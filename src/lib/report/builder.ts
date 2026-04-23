import { getPackageById, type PackageId } from "@/config/packages";
import { getCategoryByValue, type CategoryValue } from "@/config/site";
import type {
  ClientSnapshot,
  GeneratedReportContent,
  ReportCallout,
  ReportPage,
  ReportResource,
  RoutineEntry
} from "@/lib/types";
import { formatDate, titleCase } from "@/lib/utils";

const brandName = "PrimeBlueprint";
const brandTagline = "Built around your goals. Written for your next move.";
const baseCoverLine =
  "A personalized strategy report designed around your answers, current position, and selected priorities.";

function formatAnswer(value: unknown, fallback: string) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => titleCase(String(item))).join(", ");
  }

  if (typeof value === "string" && value.length > 0) {
    return titleCase(value.replace(/_/g, " "));
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return fallback;
}

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function buildCurrentSituation(category: CategoryValue, answers: Record<string, unknown>) {
  if (category === "CONSTRUCTION_GROWTH") {
    return `${formatAnswer(answers.teamModel, "A growing construction business")} serving ${formatAnswer(answers.serviceAreas, "selected local areas")}`;
  }

  if (category === "BUSINESS_CAREER") {
    return `${formatAnswer(answers.currentStage, "An active stage")} with a focus on ${formatAnswer(answers.businessType, "the chosen path")}`;
  }

  return formatAnswer(
    answers.currentSituation ?? answers.currentStage ?? answers.activityLevel ?? answers.followerRange,
    "A clear baseline still needs to be defined"
  );
}

function buildTimeline(answers: Record<string, unknown>) {
  return formatAnswer(
    answers.timeline ?? answers.speed ?? answers.successVision ?? answers.postsPerWeek ?? answers.revenueRange,
    "The next 30 days"
  );
}

function buildChallenge(answers: Record<string, unknown>) {
  return formatAnswer(
    answers.biggestChallenge ?? answers.biggestStruggle ?? answers.currentSituation ?? answers.leadSources,
    "Not having a clear path"
  );
}

function pickRotating<T>(values: readonly T[], index: number) {
  return values[index % values.length];
}

function buildSnapshot({
  userName,
  categoryLabel,
  packageName,
  goal,
  currentSituation,
  challenge,
  timeline
}: {
  userName: string;
  categoryLabel: string;
  packageName: string;
  goal: string;
  currentSituation: string;
  challenge: string;
  timeline: string;
}): ClientSnapshot {
  return {
    name: userName,
    category: categoryLabel,
    goal,
    currentSituation,
    mainChallenge: challenge,
    focusTimeline: timeline,
    packageName
  };
}

function buildConstructionKnowledge(): ReportPage[] {
  return [
    {
      id: "construction-growth-system",
      title: "Lead quality, positioning, and why growth stalls",
      subtitle: "Where most construction businesses leak trust before the quote is even sent",
      paragraphs: [
        "A construction business can look busy on the surface and still feel stuck underneath. The usual pattern is inconsistent lead quality, slow follow-up, unclear positioning, weak proof, and pricing that does not reflect the standard of work being delivered.",
        "Better clients rarely come from doing more of everything. They come from clearer local positioning, stronger trust signals, and a lead handling process that makes the business feel more reliable before the first visit is booked."
      ],
      bulletGroups: [
        {
          title: "What usually holds builders back",
          items: [
            "Depending too heavily on mixed referrals without building a repeatable lead channel",
            "Following up too slowly after site visits or quote requests",
            "Showing the work, but not the process, guarantees, proof, and reassurance behind it"
          ]
        },
        {
          title: "How to improve local positioning",
          items: [
            "Make the main trade focus obvious on every profile and marketing surface",
            "Match project photos, testimonials, and service wording to the type of client you want more of",
            "Build location trust by showing real service areas, recent jobs, and the style of work you are known for"
          ]
        }
      ],
      callouts: [
        {
          label: "Positioning rule",
          title: "People trust specialists faster than general claims",
          body: "If the business wants more extensions, lofts, renovations, or commercial work, the messaging needs to show that specialism clearly instead of sounding broad and interchangeable."
        }
      ]
    },
    {
      id: "construction-systems",
      title: "Quote follow-up, referrals, and repeat-work systems",
      subtitle: "The systems that turn one completed job into the next few opportunities",
      paragraphs: [
        "Growth becomes more predictable when quoting is treated as a system, not a one-off event. A clearer quote, faster follow-up, and better proof afterwards can lift conversion without spending heavily on more traffic.",
        "Referral and repeat-work systems matter because previous clients already know the standard of work. Most construction businesses underuse that trust because they never ask at the right time or never package the ask properly."
      ],
      bulletGroups: [
        {
          title: "Quote follow-up structure",
          items: [
            "Send a clean summary after the visit so the client remembers the scope and next steps",
            "Follow up on a defined timeline instead of waiting passively",
            "Answer the confidence questions clients usually have: timing, process, disruption, finish level, and proof"
          ]
        },
        {
          title: "Referral and repeat-work ideas",
          items: [
            "Ask for referrals immediately after visible progress or project completion",
            "Keep a simple aftercare message sequence for past clients",
            "Use project updates and before-and-after proof as trust assets for future leads"
          ]
        },
        {
          title: "Content strategy for builders",
          items: [
            "Post project proof, common client questions, and process explanations instead of random content",
            "Show how you plan, communicate, protect the property, and finish the job",
            "Use location-led and service-led content so the right enquiries find you"
          ]
        }
      ]
    },
    {
      id: "construction-guidance",
      title: "General UK guidance, suppliers, and support resources",
      subtitle: "Useful support blocks, but always verify legal and local rules officially",
      paragraphs: [
        "General guidance only: planning, permissions, building control, and certification requirements can change by area, property type, scope of work, and current regulations. This report should support decision-making, not replace official verification.",
        "For build decisions, technical details, and compliance questions, use official government guidance, local council planning teams, Building Control, planning officers, structural professionals, and product manufacturers directly."
      ],
      bulletGroups: [
        {
          title: "What often needs official checking",
          items: [
            "Planning permission and local planning constraints",
            "Building Regulations approval or Building Control sign-off",
            "Electrical, gas, structural, fire, insulation, drainage, or warranty documentation where relevant"
          ]
        },
        {
          title: "Useful support directions",
          items: [
            "Local council planning pages and Building Control contacts",
            "Official UK government guidance and planning information services",
            "Builder's merchants, technical manufacturers, and trade bodies for specification support"
          ]
        }
      ],
      resources: [
        {
          name: "Local council planning and Building Control pages",
          description: "Check local requirements, constraints, application routes, and inspection expectations.",
          referenceLabel: "Official local authority guidance"
        },
        {
          name: "UK government planning and business guidance",
          description: "Use official public guidance for national-level information before making claims to clients.",
          referenceLabel: "Official UK government guidance"
        },
        {
          name: "Planning Portal and Building Control information services",
          description: "Helpful for general overviews and process understanding, but not a substitute for local confirmation.",
          referenceLabel: "Planning information reference"
        },
        {
          name: "Trade bodies, CITB, TrustMark, and HSE guidance",
          description: "Useful for standards, training, trust signals, and safety practices.",
          referenceLabel: "Industry and safety references"
        },
        {
          name: "Builders' merchants and manufacturer technical libraries",
          description: "Use supplier support and manufacturer literature to tighten specification confidence and product decisions.",
          referenceLabel: "Merchant and manufacturer support"
        }
      ],
      note:
        "General guidance — always verify with your local council, Building Control, planning officer, or official UK government guidance before acting on regulatory or legal assumptions."
    }
  ];
}

function buildFinanceKnowledge(): ReportPage[] {
  return [
    {
      id: "finance-patterns",
      title: "Money patterns, spending behaviour, and why progress slips",
      subtitle: "Where financial momentum usually breaks down in everyday life",
      paragraphs: [
        "Most money problems are not caused by one dramatic error. They come from repeated small decisions, a lack of visibility, and a money system that feels too vague to follow under normal pressure.",
        "A useful money plan needs more than motivation. It needs structure, friction in the right places, and routines that make overspending or avoidance harder to repeat."
      ],
      bulletGroups: [
        {
          title: "Common financial mistakes",
          items: [
            "Trying to save what is left instead of directing money early",
            "Treating irregular spending like a surprise instead of planning for it",
            "Using willpower alone without a simple review rhythm"
          ]
        },
        {
          title: "Better money systems",
          items: [
            "Separate essentials, savings, and flexible spending clearly",
            "Use one weekly review instead of daily guilt-driven checking",
            "Tie saving or debt reduction to the day income lands"
          ]
        }
      ]
    },
    {
      id: "finance-routines",
      title: "Saving systems, budgeting structure, and money discipline",
      subtitle: "Practical systems that make good behaviour easier to repeat",
      paragraphs: [
        "Budgeting works best when it is simple enough to maintain, visible enough to trust, and realistic enough to survive an imperfect month.",
        "Money discipline is not about shame. It is about shortening the distance between awareness and action."
      ],
      bulletGroups: [
        {
          title: "A stronger budgeting structure",
          items: [
            "Keep fixed costs visible and reviewed monthly",
            "Set a clear number for guilt-free flexible spending",
            "Review subscriptions, debt costs, and low-value spending monthly"
          ]
        },
        {
          title: "Saving and debt priorities",
          items: [
            "Build a starter buffer if everything currently feels fragile",
            "Reduce the most expensive or most stressful debt first based on the chosen strategy",
            "Track one number that matters most: savings rate, debt balance, or spending gap"
          ]
        }
      ]
    },
    {
      id: "finance-resources-knowledge",
      title: "Educational resources and money support direction",
      subtitle: "Use guidance, not guesswork, when the topic gets more sensitive",
      paragraphs: [
        "Money advice becomes more useful when the user knows where educational guidance ends and regulated advice begins. This report is educational, strategic, and behaviour-focused rather than regulated personal financial advice.",
        "If debt pressure, vulnerability, benefits, legal enforcement, or specialist tax questions are involved, official support and qualified help matter more than generic internet tips."
      ],
      resources: [
        {
          name: "MoneyHelper and Citizens Advice",
          description: "Useful for education, debt support direction, and understanding money options more clearly.",
          referenceLabel: "UK money guidance"
        },
        {
          name: "Bank spending exports and budgeting tools",
          description: "Use them to build awareness first; clarity is the base of better money choices.",
          referenceLabel: "Personal finance systems"
        },
        {
          name: "Employer support, training, or income-building opportunities",
          description: "For users focused on income growth, look beyond budgeting alone and review earning capacity too.",
          referenceLabel: "Income improvement direction"
        }
      ],
      note: "Educational guidance only — not regulated financial advice."
    }
  ];
}

