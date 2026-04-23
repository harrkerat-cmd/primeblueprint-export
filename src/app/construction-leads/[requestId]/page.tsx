import { notFound } from "next/navigation";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getConstructionLeadPlan, constructionLeadPlans } from "@/config/construction-leads";
import { getReportRequest } from "@/lib/report-store";
import { ConstructionLeadCheckout } from "@/components/success/construction-lead-checkout";

export const dynamic = "force-dynamic";

export default async function ConstructionLeadsPage({
  params,
  searchParams
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ planId?: string }>;
}) {
  const { requestId } = await params;
  const { planId } = await searchParams;
  const reportRequest = await getReportRequest(requestId);

  if (!reportRequest) {
    notFound();
  }

  const selectedPlan = getConstructionLeadPlan(planId ?? "") ?? constructionLeadPlans[0];

  return (
    <Container className="py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="space-y-5">
          <Badge>Construction leads</Badge>
          <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            Optional genuine lead plans after your construction PDF
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            This is a separate paid upgrade for construction users only. The leads are supplied manually by your team and sent by email after purchase.
          </p>
          <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-soft">
            <p className="font-display text-3xl text-navy-950">How this offer is positioned</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <p>We provide genuine leads directly to your inbox.</p>
              <p>Winning the job still depends on your pricing, service, speed, and fit for the work.</p>
              <p>Unlike some companies, we do not take commission from the jobs you win.</p>
            </div>
          </div>
          <ButtonLink href={`/success?requestId=${requestId}`} variant="ghost" className="px-0 py-0 text-sm text-slate-500 hover:bg-transparent hover:text-navy-950">
            Back to report status
          </ButtonLink>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-2">
            {constructionLeadPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-[30px] border bg-white p-7 shadow-soft ${plan.id === selectedPlan.id ? "border-navy-950" : "border-slate-200"}`}
              >
                <p className="font-display text-3xl text-navy-950">{plan.name}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">{plan.displayVolume}</p>
                <p className="mt-6 text-4xl font-semibold tracking-tight text-navy-950">{plan.displayPrice}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  {plan.salesPoints.map((point) => (
                    <div key={point} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">
                      {point}
                    </div>
                  ))}
                </div>
                <ButtonLink href={`/construction-leads/${requestId}?planId=${plan.id}`} variant={plan.id === selectedPlan.id ? "primary" : "secondary"} className="mt-6">
                  {plan.id === selectedPlan.id ? "Selected plan" : `View ${plan.name}`}
                </ButtonLink>
              </div>
            ))}
          </div>

          <ConstructionLeadCheckout requestId={requestId} planId={selectedPlan.id} />
        </div>
      </div>
    </Container>
  );
}
