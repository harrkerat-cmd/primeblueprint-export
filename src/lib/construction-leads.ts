import { getConstructionLeadPlan } from "@/config/construction-leads";
import { resend } from "@/lib/resend";

type LeadPurchaseNotification = {
  userName?: string | null;
  email?: string | null;
  planId: string;
};

export async function notifyConstructionLeadPurchase({
  userName,
  email,
  planId
}: LeadPurchaseNotification) {
  if (!resend || !process.env.RESEND_FROM_EMAIL) {
    return;
  }

  const plan = getConstructionLeadPlan(planId);
  if (!plan) {
    return;
  }

  const adminEmail = process.env.CONTACT_TO_EMAIL;

  if (adminEmail) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: adminEmail,
      subject: `Construction leads purchase: ${plan.name}`,
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
          <p><strong>New construction leads purchase</strong></p>
          <p>Name: ${userName ?? "Unknown"}</p>
          <p>Email: ${email ?? "Unknown"}</p>
          <p>Plan: ${plan.name}</p>
          <p>Volume: ${plan.displayVolume}</p>
          <p>Price: ${plan.displayPrice}</p>
          <p>Delivery: manual email fulfilment by your team.</p>
        </div>
      `
    });
  }

  if (email) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Your construction leads plan is confirmed",
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;padding:24px;color:#0f172a;">
          <p>Hi ${userName ?? "there"},</p>
          <p>Your <strong>${plan.name}</strong> plan is confirmed.</p>
          <p>You selected <strong>${plan.displayVolume}</strong> at <strong>${plan.displayPrice}</strong>.</p>
          <p>These are genuine manual leads supplied by our team and sent by email. Winning work still depends on your pricing, follow-up speed, service quality, and fit for the job.</p>
          <p>We do not take commission from the jobs you win.</p>
          <p>PrimeBlueprint</p>
        </div>
      `
    });
  }
}
