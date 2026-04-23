import Link from 'next/link';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import type { CollectionCategory, CollectionProduct } from '@/lib/collection/types';

export function CollectionProductCard({
  product,
  category
}: {
  product: CollectionProduct;
  category?: CollectionCategory;
}) {
  return (
    <Link
      href={`/collection/${product.slug}`}
      className="group flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-slate-300"
    >
      <div className={`rounded-[24px] bg-gradient-to-br ${category?.accent ?? 'from-slate-950 via-blue-950 to-slate-900'} p-5 text-white`}>
        <p className="text-xs uppercase tracking-[0.24em] text-white/65">{category?.title ?? 'Growth Library'}</p>
        <h3 className="mt-10 font-display text-3xl leading-tight">{product.title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/76">{product.valueProp}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Structured handbook
        </span>
        <span className="text-2xl font-semibold tracking-tight text-navy-950">£{(product.price / 100).toFixed(2)}</span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        {product.whatInside.slice(0, 3).map((item) => (
          <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          {Math.max(product.pageTarget, 10)}+ pages
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
          <Mail className="h-3.5 w-3.5" />
          Instant email delivery
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure checkout
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-950">
        View handbook
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
