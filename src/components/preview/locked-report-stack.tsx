import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LockedReportStack({
  title,
  subtitle,
  className
}: {
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[440px]", className)}>
      {[2, 1].map((layer) => (
        <div
          key={layer}
          className="absolute inset-0 rounded-[28px] border border-slate-200 bg-white/70 shadow-soft backdrop-blur"
          style={{ transform: `translate(${layer * 12}px, ${layer * 12}px) scale(${1 - layer * 0.02})` }}
        />
      ))}
      <div className="relative rounded-[32px] border border-slate-200 bg-white p-6 shadow-premium">
        <div className="rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preview</p>
            <h3 className="font-display text-4xl text-navy-950">{title}</h3>
            <p className="text-sm leading-7 text-slate-600">{subtitle}</p>
          </div>

          <div className="mt-10 space-y-4">
            <div className="space-y-3 rounded-[24px] border border-slate-100 bg-white p-5 shadow-soft">
              <div className="h-3 w-28 rounded-full bg-slate-200" />
              <div className="h-3 rounded-full bg-slate-100" />
              <div className="h-3 w-4/5 rounded-full bg-slate-100" />
              <div className="h-3 w-3/5 rounded-full bg-slate-100" />
            </div>
            {[1, 2, 3].map((page) => (
              <div key={page} className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-5">
                <div className="absolute inset-0 bg-white/55 backdrop-blur-sm" />
                <div className="space-y-3 blur-[1.5px]">
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="h-3 rounded-full bg-slate-100" />
                  <div className="h-3 rounded-full bg-slate-100" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-10 rounded-[24px] border border-white/80 bg-navy-950/92 p-6 text-center text-white shadow-premium backdrop-blur">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Lock className="h-5 w-5" />
          </div>
          <p className="font-display text-2xl">Unlock full personalized report</p>
          <p className="mt-2 text-sm leading-7 text-white/70">
            View the first page now, then choose a package to unlock the full PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
