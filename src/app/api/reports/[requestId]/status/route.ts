export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getReportRequest } from "@/lib/report-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const reportRequest = await getReportRequest(requestId);

  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  return NextResponse.json({
    paymentStatus: reportRequest.paymentStatus,
    selectedPackage: reportRequest.selectedPackage,
    generationStatus: reportRequest.report?.generationStatus ?? reportRequest.generationStatus,
    emailStatus: reportRequest.emailStatus,
    pdfUrl: reportRequest.report?.pdfUrl,
    previewTitle: reportRequest.previewTitle,
    generationError: reportRequest.report?.generationError ?? null,
    emailMessage: reportRequest.emailLogs[0]?.errorMessage ?? null,
    category: reportRequest.category,
    hasConstructionLeadRequest: reportRequest.constructionLeads.length > 0
  });
}
