export const runtime = "nodejs";

import { PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getConstructionLeadPlan } from "@/config/construction-leads";
import { notifyConstructionLeadPurchase } from "@/lib/construction-leads";
import { getBaseUrl } from "@/lib/utils";
import {
  getReportRequest,
  markConstructionLeadPaid,
  upsertConstructionLeadCheckout
} from "@/lib/report-store";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json();
  const requestId = String(body.requestId ?? "");
  const planId = String(body.planId ?? "");

  if (!requestId || !planId) {
    return NextResponse.json({ error: "Request ID and plan ID are required." }, { status: 400 });
  }

  const reportRequest = await getReportRequest(requestId);
  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  if (reportRequest.category !== "CONSTRUCTION_GROWTH") {
    return NextResponse.json({ error: "Lead plans are only available for construction reports." }, { status: 400 });
  }

  if (reportRequest.paymentStatus !== PaymentStatus.PAID) {
    return NextResponse.json({ error: "Please buy the construction PDF first." }, { status: 400 });
  }

  const plan = getConstructionLeadPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Lead plan not found." }, { status: 404 });
  }

  const baseUrl = getBaseUrl();
  const successUrl = `${baseUrl}/construction-leads/success?requestId=${requestId}&planId=${plan.id}`;
  const cancelUrl = `${baseUrl}/construction-leads/${requestId}?planId=${plan.id}`;

  if (!stripe) {
    await markConstructionLeadPaid({
      requestId,
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      stripeSessionId: `demo_leads_${requestId}_${Date.now()}`,
      userName: reportRequest.userName,
      email: reportRequest.email
    });

    await notifyConstructionLeadPurchase({
      userName: reportRequest.userName,
      email: reportRequest.email,
      planId: plan.id
    });

    return NextResponse.json({ url: successUrl, mode: "demo" });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ["card"],
    customer_email: reportRequest.email ?? undefined,
    metadata: {
      productType: "construction_leads",
      requestId,
      leadPlanId: plan.id
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: plan.price,
          recurring: {
            interval: "month"
          },
          product_data: {
            name: `${plan.name} Leads Plan`,
            description: `${plan.displayVolume}. Manual fulfilment by email. No commission taken on jobs won.`
          }
        }
      }
    ]
  });

  await upsertConstructionLeadCheckout({
    requestId,
    planId: plan.id,
    planName: plan.name,
    price: plan.price,
    userName: reportRequest.userName,
    email: reportRequest.email,
    checkoutUrl: session.url,
    stripeSessionId: session.id,
    paymentStatus: PaymentStatus.PENDING,
    status: "CHECKOUT_CREATED"
  });

  return NextResponse.json({ url: session.url });
}
