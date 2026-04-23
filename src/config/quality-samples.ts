import type { CategoryValue } from "@/config/site";

export type QualitySample = {
  id: string;
  category: CategoryValue;
  clientName: string;
  reportTitle: string;
  coverNote: string;
  goal: string;
  highlights: string[];
  endingLine: string;
};

export const qualitySamples: QualitySample[] = [
  {
    id: "finance-sample",
    category: "FINANCE_MONEY",
    clientName: "Olivia Hart",
    reportTitle: "Finance Reset Blueprint for Olivia Hart",
    coverNote: "Built around saving discipline, overspending pressure, and a 90-day emergency fund target.",
    goal: "Save money without feeling restricted every week",
    highlights: [
      "A simple weekly money reset routine",
      "A realistic emergency fund target based on current income",
      "Debt and spending priorities arranged in the right order"
    ],
    endingLine: "This sample shows how a finance report becomes a practical weekly plan based on the user's real money goal, pressure points, and timeline."
  },
  {
    id: "fitness-sample",
    category: "FITNESS_HEALTH",
    clientName: "Marcus Dale",
    reportTitle: "Performance Plan for Marcus Dale",
    coverNote: "Built around muscle gain, limited gym days, and nutrition that fits a busy work schedule.",
    goal: "Gain muscle with a routine I can actually follow",
    highlights: [
      "A clear 3-day training split matched to available time",
      "Protein and meal structure written in plain words",
      "Recovery reminders and consistency checkpoints"
    ],
    endingLine: "This sample shows how a fitness report turns the user's goal, training time, and routine into a plan they can start following straight away."
  },
  {
    id: "business-sample",
    category: "BUSINESS_CAREER",
    clientName: "Aisha Noor",
    reportTitle: "Career Growth Strategy for Aisha Noor",
    coverNote: "Built around a service business founder who wants clearer offers, better positioning, and stronger income focus.",
    goal: "Get more clarity on what to sell and how to grow",
    highlights: [
      "Offer positioning based on current stage and skills",
      "A 30-day roadmap with practical weekly priorities",
      "Mistakes to avoid when trying to grow too many things at once"
    ],
    endingLine: "This sample shows how a business report becomes more useful when the next moves are shaped around the user's stage, offer, and growth goal."
  },
  {
    id: "social-sample",
    category: "SOCIAL_GROWTH",
    clientName: "Sofia James",
    reportTitle: "Social Growth Blueprint for Sofia James",
    coverNote: "Built around Instagram growth, low engagement, and a goal to turn content into trust and leads.",
    goal: "Grow the right audience instead of posting randomly",
    highlights: [
      "A content direction shaped by niche and goals",
      "A weekly posting rhythm the client can sustain",
      "Clear engagement ideas that support brand and sales"
    ],
    endingLine: "This sample shows how a social growth report becomes a working plan built around the user's platform, posting style, and audience goal."
  },
  {
    id: "construction-sample",
    category: "CONSTRUCTION_GROWTH",
    clientName: "Daniel Morris",
    reportTitle: "Construction Growth Plan for Daniel Morris",
    coverNote: "Built around loft conversions, extensions, North West London coverage, and a goal to win better domestic leads.",
    goal: "Get better quality leads and improve quoting trust",
    highlights: [
      "Service-area advice based on where the team actually works",
      "Lead source fixes tied to Google, referrals, and social presence",
      "A 30-day action plan focused on quoting, follow-up, and visibility"
    ],
    endingLine: "This sample shows how a construction report changes with the user's trade mix, area, lead source, and growth goal."
  }
];
