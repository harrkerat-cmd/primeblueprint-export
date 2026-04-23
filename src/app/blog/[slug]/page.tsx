import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getBlogPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BlogArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-16 sm:py-20">
      <ButtonLink href="/blog" variant="ghost" className="mb-8 px-0 py-0 text-sm font-medium text-slate-500 hover:bg-transparent hover:text-navy-950">
        <ArrowLeft className="h-4 w-4" />
        Back to blog
      </ButtonLink>

      <article className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-premium sm:p-12">
        <Badge>{post.coverLabel}</Badge>
        <h1 className="mt-6 font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">{post.title}</h1>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 px-4 py-2">{post.categoryFocus}</span>
          <span className="rounded-full border border-slate-200 px-4 py-2">{formatDate(post.publishedAt)}</span>
          <span className="rounded-full border border-slate-200 px-4 py-2">{post.readTime}</span>
        </div>
        <p className="mt-8 text-lg leading-8 text-slate-600">{post.excerpt}</p>

        <div className="mt-10 space-y-7 text-base leading-8 text-slate-700">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 rounded-[28px] border border-slate-200 bg-slate-50 p-7">
          <p className="font-display text-3xl text-navy-950">Want your own personalized plan?</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            The article explains the thinking. The PDF turns your own answers into a report you can actually follow.
          </p>
          <ButtonLink href="/categories" className="mt-6">Create my report</ButtonLink>
        </div>
      </article>
    </Container>
  );
}
