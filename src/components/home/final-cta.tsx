import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";

export function FinalCta() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="rounded-[38px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] px-8 py-14 text-center text-white shadow-premium sm:px-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Start now</p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Create a report that feels built for one person, not everyone</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Choose your category, answer a few guided questions, preview the quality, and unlock a polished AI-powered PDF tailored to your goals.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/categories" className="bg-white text-navy-950 hover:bg-slate-100">
              Create My Report
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/quality" variant="secondary" className="border-white/20 bg-white/8 text-white hover:border-white/30 hover:bg-white/12">
              See the quality
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
