export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getGeneratedReportByRequestId } from "@/lib/report-store";

function toSafePdfFilename(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/['"]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${normalized || "primeblueprint-report"}.pdf`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const report = await getGeneratedReportByRequestId(requestId);

  if (!report?.pdfBase64) {
    return NextResponse.json({ error: "PDF not available yet." }, { status: 404 });
  }

  const buffer = Buffer.from(report.pdfBase64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${toSafePdfFilename(report.title)}"`
    }
  });
}
