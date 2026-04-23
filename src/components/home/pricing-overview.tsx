import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function PricingOverview() {
  return (
    <section id="pricing" className="bg-slate-50/75 py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="Pricing"
          title="Two premium report options, based on depth and usefulness"
          description="Starter keeps it concise and high-value. Premium opens the full guidebook with deeper personalization, resources, routines, and stronger strategy."
        />
        <PricingCards compact />
        <div className="rounded-[30px] border border-navy-100 bg-white px-6 py-6 shadow-soft sm:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Construction offer</p>
              <h3 className="mt-3 font-display text-3xl text-navy-950">Extra value for construction clients</h3>
            </div>
            <p className="text-sm leading-7 text-slate-600">
              If a user buys a <span className="font-semibold text-navy-950">Construction Growth</span> report on the
              <span className="font-semibold text-navy-950"> Premium PDF</span>, they also get
              <span className="font-semibold text-navy-950"> 2 free job leads</span> included as a strong starting bonus, with optional extra lead plans available afterwards.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <ButtonLink href="/categories" variant="secondary">
            Start with a category
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
