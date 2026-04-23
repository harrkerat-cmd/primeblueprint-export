import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/shared/container";
import { getBlogPosts } from "@/lib/blog";

export async function BlogPreview() {
  const posts = await getBlogPosts();

  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Articles that help users trust the product before they buy"
            description="Use the blog to explain value, answer objections, and keep the site feeling active and intelligent."
          />
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
            Visit the blog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{post.coverLabel}</p>
              <h3 className="mt-4 font-display text-4xl leading-tight text-navy-950">{post.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
                Read more
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
