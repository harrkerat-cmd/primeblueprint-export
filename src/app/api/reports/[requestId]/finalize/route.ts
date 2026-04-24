export const runtime = "nodejs";

import { PackageTier, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { processPaidReport } from "@/lib/report/process";
import { buildReportStatusPayload } from "@/lib/report/status";
import {
  getReportRequest,
  setPaymentCompleteForRequest,
  upsertPaidPayment
} from "@/lib/report-store";
import { stripe } from "@/lib/stripe";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const body = (await request.json().catch(() => ({}))) as { sessionId?: string | null };
  const sessionId = typeof body.sessionId === "string" && body.sessionId.length > 0 ? body.sessionId : null;

  let reportRequest = await getReportRequest(requestId);
  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  if (reportRequest.paymentStatus !== PaymentStatus.PAID && sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const matchesRequest = session.metadata?.requestId === requestId;
      const packageId = session.metadata?.packageId;

      if (matchesRequest && session.payment_status === "paid" && packageId) {
        await upsertPaidPayment({
          requestId,
          packageTier: packageId as PackageTier,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "gbp",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          stripeCustomerEmail: session.customer_details?.email ?? session.customer_email ?? undefined
        });

        await setPaymentCompleteForRequest({
          requestId,
          packageTier: packageId as PackageTier,
          stripeSessionId: session.id
        });

        reportRequest = await getReportRequest(requestId);
      }
    } catch (error) {
      console.error(`[api/reports/finalize] Failed to confirm Stripe session for ${requestId}.`, error);
      return NextResponse.json(
        {
          error: "Payment confirmation failed.",
          detail: error instanceof Error ? error.message : "Stripe session confirmation failed."
        },
        { status: 502 }
      );
    }
  }

  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  if (reportRequest.paymentStatus !== PaymentStatus.PAID) {
    return NextResponse.json(
      {
        error: "Payment is not confirmed yet.",
        status: buildReportStatusPayload(reportRequest, requestId)
      },
      { status: 409 }
    );
  }

  if (reportRequest.generationStatus === "FAILED" || reportRequest.report?.generationStatus === "FAILED") {
    return NextResponse.json(
      {
        error: "Report generation previously failed.",
        status: buildReportStatusPayload(reportRequest, requestId)
      },
      { status: 409 }
    );
  }

  try {
    await processPaidReport(requestId);
  } catch (error) {
    const refreshed = await getReportRequest(requestId);
    return NextResponse.json(
      {
        error: "Report generation failed.",
        detail: error instanceof Error ? error.message : "Unknown report generation error.",
        status: refreshed ? buildReportStatusPayload(refreshed, requestId) : null
      },
      { status: 500 }
    );
  }

  const refreshed = await getReportRequest(requestId);
  if (!refreshed) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  return NextResponse.json(buildReportStatusPayload(refreshed, requestId));
}
