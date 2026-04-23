import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-5">
          <Badge>PrimeBlueprint Journal</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            Trust-building articles that explain the value behind the PDFs
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            This blog is wired for AI-assisted updates so you can keep publishing fresh insights, category explainers, and conversion content without rebuilding the site.
          </p>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-navy-950" />
            AI-ready publishing flow
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Use the wired refresh route to generate or replace article drafts later. The front-end already supports premium list and article pages.
          </p>
          <ButtonLink href="/categories" variant="secondary" className="mt-6">
            Explore categories
          </ButtonLink>
        </div>
      </div>

      {featured ? (
        <section className="mt-14 rounded-[36px] border border-slate-200 bg-white p-8 shadow-premium sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Featured article</p>
              <h2 className="mt-4 font-display text-5xl text-navy-950">{featured.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{featured.excerpt}</p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-slate-200 px-4 py-2">{featured.categoryFocus}</span>
                <span className="rounded-full border border-slate-200 px-4 py-2">{formatDate(featured.publishedAt)}</span>
                <span className="rounded-full border border-slate-200 px-4 py-2">{featured.readTime}</span>
              </div>
              <ButtonLink href={`/blog/${featured.slug}`} className="mt-8">
                Read article
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="rounded-[30px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] p-7 text-white shadow-premium">
              <p className="text-xs uppercase tracking-[0.32em] text-white/65">{featured.coverLabel}</p>
              <div className="mt-7 space-y-4">
                {featured.content.slice(0, 3).map((paragraph, index) => (
                  <div key={paragraph} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55">Section {index + 1}</p>
                    <p className="mt-3 text-sm leading-7 text-white/78">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{post.coverLabel}</p>
            <h3 className="mt-4 font-display text-4xl leading-tight text-navy-950">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span>{post.categoryFocus}</span>
              <span>{post.readTime}</span>
            </div>
            <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
              Read more
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </Container>
  );
}
