export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { resend } from "@/lib/resend";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid form." }, { status: 400 });
  }

  if (resend && process.env.RESEND_FROM_EMAIL && process.env.CONTACT_TO_EMAIL) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: parsed.data.email,
      subject: `PrimeBlueprint enquiry from ${parsed.data.name}`,
      text: parsed.data.message
    });
  }

  return NextResponse.json({ success: true, supportEmail: siteConfig.email });
}