function buildBusinessKnowledge(): ReportPage[] {
  return [
    {
      id: "business-stage",
      title: "Stage clarity, opportunity analysis, and why growth feels messy",
      subtitle: "What usually causes talented people to stay scattered for too long",
      paragraphs: [
        "Business and career frustration usually comes from unclear positioning, too many competing priorities, and weak evidence about what the market actually values most.",
        "A sharper path comes from matching the current stage to the right next move instead of copying somebody operating with a different budget, audience, or business model."
      ],
      bulletGroups: [
        {
          title: "What often goes wrong",
          items: [
            "Trying to improve brand, offer, clients, systems, and marketing all at once",
            "Being too vague about who the offer is really for",
            "Waiting for confidence instead of building proof through smaller clear actions"
          ]
        },
        {
          title: "Opportunity direction",
          items: [
            "Strengthen the offer before widening the audience",
            "Use existing skills as leverage before chasing entirely new lanes",
            "Build proof and case examples early so positioning becomes easier"
          ]
        }
      ]
    },
    {
      id: "business-growth-plan",
      title: "Positioning, skill-building, client-building, and growth routines",
      subtitle: "The habits that create more traction without more chaos",
      paragraphs: [
        "A stronger growth plan usually combines skill depth, message clarity, and consistent market contact. That means the user needs both strategic thinking and a weekly routine that produces evidence.",
        "The right routine depends on whether the user is building from zero, switching direction, or growing something already active."
      ],
      bulletGroups: [
        {
          title: "Practical routines",
          items: [
            "Protect time each week for offer improvement, proof gathering, and outreach",
            "Review which conversations, channels, or content create real traction",
            "Stop refining invisible work forever and start testing clearer market messages"
          ]
        },
        {
          title: "Useful support directions",
          items: [
            "Local growth hubs, startup support networks, and industry communities",
            "Portfolio or case study building when trust is still low",
            "Client acquisition or networking systems matched to the chosen market"
          ]
        }
      ]
    },
    {
      id: "business-resources-knowledge",
      title: "Helpful resources, funding directions, and support options",
      subtitle: "Where people often find practical help once the direction becomes clearer",
      paragraphs: [
        "Users trying to start or grow a business often need more than ideas. They need exposure to funding routes, support ecosystems, and examples of how similar operators found their first traction.",
        "The most useful resource list is one that supports the next move directly rather than creating more research clutter."
      ],
      resources: [
        {
          name: "Local growth hubs and startup support programmes",
          description: "Useful for mentoring, training, grants direction, and local business contacts.",
          referenceLabel: "Regional business support"
        },
        {
          name: "British Business Bank, Start Up Loans, and official funding directories",
          description: "Relevant when the user needs to understand mainstream support routes before chasing expensive finance.",
          referenceLabel: "Funding direction"
        },
        {
          name: "Professional communities and client-building platforms",
          description: "Useful for proof, partnerships, and early market feedback.",
          referenceLabel: "Market access support"
        }
      ]
    }
  ];
}

function buildFitnessKnowledge(): ReportPage[] {
  return [
    {
      id: "fitness-analysis",
      title: "Goal analysis, routine gaps, and why progress stalls",
      subtitle: "Most fitness frustration comes from mismatch, not lack of effort",
      paragraphs: [
        "People often feel stuck in fitness because the goal, food structure, training load, and lifestyle do not support each other properly. The problem is not always effort. It is usually a poor fit between the plan and real life.",
        "A better result comes from building a routine that works on normal weeks, not ideal ones."
      ],
      bulletGroups: [
        {
          title: "Typical mistakes",
          items: [
            "Going too hard early and then losing the routine",
            "Using a food plan that feels too strict to sustain",
            "Training with effort but without progression, recovery, or structure"
          ]
        },
        {
          title: "What helps most",
          items: [
            "Match training volume to available days and recovery",
            "Make nutrition repeatable before trying to make it perfect",
            "Track a few useful measures rather than obsessing over everything"
          ]
        }
      ]
    },
    {
      id: "fitness-guidance",
      title: "Educational workout, nutrition, and habit guidance",
      subtitle: "Practical foundations that make progress more likely",
      paragraphs: [
        "Workout guidance becomes more valuable when it is simple enough to repeat. Nutrition guidance becomes more useful when it respects appetite, schedule, food preferences, and the user's real environment.",
        "The goal is not to sound extreme. The goal is to create a plan the user can actually follow long enough to see evidence of change."
      ],
      bulletGroups: [
        {
          title: "Workout direction",
          items: [
            "Use the available training days deliberately instead of adding random sessions",
            "Prioritize exercise quality and progression over novelty",
            "Leave enough recovery margin to protect consistency"
          ]
        },
        {
          title: "Food and habit direction",
          items: [
            "Anchor meals around protein, structure, and repeatability",
            "Reduce decision fatigue by repeating successful meals and timings",
            "Treat weekends, travel, and social events as part of the plan rather than exceptions"
          ]
        }
      ]
    },
    {
      id: "fitness-resources-knowledge",
      title: "Helpful resources and educational support",
      subtitle: "Support the goal with credible help, not random information overload",
      paragraphs: [
        "Fitness and health information is everywhere, but not all of it helps. The user needs a short list of reliable educational support options and a reminder that this report is not medical advice.",
        "If pain, fatigue, injury history, medication, or health conditions are significant factors, professional medical or qualified clinical guidance matters more than generic content."
      ],
      resources: [
        {
          name: "NHS and official public health guidance",
          description: "Useful for broad educational support, movement guidance, and baseline health information.",
          referenceLabel: "Public health education"
        },
        {
          name: "Qualified coaches, physios, and gym induction support",
          description: "Helpful when technique, progression, or limitations are creating uncertainty.",
          referenceLabel: "Professional support"
        },
        {
          name: "Meal tracking, habit tracking, and training logs",
          description: "Use tracking as feedback, not punishment.",
          referenceLabel: "Routine tools"
        }
      ],
      note: "Educational guidance only — not medical advice."
    }
  ];
}

function buildSocialKnowledge(): ReportPage[] {
  return [
    {
      id: "social-growth-gaps",
      title: "Growth mistakes, content gaps, and why the account feels flat",
      subtitle: "Most social stagnation comes from unclear direction, not a broken algorithm",
      paragraphs: [
        "Social growth often stalls because the account tries to do too many jobs at once. The message is unclear, the content rhythm is inconsistent, and the audience has no strong reason to remember the creator or business.",
        "The right fix is not always more content. It is better positioning, clearer recurring themes, and a more disciplined publishing system."
      ],
      bulletGroups: [
        {
          title: "What usually goes wrong",
          items: [
            "Posting without a strong niche or outcome for the audience",
            "Switching content styles too often to build trust",
            "Waiting for motivation instead of using a repeatable process"
          ]
        },
        {
          title: "What usually works better",
          items: [
            "Choose a few repeatable content pillars and stay with them long enough to learn",
            "Build content around audience problems, proof, and personality",
            "Treat content creation and distribution as separate jobs"
          ]
        }
      ]
    },
    {
      id: "social-brand-system",
      title: "Content direction, personal brand, and platform strategy",
      subtitle: "Build the account so people understand who it is for and why it matters",
      paragraphs: [
        "A strong content system helps the user create with less stress and better quality. A strong brand system helps the right followers stay, trust, and take the next step.",
        "The most effective accounts usually combine clarity, repetition, and audience empathy with a style that still feels human."
      ],
      bulletGroups: [
        {
          title: "Practical growth strategy",
          items: [
            "Use stronger hooks, clearer positioning, and repeatable angles",
            "Plan publishing around the number of posts the user can actually maintain",
            "Create a balance of growth content, trust content, and conversion content"
          ]
        },
        {
          title: "Posting ideas",
          items: [
            "Problems and myths in the niche",
            "Behind-the-scenes process or proof",
            "Short frameworks, examples, before-and-after outcomes, and opinion-based pieces"
          ]
        }
      ]
    },
    {
      id: "social-resources-knowledge",
      title: "Useful tools, references, and support",
      subtitle: "Keep the workflow lean so content quality improves instead of becoming more chaotic",
      paragraphs: [
        "The right tools help reduce friction, but they should never replace clear positioning and useful ideas. The best resources support creation, analytics, and discipline without becoming another distraction.",
        "Growth improves when the user treats analytics as a learning tool instead of a self-worth score."
      ],
      resources: [
        {
          name: "Platform analytics and native creator tools",
          description: "Use them to see what earns reach, saves, watch time, clicks, and qualified engagement.",
          referenceLabel: "Built-in analytics"
        },
        {
          name: "Content planning and design tools",
          description: "Useful for batching, light design, captions, and scheduling support.",
          referenceLabel: "Workflow support"
        },
        {
          name: "Creator education hubs and platform-specific learning resources",
          description: "Useful for format updates, posting ideas, and platform behaviour patterns.",
          referenceLabel: "Educational references"
        }
      ]
    }
  ];
}

