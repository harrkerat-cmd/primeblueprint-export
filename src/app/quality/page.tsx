import { ArrowRight, Lock } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getCategoryByValue } from "@/config/site";
import { qualitySamples } from "@/config/quality-samples";

export default function QualityPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div className="space-y-5">
          <Badge>See the quality</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            Show users the standard before they decide to buy
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            These sample layouts use example names and category-specific details so visitors can feel the reports are useful, structured, and genuinely worth opening.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Why this matters</p>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
            <p>Users should feel the reports are practical, not random.</p>
            <p>Each category changes the sections, examples, and action plan.</p>
            <p>These sample pages should make it clear that every final PDF is shaped around the user's own focus, answers, and goals.</p>
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-6 xl:grid-cols-2">
        {qualitySamples.map((sample) => {
          const category = getCategoryByValue(sample.category);
          const Icon = category?.icon;
          return (
            <div key={sample.id} className="rounded-[34px] border border-slate-200 bg-white p-7 shadow-soft sm:p-8">
              <div className="rounded-[30px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fd_100%)] p-6 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Sample format</p>
                    <h2 className="mt-3 font-display text-4xl leading-tight text-navy-950">{sample.reportTitle}</h2>
                  </div>
                  {Icon ? <Icon className="h-6 w-6 text-navy-950" /> : null}
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <p className="text-sm text-slate-500">Prepared for</p>
                    <p className="mt-2 font-semibold text-navy-950">{sample.clientName}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="mt-2 font-semibold text-navy-950">{category?.title}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-[24px] border border-slate-100 bg-white p-5">
                  <p className="text-sm text-slate-500">Cover note</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{sample.coverNote}</p>
                </div>
                <div className="mt-5 rounded-[24px] border border-slate-100 bg-white p-5">
                  <p className="text-sm text-slate-500">Main goal</p>
                  <p className="mt-2 text-lg font-semibold text-navy-950">{sample.goal}</p>
                </div>
                <div className="mt-5 space-y-3">
                  {sample.highlights.map((highlight) => (
                    <div key={highlight} className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 text-sm leading-7 text-slate-600">
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-navy-950 px-6 py-7 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%)]" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
                    <Lock className="h-3.5 w-3.5" />
                    Sample note
                  </div>
                  <p className="text-sm leading-7 text-white/78">{sample.endingLine}</p>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    This is a sample PDF preview. Your final PDF is built around your own focus, goals, and answers. Every report is different, and your PDF is written to be useful for you, not for other people.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-14 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-4xl text-navy-950">Different categories. Different answers. Different PDFs.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              The design and copy now make it clear that users are not buying the same PDF over and over. The report changes according to the category, the answers selected, the goals, the challenges, and the package depth chosen.
            </p>
          </div>
          <ButtonLink href="/categories">
            Start now
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}
