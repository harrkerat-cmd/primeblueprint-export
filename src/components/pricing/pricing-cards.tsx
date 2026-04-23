"use client";

import { Loader2 } from "lucide-react";
import { packages, type PackageId } from "@/config/packages";
import { Button } from "@/components/shared/button";
import { cn } from "@/lib/utils";

export function PricingCards({
  requestId,
  compact = false,
  selectedPackage,
  onSelect,
  loadingPackage
}: {
  requestId?: string;
  compact?: boolean;
  selectedPackage?: PackageId;
  onSelect?: (packageId: PackageId) => void;
  loadingPackage?: PackageId | null;
}) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-2", compact && "xl:grid-cols-2") }>
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={cn(
            "flex h-full flex-col rounded-[28px] border bg-white p-6 shadow-soft transition duration-300",
            pkg.featured ? "border-navy-950 shadow-premium" : "border-slate-200"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-3xl text-navy-950">{pkg.name}</p>
              <p className="mt-2 text-sm text-slate-500">{pkg.turnaround}</p>
            </div>
            {pkg.featured ? (
              <span className="rounded-full bg-navy-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Featured
              </span>
            ) : null}
          </div>
          <div className="mt-6">
            <p className="text-4xl font-semibold tracking-tight text-navy-950">{pkg.displayPrice}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{pkg.description}</p>
          </div>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            {pkg.bullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                {bullet}
              </div>
            ))}
          </div>
          {onSelect ? (
            <Button
              className="mt-8"
              variant={pkg.id === selectedPackage ? "primary" : "secondary"}
              onClick={() => onSelect(pkg.id)}
              disabled={loadingPackage === pkg.id || !requestId}
            >
              {loadingPackage === pkg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {pkg.id === selectedPackage ? "Continue to secure checkout" : `Choose ${pkg.name}`}
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
