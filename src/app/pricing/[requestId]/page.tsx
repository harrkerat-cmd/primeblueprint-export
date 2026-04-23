import { notFound } from "next/navigation";
import { PaymentStatus } from "@prisma/client";
import type { PackageId } from "@/config/packages";
import { PricingSelection } from "@/components/pricing/pricing-selection";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { getReportRequest } from "@/lib/report-store";

export const dynamic = "force-dynamic";

export default async function PricingPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const reportRequest = await getReportRequest(requestId);

  if (!reportRequest) {
    notFound();
  }

  if (reportRequest.paymentStatus === PaymentStatus.PAID) {
    return (
      <Container className="py-16 sm:py-20">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <Badge>Payment already confirmed</Badge>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">
            This report has already been purchased
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            To avoid duplicate charges, we are sending you back to the delivery page for this report.
          </p>
          <div className="mt-8">
            <ButtonLink href={`/success?requestId=${reportRequest.id}`}>Go to delivery status</ButtonLink>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16 sm:py-20">
      <div className="mb-10 space-y-4">
        <Badge>Pricing & payment</Badge>
        <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">Unlock your full personalized report</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          Choose between the concise Starter PDF or the full Premium PDF, then continue to secure checkout in GBP.
        </p>
        <div>
          <ButtonLink href={`/preview/${reportRequest.id}`} variant="secondary">
            Back to preview
          </ButtonLink>
        </div>
      </div>
      <PricingSelection
        requestId={reportRequest.id}
        initialPackage={(reportRequest.selectedPackage as PackageId | null) ?? "PREMIUM"}
        paymentStatus={reportRequest.paymentStatus}
      />
    </Container>
  );
}