function buildKnowledgePages(category: CategoryValue) {
  if (category === "CONSTRUCTION_GROWTH") return buildConstructionKnowledge();
  if (category === "FINANCE_MONEY") return buildFinanceKnowledge();
  if (category === "BUSINESS_CAREER") return buildBusinessKnowledge();
  if (category === "FITNESS_HEALTH") return buildFitnessKnowledge();
  return buildSocialKnowledge();
}

function buildDisclaimers(category: CategoryValue) {
  if (category === "CONSTRUCTION_GROWTH") {
    return [
      "General guidance — always verify with your local council, Building Control, planning officer, or official UK government guidance before relying on regulatory assumptions.",
      "Rules, permissions, approvals, and technical obligations can vary by location, project scope, property type, and current law."
    ];
  }

  if (category === "FINANCE_MONEY") {
    return [
      "This report is educational and strategic in nature and should not be treated as regulated financial advice.",
      "For regulated products, legal debt issues, tax matters, or major financial decisions, use qualified professional guidance."
    ];
  }

  if (category === "FITNESS_HEALTH") {
    return [
      "This report is educational and should not replace medical advice, diagnosis, or treatment.",
      "If pain, injury, symptoms, or medical conditions are involved, seek qualified medical or clinical support."
    ];
  }

  return [];
}

function buildMotivationPage(category: CategoryValue, userName: string, goal: string): ReportPage {
  const messages: Record<CategoryValue, { title: string; body: string; checklist: string[] }> = {
    FINANCE_MONEY: {
      title: "Confidence grows after evidence, not before it",
      body:
        `${userName} does not need a perfect money identity to move forward. Better financial confidence usually appears after smaller systems start working, bills feel less chaotic, and the goal stops feeling abstract.`,
      checklist: [
        "Measure progress with numbers, not mood alone",
        "Protect the weekly review even when the month feels messy",
        "Focus on fewer financial wins and stack them deliberately"
      ]
    },
    FITNESS_HEALTH: {
      title: "The body changes when the routine becomes believable",
      body:
        `The most important shift for ${userName} is not intensity, it is trust. Once the routine feels believable, the goal of ${lowerFirst(goal)} becomes far easier to sustain long enough to produce visible change.`,
      checklist: [
        "Choose a routine you can repeat on average weeks",
        "Stop chasing perfect days as the condition for progress",
        "Let consistency build confidence instead of waiting for confidence first"
      ]
    },
    BUSINESS_CAREER: {
      title: "Clear direction usually beats raw effort",
      body:
        `${userName} does not need to do everything. The stronger move is to reduce noise, tighten the offer or path, and let better decisions compound. That is what makes growth feel lighter and more strategic.`,
      checklist: [
        "Protect time for the moves that change positioning or income",
        "Judge progress by market evidence, not only internal doubt",
        "Keep refining with feedback instead of rebuilding from zero"
      ]
    },
    SOCIAL_GROWTH: {
      title: "Better creators usually win through patience with a strong system",
      body:
        `${userName} does not need to post endlessly to grow. The more powerful move is to publish with clarity, learn from the response, and keep enough discipline to let the brand become recognisable over time.`,
      checklist: [
        "Repeat strong themes long enough to learn what resonates",
        "Separate creation quality from daily emotional swings",
        "Use performance as feedback rather than a reason to quit early"
      ]
    },
    CONSTRUCTION_GROWTH: {
      title: "Growth follows trust, speed, and follow-through",
      body:
        `For ${userName}, the business does not need to look louder. It needs to feel more reliable, more specialist, and easier to trust. Better clients usually follow that kind of improvement faster than people expect.`,
      checklist: [
        "Protect response speed when new leads arrive",
        "Keep proof of work and proof of process visible",
        "Treat every completed job as an asset for the next enquiry"
      ]
    }
  };

  const block = messages[category];

  return {
    id: `${category.toLowerCase()}-motivation`,
    title: "Motivation and belief-building",
    subtitle: block.title,
    paragraphs: [block.body],
    checklist: block.checklist,
    note: "Belief usually improves after action produces proof."
  };
}

function buildExamplePage(category: CategoryValue): ReportPage {
  const examples: Record<CategoryValue, ReportPage> = {
    FINANCE_MONEY: {
      id: "finance-example",
      title: "Illustrative progress pattern",
      subtitle: "How steady money improvement often actually looks",
      paragraphs: [
        "An illustrative pattern: somebody begins with weak visibility, irregular saving, and impulsive spending. The first change is not huge income growth. It is better control. That control then makes better saving, debt reduction, and calmer decisions possible.",
        "The key lesson is that early wins usually come from structure and reduced leakage before they come from dramatic breakthroughs."
      ],
      bulletGroups: [
        {
          title: "What tends to change first",
          items: [
            "Awareness improves",
            "Money stops disappearing without explanation",
            "The user becomes more confident because the plan feels real"
          ]
        }
      ]
    },
    FITNESS_HEALTH: {
      id: "fitness-example",
      title: "Illustrative transformation pattern",
      subtitle: "What realistic fitness progress usually looks like",
      paragraphs: [
        "An illustrative pattern: somebody starts with the right goal but the wrong routine. Once training days, food structure, and recovery become believable, progress becomes easier to trust and the user stops restarting every two weeks.",
        "The biggest visible shift is often not physical at first. It is behavioural consistency. That is what later creates body changes."
      ],
      bulletGroups: [
        {
          title: "Why this matters",
          items: [
            "Routine strength comes before transformation speed",
            "Believable structure beats motivational spikes",
            "The plan must survive real life to work"
          ]
        }
      ]
    },
    BUSINESS_CAREER: {
      id: "business-example",
      title: "Illustrative traction pattern",
      subtitle: "How clearer positioning often creates faster progress",
      paragraphs: [
        "An illustrative pattern: somebody tries to sell too many things to too many people. Once the offer sharpens and the message becomes clearer, conversations improve, trust improves, and the business or career path becomes easier to explain and sell.",
        "This does not always look dramatic from the outside. Internally, it feels like less confusion and stronger momentum."
      ],
      bulletGroups: [
        {
          title: "Common turning points",
          items: [
            "The user chooses a clearer lane",
            "Proof is collected and shown more confidently",
            "Time is redirected into fewer higher-value moves"
          ]
        }
      ]
    },
    SOCIAL_GROWTH: {
      id: "social-example",
      title: "Illustrative creator growth pattern",
      subtitle: "How stronger content systems usually outperform random effort",
      paragraphs: [
        "An illustrative pattern: a creator posts inconsistently with mixed messages. Growth changes once the account becomes recognisable, the content pillars repeat, and the audience starts knowing what to expect.",
        "The real win is not only reach. It is better audience fit, more trust, and more useful engagement."
      ],
      bulletGroups: [
        {
          title: "What shifts first",
          items: [
            "Better clarity in content themes",
            "Stronger signals in saves, replies, or shares",
            "A more repeatable production rhythm"
          ]
        }
      ]
    },
    CONSTRUCTION_GROWTH: {
      id: "construction-example",
      title: "Illustrative construction growth pattern",
      subtitle: "How many builders improve results without becoming louder",
      paragraphs: [
        "An illustrative pattern: a builder relies on mixed referrals and inconsistent enquiries. Growth improves when the company looks more specialist, follows up more reliably, shows stronger project proof, and asks for referrals with better timing.",
        "The business often does not need more noise first. It needs clearer trust and a better system around the enquiries already available."
      ],
      bulletGroups: [
        {
          title: "Typical result pattern",
          items: [
            "Fewer low-fit leads",
            "Better conversion from serious enquiries",
            "A stronger reputation loop from completed projects"
          ]
        }
      ]
    }
  };

  return examples[category];
}

