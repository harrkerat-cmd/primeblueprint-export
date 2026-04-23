"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { constructionLeadPlans, type ConstructionLeadPlanId, getConstructionLeadPlan } from "@/config/construction-leads";

export function ConstructionLeadCheckout({
  requestId,
  planId
}: {
  requestId: string;
  planId: ConstructionLeadPlanId;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = getConstructionLeadPlan(planId) ?? constructionLeadPlans[0];
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestTokenRef = useRef(0);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function readJson(response: Response) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  async function handleCheckout() {
    if (loading) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const token = requestTokenRef.current + 1;
    requestTokenRef.current = token;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/construction-leads/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, planId }),
        signal: controller.signal
      });

      const data = await readJson(response);
      if (requestTokenRef.current !== token) {
        return;
      }

      setLoading(false);

      if (response.ok && data?.url) {
        window.location.href = data.url;
        return;
      }

      setError(data?.error ?? "We could not create the leads checkout.");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }

      if (requestTokenRef.current === token) {
        setLoading(false);
        setError("We could not create the leads checkout.");
      }
    }
  }

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-premium">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Selected plan</p>
      <h2 className="mt-4 font-display text-4xl text-navy-950">{plan.name}</h2>
      <p className="mt-2 text-lg font-semibold text-navy-950">{plan.displayPrice}</p>
      <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">{plan.displayVolume}</div>
        <div className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">Manual fulfilment by email from your team</div>
        <div className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">No commission taken from the jobs you win</div>
      </div>
      <Button onClick={handleCheckout} className="mt-8" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Buy this leads plan
      </Button>
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
