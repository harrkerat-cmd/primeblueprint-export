export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { ReportCategory } from "@prisma/client";
import { createReportRequest } from "@/lib/db/report-requests";

export async function GET(request: NextRequest) {
  const categoryParam = request.nextUrl.searchParams.get("category");

  if (!categoryParam || !Object.values(ReportCategory).includes(categoryParam as ReportCategory)) {
    return NextResponse.json({ draft: null });
  }

  return NextResponse.json({ draft: null });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const category = body.category as ReportCategory | undefined;

  if (!category || !Object.values(ReportCategory).includes(category)) {
    return NextResponse.json({ error: "Valid category is required." }, { status: 400 });
  }

  try {
    const reportRequest = await createReportRequest(category);
    return NextResponse.json(reportRequest);
  } catch (error) {
    console.error("[api/report-requests] Failed to create report request.", error);
    return NextResponse.json(
      { error: "Report creation is temporarily unavailable. Persistent storage is required in production." },
      { status: 500 }
    );
  }
}