function buildRoutineEntries(category: CategoryValue, goal: string): RoutineEntry[] {
  const generic = {
    FINANCE_MONEY: [
      "Review balances and last 7 days of spending",
      "Move money toward the main priority first",
      "Check one unnecessary leak and remove it",
      "Track the main number that matters most"
    ],
    FITNESS_HEALTH: [
      "Complete the planned training or movement block",
      "Anchor meals around structure and protein",
      "Protect sleep, hydration, and recovery basics",
      "Review the routine and remove one friction point"
    ],
    BUSINESS_CAREER: [
      "Work on the highest-value business or career move first",
      "Improve the offer, positioning, or proof intentionally",
      "Reach out, publish, or create evidence of traction",
      "Review what produced signal and what wasted time"
    ],
    SOCIAL_GROWTH: [
      "Create or publish from one strong content pillar",
      "Study one post or format that performed best",
      "Engage with the right audience, not just random accounts",
      "Refine the hook, message, or CTA from what you learned"
    ],
    CONSTRUCTION_GROWTH: [
      "Respond quickly to open leads and quote requests",
      "Improve one trust asset: photo proof, testimonial, or process clarity",
      "Follow up on recent quotes and past clients deliberately",
      "Tighten the offer, area, or client messaging on one marketing surface"
    ]
  } as const;

  const actions = generic[category];

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const weeklyTheme = day <= 7
      ? "Set the baseline"
      : day <= 14
        ? "Strengthen the system"
        : day <= 21
          ? "Improve quality and consistency"
          : "Refine and compound";

    return {
      day: `Day ${day}`,
      focus: `${weeklyTheme} for ${lowerFirst(goal)}`,
      actions: [
        actions[index % actions.length],
        actions[(index + 1) % actions.length]
      ]
    };
  });
}

function buildResourcePage(category: CategoryValue): ReportPage {
  const knowledgePages = buildKnowledgePages(category);
  const resourceCarrier = knowledgePages.find((page) => page.resources?.length);

  return {
    id: `${category.toLowerCase()}-resources`,
    title: "Resources and helpful reference points",
    subtitle: "Use reliable support, not endless random searching",
    paragraphs: [
      "This section is here to shorten the distance between insight and action. The goal is not to overwhelm the user with links. The goal is to point them toward the kinds of support, references, and tools that are most likely to help next.",
      ...(resourceCarrier?.note ? [resourceCarrier.note] : [])
    ],
    resources: resourceCarrier?.resources ?? []
  };
}

function buildStarterGuidePage(category: CategoryValue, goal: string): ReportPage {
  const firstKnowledge = buildKnowledgePages(category)[0];

  return {
    id: `${category.toLowerCase()}-starter-guide`,
    title: "Practical guidance and next steps",
    subtitle: `A concise premium guide for ${lowerFirst(goal)}`,
    intro: firstKnowledge.subtitle,
    paragraphs: firstKnowledge.paragraphs,
    bulletGroups: firstKnowledge.bulletGroups,
    callouts: [
      {
        label: "Use this report properly",
        title: "Treat it like a working plan, not a one-time read",
        body: "The value comes from choosing the right first move, reviewing progress, and using the report as a live reference over the next few weeks."
      }
    ],
    checklist: [
      "Choose the first action you will complete within 48 hours",
      "Block time in the calendar for the highest-value weekly task",
      "Keep this PDF visible and review it at least once a week"
    ]
  };
}

function buildDiagnosticInsights({
  category,
  answers,
  goal,
  currentSituation,
  challenge,
  timeline,
  firstFocus
}: {
  category: CategoryValue;
  answers: Record<string, unknown>;
  goal: string;
  currentSituation: string;
  challenge: string;
  timeline: string;
  firstFocus: string;
}) {
  if (category === "CONSTRUCTION_GROWTH") {
    const leadSources = formatAnswer(answers.leadSources, "mixed lead sources");
    const tradeServices = formatAnswer(answers.tradeServices, "general construction services");
    const clientType = formatAnswer(answers.clientType, "a mixed client base");
    const teamModel = formatAnswer(answers.teamModel, "the current operating model");

    return {
      revealedPattern:
        `The answers suggest the business is trying to grow ${lowerFirst(tradeServices)} for ${lowerFirst(clientType)} clients while still relying on ${lowerFirst(leadSources)} and the current rhythm of ${lowerFirst(teamModel)}. That usually creates an unstable pipeline: some work comes in, but not enough of it is predictable, well-qualified, or aligned with the type of jobs the business actually wants more of.`,
      primaryMistake:
        "The likely mistake is treating growth mainly as a lead volume problem when the deeper issue is usually lead quality, positioning clarity, and follow-up structure. More enquiries do not solve the business if the wrong people are asking, quotes are not being handled tightly, or trust is too weak before the visit.",
      stuckReason:
        `That pattern keeps people stuck because it creates short bursts of hope without a reliable system underneath. When enquiry flow is inconsistent, the owner reacts to whatever comes in instead of building a cleaner route toward better-fit clients over ${lowerFirst(timeline)}.`,
      misunderstanding:
        `The answers point to a common misunderstanding: that good workmanship should be enough to win better jobs consistently. In reality, the market usually rewards businesses that package the work well, explain the process clearly, follow up faster, and make trust visible before price becomes the only thing the client compares.`,
      firstFocusReason:
        `The first focus should be ${lowerFirst(firstFocus)} because that is where the business can create the fastest improvement in lead quality and conversion without having to reinvent everything else first.`,
      mistakes: [
        `Letting ${lowerFirst(challenge)} stay vague instead of diagnosing where the enquiry or quote process breaks down`,
        "Accepting mixed positioning that attracts broad low-fit enquiries instead of the most valuable local jobs",
        "Relying on good intentions and memory instead of a clear quote follow-up and referral system"
      ],
      misunderstandings: [
        "Assuming more leads automatically means better growth",
        "Underestimating how strongly speed, trust, and proof shape conversion",
        "Believing the market sees the business as clearly as the owner does"
      ],
      revealedBullets: [
        `The goal is not just growth. It is better-fit growth around ${lowerFirst(goal)}`,
        `The current situation shows a business base, but not yet a strong growth system: ${currentSituation}`,
        `The answers suggest the strongest commercial leverage sits inside ${lowerFirst(firstFocus)}, not in trying to improve everything at once`
      ]
    };
  }

  if (category === "FINANCE_MONEY") {
    const tracking = formatAnswer(answers.trackSpending, "unclear");
    const income = formatAnswer(answers.monthlyIncome, "the current income range");
    const focus = formatAnswer(answers.moneyFocusAreas, "money priorities");

    return {
      revealedPattern:
        `The answers suggest somebody who wants stronger control over money, but is still operating with too little visibility and too much decision pressure. With income at ${lowerFirst(income)} and spending tracking currently ${lowerFirst(tracking)}, the real issue is rarely one dramatic mistake. It is usually a repeated pattern of leakage, avoidance, and reacting too late.`,
      primaryMistake:
        "The likely mistake is trying to solve money stress emotionally instead of structurally. That usually shows up as wanting better discipline without building a system that makes better decisions easier at the point where money actually gets spent.",
      stuckReason:
        `That keeps progress stuck because every month starts to feel like a reset. Without a clear rhythm for reviewing money, directing it early, and protecting the main priority, the same pressure point keeps returning and makes ${lowerFirst(goal)} feel harder than it should.`,
      misunderstanding:
        `The misunderstanding is often that the problem is a lack of motivation or a lack of financial intelligence. The answers usually reveal something simpler: the current money system is not carrying enough of the load. When structure is weak, willpower has to do too much work.`,
      firstFocusReason:
        `The first focus should be ${lowerFirst(firstFocus)} because that is where better control becomes visible fastest. Once the user can see what is happening and direct money more deliberately, confidence normally starts to follow.`,
      mistakes: [
        `Trying to improve ${lowerFirst(focus)} without a fixed weekly review rhythm`,
        "Relying on intention instead of separating priority money from flexible spending early",
        `Treating ${lowerFirst(challenge)} as a personal weakness instead of a system failure that can be redesigned`
      ],
      misunderstandings: [
        "Thinking money discipline is mainly about being stricter",
        "Assuming awareness alone changes behaviour",
        "Waiting to feel more confident before creating structure"
      ],
      revealedBullets: [
        `The answers point to a control problem before a confidence problem`,
        `The current situation is survivable, but too loose: ${currentSituation}`,
        `The strongest early gain comes from making the system carry more weight than mood or memory`
      ]
    };
  }

  if (category === "FITNESS_HEALTH") {
    const days = formatAnswer(answers.daysPerWeek, "the available training days");
    const trainingPlace = formatAnswer(answers.trainingPlace, "the current setup");
    const activity = formatAnswer(answers.activityLevel, "the current activity level");

    return {
      revealedPattern:
        `The answers suggest somebody with a real goal, but a routine that may not be fully matched to normal life yet. Training capacity currently looks like ${lowerFirst(days)} in ${lowerFirst(trainingPlace)} with ${lowerFirst(activity)}, which means the quality of structure matters more than intensity.`,
      primaryMistake:
        "The likely mistake is expecting the result to come from trying harder instead of from tightening the routine. In fitness, effort feels productive in the moment, but badly matched effort often creates inconsistency, fatigue, and frustration instead of progress.",
      stuckReason:
        `That keeps people stuck because the plan becomes too dependent on ideal weeks. As soon as life pressure, fatigue, food decisions, or missed sessions arrive, the whole structure feels fragile and ${lowerFirst(goal)} starts to look further away than it really is.`,
      misunderstanding:
        `The answers reveal a common misunderstanding: that better results mainly require more discipline. In reality, they usually require a more believable setup. When the plan is sustainable, discipline becomes easier because the user is no longer fighting the routine every day.`,
      firstFocusReason:
        `The first focus should be ${lowerFirst(firstFocus)} because that is where the routine can become more stable and easier to repeat over ${lowerFirst(timeline)}.`,
      mistakes: [
        "Using ambition to set the plan instead of real recovery and schedule capacity",
        "Making food or training decisions too reactively during the week",
        `Treating ${lowerFirst(challenge)} like a motivation issue when it may be a structure issue`
      ],
      misunderstandings: [
        "Believing hard weeks prove the plan is working",
        "Thinking consistency comes after motivation instead of before visible results",
        "Overvaluing perfection and undervaluing repeatability"
      ],
      revealedBullets: [
        `The goal is achievable, but the current setup needs more fit with real life: ${currentSituation}`,
        `The answers point to a planning gap more than a potential gap`,
        `The strongest first win will come from making the weekly system easier to trust`
      ]
    };
  }

  if (category === "SOCIAL_GROWTH") {
    const platform = formatAnswer(answers.primaryPlatform, "the chosen platform");
    const niche = formatAnswer(answers.niche, "the current niche");
    const posting = formatAnswer(answers.postingAlready, "the current posting rhythm");

    return {
      revealedPattern:
        `The answers suggest the account wants stronger growth on ${lowerFirst(platform)} in ${lowerFirst(niche)}, but the current pattern still looks too broad or too inconsistent to create real momentum. With posting currently ${lowerFirst(posting)}, the bigger issue is probably not effort alone. It is clarity, repeatability, and how memorable the content feels to the right audience.`,
      primaryMistake:
        "The likely mistake is treating social growth as a content quantity problem when the deeper issue is usually message sharpness and audience fit. More posts do not help much if the account still feels interchangeable or unclear.",
      stuckReason:
        `That keeps growth stuck because every post gets judged in isolation instead of as part of a system. Without clearer pillars, recurring ideas, and a stronger publishing process, the account never builds enough pattern recognition for trust to compound.`,
      misunderstanding:
        `The misunderstanding here is often blaming the algorithm too early. The answers usually reveal that the audience still needs a clearer reason to remember the creator, follow the account, and expect a specific kind of value.`,
      firstFocusReason:
        `The first focus should be ${lowerFirst(firstFocus)} because it will tighten the message and make the rest of the content strategy easier to build around.`,
      mistakes: [
        "Publishing without enough consistency in message or format",
        "Trying to speak to everyone instead of being clearer for the right audience",
        `Letting ${lowerFirst(challenge)} trigger random changes instead of stronger pattern-building`
      ],
      misunderstandings: [
        "Assuming growth is mainly about frequency",
        "Thinking better content starts with more ideas instead of more clarity",
        "Confusing visibility with trust and audience fit"
      ],
      revealedBullets: [
        `The answers show potential, but not yet a strong recognisable system`,
        `The current situation points to a brand clarity gap: ${currentSituation}`,
        `The strongest early lift will come from clearer positioning and repeatable content angles`
      ]
    };
  }

  const stage = formatAnswer(answers.currentStage, "the current stage");
  const businessType = formatAnswer(answers.businessType, "the current path");
  const marketFocus = formatAnswer(answers.marketFocus, "the chosen market direction");

  return {
    revealedPattern:
      `The answers suggest somebody at ${lowerFirst(stage)} in ${lowerFirst(businessType)} who wants better traction, but is still carrying too much uncertainty in positioning, sequencing, or market focus. With attention split across ${lowerFirst(marketFocus)} and the pressure of ${lowerFirst(challenge)}, the next move needs more precision than raw effort.`,
    primaryMistake:
      "The likely mistake is trying to build momentum before the core direction is clear enough. That usually creates busy weeks, scattered execution, and the feeling of working hard without being certain what is actually compounding.",
    stuckReason:
      `That pattern keeps people stuck because they spend too much time refining possibilities and not enough time forcing clearer evidence from the market. Without better sequencing, the business or career path stays emotionally heavy and strategically blurry.`,
    misunderstanding:
      `The answers reveal a common misunderstanding: that more confidence should come before stronger action. In reality, confidence usually follows better evidence. The route becomes clearer after the user sharpens the offer, tests it, and sees what the market responds to.`,
    firstFocusReason:
      `The first focus should be ${lowerFirst(firstFocus)} because that is the area most likely to reduce confusion and create visible traction over ${lowerFirst(timeline)}.`,
    mistakes: [
      "Trying to improve too many moving parts at the same time",
      "Keeping the message too broad for the stage the user is actually in",
      `Letting ${lowerFirst(challenge)} slow decisions that need cleaner testing instead`
    ],
    misunderstandings: [
      "Thinking progress mainly comes from doing more",
      "Expecting certainty before narrowing the direction",
      "Assuming clearer positioning can wait until later"
    ],
    revealedBullets: [
      `The answers suggest the main constraint is not effort. It is sharper direction`,
      `The current situation needs sequencing more than more ideas: ${currentSituation}`,
      `The first big gain will come from proving one lane properly before widening the plan`
    ]
  };
}

