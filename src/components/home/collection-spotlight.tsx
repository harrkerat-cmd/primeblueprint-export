import { ArrowRight, BookOpen, Mail, ShieldCheck } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button';
import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';

export function CollectionSpotlight() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="Growth Library"
          title="A premium handbook library built for faster learning and more practical action"
          description="Alongside the personalized reports, PrimeBlueprint now includes a fixed library of structured digital handbooks priced at £7.99 each."
          actions={
            <ButtonLink href="/collection" variant="secondary">
              Browse the library
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-premium">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                '65 handbooks across 20 categories',
                '10+ pages minimum per handbook',
                'Instant email delivery after checkout'
              ].map((item) => (
                <div key={item} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[28px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] p-7 text-white">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Library example</p>
              <h3 className="mt-4 font-display text-4xl">Smart Budgeting Blueprint</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">
                A guided handbook with plain-English explanations, practical examples, money mistakes to catch early, and a cleaner action plan you can actually reuse.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {[
              { title: 'Guided handbook quality', text: 'Every title is built as a complete digital handbook with structure, explanations, tips, mistakes, and next steps.', icon: BookOpen },
              { title: 'Instant delivery flow', text: 'Buy once, receive the handbook by email, and download it again from the success page.', icon: Mail },
              { title: 'Safe educational framing', text: 'Sensitive topics use practical teaching with disclaimers instead of overconfident financial, medical, or legal claims.', icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft">
                  <Icon className="h-5 w-5 text-navy-950" />
                  <h3 className="mt-5 font-display text-3xl text-navy-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
