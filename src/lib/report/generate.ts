import { type ReportCategory } from "@prisma/client";
import { buildReportContent } from "@/lib/report/builder";
import type { GeneratedReportContent } from "@/lib/types";

export async function generateReportContent({
  category,
  packageId,
  userName,
  answers,
  reportTitle
}: {
  category: ReportCategory;
  packageId: string;
  userName: string;
  answers: Record<string, unknown>;
  reportTitle: string;
}): Promise<GeneratedReportContent> {
  // Build from a controlled content system so premium PDFs stay category-specific,
  // safe for sensitive topics, and consistent even when external APIs are unavailable.
  return buildReportContent({
    category,
    packageId: packageId === "STARTER" ? "STARTER" : "PREMIUM",
    userName,
    answers,
    reportTitle
  });
}
