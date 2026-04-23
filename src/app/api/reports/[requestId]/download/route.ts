export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generatePaidReportPdfBuffer } from "@/lib/report/process";
import { getGeneratedReportByRequestId, getReportRequest } from "@/lib/report-store";

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
  let report = await getGeneratedReportByRequestId(requestId);

  if (!report?.pdfBase64) {
    const requestRecord = await getReportRequest(requestId);

    if (requestRecord?.paymentStatus === "PAID") {
      try {
        const generated = await generatePaidReportPdfBuffer(requestId);
        if (generated) {
          return new NextResponse(generated.buffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="${toSafePdfFilename(generated.title)}"`
            }
          });
        }
      } catch (error) {
        console.error("[api/reports/download] Failed to regenerate paid report.", error);
      }
    }
  }

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
