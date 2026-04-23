import type { PackageId } from "@/config/packages";
import type { CategoryValue } from "@/config/site";

export const categoryPromptTemplates: Record<CategoryValue, string> = {
  FINANCE_MONEY:
    "Write like a practical money strategist. Diagnose behaviour patterns, explain why the client feels stuck, recommend realistic saving and budgeting systems, and keep all finance language educational rather than regulated advice.",
  FITNESS_HEALTH:
    "Write like a credible coach focused on training structure, food habits, recovery, and consistency. Keep the advice educational, avoid diagnosis, and explain the likely habit gaps behind the client's current result.",
  BUSINESS_CAREER:
    "Write like a sharp operator and career strategist. Explain stage, positioning, opportunity, likely mistakes, and the best next move with concrete sequencing rather than abstract motivation.",
  SOCIAL_GROWTH:
    "Write like a premium growth strategist. Diagnose clarity, niche, content rhythm, and audience trust gaps. Give stronger direction, posting ideas, and disciplined creator systems without sounding generic.",
  CONSTRUCTION_GROWTH:
    "Write like a specialist advisor for UK trades and contractors. Focus on local positioning, lead quality, quoting, trust signals, follow-up, referrals, repeat work, and category-specific operational discipline. Never invent legal or regulatory certainty."
};

function summarizeAnswersForPrompt(answers: Record<string, unknown>) {
  return Object.entries(answers)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `- ${key}: ${value.join(", ")}`;
      }

      return `- ${key}: ${String(value)}`;
    })
    .join("\n");
}

export function buildReportPrompt({
  category,
  packageId,
  userName,
  answers,
  reportTitle
}: {
  category: CategoryValue;
  packageId: PackageId;
  userName: string;
  answers: Record<string, unknown>;
  reportTitle: string;
}) {
  const packageInstructions =
    packageId === "STARTER"
      ? [
          "Starter structure: cover page, client snapshot, 2 to 3 deeply personalized pages, concise mistakes and direction, then practical category guidance.",
          "Target depth: around 5 pages total. Keep it concise but still worth paying for."
        ]
      : [
          "Premium structure: cover page, client snapshot, 4 to 5 deeply personalized pages, then a premium category-specific guidebook section, resources, a 1-month routine chart, motivation, an illustrative example page, and a final checklist.",
          "Target depth: around 15 to 16 pages total. It must feel like a complete premium paid document, not a short AI note."
        ];

  return [
    "You are writing a PrimeBlueprint premium strategy report.",
    `Report title: ${reportTitle}`,
    `Client name: ${userName}`,
    `Category: ${category}`,
    `Package: ${packageId}`,
    "Main objective: create something that feels like a serious paid guide written around the client's answers.",
    "Part 1 is the most important: interpret the user's answers, diagnose likely mistakes and pressure points, explain why they feel stuck, and give a clear next direction.",
    "Part 2 must be category-specific premium knowledge that adds real value and does not read like recycled generic advice.",
    "Use headings, bullet groups, callouts, checklists, practical examples, and useful resources where relevant.",
    "Avoid fluff, filler motivation, robotic tone, repeated phrases, or vague life-coach language.",
    "For construction, finance, and health topics, be careful with sensitive claims and include educational or verification language rather than certainty.",
    ...packageInstructions,
    categoryPromptTemplates[category],
    `Answer summary:\n${summarizeAnswersForPrompt(answers)}`,
    `Full answers JSON:\n${JSON.stringify(answers, null, 2)}`
  ].join("\n\n");
}
