import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getConstructionLeadPlan } from "@/config/construction-leads";

export default async function ConstructionLeadSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ requestId?: string; planId?: string }>;
}) {
  const { requestId, planId } = await searchParams;
  const plan = planId ? getConstructionLeadPlan(planId) : null;

  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-premium sm:p-10">
        <Badge>Construction leads confirmed</Badge>
        <h1 className="mt-6 font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
          Your leads plan is now in place
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          {plan
            ? `You selected ${plan.name} - ${plan.displayVolume} at ${plan.displayPrice}.`
            : "Your construction leads plan has been confirmed."}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Genuine manual leads sent by email
          </div>
          <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            Winning work still depends on pricing, response time, and fit
          </div>
          <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            We do not take commission from the jobs you win
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {requestId ? <ButtonLink href={`/success?requestId=${requestId}`}>Back to report</ButtonLink> : null}
          <ButtonLink href="/contact" variant="secondary">Contact support</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
