export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { processCollectionPurchase } from '@/lib/collection/process';
import {
  getCollectionPurchase,
  markCollectionPaymentComplete
} from '@/lib/collection/store';
import { stripe } from '@/lib/stripe';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const sessionId = new URL(request.url).searchParams.get('session_id');
  let purchase = await getCollectionPurchase(purchaseId);

  if (
    purchase &&
    purchase.paymentStatus !== 'PAID' &&
    sessionId &&
    stripe
  ) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const matchesPurchase = session.metadata?.purchaseId === purchaseId;
      if (matchesPurchase && session.payment_status === 'paid') {
        await markCollectionPaymentComplete({
          purchaseId,
          stripeSessionId: session.id
        });

        await processCollectionPurchase(purchaseId);
        purchase = await getCollectionPurchase(purchaseId);
      }
    } catch (error) {
      console.error('[api/collection/status] Failed to confirm Stripe session.', error);
    }
  }

  if (!purchase) {
    return NextResponse.json({ error: 'Collection purchase not found.' }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: purchase.paymentStatus,
    generationStatus: purchase.generationStatus,
    emailStatus: purchase.emailStatus,
    pdfUrl: purchase.pdfBase64 ? `/api/collection/purchases/${purchaseId}/download` : null,
    productTitle: purchase.productTitle,
    emailMessage: purchase.emailLogs?.[0]?.errorMessage ?? null
  });
}
