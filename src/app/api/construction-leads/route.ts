export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getConstructionLeadPlan } from "@/config/construction-leads";
import { resend } from "@/lib/resend";
import { createConstructionLeadInterest, getReportRequest } from "@/lib/report-store";

export async function POST(request: Request) {
  const body = await request.json();
  const requestId = String(body.requestId ?? "");
  const planId = String(body.planId ?? "");

  if (!requestId || !planId) {
    return NextResponse.json({ error: "Request ID and plan ID are required." }, { status: 400 });
  }

  const reportRequest = await getReportRequest(requestId);
  if (!reportRequest) {
    return NextResponse.json({ error: "Report request not found." }, { status: 404 });
  }

  if (reportRequest.category !== "CONSTRUCTION_GROWTH") {
    return NextResponse.json({ error: "Lead offers are only available for construction reports." }, { status: 400 });
  }

  const plan = getConstructionLeadPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Lead plan not found." }, { status: 404 });
  }

  const existing = reportRequest.constructionLeads.find((item) => item.planId === plan.id);
  if (existing) {
    return NextResponse.json({ success: true, message: "Lead request already saved.", interest: existing });
  }

  const interest = await createConstructionLeadInterest({
    requestId,
    planId: plan.id,
    planName: plan.name,
    price: plan.price,
    userName: reportRequest.userName,
    email: reportRequest.email,
    notes: "Manual follow-up lead package request"
  });

  if (resend && process.env.RESEND_FROM_EMAIL) {
    const adminEmail = process.env.CONTACT_TO_EMAIL;

    if (adminEmail) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: adminEmail,
        subject: `Construction leads request: ${plan.name}`,
        html: `
          <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
            <p><strong>New construction leads request</strong></p>
            <p>Name: ${reportRequest.userName ?? "Unknown"}</p>
            <p>Email: ${reportRequest.email ?? "Unknown"}</p>
            <p>Plan: ${plan.name}</p>
            <p>Price: ${plan.displayPrice}</p>
            <p>This is a manual service request. Follow up directly with the client.</p>
          </div>
        `
      });
    }

    if (reportRequest.email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: reportRequest.email,
        subject: "Your construction leads request has been received",
        html: `
          <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
            <p>Hi ${reportRequest.userName ?? "there"},</p>
            <p>We have received your request for the <strong>${plan.name}</strong> package (${plan.displayPrice}).</p>
            <p>This lead service is supplied manually by our team, not by AI automation. We will follow up with you by email.</p>
            <p>PrimeBlueprint</p>
          </div>
        `
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Lead request saved. You can now follow up manually by email.",
    interest
  });
}
