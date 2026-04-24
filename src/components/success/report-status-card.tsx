"use client";

import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/shared/button";

type ReportStatusPayload = {
  generationStatus?: string | null;
  emailStatus?: string | null;
  pdfUrl?: string | null;
};

export function ReportStatusCard({ requestId }: { requestId?: string | null }) {
  const [status, setStatus] = useState<ReportStatusPayload | null>(null);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch(`/api/reports/${requestId}/status`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Status check failed with ${response.status}`);
        }

        const nextStatus = (await response.json()) as ReportStatusPayload;
        if (cancelled) {
          return;
        }

        setStatus(nextStatus);
        if (nextStatus.generationStatus !== "COMPLETED" && nextStatus.generationStatus !== "FAILED") {
          timeout = setTimeout(loadStatus, 4000);
        }
      } catch (error) {
        console.error("[success/report-status-card] Failed to read report status.", error);
        if (!cancelled) {
          timeout = setTimeout(loadStatus, 6000);
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [requestId]);

  const readyPdfUrl = status?.generationStatus === "COMPLETED" ? status.pdfUrl : null;
  const emailSent = status?.emailStatus === "SENT";

  if (readyPdfUrl) {
    return (
      <div className="rounded-[32px] border border-emerald-200 bg-emerald-50/70 p-8 shadow-soft">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-semibold text-emerald-900">
              <CheckCircle2 className="h-5 w-5" />
              Your report is ready.
            </p>
            <p className="text-sm leading-6 text-emerald-900/75">
              {emailSent ? "We emailed your PDF too." : "You can download it now. The email delivery may still be finishing."}
            </p>
          </div>
          <ButtonLink href={readyPdfUrl} className="w-full sm:w-auto">
            Download PDF
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-semibold text-navy-950">
            <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            Your report is being generated.
          </p>
          <p className="text-sm leading-6 text-slate-600">
            It will arrive in your email within 5 minutes, and the download button will appear here when it is ready.
          </p>
        </div>
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
          <Mail className="h-4 w-4" />
          Email + download
        </p>
      </div>
    </div>
  );
}
