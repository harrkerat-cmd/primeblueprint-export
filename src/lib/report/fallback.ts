import type { CategoryValue } from "@/config/site";
import { buildReportContent } from "@/lib/report/builder";
import type { GeneratedReportContent } from "@/lib/types";

export function buildFallbackReport({
  title,
  userName,
  category,
  answers,
  packageId = "PREMIUM"
}: {
  title: string;
  userName: string;
  category: CategoryValue;
  categoryLabel?: string;
  answers: Record<string, unknown>;
  packageId?: "STARTER" | "PREMIUM";
}): GeneratedReportContent {
  return buildReportContent({
    category,
    packageId,
    userName,
    answers,
    reportTitle: title
  });
}
