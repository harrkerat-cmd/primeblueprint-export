export const runtime = "nodejs";

import { GenerationStatus, PackageTier, PaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getPackageById } from "@/config/packages";
import { getBaseUrl } from "@/lib/utils";
import {
  createPendingPayment,
  getReportRequest,
  setCheckoutPending,
  setPaymentCompleteForRequest
} from "@/lib/report-store";
import { stripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations/checkout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
    }

    const reportRequest = await getReportRequest(parsed.data.requestId);
    if (!reportRequest) {
      return NextResponse.json({ error: "Report request not found." }, { status: 404 });
    }

    if (!reportRequest.email) {
      return NextResponse.json(
        { error: "Please add an email address in the questionnaire before checkout." },
        { status: 400 }
      );
    }

    if (!reportRequest.userName) {
      return NextResponse.json(
        { error: "Please add your name in the questionnaire before checkout." },
        { status: 400 }
      );
    }

    if (!reportRequest.answersJson || Object.keys(reportRequest.answersJson).length < 4) {
      return NextResponse.json(
        { error: "Please complete more of the questionnaire before checkout." },
        { status: 400 }
      );
    }

    const selectedPackage = getPackageById(parsed.data.packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Package not found." }, { status: 400 });
    }

    const packageTier = selectedPackage.id as PackageTier;
    const requestOrigin = new URL(request.url).origin;
    const baseUrl = requestOrigin || getBaseUrl();
    const successUrl = `${baseUrl}/success?requestId=${reportRequest.id}&session_id={CHECKOUT_SESSION_ID}`;

    if (reportRequest.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json({ url: successUrl, mode: "paid", packageId: selectedPackage.id });
    }

    if (
      reportRequest.paymentStatus === PaymentStatus.PENDING &&
      reportRequest.selectedPackage === packageTier &&
      reportRequest.stripeSessionId &&
      reportRequest.checkoutUrl
    ) {
      return NextResponse.json({
        url: reportRequest.checkoutUrl,
        mode: "resume-checkout",
        packageId: selectedPackage.id
      });
    }

    if (!stripe) {
      const fakeSessionId = `demo_${reportRequest.id}_${Date.now()}`;

      await setCheckoutPending({
        requestId: reportRequest.id,
        packageTier,
        paymentStatus: PaymentStatus.PAID,
        checkoutUrl: successUrl,
        stripeSessionId: fakeSessionId
      });

      await createPendingPayment({
        requestId: reportRequest.id,
        packageTier,
        amount: selectedPackage.price,
        status: PaymentStatus.PAID,
        stripeCheckoutSessionId: fakeSessionId,
        stripeCustomerEmail: reportRequest.email ?? undefined
      });

      await setPaymentCompleteForRequest({
        requestId: reportRequest.id,
        packageTier,
        stripeSessionId: fakeSessionId,
        generationStatus: GenerationStatus.QUEUED
      });

      return NextResponse.json({ url: successUrl, mode: "demo", packageId: selectedPackage.id });
    }

    const cancelUrl = `${baseUrl}/pricing/${reportRequest.id}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: reportRequest.email ?? undefined,
      metadata: {
        requestId: reportRequest.id,
        packageId: selectedPackage.id,
        category: reportRequest.category
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: selectedPackage.price,
            product_data: {
              name: selectedPackage.name,
              description: `${selectedPackage.description} ${selectedPackage.pageRange}.`
            }
          }
        }
      ]
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout could not be created. Please try again." },
        { status: 502 }
      );
    }

    try {
      await setCheckoutPending({
        requestId: reportRequest.id,
        packageTier,
        paymentStatus: PaymentStatus.PENDING,
        checkoutUrl: session.url,
        stripeSessionId: session.id
      });

      await createPendingPayment({
        requestId: reportRequest.id,
        packageTier,
        amount: selectedPackage.price,
        status: PaymentStatus.PENDING,
        stripeCheckoutSessionId: session.id,
        stripeCustomerEmail: reportRequest.email ?? undefined
      });
    } catch (error) {
      console.error("Checkout session created but pending state could not be saved", error);
    }

    return NextResponse.json({ url: session.url, packageId: selectedPackage.id });
  } catch (error) {
    console.error("Checkout creation failed", error);
    return NextResponse.json(
      { error: "Checkout could not be created. Please try again." },
      { status: 500 }
    );
  }
}
