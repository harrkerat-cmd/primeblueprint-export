export const packages = [
  {
    id: "STARTER",
    name: "Starter PDF",
    price: 999,
    displayPrice: "£9.99",
    description:
      "A concise premium report with a strong personalized opening and practical category guidance that still feels worth keeping.",
    bullets: [
      "Around 5 premium pages",
      "2 to 3 personalized pages based on answers",
      "Useful category-specific guidance and next steps"
    ],
    turnaround: "Fast high-value format",
    featured: false,
    pageRange: "Around 5 pages",
    personalizedDepth: "Focused personalized analysis",
    packageSummary:
      "Built for users who want clarity quickly, but still want the first pages to feel personal and genuinely useful."
  },
  {
    id: "PREMIUM",
    name: "Premium PDF",
    price: 2999,
    displayPrice: "£29.99",
    description:
      "A full premium guide with deep personal analysis first, followed by expert knowledge, resources, routines, and a stronger action plan.",
    bullets: [
      "Around 15 to 16 premium pages",
      "4 to 5 deeply personalized pages",
      "Extended guidebook, resources, routine chart, and final checklist"
    ],
    turnaround: "Best value and deepest guidance",
    featured: true,
    pageRange: "Around 15 to 16 pages",
    personalizedDepth: "Deep personalized consultant-style analysis",
    packageSummary:
      "Built for users who want a more complete premium document they can study, apply, and return to over the next month."
  }
] as const;

export type PackageId = (typeof packages)[number]["id"];

export function getPackageById(id?: string | null) {
  return packages.find((pkg) => pkg.id === id);
}
