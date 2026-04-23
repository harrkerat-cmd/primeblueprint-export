import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="Trust signals"
          title="The site now has the type of reassurance a premium product needs"
          description="Placeholder testimonials, stronger positioning, and quality-led messaging are included so the design already supports higher trust and better conversion."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {siteConfig.testimonials.map((testimonial, index) => (
            <div key={testimonial.name} className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
              <div className="inline-flex rounded-full border border-slate-200 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                {index === 0 ? "Founder" : index === 1 ? "Fitness" : "Construction"}
              </div>
              <p className="mt-6 font-display text-3xl leading-snug text-navy-950">“{testimonial.quote}”</p>
              <div className="mt-8 text-sm text-slate-500">
                <p className="font-semibold text-navy-950">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
