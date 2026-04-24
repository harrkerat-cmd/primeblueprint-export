export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { buildReportStatusPayload } from "@/lib/report/status";
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

  return NextResponse.json(buildReportStatusPayload(reportRequest, requestId));
}
