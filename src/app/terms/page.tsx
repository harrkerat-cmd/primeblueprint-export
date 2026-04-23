import { Badge } from "@/components/shared/badge";
import { Container } from "@/components/shared/container";

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <Badge>Terms & Conditions</Badge>
      <div className="mt-6 max-w-4xl space-y-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="font-display text-5xl text-navy-950">Terms & Conditions</h1>
        <p className="leading-8 text-slate-600">
          PrimeBlueprint provides AI-assisted educational reports based on the information users submit. Reports are designed to be useful and practical, but they are not substitutes for regulated financial, legal, or medical advice.
        </p>
        <p className="leading-8 text-slate-600">
          Access to the final PDF is granted after successful payment confirmation. Delivery timing may vary slightly depending on generation demand, third-party service availability, or payment review.
        </p>
        <p className="leading-8 text-slate-600">
          Before launch, replace this placeholder page with counsel-reviewed terms that reflect your business, jurisdiction, refunds policy, and support commitments.
        </p>
      </div>
    </Container>
  );
}
