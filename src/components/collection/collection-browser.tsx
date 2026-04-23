'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CollectionProductCard } from '@/components/collection/product-card';
import type { CollectionCategory, CollectionProduct } from '@/lib/collection/types';

export function CollectionBrowser({
  categories,
  products
}: {
  categories: CollectionCategory[];
  products: CollectionProduct[];
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.categorySlug === activeCategory;
      const matchesSearch =
        search.length === 0 ||
        product.title.toLowerCase().includes(search) ||
        product.valueProp.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.searchTerms.some((term) => term.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, query]);

  const groupedProducts = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        products: filteredProducts.filter((product) => product.categorySlug === category.slug)
      }))
      .filter((group) => group.products.length > 0);
  }, [categories, filteredProducts]);

  const showGroupedView = activeCategory === 'all' && query.trim().length === 0;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, topic, outcome, or keyword"
            className="w-full rounded-full border border-slate-200 bg-white px-12 py-4 text-sm text-slate-700 shadow-soft outline-none transition focus:border-slate-300"
          />
        </div>
        <div className="text-sm text-slate-500">{filteredProducts.length} handbooks</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${activeCategory === 'all' ? 'bg-navy-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
        >
          All categories
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
            className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${activeCategory === category.slug ? 'bg-navy-950 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {showGroupedView ? (
        <div className="space-y-10">
          {groupedProducts.map(({ category, products: categoryProducts }) => (
            <section key={category.slug} className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-3xl text-navy-950">{category.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{category.description}</p>
                </div>
                <div className="text-sm text-slate-500">{categoryProducts.length} guides</div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {categoryProducts.map((product) => (
                  <CollectionProductCard key={product.slug} product={product} category={category} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <CollectionProductCard
              key={product.slug}
              product={product}
              category={categories.find((category) => category.slug === product.categorySlug)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h3 className="font-display text-3xl text-navy-950">No guides match that search</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Try a broader keyword or switch back to all categories to browse the full Growth Library.
          </p>
        </div>
      )}
    </div>
  );
}
