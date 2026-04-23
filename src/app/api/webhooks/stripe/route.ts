export const runtime = "nodejs";

import { headers } from "next/headers";
import { GenerationStatus, PackageTier } from "@prisma/client";
import { NextResponse } from "next/server";
import { getConstructionLeadPlan } from "@/config/construction-leads";
import { processCollectionPurchase } from "@/lib/collection/process";
import {
  getCollectionPurchase,
  markCollectionPaymentComplete,
  markCollectionPaymentFailed
} from "@/lib/collection/store";
import { notifyConstructionLeadPurchase } from "@/lib/construction-leads";
import { processPaidReport } from "@/lib/report/process";
import {
  getReportRequest,
  markConstructionLeadPaid,
  markPaymentFailed,
  setPaymentCompleteForRequest,
  upsertPaidPayment
} from "@/lib/report-store";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const productType = session.metadata?.productType;
    const purchaseId = session.metadata?.purchaseId;
    const requestId = session.metadata?.requestId;
    const packageId = session.metadata?.packageId;
    const leadPlanId = session.metadata?.leadPlanId;

    if (productType === "collection_pdf" && purchaseId) {
      const purchase = await getCollectionPurchase(purchaseId);
      if (!purchase || (purchase.stripeSessionId && purchase.stripeSessionId !== session.id)) {
        return NextResponse.json({ received: true });
      }

      await markCollectionPaymentComplete({
        purchaseId,
        stripeSessionId: session.id,
        generationStatus: GenerationStatus.QUEUED
      });

      await processCollectionPurchase(purchaseId);
    }

    if (productType === "construction_leads" && requestId && leadPlanId) {
      const reportRequest = await getReportRequest(requestId);
      const leadPlan = getConstructionLeadPlan(leadPlanId);

      if (reportRequest && leadPlan) {
        await markConstructionLeadPaid({
          requestId,
          planId: leadPlanId,
          planName: leadPlan.name,
          price: leadPlan.price,
          stripeSessionId: session.id,
          userName: reportRequest.userName,
          email: reportRequest.email
        });

        await notifyConstructionLeadPurchase({
          userName: reportRequest.userName,
          email: reportRequest.email,
          planId: leadPlanId
        });
      }
    }

    if (requestId && packageId) {
      const reportRequest = await getReportRequest(requestId);
      if (!reportRequest || (reportRequest.stripeSessionId && reportRequest.stripeSessionId !== session.id)) {
        return NextResponse.json({ received: true });
      }

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
        stripeSessionId: session.id,
        generationStatus: GenerationStatus.QUEUED
      });

      await processPaidReport(requestId);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const purchaseId = session.metadata?.purchaseId;
    const requestId = session.metadata?.requestId;

    if (purchaseId) {
      await markCollectionPaymentFailed(purchaseId);
    }

    if (requestId) {
      await markPaymentFailed(requestId);
    }
  }

  return NextResponse.json({ received: true });
}
