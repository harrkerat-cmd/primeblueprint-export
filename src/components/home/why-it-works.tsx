import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const points = [
  "The next question can change depending on the answer just given, so the flow stays relevant and easier to complete.",
  "The prompts and fallback logic now push the final report to reflect the user’s exact goal, challenge, pace, and selected options.",
  "Each category has its own strategy language and report sections, which helps the PDFs feel genuinely different from one another.",
  "Action steps, quick starts, and 30-day plans are included so the PDF feels helpful after download, not only attractive on the first page."
];

export function WhyItWorks() {
  return (
    <section className="bg-slate-50/75 py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <SectionHeading
          eyebrow="Why it works"
          title="The reports are designed to change with the user, not just the category"
          description="That difference matters because users can feel when a document has been shaped around their answers versus pushed from one fixed template."
        />
        <div className="space-y-4 rounded-[34px] border border-slate-200 bg-white p-8 shadow-soft">
          {points.map((point) => (
            <div key={point} className="flex gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <CheckCircle2 className="mt-1 h-5 w-5 text-navy-900" />
              <p className="text-sm leading-7 text-slate-600">{point}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
