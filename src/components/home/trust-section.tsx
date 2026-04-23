import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export function TrustSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-6">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] p-8 text-white shadow-premium sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-white/62">Built for trust</p>
            <h2 className="mt-5 font-display text-5xl">A premium service should feel worth it before checkout</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
              The messaging, preview, status page, and final PDF are all designed to help people feel they are buying a thoughtful personalized plan - not a cheap downloadable file.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {siteConfig.proofStats.map((stat) => (
                <div key={stat.value} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="font-display text-3xl">{stat.value}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            {siteConfig.promisePoints.map((point) => (
              <div key={point.title} className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
                <p className="font-display text-3xl text-navy-950">{point.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {siteConfig.trustBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
                <Icon className="h-5 w-5 text-navy-950" />
                <p className="mt-4 font-semibold text-navy-950">{badge.label}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {badge.label === "Personalized"
                    ? "Every report changes according to category, goals, and answer logic."
                    : badge.label === "Secure Checkout"
                      ? "Stripe Checkout handles card payment with a clean mobile-ready flow."
                      : badge.label === "Delivered by Email"
                        ? "A success page tracks generation while the finished PDF is sent to the user."
                        : "The PDF is styled to feel polished, calm, and worth keeping."}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
