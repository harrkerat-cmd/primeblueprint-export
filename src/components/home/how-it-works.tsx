import { ArrowRight, CreditCard, FileText, Layers3, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    title: "Choose your category",
    description:
      "Start with the area that matters most right now. Each category has its own questions, branching logic, and report structure.",
    icon: Layers3,
    cta: { label: "View categories", href: "/categories" }
  },
  {
    title: "Answer guided questions",
    description:
      "Users move step by step through simple questions with clear answer options, helpful wording, and relevant follow-up questions only.",
    icon: Sparkles,
    cta: { label: "See full process", href: "/how-it-works" }
  },
  {
    title: "Preview and unlock the PDF",
    description:
      "A locked premium preview builds trust first, then the user chooses a package and finishes checkout before generation starts.",
    icon: FileText,
    cta: { label: "See the quality", href: "/quality" }
  },
  {
    title: "Receive it by email",
    description:
      "After payment, the final PDF is generated, turned into a polished document, and delivered with a clean success flow.",
    icon: CreditCard,
    cta: { label: "Start now", href: "/categories" }
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="How it works"
          title="A premium flow that explains itself clearly"
          description="The experience is built to feel simple for the user while still producing a high-quality, answer-specific report in the background."
        />
        <div className="grid gap-5 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-navy-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold tracking-[0.3em] text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-8 font-display text-3xl text-navy-950">{step.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{step.description}</p>
                <ButtonLink href={step.cta.href} variant="ghost" className="mt-6 w-fit px-0 py-0 text-sm text-navy-950 hover:bg-transparent">
                  {step.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
