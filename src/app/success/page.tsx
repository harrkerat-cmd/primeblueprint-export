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
          Your report is being generated and will arrive in your email within 5 minutes.
        </p>
      </div>
      <ReportStatusCard requestId={requestId} />
    </Container>
  );
}
