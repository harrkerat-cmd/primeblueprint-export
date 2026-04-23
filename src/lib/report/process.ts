import { EmailStatus, GenerationStatus, PaymentStatus } from "@prisma/client";
import { getPackageById } from "@/config/packages";
import { getCategoryByValue } from "@/config/site";
import { renderReportPdf } from "@/lib/pdf/render-report";
import { resend } from "@/lib/resend";
import {
  completeGeneratedReport,
  createEmailLog,
  failGeneratedReport,
  getReportRequest,
  setEmailStatusForRequest,
  setReportGenerationState,
  upsertGeneratedReportShell,
  updateEmailLog
} from "@/lib/report-store";
import { generateReportContent } from "@/lib/report/generate";
import { getBaseUrl } from "@/lib/utils";

async function sendReportEmail({
  requestId,
  request,
  pdfBase64,
  pdfUrl,
  title
}: {
  requestId: string;
  request: Awaited<ReturnType<typeof getReportRequest>>;
  pdfBase64: string;
  pdfUrl: string;
  title: string;
}) {
  if (!request?.email) {
    return;
  }

  const alreadySent = request.emailLogs.some((log) => log.status === EmailStatus.SENT);
  if (alreadySent) {
    await setEmailStatusForRequest(requestId, EmailStatus.SENT);
    return;
  }

  if (request.emailStatus === EmailStatus.FAILED && request.emailLogs.length > 0) {
    return;
  }

  await setEmailStatusForRequest(requestId, EmailStatus.PENDING);
  const emailLog = await createEmailLog({
    requestId,
    recipient: request.email,
    subject: "Your personalized report is ready"
  });

  if (resend && process.env.RESEND_FROM_EMAIL) {
    try {
      const email = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: request.email,
        subject: "Your personalized report is ready",
        html: `
          <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
            <p>Hi ${request.userName ?? "there"},</p>
            <p>Your PrimeBlueprint report is ready. You can download it using the button below, and a copy is attached for convenience.</p>
            <p><a href="${pdfUrl}" style="display:inline-block;background:#0f2744;color:#ffffff;padding:12px 18px;border-radius:999px;text-decoration:none;">Download your PDF</a></p>
            <p>If you need anything, just reply to this email and our team will help.</p>
            <p>PrimeBlueprint</p>
          </div>
        `,
        attachments: [
          {
            filename: `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`,
            content: pdfBase64
          }
        ]
      });

      await updateEmailLog({
        emailLogId: emailLog.id,
        status: EmailStatus.SENT,
        providerMessageId: email.data?.id ?? null
      });
      await setEmailStatusForRequest(requestId, EmailStatus.SENT);
      return;
    } catch (error) {
      await updateEmailLog({
        emailLogId: emailLog.id,
        status: EmailStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Email delivery failed"
      });
      await setEmailStatusForRequest(requestId, EmailStatus.FAILED);
      return;
    }
  }

  await updateEmailLog({
    emailLogId: emailLog.id,
    status: EmailStatus.FAILED,
    errorMessage: "Email delivery is not configured in this environment."
  });
  await setEmailStatusForRequest(requestId, EmailStatus.FAILED);
}

export async function processPaidReport(requestId: string) {
  const request = await getReportRequest(requestId);

  if (!request || request.paymentStatus !== PaymentStatus.PAID) {
    return null;
  }

  if (request.report?.generationStatus === GenerationStatus.COMPLETED && request.report.pdfBase64) {
    await sendReportEmail({
      requestId,
      request,
      pdfBase64: request.report.pdfBase64,
      pdfUrl: request.report.pdfUrl ?? `${getBaseUrl()}/api/reports/${requestId}/download`,
      title: request.report.title
    });
    return request.report;
  }

  if (request.report?.generationStatus === GenerationStatus.GENERATING) {
    return request.report;
  }

  await setReportGenerationState(requestId, GenerationStatus.GENERATING);
  await upsertGeneratedReportShell({
    requestId,
    title: request.previewTitle ?? "Personalized Report"
  });

  try {
    const selectedPackageId = String(request.selectedPackage ?? request.payments[0]?.packageTier ?? "PREMIUM");
    const selectedPackage = getPackageById(selectedPackageId)?.id ?? "PREMIUM";
    const content = await generateReportContent({
      category: request.category,
      packageId: selectedPackage,
      userName: request.userName ?? "Client",
      answers: (request.answersJson as Record<string, unknown>) ?? {},
      reportTitle:
        request.previewTitle ?? `${getCategoryByValue(request.category)?.reportTitle ?? "Personalized Report"} for ${request.userName ?? "You"}`
    });

    if (!content.title?.trim() || content.pages.length === 0) {
      throw new Error("Report content generation returned empty output.");
    }

    const pdfBuffer = await renderReportPdf({
      content,
      category: request.category,
      packageId: selectedPackage,
      userName: request.userName ?? "Client",
      createdAt: new Date()
    });

    if (!pdfBuffer || pdfBuffer.length < 1200) {
      throw new Error("Report PDF generation returned an invalid file.");
    }

    const pdfBase64 = pdfBuffer.toString("base64");
    const pdfUrl = `${getBaseUrl()}/api/reports/${requestId}/download`;

    const report = await completeGeneratedReport({
      requestId,
      title: content.title,
      content,
      pdfBase64,
      pdfUrl
    });

    if (!report?.pdfUrl || !report.pdfBase64) {
      throw new Error("Report PDF could not be stored correctly.");
    }

    await setReportGenerationState(requestId, GenerationStatus.COMPLETED);
    await sendReportEmail({
      requestId,
      request,
      pdfBase64,
      pdfUrl,
      title: content.title
    });

    return report;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Report generation failed";
    await failGeneratedReport({ requestId, errorMessage: message });
    await setReportGenerationState(requestId, GenerationStatus.FAILED);
    throw error;
  }
}
