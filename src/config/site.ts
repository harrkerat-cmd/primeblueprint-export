import {
  Award,
  BriefcaseBusiness,
  Clock3,
  Dumbbell,
  HardHat,
  Landmark,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export const siteConfig = {
  name: "PrimeBlueprint",
  tagline: "Your answers. Your plan. Your PDF.",
  email: "support@primeblueprint.ai",
  phone: "+44 (0)20 4587 1204",
  description:
    "Premium AI-powered personalized reports that turn your answers into a practical PDF blueprint.",
  nav: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Growth Library", href: "/collection" },
    { label: "Blog", href: "/blog" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" }
  ],
  trustBadges: [
    { label: "Personalized", icon: Sparkles },
    { label: "Secure Checkout", icon: ShieldCheck },
    { label: "Delivered by Email", icon: Award },
    { label: "Premium Format", icon: Landmark }
  ],
  proofStats: [
    {
      value: "5 categories",
      label: "Built with different question logic and report structures"
    },
    {
      value: "2 clear packages",
      label: "Starter for focused value, Premium for the full deep-dive guide"
    },
    {
      value: "Minutes, not days",
      label: "Fast PDF delivery after successful checkout confirmation"
    }
  ],
  promisePoints: [
    {
      title: "Not one generic PDF",
      description:
        "Every report uses the user's actual answers, priorities, challenges, and preferences so the final sections change with the person."
    },
    {
      title: "Useful enough to follow daily",
      description:
        "Each report includes practical next steps, quick-start actions, and a 30-day direction so it feels worth using after download."
    },
    {
      title: "Premium from first click",
      description:
        "The site, preview, checkout, email delivery, and final PDF are all designed to feel calm, polished, and high-trust."
    }
  ],
  testimonials: [
    {
      quote:
        "The report felt closer to a private advisory summary than an AI download. It gave me a clear route instead of generic noise.",
      name: "Maya Patel",
      role: "Founder, Studio Eleven"
    },
    {
      quote:
        "The daily actions were the part I kept coming back to. It felt personal, structured, and worth the money.",
      name: "Daniel Brooks",
      role: "Fitness client"
    },
    {
      quote:
        "For construction, I liked that it focused on leads, quoting, and trust instead of fluff. It actually sounded like my business.",
      name: "Lewis Carter",
      role: "Construction business owner"
    }
  ],
  faqs: [
    {
      question: "How personalized is the report?",
      answer:
        "Each report is built from the category selected, the answers given in the consultation flow, the chosen package depth, and the user's main goal. The personalized section is written around that answer pattern, so two users in the same category should still receive different reports."
    },
    {
      question: "When do I receive my PDF?",
      answer:
        "Most reports are generated and emailed within a few minutes of successful payment. If generation is still running, the success page keeps the user updated in real time."
    },
    {
      question: "Is the report generated after payment?",
      answer:
        "Yes. Users first see a locked preview, then choose a package. Final generation only begins after successful payment confirmation."
    },
    {
      question: "Can I choose different categories?",
      answer:
        "Yes. A user can create a separate request for each category so every report stays focused on one goal area."
    },
    {
      question: "Do I get the file by email?",
      answer:
        "Yes. The PDF is sent by email and can also be downloaded from the success page once generation finishes."
    },
    {
      question: "What makes this different from generic advice?",
      answer:
        "PrimeBlueprint uses structured questions and category-specific prompts so the final PDF reflects the user's situation, obstacles, pace, and preferences instead of repeating one template to everyone."
    },
    {
      question: "How do construction leads work?",
      answer:
        "Construction users can choose an optional leads plan after buying their PDF. Those leads are fulfilled manually by your team, emailed directly, and clearly positioned as a separate paid service."
    }
  ],
  assuranceStrip: [
    { label: "Secure Stripe checkout", icon: ShieldCheck },
    { label: "A4 premium PDF delivery", icon: Landmark },
    { label: "Fast generation status tracking", icon: Clock3 }
  ]
} as const;

export const categoryMeta = [
  {
    slug: "finance-money",
    value: "FINANCE_MONEY",
    title: "Finance & Money",
    tagline: "More control, smarter money moves, and stronger income direction.",
    description:
      "Get a clearer route for saving, debt reduction, money discipline, and income growth with a report built around your real situation.",
    icon: Landmark,
    accent: "from-slate-950 via-slate-900 to-blue-950",
    reportTitle: "Finance Reset Blueprint"
  },
  {
    slug: "fitness-health",
    value: "FITNESS_HEALTH",
    title: "Fitness & Health",
    tagline: "Look better, feel stronger, and follow a routine that fits real life.",
    description:
      "Receive a focused plan for fat loss, muscle gain, training, nutrition, and consistency without generic fitness noise.",
    icon: Dumbbell,
    accent: "from-slate-950 via-blue-950 to-slate-900",
    reportTitle: "Performance Plan"
  },
  {
    slug: "business-career",
    value: "BUSINESS_CAREER",
    title: "Business & Career",
    tagline: "Choose the right move, grow faster, and build with more clarity.",
    description:
      "Ideal for founders, professionals, and people planning a new move who want direction, stronger positioning, and a clearer path to income and growth.",
    icon: BriefcaseBusiness,
    accent: "from-slate-950 via-slate-900 to-indigo-950",
    reportTitle: "Career Growth Strategy"
  },
  {
    slug: "social-growth",
    value: "SOCIAL_GROWTH",
    title: "Social Growth",
    tagline: "Grow the right audience, improve content, and turn attention into momentum.",
    description:
      "Improve clarity, engagement, personal brand direction, and content strategy with a report tailored to your niche and goals.",
    icon: Sparkles,
    accent: "from-slate-950 via-blue-950 to-slate-950",
    reportTitle: "Social Growth Blueprint"
  },
  {
    slug: "construction-growth",
    value: "CONSTRUCTION_GROWTH",
    title: "Construction Growth",
    tagline: "Win better jobs, improve local trust, and build steadier lead flow.",
    description:
      "Built for trades and contractors who want more leads, better clients, stronger quoting trust, and more consistent monthly growth.",
    icon: HardHat,
    accent: "from-slate-950 via-slate-900 to-blue-950",
    reportTitle: "Construction Growth Plan"
  }
] as const;

export type CategoryValue = (typeof categoryMeta)[number]["value"];
export type CategorySlug = (typeof categoryMeta)[number]["slug"];

export function getCategoryBySlug(slug: string) {
  return categoryMeta.find((category) => category.slug === slug);
}

export function getCategoryByValue(value: string) {
  return categoryMeta.find((category) => category.value === value);
}
