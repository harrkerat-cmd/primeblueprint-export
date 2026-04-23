export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { ReportCategory } from "@prisma/client";
import { createReportRequest, getLatestResumableReportRequest } from "@/lib/db/report-requests";

export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get("category");

  if (!categoryParam || !Object.values(ReportCategory).includes(categoryParam as ReportCategory)) {
    return NextResponse.json({ draft: null });
  }

  const draft = await getLatestResumableReportRequest(categoryParam as ReportCategory);
  return NextResponse.json({ draft });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const category = body.category as ReportCategory | undefined;

  if (!category || !Object.values(ReportCategory).includes(category)) {
    return NextResponse.json({ error: "Valid category is required." }, { status: 400 });
  }

  const reportRequest = await createReportRequest(category);
  return NextResponse.json(reportRequest);
}
