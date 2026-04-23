import { ArrowRight, CalendarDays, Lock, Mail, User2 } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { LockedReportStack } from "@/components/preview/locked-report-stack";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { formatDate } from "@/lib/utils";

export function ReportPreview({
  requestId,
  userName,
  email,
  category,
  reportTitle,
  goal
}: {
  requestId: string;
  userName: string;
  email: string;
  category: string;
  reportTitle: string;
  goal?: string | null;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Your preview</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-navy-950">{reportTitle}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Your first page is visible. The rest stays locked until you choose either the Starter PDF or the deeper Premium PDF and complete secure checkout.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <User2 className="h-5 w-5 text-navy-950" />
              <p className="mt-4 text-sm text-slate-500">Prepared for</p>
              <p className="font-semibold text-navy-950">{userName}</p>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <Mail className="h-5 w-5 text-navy-950" />
              <p className="mt-4 text-sm text-slate-500">Delivery email</p>
              <p className="font-semibold text-navy-950">{email}</p>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <Lock className="h-5 w-5 text-navy-950" />
              <p className="mt-4 text-sm text-slate-500">Category</p>
              <p className="font-semibold text-navy-950">{category}</p>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5">
              <CalendarDays className="h-5 w-5 text-navy-950" />
              <p className="mt-4 text-sm text-slate-500">Prepared on</p>
              <p className="font-semibold text-navy-950">{formatDate(new Date())}</p>
            </div>
          </div>

          {goal ? (
            <div className="mt-6 rounded-[24px] border border-slate-100 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Main goal</p>
              <p className="mt-2 text-lg font-semibold text-navy-950">{goal}</p>
            </div>
          ) : null}

          <ButtonLink href={`/pricing/${requestId}`} className="mt-8">
            Unlock full personalized report
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <LockedReportStack title={reportTitle} subtitle={`${category} • One visible page, premium pages locked behind checkout`} />
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-soft">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Package comparison</p>
          <h2 className="mt-3 font-display text-4xl text-navy-950">Choose the level of depth you want in your report</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Starter keeps the document concise and useful. Premium opens the full consultant-style version with a deeper personalized diagnosis, stronger category guidance, resources, and a 1-month routine chart.
          </p>
        </div>
        <PricingCards requestId={requestId} compact />
      </div>
    </div>
  );
}
