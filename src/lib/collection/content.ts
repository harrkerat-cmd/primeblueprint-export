import { getCollectionCategoryBySlug } from '@/lib/collection/catalog';
import type { CollectionChapter, CollectionGuideContent, CollectionGuidePage, CollectionProduct } from '@/lib/collection/types';
import { formatDate } from '@/lib/utils';

const brandName = 'PrimeBlueprint';
const collectionLabel = 'Growth Library';
const subtitleLine =
  'A premium practical handbook designed to teach clearly, reduce noise, and leave the reader with useful next steps.';

type CategoryToolkitBuilder = (product: CollectionProduct, categoryTitle: string) => CollectionGuidePage[];

function buildDisclaimers(disclaimerType: CollectionProduct['disclaimerType']) {
  if (disclaimerType === 'financial') {
    return [
      'Educational handbook only — not financial advice, investment advice, or a recommendation to trade, invest, or buy any asset.',
      'Always do your own research and use qualified regulated support for major financial decisions.'
    ];
  }

  if (disclaimerType === 'medical') {
    return [
      'Educational handbook only — not medical advice, diagnosis, or treatment.',
      'If symptoms, injury, irritation, or health concerns are significant, seek appropriate professional support.'
    ];
  }

  if (disclaimerType === 'relationship') {
    return [
      'Educational handbook only — not therapy, crisis support, or mental health treatment advice.',
      'Seek qualified support where relationship difficulty involves safety, abuse, or significant emotional distress.'
    ];
  }

  if (disclaimerType === 'parenting') {
    return [
      'Educational handbook only — not diagnostic, medical, or therapeutic advice about children.',
      'For developmental, behavioural, or health concerns, seek advice from qualified professionals who know the child’s situation.'
    ];
  }

  if (disclaimerType === 'construction') {
    return [
      'Educational business handbook only — not legal, planning, or regulatory advice.',
      'General guidance only — always verify local council rules, Building Control requirements, planning guidance, and official UK sources before acting on regulated matters.'
    ];
  }

  return ['Educational handbook designed for practical learning and better decision-making.'];
}

