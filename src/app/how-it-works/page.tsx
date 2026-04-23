import { ArrowRight, CheckCircle2, CreditCard, FileStack, Layers3, Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

const steps = [
  {
    id: "01",
    icon: Layers3,
    title: "Choose the category that matches the help you want",
    description:
      "Users start by selecting Finance & Money, Fitness & Health, Business & Career, Social Growth, or Construction Growth. Each category opens a different question flow and a different report structure.",
    detail:
      "This keeps the experience focused. Someone improving debt should not see the same path as someone trying to grow a construction business."
  },
  {
    id: "02",
    icon: Sparkles,
    title: "Answer simple guided questions with clear options",
    description:
      "The questionnaire is designed like a premium consultation. Questions appear step by step, answer options are easy to understand, and only relevant follow-up questions show next.",
    detail:
      "Each new report starts from a clean blank questionnaire, the wording stays simple, and the branching logic helps the final report feel more tailored."
  },
  {
    id: "03",
    icon: FileStack,
    title: "Preview the report before paying",
    description:
      "Before checkout, the user sees a polished preview with their name, category, title, date, and a visible first page. The remaining pages stay blurred and locked.",
    detail:
      "That preview builds trust because the user can see the level of quality before deciding which package depth they want."
  },
  {
    id: "04",
    icon: CreditCard,
    title: "Choose a package and complete secure checkout",
    description:
      "The user picks the package that fits the depth they want and moves into secure Stripe Checkout in GBP. Apple Pay or PayPal can also appear when the Stripe account and device support them. Only after payment is confirmed do we generate the final PDF.",
    detail:
      "This keeps the payment flow reliable, protects against duplicate generation, and gives users a clean checkout experience on desktop and mobile."
  }
];

const afterPurchase = [
  "AI generates the report using the exact category, answers, and package depth selected.",
  "A premium server-side PDF is created with a clean cover page, structured sections, and action steps.",
  "The user sees a live status page while generation runs and receives the finished PDF by email.",
  "Construction users can then unlock an optional manual leads plan on a separate paid page."
];

export default function HowItWorksPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-5">
          <Badge>How it works</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            A clear premium journey from first click to delivered PDF
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            This page explains the full flow properly so users understand what happens, why it is useful, and why the final report feels worth buying.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">What users feel</p>
          <div className="mt-5 space-y-4">
            {siteConfig.promisePoints.map((point) => (
              <div key={point.title} className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
                <p className="font-semibold text-navy-950">{point.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-5 xl:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-navy-950">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold tracking-[0.22em] text-slate-400">{step.id}</span>
              </div>
              <h2 className="mt-8 font-display text-4xl text-navy-950">{step.title}</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{step.description}</p>
              <p className="mt-4 text-sm leading-7 text-slate-500">{step.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-[36px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] p-8 text-white shadow-premium sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/65">After checkout</p>
            <h2 className="mt-4 font-display text-5xl">What happens next</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/78">
              Once payment is confirmed, the system moves into report generation, PDF creation, and email delivery without the user needing to do anything else.
            </p>
          </div>
          <div className="space-y-4">
            {afterPurchase.map((item) => (
              <div key={item} className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5">
                <CheckCircle2 className="mt-1 h-5 w-5 text-white/80" />
                <p className="text-sm leading-7 text-white/78">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-4xl text-navy-950">Want to see the report quality before starting?</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              We also added a dedicated quality page with category examples, sample names, and teaser sections so users can understand the standard of the PDFs properly.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/quality" variant="secondary">
              See the quality
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/categories">
              Create my report
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </Container>
  );
}