function buildPersonalizedPages({
  category,
  userName,
  goal,
  currentSituation,
  challenge,
  timeline,
  answers
}: {
  category: CategoryValue;
  userName: string;
  goal: string;
  currentSituation: string;
  challenge: string;
  timeline: string;
  answers: Record<string, unknown>;
}) {
  const categoryLabel = getCategoryByValue(category)?.title ?? "Personalized Report";
  const focusAreas = formatAnswer(
    answers.moneyFocusAreas ?? answers.tradeServices ?? answers.contentStyle ?? answers.existingSkills ?? answers.nutritionStyle,
    "a clearer set of priorities"
  );
  const pace = buildTimeline(answers);
  const firstFocus = formatAnswer(
    answers.successVision ?? answers.mainGoal ?? answers.buildingFor ?? answers.clientType,
    "one clear next move"
  );
  const diagnostic = buildDiagnosticInsights({
    category,
    answers,
    goal,
    currentSituation,
    challenge,
    timeline,
    firstFocus
  });

  const analysisPage: ReportPage = {
    id: `${category.toLowerCase()}-analysis`,
    title: "Deep personalized analysis",
    subtitle: `What ${userName}'s answers reveal about the current position`,
    paragraphs: [
      `${userName} is not starting from zero. The answers point to a serious goal — ${lowerFirst(goal)} — but they also show a pattern that is likely draining momentum before the user ever sees enough proof of progress.`,
      diagnostic.revealedPattern,
      `The most important insight is that ${lowerFirst(currentSituation)} is not the full diagnosis by itself. The deeper issue is that the current approach probably does not create enough structure, feedback, or confidence-building evidence. That is why the next phase needs to be tighter, clearer, and built around ${lowerFirst(focusAreas)} instead of broad effort.`
    ],
    callouts: [
      {
        label: "Current pattern",
        title: "The goal is strong, but the system around it is still too loose",
        body: `The report should not only tell ${userName} what to do. It should explain why the current pattern keeps repeating and why a more focused structure will create better results over ${lowerFirst(pace)}.`
      }
    ],
    bulletGroups: [
      {
        title: "What stands out most",
        items: [
          `Primary goal: ${goal}`,
          `Current situation: ${currentSituation}`,
          `Main challenge: ${challenge}`
        ]
      },
      {
        title: "What the answers reveal",
        items: diagnostic.revealedBullets
      },
      {
        title: "What deserves immediate attention",
        items: [
          "The gap between ambition and structure",
          "The missing system that should be carrying more of the load",
          `The need to create proof early instead of waiting for confidence first`
        ]
      }
    ]
  };

  const stuckPage: ReportPage = {
    id: `${category.toLowerCase()}-stuck`,
    title: "Where the current approach is breaking down",
    subtitle: "A closer diagnosis of the mistakes, pressure points, and misunderstandings",
    paragraphs: [
      `People usually stay stuck when effort and direction are out of sync. In ${categoryLabel.toLowerCase()}, that often means doing useful things in the wrong order, reacting to pressure instead of following a system, or letting uncertainty delay the moves that matter most.`,
      diagnostic.primaryMistake,
      diagnostic.stuckReason,
      diagnostic.misunderstanding
    ],
    bulletGroups: [
      {
        title: "Likely mistakes that need correcting",
        items: diagnostic.mistakes
      },
      {
        title: "What the user is likely misunderstanding",
        items: diagnostic.misunderstandings
      },
      {
        title: "What to stop doing now",
        items: [
          "Stop trying to improve everything at once",
          "Stop waiting for more certainty before acting on the strongest next move",
          `Stop letting ${lowerFirst(challenge)} define the whole strategy`
        ]
      }
    ]
  };

  const opportunityPage: ReportPage = {
    id: `${category.toLowerCase()}-opportunity`,
    title: "Best opportunity and what to focus on first",
    subtitle: "The first strong move matters more than ten average ones",
    paragraphs: [
      `The best opportunity for ${userName} is to narrow the focus and get one part of the system working properly before widening the plan. That first win should support ${lowerFirst(goal)} directly and create proof that progress is possible.`,
      `In practical terms, the first focus should be ${lowerFirst(firstFocus)}. That is where the report can create the biggest shift in clarity, confidence, and visible momentum.`,
      diagnostic.firstFocusReason
    ],
    callouts: [
      {
        label: "First focus",
        title: firstFocus,
        body: `This is the area that should receive the most attention first because it will influence the rest of the plan more than almost anything else.`
      }
    ],
    bulletGroups: [
      {
        title: "What to focus on first",
        items: [
          `Build the first system around ${lowerFirst(firstFocus)}`,
          "Reduce noise, low-value tasks, and mixed priorities",
          "Measure progress weekly so the next decision is evidence-based"
        ]
      },
      {
        title: "Why this focus comes before everything else",
        items: [
          "It creates faster feedback than broad unfocused effort",
          "It shows whether the current direction is actually working",
          "It gives the user an early win that can stabilize confidence and execution"
        ]
      }
    ]
  };

  const actionPage: ReportPage = {
    id: `${category.toLowerCase()}-direction`,
    title: "Custom action direction",
    subtitle: "What to do next, what to stop, and what to protect",
    paragraphs: [
      `The next move should be practical enough to start immediately and strong enough to matter after a month. That means fewer ideas, clearer sequencing, and a routine that fits the user's real capacity instead of fantasy capacity.`,
      `The first job is not to fix everything. It is to remove confusion, tighten the highest-value actions, and make progress easier to see. That is how ${lowerFirst(goal)} starts becoming a working direction instead of a repeating intention.`,
      `If ${userName} protects the right first step, reviews the result weekly, and stays with the plan long enough to learn from it, the next phase should feel less chaotic and far more deliberate.`
    ],
    callouts: [
      {
        label: "Execution note",
        title: "Use the first month to create evidence, not to chase perfection",
        body: `The early objective is to prove that the right structure works. Once the user can see what is moving, it becomes much easier to improve the plan intelligently over ${lowerFirst(timeline)}.`
      }
    ],
    bulletGroups: [
      {
        title: "What matters most right now",
        items: [
          `Protect the work that directly supports ${lowerFirst(firstFocus)}`,
          "Review the pattern weekly instead of emotionally judging each day",
          "Keep the plan narrow until visible traction appears"
        ]
      }
    ],
    checklist: [
      `Choose one move this week that supports ${lowerFirst(goal)}`,
      `Review progress against ${lowerFirst(timeline)}`,
      `Protect the highest-value routine tied to ${lowerFirst(firstFocus)}`,
      "Remove one friction point that keeps the current pattern repeating"
    ]
  };

  return { analysisPage, stuckPage, opportunityPage, actionPage };
}

