import type { getReportRequest } from "@/lib/report-store";

type ReportRequestRecord = NonNullable<Awaited<ReturnType<typeof getReportRequest>>>;

export function buildReportStatusPayload(reportRequest: ReportRequestRecord, requestId: string) {
  const effectiveGenerationStatus =
    reportRequest.report?.generationStatus === "COMPLETED" || reportRequest.generationStatus === "COMPLETED"
      ? "COMPLETED"
      : reportRequest.report?.generationStatus ?? reportRequest.generationStatus;

  return {
    paymentStatus: reportRequest.paymentStatus,
    selectedPackage: reportRequest.selectedPackage,
    generationStatus: effectiveGenerationStatus,
    emailStatus: reportRequest.emailStatus,
    pdfUrl:
      effectiveGenerationStatus === "COMPLETED" || reportRequest.report?.pdfUrl
        ? `/api/reports/${requestId}/download`
        : null,
    previewTitle: reportRequest.previewTitle,
    generationError: effectiveGenerationStatus === "COMPLETED" ? null : reportRequest.report?.generationError ?? null,
    emailMessage: reportRequest.emailLogs[0]?.errorMessage ?? null,
    category: reportRequest.category,
    hasConstructionLeadRequest: reportRequest.constructionLeads.length > 0
  };
}
