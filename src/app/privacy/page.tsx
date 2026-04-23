import { Badge } from "@/components/shared/badge";
import { Container } from "@/components/shared/container";

export default function PrivacyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Badge>Privacy Policy</Badge>
      <div className="mt-6 max-w-4xl space-y-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="font-display text-5xl text-navy-950">Privacy Policy</h1>
        <p className="leading-8 text-slate-600">
          PrimeBlueprint collects the information required to create and deliver your personalized report, including your name, email address, selected category, questionnaire answers, payment status, and delivery logs.
        </p>
        <p className="leading-8 text-slate-600">
          We use this information to generate your report, process checkout securely through Stripe, and send the finished PDF by email. We do not ask for full postal addresses, and optional fields remain optional throughout the experience.
        </p>
        <p className="leading-8 text-slate-600">
          Data is stored in your configured PostgreSQL or Supabase-backed database. You are responsible for adding your own legal review, retention policy, and compliance wording before going live.
        </p>
      </div>
    </Container>
  );
}