function buildPersonalizedExpansionPages({
  category,
  userName,
  goal,
  currentSituation,
  challenge,
  timeline,
  firstFocus,
  focusAreas,
  diagnostic
}: {
  category: CategoryValue;
  userName: string;
  goal: string;
  currentSituation: string;
  challenge: string;
  timeline: string;
  firstFocus: string;
  focusAreas: string;
  diagnostic: ReturnType<typeof buildDiagnosticInsights>;
}): ReportPage[] {
  const categoryLabel = getCategoryByValue(category)?.title ?? "Personalized Report";

  return [
    {
      id: `${category.toLowerCase()}-decoded-pattern`,
      title: "What your answers are really saying",
      subtitle: "A clearer interpretation of the current pattern behind the goal",
      paragraphs: [
        `At a surface level, ${userName}'s answers describe a goal: ${lowerFirst(goal)}. At a deeper level, they describe a working pattern. The pattern matters more than the ambition because it shows how decisions are currently being made, where energy is getting lost, and why progress has probably felt less stable than expected.`,
        diagnostic.revealedPattern,
        `What stands out is the gap between what ${userName} wants and what the current system can reliably support. ${currentSituation} might be good enough to keep things moving, but it is not yet strong enough to produce the kind of confidence, clarity, or momentum that makes the result feel inevitable.`,
        `That is why this report treats the answers like evidence. The goal is to interpret the evidence properly, identify what is slowing progress, and rebuild the next phase around ${lowerFirst(firstFocus)} and ${lowerFirst(focusAreas)} instead of around vague pressure.`
      ],
      bulletGroups: [
        {
          title: "What the answers reveal beneath the surface",
          items: [
            `The user is serious about ${lowerFirst(goal)}, but the current structure is not yet supporting that priority properly`,
            `The real pressure point is not only ${lowerFirst(challenge)}. It is the system that allows ${lowerFirst(challenge)} to repeat`,
            `The next 30 to 90 days need better sequencing, stronger feedback, and clearer standards for what progress should look like`
          ]
        }
      ],
      callouts: [
        {
          label: "Expert reading",
          title: "The answers show a solvable pattern, not a fixed limitation",
          body: `The value of this report is that it translates the answers into a clearer diagnosis. Once the pattern is visible, the plan can become much more specific and much more useful over ${lowerFirst(timeline)}.`
        }
      ]
    },
    {
      id: `${category.toLowerCase()}-mistake-chain`,
      title: "The mistake chain keeping progress slow",
      subtitle: "How one weak decision pattern creates multiple downstream problems",
      paragraphs: [
        `Progress rarely stalls because of one isolated error. It usually stalls because several smaller mistakes reinforce each other. One unclear decision leads to weaker execution, weaker execution produces less proof, and less proof makes the next decision feel even more uncertain.`,
        diagnostic.primaryMistake,
        `That chain becomes expensive because the user starts reacting to symptoms instead of causes. The emotional experience becomes frustration, but the practical reality is usually a system issue: the wrong actions are being prioritized, reviewed too loosely, or repeated without a tighter standard.`,
        `When that pattern continues, the user can stay busy while still feeling behind. That is exactly why strong reports need to explain not only what to do next, but what to stop trusting about the old approach.`
      ],
      bulletGroups: [
        {
          title: "How the mistake chain usually unfolds",
          items: [
            "The user aims high, but the plan is still too broad or too fragile",
            "Important actions are done inconsistently because the system is unclear",
            "Results remain mixed, which makes the next round feel heavier and more reactive",
            "The user concludes they need more effort, when the bigger need is better structure"
          ]
        },
        {
          title: "Why this matters now",
          items: [
            "Mistakes become habits when they are not interpreted early",
            "Loose systems make every setback feel more personal than it needs to",
            "A cleaner first focus removes pressure from the rest of the plan"
          ]
        }
      ]
    },
    {
      id: `${category.toLowerCase()}-stuck-cost`,
      title: "Why staying in the current pattern is expensive",
      subtitle: "The practical cost of continuing without a tighter system",
      paragraphs: [
        diagnostic.stuckReason,
        `The cost of staying in the same pattern is not only lost time. It is also lost confidence, weaker decision-making, and reduced trust in the process itself. Once the user starts assuming that effort does not work, even good opportunities begin to feel heavier than they should.`,
        `The aim of this page is to make the cost visible. If the user keeps operating from the same structure, the next month is likely to feel very similar to the last one. If the structure changes, the same effort can start producing cleaner evidence and better momentum.`,
        `That shift matters because results rarely improve from inspiration alone. They improve when the user stops repeating costly loops and starts protecting the actions that move the situation forward.`
      ],
      callouts: [
        {
          label: "Cost of delay",
          title: "A weak system quietly taxes progress every week",
          body: `The problem is not only that progress is slower. It is that slow unclear progress makes ${userName} more vulnerable to doubt, distraction, and low-value decisions.`
        }
      ],
      checklist: [
        "Identify the one old behaviour that wastes the most energy each week",
        "Mark the point where the current system usually breaks down",
        "Replace one reactive decision with a planned decision this week"
      ]
    },
    {
      id: `${category.toLowerCase()}-false-beliefs`,
      title: "What you may be misunderstanding right now",
      subtitle: "Beliefs that sound reasonable but create weaker decisions",
      paragraphs: [
        diagnostic.misunderstanding,
        `People often stay stuck because they are following an explanation that feels true, even when it is incomplete. They tell themselves they need more motivation, more confidence, or more information, when the actual need is better structure and faster learning.`,
        `The answers suggest that ${userName} would benefit from replacing vague self-judgment with practical interpretation. That means asking better questions: Which part of the system is weak? What is being assumed too quickly? Which action would create the clearest evidence next?`,
        `This matters because misunderstanding the problem always leads to slower solutions. Once the problem is defined more accurately, the next steps stop feeling random and start feeling earned.`
      ],
      bulletGroups: [
        {
          title: "Beliefs to challenge",
          items: diagnostic.misunderstandings
        },
        {
          title: "Better working beliefs",
          items: [
            "Better structure reduces the amount of motivation required",
            "Clarity comes from stronger feedback, not endless thinking",
            "A narrow effective plan beats a broad ambitious plan every time"
          ]
        }
      ]
    },
    {
      id: `${category.toLowerCase()}-priority-order`,
      title: "What to focus on first and why it comes first",
      subtitle: "The right order matters more than doing more",
      paragraphs: [
        `When somebody wants a better outcome quickly, the temptation is to attack every weakness at once. That usually creates scattered execution. The stronger move is to define the correct order and let the first step improve everything that comes after it.`,
        diagnostic.firstFocusReason,
        `For ${userName}, the first priority is ${lowerFirst(firstFocus)}. That priority should come first because it has the best chance of reducing confusion, improving decision quality, and making the rest of the plan easier to execute well.`,
        `Once that first layer is stronger, the user can expand the plan with much more confidence. Without it, every extra tactic risks becoming noise.`
      ],
      bulletGroups: [
        {
          title: "First priority logic",
          items: [
            `Priority 1: ${firstFocus}`,
            `Priority 2: build supporting structure around ${lowerFirst(focusAreas)}`,
            `Priority 3: review outcomes weekly over ${lowerFirst(timeline)} before expanding the plan`
          ]
        },
        {
          title: "What this protects against",
          items: [
            "Wasting time on tasks that look productive but create weak traction",
            "Jumping between ideas before any one system has had time to work",
            "Confusing activity with strategic progress"
          ]
        }
      ]
    },
    {
      id: `${category.toLowerCase()}-stop-start-continue`,
      title: "Stop, start, and continue framework",
      subtitle: "A cleaner operating model for the next phase",
      paragraphs: [
        `The next phase becomes much easier when the user separates what needs to stop, what needs to start, and what is already worth keeping. Without that structure, improvement feels abstract. With it, the plan becomes more operational and easier to follow.`,
        `This framework is designed to turn the diagnosis into behaviour. It helps ${userName} translate insight into a weekly working rhythm instead of letting the report stay theoretical.`,
        `The goal is not to create a perfect system immediately. The goal is to remove the biggest sources of drag, install a better decision process, and protect the actions most likely to improve ${lowerFirst(goal)}.`
      ],
      bulletGroups: [
        {
          title: "Stop",
          items: [
            "Stop judging progress from isolated good or bad days",
            "Stop widening the plan when the first system is not stable yet",
            `Stop letting ${lowerFirst(challenge)} define the whole strategy`
          ]
        },
        {
          title: "Start",
          items: [
            `Start with a fixed weekly review focused on ${lowerFirst(firstFocus)}`,
            "Start recording what creates signal and what creates noise",
            "Start making one deliberate improvement per week instead of ten vague promises"
          ]
        },
        {
          title: "Continue",
          items: [
            `Continue protecting the ambition behind ${lowerFirst(goal)}`,
            "Continue using practical feedback instead of emotional assumptions",
            "Continue narrowing the plan until results are easier to trust"
          ]
        }
      ]
    }
  ];
}

