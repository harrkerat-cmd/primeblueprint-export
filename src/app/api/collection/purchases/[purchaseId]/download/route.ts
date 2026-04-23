export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getCollectionPurchase } from '@/lib/collection/store';

function toSafePdfFilename(value: string) {
  const normalized = value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/['"]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return `${normalized || 'primeblueprint-guide'}.pdf`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params;
  const purchase = await getCollectionPurchase(purchaseId);

  if (!purchase?.pdfBase64) {
    return NextResponse.json({ error: 'PDF not available yet.' }, { status: 404 });
  }

  return new NextResponse(Buffer.from(purchase.pdfBase64, 'base64'), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${toSafePdfFilename(purchase.productTitle)}"`
    }
  });
}
