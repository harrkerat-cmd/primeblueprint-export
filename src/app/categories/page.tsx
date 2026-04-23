import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { categoryMeta } from "@/config/site";

export default function CategoriesPage() {
  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-end">
        <div className="space-y-5">
          <Badge>Category selection</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            Choose the report category that fits your next move
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Each path uses tailored questions, branching logic, and a dedicated report structure so the PDF changes with the category and the user's answers.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
          <p className="font-display text-3xl text-navy-950">Need more confidence first?</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            We added full pages for how the system works and what the report quality looks like before someone starts the questionnaire.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/how-it-works" variant="secondary">
              How it works
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/quality">
              See the quality
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryMeta.map((category) => {
          const Icon = category.icon;
          const isConstruction = category.value === "CONSTRUCTION_GROWTH";
          return (
            <Link
              key={category.slug}
              href={`/questionnaire/${category.slug}`}
              className="group rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1"
            >
              <div className={`rounded-[26px] bg-gradient-to-br ${category.accent} p-6 text-white`}>
                <Icon className="h-6 w-6" />
                <h2 className="mt-12 font-display text-4xl leading-tight">{category.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-white/75">{category.tagline}</p>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-600">{category.description}</p>
              {isConstruction ? (
                <div className="mt-5 rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900">
                  <p className="font-semibold">Construction bonus</p>
                  <p className="mt-1">
                    Buy the <span className="font-semibold">Premium PDF</span> and get <span className="font-semibold">2 free job leads</span> included to help you start faster.
                  </p>
                </div>
              ) : null}
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
                Create this report
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
