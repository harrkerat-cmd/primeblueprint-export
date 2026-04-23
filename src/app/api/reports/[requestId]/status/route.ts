export const runtime = "nodejs";

import { PackageTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { processPaidReport } from "@/lib/report/process";
import {
  getReportRequest,
  setPaymentCompleteForRequest,
  upsertPaidPayment
} from "@/lib/report-store";
import { stripe } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const sessionId = new URL(request.url).searchParams.get("session_id");
  let reportRequest = await getReportRequest(requestId);

  if (
    reportRequest &&
    reportRequest.paymentStatus !== "PAID" &&
    sessionId &&
    stripe
  ) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const matchesRequest = session.metadata?.requestId === requestId;
      if (matchesRequest && session.payment_status === "paid" && session.metadata?.packageId) {
        await upsertPaidPayment({
          requestId,
          packageTier: session.metadata.packageId as PackageTier,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "gbp",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          stripeCustomerEmail: session.customer_details?.email ?? session.customer_email ?? undefined
        });

        await setPaymentCompleteForRequest({
          requestId,
          packageTier: session.metadata.packageId as PackageTier,
          stripeSessionId: session.id
        });

        await processPaidReport(requestId);
        reportRequest = await getReportRequest(requestId);
      }
    } catch (error) {
      console.error("[api/reports/status] Failed to confirm Stripe session.", error);
    }
  }

  if (
    reportRequest &&
    reportRequest.paymentStatus === "PAID" &&
    reportRequest.report?.generationStatus === "FAILED" &&
    !reportRequest.report?.pdfBase64
  ) {
    try {
      await processPaidReport(requestId);
      reportRequest = await getReportRequest(requestId);
    } catch (error) {
      console.error("[api/reports/status] Failed to retry paid report generation.", error);
    }
  }

  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: reportRequest.paymentStatus,
    selectedPackage: reportRequest.selectedPackage,
    generationStatus: reportRequest.report?.generationStatus ?? reportRequest.generationStatus,
    emailStatus: reportRequest.emailStatus,
    pdfUrl:
      reportRequest.report?.generationStatus === "COMPLETED" || reportRequest.report?.pdfUrl
        ? `/api/reports/${requestId}/download`
        : null,
    previewTitle: reportRequest.previewTitle,
    generationError: reportRequest.report?.generationError ?? null,
    emailMessage: reportRequest.emailLogs[0]?.errorMessage ?? null,
    category: reportRequest.category,
    hasConstructionLeadRequest: reportRequest.constructionLeads.length > 0
  });
}
