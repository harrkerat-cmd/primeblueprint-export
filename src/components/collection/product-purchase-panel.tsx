'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/shared/button';
import type { CollectionProduct } from '@/lib/collection/types';

export function CollectionPurchasePanel({ product }: { product: CollectionProduct }) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestTokenRef = useRef(0);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function handleBuy() {
    if (loading) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const token = requestTokenRef.current + 1;
    requestTokenRef.current = token;
    let didRedirect = false;
    const timeoutId = window.setTimeout(() => {
      if (requestTokenRef.current !== token) {
        return;
      }

      controller.abort();
      setLoading(false);
      setError('Checkout is taking too long. Please try again.');
    }, 15000);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/collection/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug: product.slug, email, customerName }),
        signal: controller.signal
      });

      let data: { url?: string; error?: string; productSlug?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (requestTokenRef.current !== token) {
        return;
      }

      if (response.ok && data?.url && data?.productSlug === product.slug) {
        didRedirect = true;
        setLoading(false);
        window.location.href = data.url;
        return;
      }

      setError(data?.error ?? 'Checkout could not be created.');
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }

      if (requestTokenRef.current === token) {
        setError('Checkout could not be created. Please try again.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      if (requestTokenRef.current === token && !didRedirect) {
        setLoading(false);
      }
    }
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Instant purchase</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-4xl text-navy-950">£{(product.price / 100).toFixed(2)}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Instant email delivery plus success-page download.</p>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Premium handbook
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <input
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          placeholder="Your name (optional)"
          className="w-full rounded-[20px] border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email for delivery"
          className="w-full rounded-[20px] border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
        />
      </div>

      {error ? <div className="mt-4 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <Button className="mt-6 w-full justify-center" onClick={handleBuy} disabled={loading || !email}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Buy now
      </Button>

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
          <Mail className="h-4 w-4" />
          Your handbook is emailed after payment
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
          <ShieldCheck className="h-4 w-4" />
          Secure checkout in GBP
        </div>
      </div>
    </div>
  );
}
