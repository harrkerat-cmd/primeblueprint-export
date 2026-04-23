export const runtime = 'nodejs';

import { GenerationStatus, PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getCollectionProductBySlug } from '@/lib/collection/catalog';
import { processCollectionPurchase } from '@/lib/collection/process';
import {
  createCollectionPurchaseShell,
  markCollectionPaymentComplete,
  setCollectionCheckoutPending
} from '@/lib/collection/store';
import { stripe } from '@/lib/stripe';
import { getBaseUrl } from '@/lib/utils';
import { collectionCheckoutSchema } from '@/lib/validations/collection';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = collectionCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid collection checkout payload.' }, { status: 400 });
    }

    const product = getCollectionProductBySlug(parsed.data.productSlug);
    if (!product) {
      return NextResponse.json({ error: 'Collection product not found.' }, { status: 404 });
    }

    const purchase = await createCollectionPurchaseShell({
      productSlug: product.slug,
      productTitle: product.title,
      productCategory: product.categorySlug,
      email: parsed.data.email,
      customerName: parsed.data.customerName || undefined,
      amount: product.price,
      productVersion: product.fileVersion
    });

    const requestOrigin = new URL(request.url).origin;
    const baseUrl = requestOrigin || getBaseUrl();
    const successUrl = `${baseUrl}/collection/success?purchaseId=${purchase.id}&session_id={CHECKOUT_SESSION_ID}`;

    if (!stripe) {
      const fakeSessionId = `collection_demo_${purchase.id}_${Date.now()}`;

      await setCollectionCheckoutPending({
        purchaseId: purchase.id,
        paymentStatus: PaymentStatus.PAID,
        checkoutUrl: successUrl,
        stripeSessionId: fakeSessionId
      });

      await markCollectionPaymentComplete({
        purchaseId: purchase.id,
        stripeSessionId: fakeSessionId,
        generationStatus: GenerationStatus.QUEUED
      });

      await processCollectionPurchase(purchase.id);
      return NextResponse.json({ url: successUrl, mode: 'demo', productSlug: product.slug });
    }

    const cancelUrl = `${baseUrl}/collection/${product.slug}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: ['card'],
      customer_email: parsed.data.email,
      metadata: {
        productType: 'collection_pdf',
        purchaseId: purchase.id,
        productSlug: product.slug
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: product.price,
            product_data: {
              name: product.title,
              description: product.valueProp
            }
          }
        }
      ]
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Checkout could not be created. Please try again.' },
        { status: 502 }
      );
    }

    try {
      await setCollectionCheckoutPending({
        purchaseId: purchase.id,
        paymentStatus: PaymentStatus.PENDING,
        checkoutUrl: session.url,
        stripeSessionId: session.id
      });
    } catch (error) {
      console.error('Collection checkout session created but pending state could not be saved', error);
    }

    return NextResponse.json({ url: session.url, productSlug: product.slug });
  } catch (error) {
    console.error('Collection checkout creation failed', error);
    return NextResponse.json(
      { error: 'Checkout could not be created. Please try again.' },
      { status: 500 }
    );
  }
}