function buildKnowledgeExpansionPages(
  category: CategoryValue,
  basePages: ReportPage[],
  goal: string
): ReportPage[] {
  const categoryLabel = getCategoryByValue(category)?.title ?? "Personalized Report";

  return basePages.flatMap((page, index) => [
    {
      ...page,
      id: `${page.id}-expanded`,
      title: page.title,
      subtitle: page.subtitle,
      paragraphs: [
        ...(page.paragraphs ?? []),
        `This part of the report expands the user's understanding of ${categoryLabel.toLowerCase()} in a way that supports ${lowerFirst(goal)} directly. The aim is not simply to share extra information. It is to explain why these principles matter, how they connect to real decisions, and where people usually apply them too loosely.`,
        `Use this page like a study page and a working reference. The strongest reports are valuable because they can be returned to repeatedly as the user builds better standards, routines, and judgment.`
      ],
      callouts: [
        ...(page.callouts ?? []),
        {
          label: "Use this well",
          title: "Learn the principle, then apply it to one real decision",
          body: "Knowledge becomes valuable when it changes the next action. After reading each section, the user should know what to tighten, test, or review next."
        }
      ]
    },
    {
      id: `${page.id}-implementation`,
      title: `${page.title} — implementation notes`,
      subtitle: "Turn the principle into weekly action",
      paragraphs: [
        `Most people understand the headline idea from a section but still struggle to use it. This page closes that gap by translating the lesson into clearer implementation steps.`,
        `In ${categoryLabel.toLowerCase()}, the practical question is always the same: how does the user turn this principle into a behaviour, system, or standard that remains useful after the first burst of motivation fades?`,
        `The answer is to reduce the lesson to repeatable actions, review points, and quality checks that can be used every week.`,
        `For ${lowerFirst(goal)}, this means reviewing the current approach against the section above, deciding what is underbuilt, and then protecting one practical improvement long enough for it to influence results.`
      ],
      bulletGroups: [
        {
          title: "Implementation prompts",
          items: [
            "What on this page is already working reasonably well?",
            "Which point is most missing from the current approach?",
            "What would a stronger version of this look like in the next 7 days?",
            "How will progress on this section be reviewed next week?"
          ]
        }
      ],
      checklist: [
        "Choose one idea from this section to apply immediately",
        "Decide where that action will live in the weekly routine",
        "Review the result before moving on to another tactic"
      ]
    }
  ]);
}

function buildRoutineWorkbookPages(
  category: CategoryValue,
  routineEntries: RoutineEntry[]
): ReportPage[] {
  const pages: ReportPage[] = [];

  for (let index = 0; index < routineEntries.length; index += 10) {
    const chunk = routineEntries.slice(index, index + 10);
    const start = index + 1;
    const end = index + chunk.length;

    pages.push({
      id: `${category.toLowerCase()}-routine-${start}-${end}`,
      title: "1-month daily routine chart",
      subtitle: `Days ${start} to ${end} — practice the plan consistently`,
      intro:
        "Treat this routine page like a working chart. The point is not perfection. The point is to make daily execution more obvious, more repeatable, and easier to review.",
      routineEntries: chunk,
      callouts: [
        {
          label: "Routine note",
          title: "Daily structure reduces decision fatigue",
          body: "When the user knows the daily focus in advance, the day becomes easier to execute well and easier to review honestly."
        }
      ]
    });
  }

  return pages;
}

function buildWorkbookSupportPages({
  category,
  goal,
  challenge,
  timeline
}: {
  category: CategoryValue;
  goal: string;
  challenge: string;
  timeline: string;
}): ReportPage[] {
  const categoryLabel = getCategoryByValue(category)?.title ?? "Personalized Report";
  const templates: Array<{
    suffix: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    bulletGroups?: ReportPage["bulletGroups"];
    checklist?: string[];
  }> = [
    {
      suffix: "weekly-review",
      title: "Weekly review worksheet",
      subtitle: "Use one short review to keep the plan honest",
      paragraphs: [
        `A strong week should be reviewed, and a weak week should be reviewed even more carefully. This worksheet is here to stop the user from drifting through ${categoryLabel.toLowerCase()} on memory, emotion, or vague impressions.`,
        `The review should focus on what moved ${lowerFirst(goal)} forward, what increased friction around ${lowerFirst(challenge)}, and what needs to be adjusted before the next seven days begin.`,
        `Over ${lowerFirst(timeline)}, this kind of review is what turns effort into learning instead of repetition.`
      ],
      checklist: [
        "List the two actions that created the best signal this week",
        "Identify the moment the system felt weakest",
        "Choose one adjustment for the next 7 days"
      ]
    },
    {
      suffix: "decision-rules",
      title: "Decision rules for the next phase",
      subtitle: "A short set of rules to reduce confusion",
      paragraphs: [
        `Progress improves when the user does not have to reinvent the rules every day. Decision rules are valuable because they protect attention, reduce hesitation, and stop low-value choices from eating into better work.`,
        `For ${categoryLabel.toLowerCase()}, the aim is to make important choices easier to repeat under normal pressure, not only on the days when motivation is high.`,
        `These rules should be kept simple enough to use quickly and strict enough to block obvious distractions.`
      ],
      bulletGroups: [
        {
          title: "Suggested rules",
          items: [
            `If an action does not support ${lowerFirst(goal)}, question why it is being prioritised`,
            `If a task increases ${lowerFirst(challenge)} without creating clear signal, simplify it or remove it`,
            "If the next step is unclear, return to the first focus before adding complexity"
          ]
        }
      ]
    },
    {
      suffix: "progress-signals",
      title: "How to recognise real progress",
      subtitle: "The signs that the strategy is starting to work",
      paragraphs: [
        `People often miss progress because they only look for the final outcome. In reality, progress usually shows up earlier in the form of clearer decisions, stronger routines, fewer repeated mistakes, and better-quality signals from the work.`,
        `This page helps the user recognise those earlier indicators so the next phase feels grounded in evidence instead of guesswork.`,
        `That matters because better interpretation protects momentum. When the user can see what is improving, it becomes much easier to continue deliberately.`
      ],
      bulletGroups: [
        {
          title: "Early signs of traction",
          items: [
            "The core routine feels easier to follow than it did before",
            "Important decisions are being made faster and with more clarity",
            "The same pressure point appears less often or feels easier to manage",
            "One area of the system is now strong enough to trust consistently"
          ]
        }
      ]
    }
  ];

  return templates.map((template) => ({
    id: `${category.toLowerCase()}-${template.suffix}`,
    title: template.title,
    subtitle: template.subtitle,
    paragraphs: template.paragraphs,
    bulletGroups: template.bulletGroups,
    checklist: template.checklist
  }));
}

function buildExtendedReportPages({
  category,
  goal,
  challenge,
  timeline,
  firstFocus,
  targetPageCount,
  currentPageCount
}: {
  category: CategoryValue;
  goal: string;
  challenge: string;
  timeline: string;
  firstFocus: string;
  targetPageCount: number;
  currentPageCount: number;
}): ReportPage[] {
  const categoryLabel = getCategoryByValue(category)?.title ?? "Personalized Report";
  const rotatingTopics = [
    "refining the operating standard",
    "reducing avoidable mistakes",
    "building stronger weekly discipline",
    "learning from real feedback",
    "protecting the best opportunities",
    "strengthening review habits",
    "improving decision quality",
    "turning good intentions into reliable routines"
  ] as const;

  const pages: ReportPage[] = [];

  for (let index = currentPageCount; index < targetPageCount - 1; index += 1) {
    const topic = pickRotating(rotatingTopics, index);
    const pageNumber = index + 1;

    pages.push({
      id: `${category.toLowerCase()}-extended-${pageNumber}`,
      title: `Extended guidance ${String(pageNumber).padStart(2, "0")}`,
      subtitle: `A deeper note on ${topic}`,
      paragraphs: [
        `This extended page gives the report more depth where most people normally receive only a short summary. In ${categoryLabel.toLowerCase()}, ${topic} matters because results depend on what the user repeats after the first burst of motivation wears off.`,
        `The practical question is how to support ${lowerFirst(goal)} while keeping ${lowerFirst(challenge)} from taking control of the process again. That means returning to ${lowerFirst(firstFocus)}, simplifying weak areas, and applying better standards over ${lowerFirst(timeline)}.`,
        `Use this page as a reinforcement note: identify where the current approach is still too loose, choose the next practical correction, and keep the change long enough for it to influence real outcomes.`
      ],
      bulletGroups: [
        {
          title: "How to use this page",
          items: [
            `Connect this topic back to ${lowerFirst(firstFocus)}`,
            "Choose one behaviour or system to tighten this week",
            "Review the effect before adding more complexity"
          ]
        }
      ],
      checklist: [
        "Mark one insight from this page that fits the current week",
        "Translate that insight into one concrete action",
        "Keep the action visible in the weekly review"
      ]
    });
  }

  return pages;
}

