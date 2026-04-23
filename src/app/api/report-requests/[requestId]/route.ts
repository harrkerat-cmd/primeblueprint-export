export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { ReportCategory } from "@prisma/client";
import {
  clearDraftReportRequest,
  getReportRequest,
  saveDraftReportRequest
} from "@/lib/db/report-requests";
import { questionnaireStorageSchema } from "@/lib/validations/questionnaire";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  let reportRequest;
  try {
    reportRequest = await getReportRequest(requestId);
  } catch (error) {
    console.error("[api/report-requests/[requestId]] Failed to load report request.", error);
    return NextResponse.json(
      { error: "Report request loading is temporarily unavailable. Persistent storage is required in production." },
      { status: 500 }
    );
  }

  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  return NextResponse.json(reportRequest);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const body = await request.json();
  const category = body.category as ReportCategory | undefined;
  const parseAnswers = questionnaireStorageSchema.safeParse(body.answers ?? {});

  if (!category || !Object.values(ReportCategory).includes(category)) {
    return NextResponse.json({ error: "Valid category is required." }, { status: 400 });
  }

  if (!parseAnswers.success) {
    return NextResponse.json({ error: "Invalid answers payload." }, { status: 400 });
  }

  let reportRequest;
  try {
    reportRequest = await saveDraftReportRequest({
      requestId,
      category,
      answers: parseAnswers.data,
      lastSavedStep: body.lastSavedStep
    });
  } catch (error) {
    console.error("[api/report-requests/[requestId]] Failed to save draft.", error);
    return NextResponse.json(
      { error: "Draft saving is temporarily unavailable. Persistent storage is required in production." },
      { status: 500 }
    );
  }

  return NextResponse.json(reportRequest);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  let reportRequest;
  try {
    reportRequest = await clearDraftReportRequest(requestId);
  } catch (error) {
    console.error("[api/report-requests/[requestId]] Failed to clear draft.", error);
    return NextResponse.json(
      { error: "Draft reset is temporarily unavailable. Persistent storage is required in production." },
      { status: 500 }
    );
  }

  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
