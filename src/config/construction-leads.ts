export const constructionLeadPlans = [
  {
    id: "MONTHLY_STARTER",
    name: "Starter Leads",
    displayVolume: "8-10 leads per month",
    displayPrice: "£89.99 / month",
    price: 8999,
    cadence: "monthly",
    description:
      "A steady monthly lead plan for builders and trades who want a manageable flow of genuine opportunities in the areas they serve.",
    note: "Leads are supplied manually by your team after purchase and sent by email.",
    salesPoints: [
      "Suitable for solo builders and smaller teams",
      "Designed for consistent local enquiry flow",
      "No commission taken on the jobs you win"
    ]
  },
  {
    id: "DAILY_PRIORITY",
    name: "Priority Leads",
    displayVolume: "2-3 leads per day",
    displayPrice: "£250 / month",
    price: 25000,
    cadence: "monthly",
    description:
      "A higher-volume option for teams ready to follow up quickly and turn daily opportunity flow into more booked work.",
    note: "Leads are supplied manually by your team after purchase and sent by email.",
    salesPoints: [
      "Best for active teams with faster follow-up capacity",
      "Built for businesses pushing harder on growth",
      "No percentage or commission taken from your jobs"
    ]
  }
] as const;

export type ConstructionLeadPlanId = (typeof constructionLeadPlans)[number]["id"];

export function getConstructionLeadPlan(planId: string) {
  return constructionLeadPlans.find((plan) => plan.id === planId);
}