function runQualityCheck(content: GeneratedReportContent, packageId: PackageId) {
  const minimumPageCount = packageId === "STARTER" ? 60 : 75;

  if (content.pages.length < minimumPageCount) {
    throw new Error(`Report page count mismatch for ${packageId}. Expected at least ${minimumPageCount}, received ${content.pages.length}.`);
  }

  for (const page of content.pages) {
    const paragraphLength = (page.paragraphs ?? []).join(" ").trim().length;
    const bulletCount = (page.bulletGroups ?? []).reduce((total, group) => total + group.items.length, 0);
    const hasUsefulBody = paragraphLength > 120 || bulletCount >= 3 || (page.resources?.length ?? 0) >= 3 || (page.routineEntries?.length ?? 0) >= 7;

    if (!hasUsefulBody) {
      throw new Error(`Page ${page.id} failed the internal quality check because it is too thin.`);
    }
  }
}

export function buildReportContent({
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
}): GeneratedReportContent {
  const packageMeta = getPackageById(packageId) ?? getPackageById("PREMIUM");
  const categoryMeta = getCategoryByValue(category);
  const categoryLabel = categoryMeta?.title ?? "Personalized Report";
  const goal = formatAnswer(answers.mainGoal ?? answers.successVision, "A clearer next move");
  const currentSituation = buildCurrentSituation(category, answers);
  const challenge = buildChallenge(answers);
  const timeline = buildTimeline(answers);
  const snapshot = buildSnapshot({
    userName,
    categoryLabel,
    packageName: packageMeta?.name ?? "Premium PDF",
    goal,
    currentSituation,
    challenge,
    timeline
  });
  const personalizedPages = buildPersonalizedPages({
    category,
    userName,
    goal,
    currentSituation,
    challenge,
    timeline,
    answers
  });
  const knowledgePages = buildKnowledgePages(category);
  const resourcesPage = buildResourcePage(category);
  const motivationPage = buildMotivationPage(category, userName, goal);
  const examplePage = buildExamplePage(category);
  const routineEntries = buildRoutineEntries(category, goal);
  const firstFocus = formatAnswer(
    answers.successVision ?? answers.mainGoal ?? answers.buildingFor ?? answers.clientType,
    "one clear next move"
  );
  const focusAreas = formatAnswer(
    answers.moneyFocusAreas ?? answers.tradeServices ?? answers.contentStyle ?? answers.existingSkills ?? answers.nutritionStyle,
    "a clearer set of priorities"
  );
  const diagnostic = buildDiagnosticInsights({
    category,
    answers,
    goal,
    currentSituation,
    challenge,
    timeline,
    firstFocus
  });
  const personalizedExpansionPages = buildPersonalizedExpansionPages({
    category,
    userName,
    goal,
    currentSituation,
    challenge,
    timeline,
    firstFocus,
    focusAreas,
    diagnostic
  });
  const expandedKnowledgePages = buildKnowledgeExpansionPages(category, knowledgePages, goal);
  const routinePages = buildRoutineWorkbookPages(category, routineEntries);
  const workbookSupportPages = buildWorkbookSupportPages({
    category,
    goal,
    challenge,
    timeline
  });

  const basePages: ReportPage[] =
    packageId === "STARTER"
      ? [
          {
            id: "snapshot",
            title: "Client snapshot",
            subtitle: "The short version of where you are and what matters now",
            paragraphs: [
              `${userName} wants help with ${lowerFirst(goal)}. The current situation looks like ${lowerFirst(currentSituation)}, and the main challenge is ${lowerFirst(challenge)}. The immediate goal of this report is to clarify the right next move and remove wasted effort over ${lowerFirst(timeline)}.`
            ],
            callouts: [
              {
                label: "Snapshot summary",
                title: `${goal} is the priority. ${challenge} is the pressure point.`,
                body: "The report below focuses on what matters first so the user can stop guessing and start moving with more direction."
              }
            ],
            bulletGroups: [
              {
                title: "Client snapshot",
                items: [
                  `Name: ${snapshot.name}`,
                  `Category: ${snapshot.category}`,
                  `Goal: ${snapshot.goal}`,
                  `Current situation: ${snapshot.currentSituation}`,
                  `Main challenge: ${snapshot.mainChallenge}`,
                  `Focus timeline: ${snapshot.focusTimeline}`,
                  `Package: ${snapshot.packageName}`
                ]
              }
            ]
          },
          personalizedPages.analysisPage,
          personalizedPages.stuckPage,
          personalizedExpansionPages[0],
          personalizedExpansionPages[1],
          buildStarterGuidePage(category, goal),
          knowledgePages[0],
          expandedKnowledgePages[0],
          resourcesPage,
          ...routinePages,
          workbookSupportPages[0],
          motivationPage,
          examplePage
        ]
      : [
          {
            id: "snapshot",
            title: "Client snapshot",
            subtitle: "The strategic baseline for the rest of the report",
            paragraphs: [
              `${userName} wants help with ${lowerFirst(goal)} and currently sits in a position best described as ${lowerFirst(currentSituation)}. The main challenge is ${lowerFirst(challenge)}, and the next phase should be judged over ${lowerFirst(timeline)} rather than through isolated daily emotions.`,
              "This snapshot matters because the rest of the report is built to interpret the current pattern, explain the biggest mistakes and opportunities, and turn the next 30 days into a more structured working plan."
            ],
            bulletGroups: [
              {
                title: "Client snapshot",
                items: [
                  `Name: ${snapshot.name}`,
                  `Category: ${snapshot.category}`,
                  `Goal: ${snapshot.goal}`,
                  `Current situation: ${snapshot.currentSituation}`,
                  `Main challenge: ${snapshot.mainChallenge}`,
                  `Focus timeline: ${snapshot.focusTimeline}`,
                  `Package: ${snapshot.packageName}`
                ]
              }
            ],
            callouts: [
              {
                label: "Why this matters",
                title: "The right answer is not more information — it is better direction",
                body: "The premium version is designed to diagnose the pattern, explain the likely weak points, and then support the user with stronger category-specific guidance, resources, and routines."
              }
            ]
          },
          personalizedPages.analysisPage,
          personalizedPages.stuckPage,
          personalizedPages.opportunityPage,
          personalizedPages.actionPage,
          ...personalizedExpansionPages,
          knowledgePages[0],
          knowledgePages[1],
          knowledgePages[2],
          ...expandedKnowledgePages,
          resourcesPage,
          ...routinePages,
          ...workbookSupportPages,
          motivationPage,
          examplePage,
          {
            id: "final-checklist",
            title: "Final action checklist",
            subtitle: "Your next results will come from acting on the right steps, not from reading more",
            paragraphs: [
              "Use this report as your working plan for the next phase. Revisit it weekly, adjust with evidence, and keep your attention on the parts of the plan that create the clearest movement.",
              "A premium report is only valuable when it becomes part of decision-making. The aim now is not to admire the document. It is to use it."
            ],
            checklist: [
              `Choose the first action that supports ${lowerFirst(goal)}`,
              "Block the next 7 days around the highest-value tasks",
              "Review progress after one week instead of waiting for a perfect month",
              "Keep only the systems that create visible traction",
              "Use the resource section when the next step needs more specialist support"
            ],
            note: "Support: support@primeblueprint.ai"
          }
        ];

  const targetPageCount = packageId === "STARTER" ? 60 : 80;
  const pages: ReportPage[] = [
    ...basePages,
    ...buildExtendedReportPages({
      category,
      goal,
      challenge,
      timeline,
      firstFocus,
      targetPageCount,
      currentPageCount: basePages.length
    })
  ];

  const content: GeneratedReportContent = {
    brandName,
    brandTagline,
    title: reportTitle,
    subtitle: baseCoverLine,
    coverLine: `${categoryLabel} • ${packageMeta?.name ?? "Premium PDF"}`,
    categoryLabel,
    packageName: packageMeta?.name ?? "Premium PDF",
    packageSummary: packageMeta?.packageSummary ?? "A premium report built around the user's next move.",
    preparedFor: userName,
    goal,
    createdAtLabel: formatDate(new Date()),
    snapshot,
    pages,
    closingMessage:
      "Your next results will come from acting on the right steps, not from reading more. Use this report as your working plan for the next phase.",
    supportLine: "Support: support@primeblueprint.ai",
    disclaimers: buildDisclaimers(category),
    reviewedReferenceStamp: category === "CONSTRUCTION_GROWTH" ? "Reference set reviewed: April 2026" : undefined
  };

  runQualityCheck(content, packageId);
  return content;
}
