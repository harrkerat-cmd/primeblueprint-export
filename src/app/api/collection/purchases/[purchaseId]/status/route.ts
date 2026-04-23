export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getCollectionPurchase } from '@/lib/collection/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const purchase = await getCollectionPurchase(purchaseId);

  if (!purchase) {
    return NextResponse.json({ error: 'Collection purchase not found.' }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: purchase.paymentStatus,
    generationStatus: purchase.generationStatus,
    emailStatus: purchase.emailStatus,
    pdfUrl: purchase.pdfUrl,
    productTitle: purchase.productTitle,
    emailMessage: purchase.emailLogs?.[0]?.errorMessage ?? null
  });
}
