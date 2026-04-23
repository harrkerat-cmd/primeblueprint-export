import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { LockedReportStack } from "@/components/preview/locked-report-stack";

export function PreviewShowcase() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div className="space-y-8">
        <SectionHeading
          eyebrow="Preview showcase"
          title="Let users see the quality before they unlock the full report"
          description="The preview flow should feel premium enough to create trust, while the locked pages reinforce quality and show that the final report is worth unlocking."
        />
          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="font-display text-3xl text-navy-950">See the quality properly</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We also added a dedicated page with sample report formats, fake user names, useful section previews, and category-specific teaser details that make people want to unlock the full version.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
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
        </div>
        <LockedReportStack
          title="Construction Growth Plan for Daniel Morris"
          subtitle="Live sample preview with a visible first page, blurred follow-on pages, and a premium locked overlay"
          className="max-w-[500px]"
        />
      </Container>
    </section>
  );
}
