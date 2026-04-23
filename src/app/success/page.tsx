import { Badge } from "@/components/shared/badge";
import { Container } from "@/components/shared/container";
import { ReportStatusCard } from "@/components/success/report-status-card";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ requestId?: string }>;
}) {
  const { requestId } = await searchParams;

  return (
    <Container className="py-16 sm:py-20">
      <div className="mb-10 space-y-4">
        <Badge>Success</Badge>
        <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">Your payment is confirmed</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          We are now generating your final PDF and sending it by email. This page updates automatically.
        </p>
      </div>
      {requestId ? (
        <ReportStatusCard requestId={requestId} />
      ) : (
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          Missing request ID. Please return to your checkout confirmation link.
        </div>
      )}
    </Container>
  );
}
