import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryMeta } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function CategoriesShowcase() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="Categories"
          title="Five focused report paths, each built for a different goal"
          description="Every category has its own question structure, tone, and report logic so the final PDF feels more specific and useful."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {categoryMeta.map((category) => {
            const Icon = category.icon;
            const isConstruction = category.value === "CONSTRUCTION_GROWTH";
            return (
              <Link
                href={`/questionnaire/${category.slug}`}
                key={category.slug}
                className="group rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-slate-300"
              >
                <div className={`rounded-[26px] bg-gradient-to-br ${category.accent} p-5 text-white`}>
                  <Icon className="h-6 w-6" />
                  <p className="mt-10 font-display text-3xl leading-tight">{category.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{category.tagline}</p>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">{category.description}</p>
                {isConstruction ? (
                  <div className="mt-4 rounded-[20px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-6 text-emerald-900">
                    Premium includes 2 free job leads.
                  </div>
                ) : null}
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
                  Start this report
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
