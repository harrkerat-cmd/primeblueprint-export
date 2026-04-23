import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { CollectionPurchasePanel } from '@/components/collection/product-purchase-panel';
import { Badge } from '@/components/shared/badge';
import { ButtonLink } from '@/components/shared/button';
import { Container } from '@/components/shared/container';
import { getCollectionCategoryBySlug, getCollectionProductBySlug, getCollectionProductsByCategory } from '@/lib/collection/catalog';

export default async function CollectionProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getCollectionProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCollectionCategoryBySlug(product.categorySlug);
  const moreInCategory = getCollectionProductsByCategory(product.categorySlug).filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <Container className="py-16 sm:py-20">
      <ButtonLink href="/collection" variant="ghost" className="mb-8 px-0 py-0 text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </ButtonLink>

      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="space-y-8">
          <div className={`rounded-[34px] bg-gradient-to-br ${category?.accent ?? 'from-slate-950 via-blue-950 to-slate-900'} p-8 text-white shadow-premium`}>
            <Badge>{category?.title ?? 'Growth Library'}</Badge>
            <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl">{product.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{product.valueProp}</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{product.description}</p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/76">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                <Mail className="h-4 w-4" />
                Instant email delivery
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                <ShieldCheck className="h-4 w-4" />
                Examples, tasks, and frameworks
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2">
                <CheckCircle2 className="h-4 w-4" />
                {product.pageTarget + 1} page premium PDF
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">What’s inside</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {product.whatInside.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Inside the guide</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {product.chapters.map((chapter) => (
                  <div key={chapter.title} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-navy-950">{chapter.title}</p>
                    <p className="mt-1">{chapter.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Common mistakes covered</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {product.commonMistakes.map((item) => (
                <div key={item} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Practical framework</p>
            <h2 className="mt-3 font-display text-4xl text-navy-950">{product.frameworkTitle}</h2>
            <div className="mt-6 space-y-3">
              {product.frameworkSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-xs font-semibold text-white">{index + 1}</div>
                  <p className="text-sm leading-7 text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {moreInCategory.length > 0 ? (
            <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">More in this category</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {moreInCategory.map((item) => (
                  <a key={item.slug} href={`/collection/${item.slug}`} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 transition hover:border-slate-200 hover:bg-white">
                    <p className="font-semibold text-navy-950">{item.title}</p>
                    <p className="mt-2">{item.valueProp}</p>
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6 lg:sticky lg:top-32">
          <CollectionPurchasePanel product={product} />
          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Trust note</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              This handbook is part of Growth Library. It is not generated from user answers. It is written as a complete educational product designed to feel worth keeping, using, and revisiting.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