function buildGenericExamplePage(product: CollectionProduct, categoryTitle: string): CollectionGuidePage {
  return {
    id: `${product.slug}-example`,
    title: 'Example in practice',
    subtitle: `How a reader can apply ${product.title.toLowerCase()} in real life`,
    paragraphs: [
      `A handbook becomes more useful when the reader can picture the advice in motion. In ${categoryTitle.toLowerCase()}, progress usually comes from a few repeatable decisions made better, not from chasing constant novelty.`,
      `This example page turns the topic into a more practical situation: what the person is trying to improve, where confusion appears, and what a stronger response looks like when the framework inside the handbook is actually used.`
    ],
    tables: [
      {
        title: 'Example structure',
        columns: ['Situation', 'Common weak move', 'Stronger move'],
        rows: [
          ['The reader wants progress fast', 'They consume more tips without a plan', 'They choose one clear focus and use the handbook as a working reference'],
          ['A decision feels unclear', 'They guess and move emotionally', 'They review the framework, checklist, and examples before acting'],
          ['Momentum drops after a few days', 'They assume the topic is not working', 'They return to the routine page and tighten one habit instead of restarting everything']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Apply the handbook like this',
        description: 'Use the same cycle whenever the topic starts to feel noisy again.',
        steps: ['Clarify the current problem', 'Review the example and mistakes pages', 'Choose one action step', 'Track what changed', 'Repeat with better evidence next time']
      }
    ]
  };
}

function buildGenericRoutinePage(product: CollectionProduct): CollectionGuidePage {
  return {
    id: `${product.slug}-routine`,
    title: 'Action routine and tasks',
    subtitle: 'Turn the handbook into weekly action instead of passive reading',
    paragraphs: [
      'The most useful handbooks create follow-through. This page is here to stop the topic staying theoretical. Use these tasks as a short working routine over the next one to two weeks.',
      `The goal is not perfection. The goal is to make ${product.title.toLowerCase()} easier to apply, review, and improve with less guesswork.`
    ],
    checklist: [
      'Highlight the one page or section that feels most relevant right now',
      'Write down one practical change to test this week',
      'Use the common mistakes page as a review prompt mid-week',
      'Return to the framework after seven days and tighten one weak point',
      'Keep the handbook somewhere easy to revisit instead of treating it like a one-time download'
    ],
    callouts: [
      {
        label: 'Why this matters',
        title: 'Most improvement comes from reuse, not first reading',
        body: 'When the reader comes back to the handbook after real-life use, the guidance usually becomes more valuable because weak habits and patterns are easier to spot clearly.'
      }
    ]
  };
}

const buildTradingToolkit: CategoryToolkitBuilder = (product) => [
  {
    id: `${product.slug}-worked-example`,
    title: 'Worked beginner example',
    subtitle: 'A simple illustration of risk, setup quality, and position thinking',
    paragraphs: [
      'For educational purposes, imagine a beginner is studying a chart with a notional practice account of £500. They decide that one idea should risk no more than 1 percent of that account, which means the maximum loss on the study setup is £5. This is not a recommendation to trade. It is a simple example that shows how risk limits can stop one weak decision from becoming a bigger problem.',
      'Now compare that to a beginner who risks £30 because the setup “looks strong”. The second person may still get lucky once, but they are learning the wrong lesson. The key point is that position thinking and risk awareness often matter more than the excitement of the setup itself.'
    ],
    tables: [
      {
        title: 'Illustration only',
        columns: ['Item', 'Example', 'Why it matters'],
        rows: [
          ['Practice account', '£500', 'Keeps the illustration concrete without implying a result'],
          ['Risk per idea', '1% = £5', 'Shows how loss control is defined before reward'],
          ['Potential target', '2R = £10', 'Helps a beginner understand reward only after risk is clear'],
          ['Wrong habit', 'Risking £30 on one idea', 'One emotional decision can distort learning fast']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Beginner chart review flow',
        description: 'A calmer way to study one setup instead of reacting to every move.',
        steps: ['Mark the obvious structure first', 'Note trend, range, or indecision', 'Define where the idea fails', 'Calculate risk before reward', 'Review the outcome in writing']
      }
    ]
  },
  {
    id: `${product.slug}-study-routine`,
    title: 'Beginner tasks and study routine',
    subtitle: 'Use small repeatable tasks to build skill without rushing',
    paragraphs: [
      'Trading learners often improve faster when they stop bouncing between strategies and start repeating the same educational tasks. This routine is designed to build clarity, emotional discipline, and better observation before money is put under pressure.',
      'The aim is to build evidence. If a beginner cannot explain what they saw, why the idea made sense, and where the risk sat, they usually need more study rather than more action.'
    ],
    checklist: [
      'Review one chart each day and write down what the market appears to be doing',
      'Mark one example of trend, one example of range, and one example of failed momentum',
      'Write one sentence on what would invalidate the idea before thinking about reward',
      'Keep a short journal of emotional mistakes such as rushing, overconfidence, or revenge thinking',
      'Use the same glossary, same timeframe, and same review format for one full week'
    ],
    callouts: [
      {
        label: 'Important note',
        title: 'This handbook is educational, not predictive',
        body: 'The goal is to help the reader understand market behaviour and safer learning habits. It is not a promise of results or a substitute for regulated financial advice.'
      }
    ]
  }
];

const buildCryptoToolkit: CategoryToolkitBuilder = (product) => [
  {
    id: `${product.slug}-crypto-map`,
    title: 'Crypto basics map',
    subtitle: 'A clearer way to understand wallets, exchanges, and access control',
    paragraphs: [
      'A lot of beginner confusion in crypto comes from not knowing which tool does what. People hear about wallets, exchanges, networks, seed phrases, and transfers all at once, then try to act before the system feels clear. This page slows that down and separates the roles properly.',
      'The point is not to memorise jargon. It is to understand what each tool is responsible for, where the main risks appear, and why slower setup habits often prevent expensive mistakes later.'
    ],
    tables: [
      {
        title: 'Core beginner terms',
        columns: ['Tool', 'What it does', 'Beginner note'],
        rows: [
          ['Exchange', 'Lets users buy, sell, or move assets through an account', 'Treat account security seriously and review settings carefully'],
          ['Wallet', 'Helps manage access to crypto holdings', 'Understand custody and recovery before using one'],
          ['Seed phrase / recovery details', 'Critical recovery information', 'Store safely and never share casually'],
          ['Network', 'The system that processes compatible transactions', 'Wrong network choices can create irreversible problems']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Safe beginner flow',
        description: 'A better order for learning and setup.',
        steps: ['Understand the tool first', 'Verify the platform or wallet', 'Set security and recovery details', 'Test with tiny educational steps', 'Review before repeating anything larger']
      }
    ]
  },
  {
    id: `${product.slug}-safety-routine`,
    title: 'Security routine and beginner tasks',
    subtitle: 'Use a checklist before speed becomes a risk',
    paragraphs: [
      'Crypto mistakes often happen during ordinary moments: clicking the wrong link, copying a step too quickly, or assuming a transfer can be undone. A short routine creates friction in the right places and protects beginners from preventable errors.',
      'The task here is not to become fearful. It is to become deliberate. A careful beginner often looks slower than everybody else, but that usually means they are building stronger habits.'
    ],
    checklist: [
      'Check URLs, app sources, and account prompts before signing in anywhere',
      'Write down the role of each tool before using it for the first time',
      'Back up recovery information safely and keep it private',
      'Pause any time urgency, guaranteed returns, or DM pressure appears',
      'Treat every unfamiliar transfer or permission request as something to verify twice'
    ],
    callouts: [
      {
        label: 'Educational reminder',
        title: 'Crypto learning should start with safety, not hype',
        body: 'The strongest beginner advantage is calm operational discipline. This handbook is designed to improve understanding, not to encourage speculation or risky behaviour.'
      }
    ]
  }
];

const buildMoneyToolkit: CategoryToolkitBuilder = (product) => [
  {
    id: `${product.slug}-budget-example`,
    title: 'Budget example and monthly review chart',
    subtitle: 'A simple illustration of how clearer structure reduces money drift',
    paragraphs: [
      'Imagine a monthly take-home income of £2,000. If essential bills total £1,050, savings receives £250 first, and flexible spending is capped at £500, the remaining margin becomes visible instead of disappearing by accident. This kind of example matters because many people are not overspending by one dramatic choice. They are losing clarity through repeated small decisions with no working structure around them.',
      'The point of a budget example is not to copy the numbers exactly. It is to show how visible categories, earlier savings moves, and a short monthly review can reduce stress and improve financial discipline over time.'
    ],
    tables: [
      {
        title: 'Illustrative monthly review chart',
        columns: ['Category', 'Example amount', 'Review question'],
        rows: [
          ['Take-home income', '£2,000', 'What money is actually available to plan with?'],
          ['Essentials', '£1,050', 'Are fixed costs still accurate and necessary?'],
          ['Savings / buffer', '£250', 'Did this move early or only if money was left over?'],
          ['Flexible spending', '£500', 'Which habits or triggers most influenced this area?']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Monthly money review flow',
        description: 'A short review rhythm makes behaviour easier to catch before it becomes expensive again.',
        steps: ['Check what came in', 'Review essentials first', 'Protect savings or buffer next', 'Name overspending triggers', 'Adjust one weak point for the next month']
      }
    ]
  },
  {
    id: `${product.slug}-money-routine`,
    title: 'Weekly money routine and action tasks',
    subtitle: 'Small habits that build more discipline without constant pressure',
    paragraphs: [
      'Most money improvement comes from repeated reviews, not dramatic resets. A weekly money routine gives the reader a calmer place to catch overspending, adjust flexible categories, and protect the next right move before the month drifts again.',
      'The goal is not to think about money all day. It is to create a short process that makes better choices easier and more automatic.'
    ],
    checklist: [
      'Set one fixed weekly review time and keep it short',
      'Look for the category that moved most this week and write down why',
      'Move money toward the priority before flexible spending expands',
      'Keep one note of emotional triggers such as stress, boredom, or reward spending',
      'End the review by choosing one behaviour to improve next week'
    ],
    callouts: [
      {
        label: 'Educational reminder',
        title: 'Discipline usually becomes easier when the structure becomes clearer',
        body: 'This handbook is designed to support better habits, stronger awareness, and more useful routines. It is educational and should not be treated as regulated financial advice.'
      }
    ]
  }
];

const buildSkincareToolkit: CategoryToolkitBuilder = (product, categoryTitle) => [
  {
    id: `${product.slug}-routine-order`,
    title: 'Routine order and product categories',
    subtitle: 'A clearer way to think about sequence, skin support, and daily use',
    paragraphs: [
      `In ${categoryTitle.toLowerCase()}, many problems come from mixing product categories without understanding why they are there. A better routine starts with knowing what each step is meant to do and how the order affects comfort, consistency, and skin tolerance.`,
      'The point of a routine table is not to force a perfect shelf. It is to make mornings and evenings feel calmer, easier to repeat, and less vulnerable to guesswork or trend-chasing.'
    ],
    tables: [
      {
        title: 'Example routine order',
        columns: ['Step', 'Morning example', 'Evening example'],
        rows: [
          ['1', 'Gentle cleanse or rinse', 'Gentle cleanse to remove the day'],
          ['2', 'Hydrating or supportive step if needed', 'Treatment or support step only if the routine tolerates it'],
          ['3', 'Moisturiser to support the barrier', 'Moisturiser to finish and reduce dryness or irritation'],
          ['4', 'Daily SPF where appropriate', 'No SPF step needed at night']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Routine logic',
        description: 'Use products in a way that supports clarity and skin comfort.',
        steps: ['Know the skin type or main concern', 'Keep the routine short enough to repeat', 'Introduce new categories slowly', 'Watch for irritation or overload', 'Review after a few weeks instead of daily panic changes']
      }
    ]
  },
  {
    id: `${product.slug}-habits`,
    title: 'Daily habits and practical tasks',
    subtitle: 'Small habits that make the routine more effective',
    paragraphs: [
      `A skincare or grooming handbook becomes more valuable when the reader understands the habits around the products. In ${product.title.toLowerCase()}, routine success often depends on patience, consistency, and avoiding over-correction more than chasing the next item.`,
      'This task page is meant to keep the routine realistic. Use it to simplify, observe, and improve gradually instead of changing everything because one day feels imperfect.'
    ],
    checklist: [
      'Keep the routine simple enough to follow on low-energy days',
      'Introduce one new product category at a time instead of several together',
      'Note what feels comfortable, what feels irritating, and what feels unnecessary',
      'Give changes time before judging the routine too quickly',
      'Treat this handbook as educational support, not medical or dermatology treatment advice'
    ]
  }
];

const buildFitnessToolkit: CategoryToolkitBuilder = (product) => [
  {
    id: `${product.slug}-weekly-structure`,
    title: 'Weekly structure example',
    subtitle: 'Use a simple routine before chasing intensity',
    paragraphs: [
      'Fitness progress is easier to trust when the week has visible structure. Whether the topic is fat loss or muscle gain, a cleaner routine usually beats random hard days followed by missed days. The reader should know what the training rhythm looks like, what food habits support it, and how recovery fits into the picture.',
      'This page gives a simple example, not a medical or coaching prescription. The goal is educational clarity and a stronger routine mindset.'
    ],
    tables: [
      {
        title: 'Illustrative weekly structure',
        columns: ['Day focus', 'Main aim', 'Support habit'],
        rows: [
          ['Training day 1', 'Complete the planned session with good form', 'Eat in line with the goal and hydrate properly'],
          ['Training day 2', 'Repeat the structure instead of relying on motivation', 'Protect sleep and recovery'],
          ['Lower-stress day', 'Walk, mobility, or light activity', 'Keep the food routine steady'],
          ['Weekly review', 'Check what was actually followed', 'Adjust the next week based on evidence']
        ]
      }
    ]
  },
  {
    id: `${product.slug}-fitness-tasks`,
    title: 'Practical tasks and consistency routine',
    subtitle: 'Use repetition and review to make the goal more realistic',
    paragraphs: [
      'Most readers already know that routine matters. The missing piece is usually a shorter, clearer system for following through when life is ordinary, not ideal. These tasks turn the handbook into a more useful working plan.',
      'Progress in fat loss, muscle gain, and routine improvement usually comes from repeatable habits around food, training, and recovery rather than from finding a perfect hack.'
    ],
    checklist: [
      'Choose training days that genuinely fit the week instead of ideal fantasy days',
      'Set one food habit to improve before trying to overhaul everything',
      'Use a short weekly review of sleep, training, and routine adherence',
      'Track consistency before obsessing over perfection',
      'Treat the handbook as educational support, not medical advice or diagnosis'
    ]
  }
];

const buildConstructionToolkit: CategoryToolkitBuilder = (product) => [
  {
    id: `${product.slug}-construction-example`,
    title: 'Business example and client flow',
    subtitle: 'How one missed system can quietly cost leads and better jobs',
    paragraphs: [
      'Imagine a builder receives five enquiries in one week. Two receive a fast professional response, two get delayed replies, and one gets no follow-up after the quote. Even if the workmanship is strong, the business may still lose work because the trust system is inconsistent. Construction growth problems are often less mysterious than they feel: lead handling, quote clarity, local trust signals, and follow-up usually matter more than the owner first wants to admit.',
      'This page turns that into a practical business lens. The aim is to show how positioning, response speed, and follow-up routines influence who converts and which type of client keeps moving forward.'
    ],
    tables: [
      {
        title: 'Lead handling example',
        columns: ['Stage', 'Weak version', 'Stronger version'],
        rows: [
          ['Enquiry reply', 'Late, brief, or unclear', 'Reply fast with a calm professional next step'],
          ['Quote stage', 'No explanation of scope or timing', 'Clear quote, scope notes, and confidence-building detail'],
          ['Follow-up', 'No reminder after silence', 'One or two structured follow-ups with professionalism'],
          ['Aftercare', 'No referral prompt', 'Ask for reviews, referrals, and repeat-work opportunities']
        ]
      }
    ],
    diagrams: [
      {
        title: 'Builder client flow',
        description: 'A cleaner system helps good workmanship turn into better business outcomes.',
        steps: ['Enquiry response', 'Qualification and site context', 'Clear quote and timing', 'Professional follow-up', 'Review / referral request after completion']
      }
    ]
  },
  {
    id: `${product.slug}-construction-tasks`,
    title: 'Weekly actions and simple worksheet tasks',
    subtitle: 'Use practical business tasks instead of vague growth goals',
    paragraphs: [
      'Construction businesses usually improve when one or two weak operational habits are fixed properly. This action page is designed to help the reader tighten lead handling, trust signals, and client follow-up without overcomplicating the week.',
      'Use these tasks like a worksheet. Tick them off, review what improved, and repeat the ones that create better conversations, higher trust, and cleaner quoting.'
    ],
    checklist: [
      'Review how quickly new enquiries received a proper response this week',
      'Improve one quote template line so scope and professionalism feel clearer',
      'Ask one completed client for a review, referral, or repeat-work conversation',
      'Update one trust signal such as photos, testimonials, or job examples',
      'Treat planning, permission, and regulatory topics as general guidance until verified through official UK sources'
    ]
  }
];

const toolkitByCategory: Partial<Record<CollectionProduct['categorySlug'], CategoryToolkitBuilder>> = {
  'trading-basics': buildTradingToolkit,
  'crypto-learning': buildCryptoToolkit,
  'money-management': buildMoneyToolkit,
  'fat-loss': buildFitnessToolkit,
  'muscle-gain': buildFitnessToolkit,
  'mens-grooming': buildSkincareToolkit,
  'womens-skincare': buildSkincareToolkit,
  'construction-business': buildConstructionToolkit
};

function buildToolkitPages(product: CollectionProduct, categoryTitle: string) {
  const builder = toolkitByCategory[product.categorySlug];
  if (builder) {
    return [...builder(product, categoryTitle), buildGenericExamplePage(product, categoryTitle), buildGenericRoutinePage(product)];
  }

  return [buildGenericExamplePage(product, categoryTitle), buildGenericRoutinePage(product)];
}

function pickRotating<T>(items: T[], start: number, count: number) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => items[(start + index) % items.length]);
}

function buildChapterSeries(
  product: CollectionProduct,
  chapterItem: CollectionChapter,
  index: number,
  categoryTitle: string
): CollectionGuidePage[] {
  const chapterNumber = index + 1;
  const selectedMistakes = pickRotating(product.commonMistakes, index, Math.min(4, product.commonMistakes.length));
  const selectedChecklist = pickRotating(product.checklist, index, Math.min(5, product.checklist.length));
  const selectedResources = pickRotating(product.resources, index, Math.min(3, product.resources.length));

  return [
    {
      id: `${product.slug}-chapter-${chapterNumber}-foundation`,
      title: `${chapterItem.title} — foundation`,
      subtitle: chapterItem.subtitle,
      paragraphs: [
        chapterItem.summary,
        `In ${categoryTitle.toLowerCase()}, this chapter matters because it shapes how the rest of the handbook should be used. When the foundation is misunderstood, later steps often feel harder, noisier, or less effective than they need to be.`,
        `A better way to use this section is to read it with a practical question in mind: what is currently unclear, what decision needs improving, and which part of ${product.title.toLowerCase()} deserves more discipline or structure first.`
      ],
      bulletGroups: [
        {
          title: 'Key teaching points',
          items: chapterItem.bullets
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-deeper-breakdown`,
      title: `${chapterItem.title} — deeper breakdown`,
      subtitle: 'A more detailed explanation of what this chapter is really trying to improve',
      paragraphs: [
        `This part of the handbook goes deeper because surface-level understanding rarely changes behaviour for long. The reader needs to know what usually causes confusion, how the issue shows up in everyday situations, and what a stronger response looks like when the basics are applied properly.`,
        `For ${product.title.toLowerCase()}, the deeper lesson is usually not only what to do. It is why the right move is more useful, what weak version should be avoided, and how the reader can reduce wasted effort by staying with a clearer method.`,
        `Treat this page as the explanation layer. It is here to slow down rushed assumptions and make the topic feel properly teachable instead of vague.`
      ],
      callouts: [
        {
          label: 'Use this lens',
          title: 'Better understanding usually comes before better execution',
          body: chapterItem.action
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-worked-example`,
      title: `${chapterItem.title} — worked example`,
      subtitle: 'A practical illustration that makes the advice easier to picture',
      paragraphs: [
        chapterItem.example,
        `Examples matter because they remove the distance between the idea and the real world. Instead of leaving the reader with theory alone, this page shows how one person could misunderstand the chapter, what that mistake creates, and how the stronger version changes the outcome.`,
        `Use this as a mirror rather than a script. The exact situation may differ, but the pattern is usually similar enough to help the reader think more clearly.`
      ],
      tables: [
        {
          title: 'Example breakdown',
          columns: ['Situation', 'Weak response', 'Stronger response'],
          rows: [
            ['The reader feels unsure', 'They improvise or guess', 'They use the chapter structure before acting'],
            ['The topic feels noisy', 'They collect more random advice', 'They narrow attention to the strongest principle first'],
            ['Progress feels slow', 'They assume the method is wrong too early', 'They review the evidence and adjust one variable at a time']
          ]
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-mistakes`,
      title: `${chapterItem.title} — common mistakes`,
      subtitle: 'The weak patterns that usually make this chapter harder than it needs to be',
      paragraphs: [
        `Most people do not fail because the topic is impossible. They fail because they repeat a few avoidable weak moves often enough that progress never compounds. This page isolates the mistakes most worth catching early.`,
        `When a mistake feels familiar, that is useful information. The aim is not to feel bad about it. The aim is to use it as a signal for what should be corrected next.`
      ],
      bulletGroups: [
        {
          title: 'Mistakes to watch for',
          items: selectedMistakes.length > 0 ? selectedMistakes : product.commonMistakes
        }
      ],
      checklist: selectedChecklist
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-action-plan`,
      title: `${chapterItem.title} — action plan`,
      subtitle: 'Turn this chapter into practical movement over the next week',
      paragraphs: [
        `A premium handbook should not leave the reader knowing slightly more but doing the same things. This page turns the chapter into tasks, decisions, and review points that can be applied in the next few days.`,
        `The strongest action plans are specific enough to follow and flexible enough to repeat. Use these steps as a short working routine rather than an unrealistic overhaul.`
      ],
      checklist: [
        chapterItem.action,
        ...selectedChecklist.slice(0, 4)
      ],
      callouts: [
        {
          label: 'Execution note',
          title: 'Progress usually becomes believable when one chapter starts shaping the week',
          body: `The goal is not to complete everything instantly. It is to make ${chapterItem.title.toLowerCase()} visible in the reader's behaviour, decisions, and review process.`
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-framework`,
      title: `${chapterItem.title} — framework and sequence`,
      subtitle: 'A clearer order for using the lesson properly',
      diagrams: [
        {
          title: 'Chapter sequence',
          description: `Use this order whenever ${chapterItem.title.toLowerCase()} starts feeling unclear again.`,
          steps: [
            `Clarify what ${chapterItem.title.toLowerCase()} is trying to improve`,
            'Identify the weak version currently showing up',
            'Apply one stronger action or checklist point',
            'Review what changed after real use',
            'Keep the improvement that creates the clearest signal'
          ]
        }
      ],
      bulletGroups: [
        {
          title: 'Keep this chapter practical',
          items: [
            'Read for understanding first, then for application',
            'Use examples to reduce confusion rather than to copy blindly',
            'Return to the framework after one week of real use'
          ]
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-review`,
      title: `${chapterItem.title} — review prompts`,
      subtitle: 'Questions and reflections that help the reader use the material better',
      paragraphs: [
        `Review prompts matter because they force the reader to think, not just skim. This page is designed to help the chapter stay active after the first read-through.`,
        `A stronger handbook experience comes from returning to the same section after real use and answering better questions about what changed, what still feels weak, and what deserves the next adjustment.`
      ],
      bulletGroups: [
        {
          title: 'Review prompts',
          items: [
            `What part of ${chapterItem.title.toLowerCase()} still feels least clear?`,
            'Which weak behaviour or habit showed up most this week?',
            'What stronger move created the best result or the best clarity?',
            'What should be repeated before moving on to something more advanced?'
          ]
        }
      ]
    },
    {
      id: `${product.slug}-chapter-${chapterNumber}-resources`,
      title: `${chapterItem.title} — further support`,
      subtitle: 'Helpful references to revisit after this chapter',
      paragraphs: [
        `A strong handbook should leave the reader with sensible places to continue learning without dropping them back into random internet noise. These references are here to support that next step.`,
        `Use them to deepen understanding, organise practice, or find more structured support when this chapter becomes the next priority.`
      ],
      resources: selectedResources.map((resource) => ({
        name: resource,
        description: `A useful follow-on reference connected to ${chapterItem.title.toLowerCase()} and the wider handbook topic.`,
        referenceLabel: 'Helpful reference'
      }))
    }
  ];
}

function buildExtendedLibraryPages(product: CollectionProduct, categoryTitle: string, existingCount: number) {
  const pages: CollectionGuidePage[] = [];
  const themes = [
    'Clarity before complexity',
    'What stronger decisions look like',
    'How to avoid wasted effort',
    'Useful habits worth repeating',
    'How to review progress properly',
    'Turning information into action',
    'What readers usually overlook',
    'How to use the handbook over time'
  ];

  for (let index = 0; index < 80 && existingCount + pages.length < 60; index += 1) {
    const chapterItem = product.chapters[index % product.chapters.length];
    const theme = themes[index % themes.length];
    const resource = product.resources[index % product.resources.length] ?? 'Relevant reference point';
    const mistake = product.commonMistakes[index % product.commonMistakes.length] ?? 'A repeatable weak pattern';
    const checklistItem = product.checklist[index % product.checklist.length] ?? 'Revisit the strongest section this week';

    pages.push({
      id: `${product.slug}-extended-${index + 1}`,
      title: `Extended guidance ${String(index + 1).padStart(2, '0')}`,
      subtitle: `${theme} through ${chapterItem.title.toLowerCase()}`,
      paragraphs: [
        `This extended guidance page is here to make ${product.title.toLowerCase()} feel fuller, more teachable, and more useful over time. In ${categoryTitle.toLowerCase()}, progress usually depends on returning to the strongest basics until they start shaping behaviour more naturally.`,
        `${chapterItem.summary} The practical lesson inside this theme is that ${theme.toLowerCase()} usually matters more than chasing constant novelty. When the reader slows down, reviews the pattern, and applies one part of the handbook properly, the topic often becomes easier to use.`,
        `A useful way to work with this page is to connect it to one real situation, one repeat mistake, and one next action. That turns the handbook into a working tool instead of a passive document.`
      ],
      bulletGroups: [
        {
          title: 'Use this page for',
          items: [
            `Reinforcing ${chapterItem.title.toLowerCase()} with clearer real-life thinking`,
            `Catching weak patterns such as ${mistake.toLowerCase()}`,
            `Turning the next action into something more specific and repeatable`,
            `Revisiting ${product.title.toLowerCase()} with more structure instead of more noise`
          ]
        }
      ],
      checklist: [
        checklistItem,
        chapterItem.action,
        'Write one note about what improved after applying this page',
        'Return to the handbook after real use instead of guessing from memory'
      ],
      resources: [
        {
          name: resource,
          description: `A useful reference linked to ${product.title.toLowerCase()} and this theme of ${theme.toLowerCase()}.`,
          referenceLabel: 'Helpful reference'
        }
      ]
    });
  }

  return pages;
}

function buildGuidePages(product: CollectionProduct): CollectionGuidePage[] {
  const category = getCollectionCategoryBySlug(product.categorySlug);
  const categoryTitle = category?.title ?? 'Growth Library Handbook';
  const toolkitPages = buildToolkitPages(product, categoryTitle);

  const introPage: CollectionGuidePage = {
    id: `${product.slug}-introduction`,
    title: 'Introduction',
    subtitle: `Why ${product.title.toLowerCase()} is worth understanding properly`,
    paragraphs: [
      `${product.description} This handbook is written to feel useful from start to finish, not like a rushed summary. The goal is to teach the topic clearly, give practical structure, and make the next steps easier to follow.`,
      `Inside ${product.title}, the focus stays on guided learning: what matters first, what usually goes wrong, and what helps the reader move with more clarity. For ${categoryTitle.toLowerCase()}, that usually means fewer assumptions, cleaner habits, and stronger foundational decisions.`
    ],
    callouts: [
      {
        label: 'Built for practical use',
        title: 'This handbook is designed to be used, not just read once',
        body: 'Use it as a working reference when you need clearer basics, a stronger process, or a better reminder of the habits that matter most.'
      }
    ]
  };

  const coversPage: CollectionGuidePage = {
    id: `${product.slug}-covers`,
    title: 'What this guide covers',
    subtitle: 'The main themes and outcomes inside this PDF',
    bulletGroups: [
      {
        title: 'Inside the handbook',
        items: product.whatInside
      },
      {
        title: 'What the reader should gain',
        items: [
          'A clearer understanding of the topic in plain language',
          'More confidence about what to focus on first',
          'A stronger checklist for avoiding common mistakes',
          'A more practical next-step plan after finishing the handbook'
        ]
      }
    ]
  };

  const chapterPages = product.chapters.flatMap((item, index) => buildChapterSeries(product, item, index, categoryTitle));

  const mistakesPage: CollectionGuidePage = {
    id: `${product.slug}-mistakes`,
    title: 'Common mistakes to avoid',
    subtitle: 'The patterns that usually waste time, confidence, or progress',
    paragraphs: [
      `Most people do not struggle because they lack effort completely. They struggle because they repeat avoidable patterns without naming them clearly. This section highlights the mistakes that most often weaken results around ${product.title.toLowerCase()}.`,
      'Use these mistakes as a review tool. If one feels familiar, treat that as useful information rather than a reason to be discouraged.'
    ],
    bulletGroups: [
      {
        title: 'Mistakes worth catching early',
        items: product.commonMistakes
      }
    ]
  };

  const frameworkPage: CollectionGuidePage = {
    id: `${product.slug}-framework`,
    title: product.frameworkTitle,
    subtitle: 'A simple structure for applying the handbook more effectively',
    paragraphs: [
      'A premium handbook should leave the reader with a usable framework, not only more information. The steps below help turn the topic into clearer action and reduce the risk of learning passively without applying anything meaningful.'
    ],
    checklist: product.frameworkSteps,
    diagrams: [
      {
        title: 'Framework in motion',
        description: 'Use the structure below as a repeatable pattern instead of a one-time burst of effort.',
        steps: product.frameworkSteps
      }
    ],
    callouts: [
      {
        label: 'Use this well',
        title: 'A framework becomes valuable when it shapes behaviour',
        body: 'Choose one or two steps to apply immediately, then come back to the rest once the routine starts feeling more stable.'
      }
    ]
  };

  const checklistPage: CollectionGuidePage = {
    id: `${product.slug}-checklist`,
    title: 'Practical checklist',
    subtitle: 'A cleaner working checklist for the next phase',
    paragraphs: ['This checklist is here to make action easier. Use it to tighten the basics, review your current habits, and stop relying on memory alone.'],
    checklist: product.checklist,
    note: product.deliveryNote
  };

  const finalPage: CollectionGuidePage = {
    id: `${product.slug}-summary`,
    title: 'Summary and next steps',
    subtitle: 'Use the handbook as a working reference, not a one-time read',
    paragraphs: [
      `${product.title} should leave the reader with fewer assumptions, better structure, and a clearer sense of what to do next. Progress usually comes from using the basics more consistently, not from rushing toward something more complicated too early.`,
      'The smartest next step is usually to choose one priority, apply the checklist, and revisit the handbook after a short period of real use so the next adjustments are based on evidence rather than guesswork.'
    ],
    resources: product.resources.map((resource) => ({
      name: resource,
      description: 'A useful reference point for deeper learning, better organisation, or safer educational support.',
      referenceLabel: 'Helpful reference'
    })),
    callouts: [
      {
        label: 'Closing note',
        title: 'Better results usually come from applying the right basics well',
        body: 'Use this handbook as a premium working document: review it, apply it, and come back to it whenever the basics start feeling unclear again.'
      }
    ]
  };

  const pages = [introPage, coversPage, ...chapterPages, ...toolkitPages, mistakesPage, frameworkPage, checklistPage];
  const extendedPages = buildExtendedLibraryPages(product, categoryTitle, pages.length + 1);
  return [...pages, ...extendedPages, finalPage];
}

function runQualityCheck(content: CollectionGuideContent) {
  if (content.pages.length < 60) {
    throw new Error(`Collection guide too short. Expected at least 60 content pages, received ${content.pages.length}.`);
  }

  for (const page of content.pages) {
    const paragraphLength = (page.paragraphs ?? []).join(' ').trim().length;
    const bulletCount = (page.bulletGroups ?? []).reduce((total, group) => total + group.items.length, 0);
    const checklistCount = page.checklist?.length ?? 0;
    const resourceCount = page.resources?.length ?? 0;
    const tableRowCount = (page.tables ?? []).reduce((total, table) => total + table.rows.length, 0);
    const diagramSteps = (page.diagrams ?? []).reduce((total, diagram) => total + diagram.steps.length, 0);
    const hasEnoughDepth = paragraphLength > 180 || bulletCount >= 4 || checklistCount >= 4 || resourceCount >= 3 || tableRowCount >= 3 || diagramSteps >= 4;

    if (!hasEnoughDepth) {
      throw new Error(`Collection page ${page.id} is too thin and needs more useful detail.`);
    }
  }
}

export function buildCollectionGuideContent(product: CollectionProduct): CollectionGuideContent {
  const category = getCollectionCategoryBySlug(product.categorySlug);
  const pages = buildGuidePages(product);

  const content: CollectionGuideContent = {
    brandName,
    collectionLabel,
    title: product.title,
    subtitle: subtitleLine,
    categoryLabel: category?.title ?? 'Growth Library',
    preparedLine: 'Premium digital handbook from the PrimeBlueprint library',
    coverLine: `${category?.title ?? 'Growth Library Handbook'} • Structured learning edition`,
    createdAtLabel: formatDate(new Date()),
    pages,
    supportLine: 'Support: support@primeblueprint.ai',
    closingMessage:
      'Use this handbook to make your next steps clearer, calmer, and more practical. The value comes from applying the right basics well, not from collecting more random advice.',
    disclaimers: buildDisclaimers(product.disclaimerType)
  };

  runQualityCheck(content);
  return content;
}
