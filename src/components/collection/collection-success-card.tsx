'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Mail, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button';

type StatusPayload = {
  paymentStatus: string;
  generationStatus: string;
  emailStatus: string;
  pdfUrl?: string | null;
  productTitle?: string | null;
  emailMessage?: string | null;
};

export function CollectionSuccessCard({ purchaseId, sessionId }: { purchaseId: string; sessionId?: string | null }) {
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    async function loadStatus() {
      const params = new URLSearchParams();
      if (sessionId) {
        params.set('session_id', sessionId);
      }

      const query = params.toString();
      const response = await fetch(`/api/collection/purchases/${purchaseId}/status${query ? `?${query}` : ''}`, { cache: 'no-store' });
      if (!response.ok) return;
      const data = (await response.json()) as StatusPayload;
      setStatus(data);

      if (data.generationStatus !== 'COMPLETED' && data.generationStatus !== 'FAILED') {
        timer = setTimeout(loadStatus, 2500);
      }
    }

    loadStatus();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [purchaseId, sessionId]);

  if (status?.paymentStatus && status.paymentStatus !== 'PAID') {
    return (
      <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8 shadow-soft">
        <div className="flex items-center gap-3 text-amber-900">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="font-semibold">We are still confirming your payment.</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-amber-900">
          If you have just completed checkout, give this page a moment to update. If payment was cancelled, return to the product page and try again safely.
        </p>
      </div>
    );
  }

  if (!status || status.generationStatus === 'QUEUED' || status.generationStatus === 'GENERATING') {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex items-center gap-3 text-navy-950">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="font-semibold">We are preparing your handbook now.</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">Keep this page open. As soon as the handbook is ready, the download button and email status will appear here.</p>
      </div>
    );
  }

  if (status.generationStatus === 'FAILED') {
    return (
      <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 shadow-soft">
        <div className="flex items-center gap-3 text-red-800">
          <TriangleAlert className="h-5 w-5" />
          <p className="font-semibold">We hit a delivery issue.</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-red-700">Your payment is safe. Please contact support and include your purchase ID: {purchaseId}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="flex items-center gap-3 text-emerald-700">
        <CheckCircle2 className="h-6 w-6" />
        <p className="font-semibold">Your handbook is ready.</p>
      </div>
      <h2 className="mt-5 font-display text-4xl text-navy-950">{status.productTitle}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">Download the PDF below. {status.emailStatus === 'SENT' ? 'A copy has also been sent to your email.' : 'You can download it here even if email sending is not configured yet.'}</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {status.pdfUrl ? <ButtonLink href={status.pdfUrl}>Download PDF</ButtonLink> : null}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-600">
          <Mail className="h-4 w-4" />
          Email status: {status.emailStatus.replaceAll('_', ' ').toLowerCase()}
        </div>
      </div>
      {status.emailMessage ? <p className="mt-4 text-sm text-slate-500">{status.emailMessage}</p> : null}
    </div>
  );
}
