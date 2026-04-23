import { EmailStatus, GenerationStatus, PaymentStatus } from '@prisma/client';
import { getCollectionProductBySlug } from '@/lib/collection/catalog';
import { buildCollectionGuideContent } from '@/lib/collection/content';
import { renderCollectionPdf } from '@/lib/collection/render-pdf';
import {
  completeCollectionPurchase,
  createCollectionEmailLog,
  failCollectionPurchase,
  getCollectionPurchase,
  setCollectionEmailStatus,
  setCollectionGenerationState,
  updateCollectionEmailLog
} from '@/lib/collection/store';
import { resend } from '@/lib/resend';
import { getBaseUrl } from '@/lib/utils';

async function sendCollectionEmail({
  purchaseId,
  purchase,
  pdfBase64,
  pdfUrl
}: {
  purchaseId: string;
  purchase: Awaited<ReturnType<typeof getCollectionPurchase>>;
  pdfBase64: string;
  pdfUrl: string;
}) {
  if (!purchase) {
    return;
  }

  const alreadySent = purchase.emailLogs?.some((log) => log.status === EmailStatus.SENT);
  if (alreadySent) {
    await setCollectionEmailStatus(purchaseId, EmailStatus.SENT);
    return;
  }

  if (purchase.emailStatus === EmailStatus.FAILED && (purchase.emailLogs?.length ?? 0) > 0) {
    return;
  }

  await setCollectionEmailStatus(purchaseId, EmailStatus.PENDING);
  const emailLog = await createCollectionEmailLog({
    purchaseId,
    recipient: purchase.email,
    subject: 'Your PDF is ready'
  });

  if (resend && process.env.RESEND_FROM_EMAIL) {
    try {
      const email = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: purchase.email,
        subject: 'Your PDF is ready',
        html: `
          <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
            <p>Hi ${purchase.customerName ?? 'there'},</p>
            <p>Thank you for your purchase from <strong>PrimeBlueprint – Growth Library</strong>.</p>
            <p>Your handbook <strong>${purchase.productTitle}</strong> is ready. You can download it below, and a copy is attached for convenience.</p>
            <p><a href="${pdfUrl}" style="display:inline-block;background:#0f2744;color:#ffffff;padding:12px 18px;border-radius:999px;text-decoration:none;">Download your PDF</a></p>
            <p>If you need anything, reply to this email and our team will help.</p>
            <p>PrimeBlueprint<br/>support@primeblueprint.ai</p>
          </div>
        `,
        attachments: [
          {
            filename: `${purchase.productTitle.replace(/\s+/g, '-').toLowerCase()}.pdf`,
            content: pdfBase64
          }
        ]
      });

      await updateCollectionEmailLog({
        emailLogId: emailLog.id,
        status: EmailStatus.SENT,
        providerMessageId: email.data?.id ?? null
      });
      await setCollectionEmailStatus(purchaseId, EmailStatus.SENT);
      return;
    } catch (error) {
      await updateCollectionEmailLog({
        emailLogId: emailLog.id,
        status: EmailStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : 'Collection email delivery failed'
      });
      await setCollectionEmailStatus(purchaseId, EmailStatus.FAILED);
      return;
    }
  }

  await updateCollectionEmailLog({
    emailLogId: emailLog.id,
    status: EmailStatus.FAILED,
    errorMessage: 'Email delivery is not configured in this environment.'
  });
  await setCollectionEmailStatus(purchaseId, EmailStatus.FAILED);
}

export async function processCollectionPurchase(purchaseId: string) {
  const purchase = await getCollectionPurchase(purchaseId);

  if (!purchase || purchase.paymentStatus !== PaymentStatus.PAID) {
    return null;
  }

  if (purchase.generationStatus === GenerationStatus.COMPLETED && purchase.pdfBase64) {
    await sendCollectionEmail({
      purchaseId,
      purchase,
      pdfBase64: purchase.pdfBase64,
      pdfUrl: purchase.pdfUrl ?? `${getBaseUrl()}/api/collection/purchases/${purchaseId}/download`
    });
    return purchase;
  }

  if (purchase.generationStatus === GenerationStatus.GENERATING) {
    return purchase;
  }

  await setCollectionGenerationState(purchaseId, GenerationStatus.GENERATING);

  try {
    const product = getCollectionProductBySlug(purchase.productSlug);
    if (!product) {
      throw new Error(`Collection product not found for slug ${purchase.productSlug}`);
    }

    const content = buildCollectionGuideContent(product);
    if (!content.title?.trim() || content.pages.length === 0) {
      throw new Error('Collection guide content generation returned empty output.');
    }

    const pdfBuffer = await renderCollectionPdf(content);
    if (!pdfBuffer || pdfBuffer.length < 1200) {
      throw new Error('Collection PDF generation returned an invalid file.');
    }

    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfUrl = `${getBaseUrl()}/api/collection/purchases/${purchaseId}/download`;

    const completedPurchase = await completeCollectionPurchase({
      purchaseId,
      pdfBase64,
      pdfUrl
    });
    if (!completedPurchase?.pdfUrl || !completedPurchase.pdfBase64) {
      throw new Error('Collection PDF could not be stored correctly.');
    }

    await sendCollectionEmail({
      purchaseId,
      purchase,
      pdfBase64,
      pdfUrl
    });

    await setCollectionGenerationState(purchaseId, GenerationStatus.COMPLETED);
    return getCollectionPurchase(purchaseId);
  } catch (error) {
    await failCollectionPurchase({ purchaseId });
    await setCollectionGenerationState(purchaseId, GenerationStatus.FAILED);
    throw error;
  }
}
