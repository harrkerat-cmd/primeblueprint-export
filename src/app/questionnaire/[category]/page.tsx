import { notFound } from "next/navigation";
import { QuestionnaireClient } from "@/components/questionnaire/questionnaire-client";
import { getCategoryBySlug } from "@/config/site";

export default async function QuestionnairePage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryMeta = getCategoryBySlug(category);

  if (!categoryMeta) {
    notFound();
  }

  return <QuestionnaireClient category={categoryMeta.value} />;
}
