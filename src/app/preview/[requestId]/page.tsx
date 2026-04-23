import { notFound } from "next/navigation";
import { ReportPreview } from "@/components/preview/report-preview";
import { Badge } from "@/components/shared/badge";
import { Container } from "@/components/shared/container";
import { getCategoryByValue } from "@/config/site";
import { getReportRequest } from "@/lib/report-store";
import { titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const reportRequest = await getReportRequest(requestId);

  if (!reportRequest) {
    notFound();
  }

  return (
    <Container className="py-16 sm:py-20">
      <div className="mb-10 space-y-4">
        <Badge>Report preview</Badge>
        <h1 className="font-display text-5xl tracking-tight text-navy-950 sm:text-6xl">Preview your personalized report</h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          One visible page, a polished locked stack behind it, and a clear package path to unlock the full PDF.
        </p>
      </div>

      <ReportPreview
        requestId={reportRequest.id}
        userName={reportRequest.userName ?? "Client"}
        email={reportRequest.email ?? "your@email.com"}
        category={getCategoryByValue(reportRequest.category)?.title ?? reportRequest.category}
        reportTitle={reportRequest.previewTitle ?? "Personalized Report"}
        goal={reportRequest.mainGoal ? titleCase(reportRequest.mainGoal) : null}
      />
    </Container>
  );
}
