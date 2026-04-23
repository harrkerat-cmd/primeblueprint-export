import type { CollectionCategory, CollectionChapter, CollectionDisclaimerType, CollectionProduct } from '@/lib/collection/types';

const COLLECTION_PRICE = 799;

function chapter(
  title: string,
  subtitle: string,
  summary: string,
  bullets: string[],
  example: string,
  action: string
): CollectionChapter {
  return { title, subtitle, summary, bullets, example, action };
}

function buildProduct(input: Omit<CollectionProduct, 'price' | 'coverStyle' | 'coverAsset' | 'pageTarget' | 'emailTemplateKey' | 'fileVersion' | 'downloadFileKey'> & {
  coverStyle?: string;
  coverAsset?: string | null;
  pageTarget?: number;
  emailTemplateKey?: string;
  fileVersion?: string;
  downloadFileKey?: string | null;
}) {
  return {
    coverStyle: input.coverStyle ?? 'navy-minimal',
    coverAsset: input.coverAsset ?? null,
    pageTarget: input.pageTarget ?? 11,
    emailTemplateKey: input.emailTemplateKey ?? 'collection-guide',
    fileVersion: input.fileVersion ?? 'v1',
    downloadFileKey: input.downloadFileKey ?? input.slug,
    ...input,
    price: COLLECTION_PRICE
  };
}

export const collectionCategories: CollectionCategory[] = [
  { slug: 'trading-basics', shortLabel: 'Trading', title: 'Trading Basics', description: 'Structured trading handbooks that explain charts, discipline, and risk with calmer educational depth.', accent: 'from-slate-950 via-blue-950 to-slate-900' },
  { slug: 'crypto-learning', shortLabel: 'Crypto', title: 'Crypto Learning', description: 'Premium beginner handbooks for understanding crypto basics, wallets, exchanges, and safer setup habits.', accent: 'from-slate-950 via-sky-950 to-slate-900' },
  { slug: 'money-management', shortLabel: 'Money', title: 'Money Management', description: 'Clear money handbooks for budgeting, overspending patterns, saving structure, and stronger financial habits.', accent: 'from-slate-950 via-indigo-950 to-slate-900' },
  { slug: 'side-hustles', shortLabel: 'Hustles', title: 'Side Hustles', description: 'Structured handbooks for choosing, testing, and setting up extra income ideas with more realism.', accent: 'from-slate-950 via-cyan-950 to-slate-900' },
  { slug: 'business-starters', shortLabel: 'Business', title: 'Business Starters', description: 'Focused business handbooks covering offers, first clients, pricing, and the early systems that matter.', accent: 'from-slate-950 via-blue-950 to-slate-900' },
  { slug: 'career-growth', shortLabel: 'Career', title: 'Career Growth', description: 'Professional handbooks for CVs, interviews, communication, and stronger long-term career habits.', accent: 'from-slate-950 via-indigo-950 to-slate-900' },
  { slug: 'social-media-growth', shortLabel: 'Social', title: 'Social Media Growth', description: 'Practical growth handbooks for content systems, consistency, and stronger audience-building habits.', accent: 'from-slate-950 via-blue-950 to-slate-900' },
  { slug: 'personal-branding', shortLabel: 'Branding', title: 'Personal Branding', description: 'Clear positioning handbooks for building a stronger online presence and more credible message.', accent: 'from-slate-950 via-slate-900 to-blue-950' },
  { slug: 'fat-loss', shortLabel: 'Fat Loss', title: 'Fat Loss', description: 'Educational handbooks for fat-loss routines, food structure, and more realistic consistency.', accent: 'from-slate-950 via-emerald-950 to-slate-900' },
  { slug: 'muscle-gain', shortLabel: 'Muscle', title: 'Muscle Gain', description: 'Practical handbooks for building muscle with stronger training structure and recovery habits.', accent: 'from-slate-950 via-green-950 to-slate-900' },
  { slug: 'mens-grooming', shortLabel: 'Grooming', title: 'Men’s Grooming', description: 'Premium grooming handbooks covering skin, hair, beard, and appearance routines with more clarity.', accent: 'from-slate-950 via-stone-900 to-slate-900' },
  { slug: 'womens-skincare', shortLabel: 'Skincare', title: 'Women’s Skincare', description: 'Educational skincare handbooks with routine order, product categories, and skin-type-specific support.', accent: 'from-slate-950 via-rose-950 to-slate-900' },
  { slug: 'mindset-discipline', shortLabel: 'Mindset', title: 'Mindset & Discipline', description: 'Structured habit handbooks for reducing self-sabotage and improving follow-through.', accent: 'from-slate-950 via-violet-950 to-slate-900' },
  { slug: 'confidence-building', shortLabel: 'Confidence', title: 'Confidence Building', description: 'Grounded confidence handbooks built around action, self-respect, and clearer communication.', accent: 'from-slate-950 via-fuchsia-950 to-slate-900' },
  { slug: 'relationships', shortLabel: 'Relationships', title: 'Relationships', description: 'Respectful relationship handbooks focused on communication, boundaries, and healthier habits.', accent: 'from-slate-950 via-rose-950 to-slate-900' },
  { slug: 'parenting-guides', shortLabel: 'Parenting', title: 'Parenting Guides', description: 'Supportive parenting handbooks for routines, confidence, learning support, and calmer day-to-day structure.', accent: 'from-slate-950 via-amber-950 to-slate-900' },
  { slug: 'kids-learning-development', shortLabel: 'Kids Learning', title: 'Kids Learning & Development', description: 'Practical home-learning handbooks for helping children focus, study, and learn more effectively.', accent: 'from-slate-950 via-teal-950 to-slate-900' },
  { slug: 'study-success', shortLabel: 'Study', title: 'Study Success', description: 'Clear study handbooks for revision, focus, memory, and smarter planning habits.', accent: 'from-slate-950 via-cyan-950 to-slate-900' },
  { slug: 'construction-business', shortLabel: 'Construction', title: 'Construction Business', description: 'Builder-focused business handbooks for better leads, trust, quotes, and stronger local growth systems.', accent: 'from-slate-950 via-blue-950 to-slate-900' },
  { slug: 'productivity-routine', shortLabel: 'Routine', title: 'Productivity & Routine', description: 'Practical productivity handbooks designed to improve focus, planning, and daily structure without burnout.', accent: 'from-slate-950 via-indigo-950 to-slate-900' }
];

function tradingProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'trading-basics',
    valueProp,
    description: `A guided trading handbook for understanding ${focus.toLowerCase()} with beginner explanations, chart examples, stronger risk awareness, and safer early habits.`,
    disclaimerType: 'financial',
    searchTerms: ['trading', 'risk', 'discipline', focus.toLowerCase()],
    whatInside: [
      `A plain-English explanation of ${focus.toLowerCase()}`,
      'Simple chart-reading examples and beginner trading context',
      'The mistakes that usually create confusion, bad habits, or early losses',
      'A practical checklist for learning with more risk awareness and control'
    ],
    chapters: [
      chapter('Start with the right foundation', `Why ${focus.toLowerCase()} often feels confusing early`, `Most beginners struggle because they try to jump straight into outcomes before understanding the language, structure, and context behind ${focus.toLowerCase()}. This guide slows the process down and explains the basics in the right order.`, ['Understand the difference between learning, testing, and risking money', 'Know the basic language before trying to react quickly', 'Build awareness before trying to build confidence'], `A new trader often mistakes activity for progress. They keep changing charts, styles, and opinions because the learning process itself has never been structured.`, 'Create one simple study routine and stick to it for a few weeks before judging results.'),
      chapter('How to read the environment better', `What ${focus.toLowerCase()} is actually telling you`, `The point of beginner trading education is not to predict everything. It is to read price behaviour with more context, separate signal from noise, and stop reacting emotionally to every movement.`, ['Use simple observations before complex indicators', 'Look for context, not isolated moments', 'Treat chart reading as interpretation rather than certainty'], `A cleaner reader of the market usually looks for repeated behaviour, obvious structure, and whether the idea actually fits the timeframe being studied.`, 'Write down what you think the market is doing before deciding whether a setup is even worth further attention.'),
      chapter('Risk comes before reward', 'Why most beginners think about profit too early', `A common beginner mistake is becoming fascinated by upside while staying vague about downside. The safer learning path is to understand that risk is the main control point, especially at the start.`, ['Position size matters', 'Poor discipline can ruin a decent idea', 'One bad habit repeated often becomes expensive'], `Many new traders feel like the setup failed them when the real issue was risking too much or ignoring their own plan.`, 'Review every idea with a downside-first lens before thinking about any target.'),
      chapter('Discipline and repeatability', 'The routines that protect a beginner', `Discipline in trading is not about acting tough. It is about following a process that reduces impulsive choices and makes mistakes easier to catch early.`, ['Keep one review routine', 'Reduce emotional decision-making', 'Track mistakes more seriously than wins'], `A trader who journals their reasoning usually improves faster than someone who keeps changing method without reflection.`, 'Use a short post-session review after each study or demo session.'),
      chapter('Build a better learning path', 'How to improve without rushing into false confidence', `The strongest learning path is steady, evidence-based, and focused on understanding rather than ego. That is what makes future decision-making safer and more professional.`, ['Stay educational first', 'Use demo or paper learning properly', 'Let skill develop before pressure increases'], `The best early progress often looks boring from the outside: notes, repeated study, and fewer emotional reactions.`, 'Judge your development by clarity and consistency, not by whether you found one exciting trade idea.')
    ],
    commonMistakes: [
      'Jumping between too many strategies without understanding any of them well',
      'Thinking fast decisions are automatically better decisions',
      'Ignoring risk because the focus stays too heavily on winning trades',
      'Confusing random short-term outcomes with real skill'
    ],
    frameworkTitle: 'A safer beginner learning framework',
    frameworkSteps: ['Learn the core language first', 'Observe charts with a clear question in mind', 'Define risk before imagining reward', 'Record what happened and why', 'Review patterns before changing approach'],
    checklist: ['Keep a trading glossary or notes page', 'Review one market session calmly instead of chasing many', 'Write risk rules before any live exposure', 'Use journaling to spot emotional habits', 'Stay educational and avoid certainty language around outcomes'],
    resources: ['Paper trading platforms and demo charting tools', 'Reputable educational explainers on candlesticks and market structure', 'Beginner risk management checklists from educational sources'],
    deliveryNote: 'Educational guide only — not financial advice or a promise of trading results.'
  });
}

function cryptoProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'crypto-learning',
    valueProp,
    description: `A guided crypto handbook that explains ${focus.toLowerCase()} with clearer language, safer setup thinking, stronger scam awareness, and more realistic expectations.`,
    disclaimerType: 'financial',
    searchTerms: ['crypto', 'wallets', 'security', focus.toLowerCase()],
    whatInside: [
      `A structured introduction to ${focus.toLowerCase()}`,
      'Wallet, exchange, and safety basics explained in plain language',
      'Scam-awareness reminders and beginner examples that reduce confusion',
      'Practical steps for learning without rushing into avoidable mistakes'
    ],
    chapters: [
      chapter('Understand the basics first', `Why ${focus.toLowerCase()} needs plain-language explanation`, `Crypto becomes overwhelming when beginners meet too many terms, platforms, and opinions all at once. The first job is to understand the purpose of the tools and behaviours involved before making decisions around them.`, ['Start with concepts, not hype', 'Know what each tool actually does', 'Keep security in mind from the beginning'], `A beginner who understands custody, access, and transaction basics makes calmer choices than somebody who only follows excitement or online chatter.`, 'Slow the learning process down and define the basic roles of wallets, exchanges, and networks first.'),
      chapter('How the system works in practice', 'From theory to everyday use', `Crypto knowledge becomes more useful when it is connected to real actions: setting things up properly, protecting access, and knowing what each step is meant to achieve.`, ['Separate learning from speculation', 'Understand transfer and storage basics', 'Know where mistakes usually happen'], `Many early mistakes happen during simple setup steps because the user has not thought carefully about responsibility, security, or irreversible actions.`, 'Review the practical flow step by step instead of clicking through quickly.'),
      chapter('Security matters more than speed', 'The habits that protect beginners', `Security is not an advanced topic that can wait until later. It is part of the foundation. Beginners are usually most vulnerable when they are excited, rushed, or copying people without understanding the setup.`, ['Treat seed phrases and account recovery seriously', 'Be careful with links, DMs, and fake urgency', 'Use simple verification habits'], `A careful beginner often looks slower than everyone else, but that caution prevents the kind of errors that can be expensive or irreversible.`, 'Build a small security checklist and use it every time you interact with a platform or wallet.'),
      chapter('Common traps and bad assumptions', 'Where beginners often go wrong', `A lot of beginner pain comes from misunderstanding what is normal, what is risky, and what is simply marketing. Better learning means becoming harder to mislead.`, ['Avoid confusing popularity with safety', 'Question pressure and guaranteed claims', 'Stay aware of irreversible actions'], `People often think the biggest risk is market movement. In reality, poor operational habits and scams can be just as damaging.`, 'Pause whenever the situation feels rushed, secretive, or overly confident.'),
      chapter('Build a smarter learning path', 'How to keep learning without getting lost', `The best beginner path is grounded, careful, and focused on understanding before commitment. The goal is not to know everything quickly. It is to build a safer and clearer base.`, ['Learn one layer at a time', 'Keep notes on key terms and processes', 'Use trusted sources and verify important details'], `Beginners improve faster when they reduce noise and keep returning to the same key concepts until they become clear.`, 'Use this guide as a reference point whenever a term, step, or platform feels unclear.')
    ],
    commonMistakes: [
      'Using platforms or links without verifying legitimacy first',
      'Treating security setup like a minor detail',
      'Trying to learn everything through hype-driven content',
      'Assuming irreversible actions can easily be undone'
    ],
    frameworkTitle: 'A safer crypto learning framework',
    frameworkSteps: ['Learn the purpose of the tool', 'Understand the practical action involved', 'Check the security requirement', 'Verify before confirming anything', 'Keep records and recovery details secure'],
    checklist: ['Understand the difference between exchanges and wallets', 'Back up critical recovery information safely', 'Verify URLs and account prompts carefully', 'Treat DMs and fast-pressure messages as risk signals', 'Stay educational and avoid acting on hype alone'],
    resources: ['Official wallet setup guides', 'Security-focused beginner explainers', 'Exchange help centres and account safety pages'],
    deliveryNote: 'Educational guide only — not financial advice, investment advice, or a recommendation to buy crypto.'
  });
}

function moneyProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'money-management',
    valueProp,
    description: `A practical money handbook focused on ${focus.toLowerCase()}, spending behaviour, clearer budgeting structure, and better day-to-day financial habits.`,
    disclaimerType: 'financial',
    searchTerms: ['budgeting', 'money', 'saving', focus.toLowerCase()],
    whatInside: ['A clearer explanation of the money issue', 'Spending behaviour insights, examples, and useful checklists', 'Common money mistakes that quietly slow progress', 'A simple structure for better budgeting, saving, and weekly money habits'],
    chapters: [
      chapter('See the pattern clearly', `What ${focus.toLowerCase()} looks like in real life`, `Money problems usually feel emotional because the pattern has stayed too invisible for too long. This guide starts by making the behaviour, pressure points, and decision gaps easier to recognise.`, ['Look for repeated triggers', 'Separate awareness from shame', 'Understand where small leaks become bigger problems'], `A person who can describe their pattern clearly is already in a better position than someone who only says they need to be “better with money”.`, 'Write down the main moments where money decisions go off course.'),
      chapter('Build a simple structure', 'Why clarity usually matters before intensity', `A good money structure does not need to look complicated. It needs to be realistic enough to survive ordinary weeks and clear enough to reduce late-reactive decisions.`, ['Separate fixed costs, priorities, and flexible spending', 'Review money on a regular rhythm', 'Reduce the number of decisions that rely on mood'], `People often feel more in control not because their situation changed overnight, but because their system became easier to trust.`, 'Start with one repeatable weekly or payday routine.'),
      chapter('Fix behaviour at the point of action', 'Where real change usually happens', `Most progress happens before the spending or saving decision, not after it. That means the system should influence the moment of choice instead of relying on regret afterwards.`, ['Use friction in the right places', 'Automate helpful actions where possible', 'Make the main priority obvious'], `A small change like moving money earlier can be more powerful than promising to “try harder” later in the week.`, 'Adjust the setup so the right action becomes easier than the wrong one.'),
      chapter('Watch for emotional money traps', 'The habits that quietly undo progress', `Overspending, avoidance, and inconsistent saving often have emotional triggers behind them. Naming those triggers makes it easier to create a response plan instead of repeating the cycle.`, ['Stress spending needs a plan', 'Avoidance grows when reviews feel too painful', 'Small comforts become expensive when they stay unconscious'], `Many people think they lack discipline when the real issue is that no plan exists for tired, stressful, or impulse-heavy moments.`, 'Choose one trigger and build a better response around it.'),
      chapter('Make progress sustainable', 'How to keep the improvement going', `The goal is not a perfect month. The goal is a structure that keeps improving even when life is not ideal. Sustainable progress is what turns better knowledge into better outcomes.`, ['Review what is working', 'Keep the system simple enough to maintain', 'Let evidence guide the next adjustment'], `A calm money routine is often more valuable than an intense short-lived reset.`, 'Use monthly reflection to improve one weak point at a time.')
    ],
    commonMistakes: ['Trying to fix everything at once', 'Using guilt instead of structure', 'Ignoring irregular spending patterns', 'Waiting for motivation before reviewing money'],
    frameworkTitle: 'A simple money reset framework',
    frameworkSteps: ['Make the pattern visible', 'Separate priorities clearly', 'Automate or simplify the first right move', 'Review weekly', 'Improve one leak at a time'],
    checklist: ['Track the main pressure points', 'Set one clear review time each week', 'Protect the priority before flexible spending', 'Name the emotional triggers around money', 'Keep the system realistic enough to repeat'],
    resources: ['Budget planner templates', 'Bank spending exports or budgeting tools', 'Educational UK money guidance services'],
    deliveryNote: 'Educational guide only — not regulated financial advice.'
  });
}

function sideHustleProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'side-hustles',
    valueProp,
    description: `A structured side-hustle handbook for understanding ${focus.toLowerCase()}, early setup choices, and more realistic expectations.`,
    disclaimerType: 'general',
    searchTerms: ['side hustle', 'income', 'beginner business', focus.toLowerCase()],
    whatInside: ['How to judge the opportunity properly', 'The beginner setup basics that matter most', 'Common mistakes that waste time early', 'A practical selection and testing framework'],
    chapters: [
      chapter('Start with realistic expectations', `How to think about ${focus.toLowerCase()} properly`, `A side hustle becomes more useful when the reader stops thinking about it as a shortcut and starts treating it like a small operating system that needs fit, energy, and patience.`, ['Match the idea to time and skill', 'Judge friction honestly', 'Avoid fantasy timelines'], `People often choose a side hustle because it sounds exciting, then quit because the daily reality was never assessed properly.`, 'Judge the idea by repeatability, not hype.'),
      chapter('Choose for fit, not noise', 'Why the right hustle looks different for different people', `The strongest side hustle is rarely the trendiest. It is the one that fits the person’s schedule, attention, confidence, and willingness to learn or sell.`, ['Consider skills, market, and available time', 'Choose something you can test cheaply', 'Know whether it needs clients, products, or content'], `Some of the most stable side hustles look simple because they are built around reliability, not online noise.`, 'Write down what kind of effort you can genuinely sustain each week.'),
      chapter('Set up the basics cleanly', 'Simple structure beats messy enthusiasm', `Early setup does not need to be heavy, but it does need to be clear. The reader should know what they are offering, who it is for, and how a first sale or first client would happen.`, ['Define the offer clearly', 'Use a clean first-sales path', 'Keep admin light but organised'], `Confusion usually appears when the person keeps researching but still cannot explain what they are actually selling.`, 'Create one sentence that explains the offer and outcome clearly.'),
      chapter('Avoid the common beginner traps', 'Where time and energy usually leak away', `Most beginner waste comes from overcomplicating, overbranding too early, or delaying any real market contact. A side hustle improves when it meets reality quickly.`, ['Avoid overplanning', 'Avoid underpricing from panic', 'Avoid hiding from feedback'], `A clean test with imperfect materials often teaches more than two weeks of private redesigning.`, 'Get one real-world signal before adding more complexity.'),
      chapter('Turn the idea into a working habit', 'Small systems that make the hustle easier to keep', `The reader needs a weekly rhythm, not constant pressure. Small consistent blocks outperform chaotic bursts because they create proof and reduce restart friction.`, ['Use a set weekly block', 'Track one useful progress measure', 'Improve with feedback rather than emotion'], `A side hustle often becomes believable after a few weeks of structured repetition, not after one big energetic evening.`, 'Protect one recurring work block every week and use it on the highest-value task.')
    ],
    commonMistakes: ['Choosing based on hype instead of fit', 'Trying to build everything before testing demand', 'Avoiding outreach or visibility', 'Expecting fast certainty'],
    frameworkTitle: 'A side-hustle selection framework',
    frameworkSteps: ['Check fit with time and skills', 'Define the offer clearly', 'Test with minimal setup', 'Collect real feedback', 'Refine what gets traction'],
    checklist: ['Can you explain the offer clearly?', 'Do you know who it is for?', 'Can you test demand cheaply?', 'Do you have one weekly work block protected?', 'Are you measuring a real signal and not just effort?'],
    resources: ['Simple offer templates', 'Freelance or marketplace research tools', 'Beginner business planning worksheets'],
    deliveryNote: 'Educational guide for planning and learning — not a promise of income results.'
  });
}

function businessStarterProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'business-starters',
    valueProp,
    description: `A structured business handbook covering ${focus.toLowerCase()}, offer clarity, early client foundations, and stronger first systems.`,
    disclaimerType: 'general',
    searchTerms: ['small business', 'first clients', 'service business', focus.toLowerCase()],
    whatInside: ['Offer clarity and beginner positioning', 'What to focus on before chasing growth', 'Common setup and pricing mistakes', 'Practical frameworks for early client traction'],
    chapters: [
      chapter('Start with the offer', `Why ${focus.toLowerCase()} begins with clarity`, `A service business feels stronger when the offer is easy to explain, easy to trust, and matched to a real problem. Many beginner issues come from unclear packaging rather than weak ability.`, ['State the problem solved', 'Be clear about the outcome', 'Avoid broad vague offers'], `People trust offers faster when the promise sounds specific and grounded rather than ambitious but blurry.`, 'Write one clean offer statement before improving anything else.'),
      chapter('Know who it is for', 'Audience clarity is a growth tool', `Beginners often think audience clarity is branding decoration. It is not. It affects message, trust, and whether the business attracts serious conversations or only curiosity.`, ['Define the best-fit client', 'Use their language, not only your own', 'Narrow before widening'], `When the audience becomes clearer, writing, outreach, and pricing decisions all become easier to make.`, 'Choose the client type you would most want to serve first.'),
      chapter('Build the first traction path', 'How early clients are usually won', `The business does not need every system at the start. It needs a believable path to conversations, trust, and conversion. That path should be simple enough to use consistently.`, ['Use a direct first-client path', 'Collect proof early', 'Follow up properly'], `Many small service businesses grow first through a few disciplined conversations, not through perfect branding.`, 'Create one short weekly habit for outreach, referrals, or visibility.'),
      chapter('Price with more confidence', 'Why pricing confusion is often a positioning issue', `Pricing usually feels difficult when the value, audience, and delivery process still feel too loose. Clearer pricing comes after clearer framing.`, ['Link pricing to value and fit', 'Avoid panic-discounting', 'Explain scope properly'], `A client often resists price because the offer or trust level still feels unclear, not only because the number is too high.`, 'Review what the client is really being asked to understand and trust.'),
      chapter('Operate like a real business', 'Simple systems that make growth cleaner', `The strongest early businesses feel calmer because they use a few good systems well: notes, client follow-up, delivery standards, and review habits.`, ['Keep admin simple but clear', 'Track enquiries and outcomes', 'Improve one weak point at a time'], `A tidy beginner system builds confidence for both the owner and the client.`, 'Set one weekly operator review to tighten the business instead of always reacting mid-week.')
    ],
    commonMistakes: ['Keeping the offer too vague', 'Trying to look bigger before proving value', 'Discounting from uncertainty', 'Waiting too long to gather proof or testimonials'],
    frameworkTitle: 'A service business starter framework',
    frameworkSteps: ['Clarify the offer', 'Define the best-fit client', 'Choose a first traction channel', 'Price with scope in mind', 'Review and tighten weekly'],
    checklist: ['Can a stranger understand the offer quickly?', 'Do you know the first client type to target?', 'Is there a simple path to conversation or enquiry?', 'Is your price linked to a clear outcome?', 'Are you collecting proof as early as possible?'],
    resources: ['Offer statement worksheets', 'Proposal or scope templates', 'Local business support hubs and startup guides'],
    deliveryNote: 'Educational guide for business learning and setup decisions.'
  });
}

function careerProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'career-growth',
    valueProp,
    description: `A professional handbook for improving ${focus.toLowerCase()} with stronger preparation, clearer communication, and better long-term habits.`,
    disclaimerType: 'general',
    searchTerms: ['career', 'cv', 'interview', focus.toLowerCase()],
    whatInside: ['A clearer explanation of what matters most', 'Communication and preparation frameworks', 'Common mistakes that weaken trust', 'Practical next steps for stronger career progress'],
    chapters: [
      chapter('Understand the role of first impressions', `How ${focus.toLowerCase()} shapes professional trust`, `Career progress often improves when the basics of communication, preparation, and presentation become more deliberate. The goal is not to sound artificial. It is to be clearer and more credible.`, ['Clarity beats cleverness', 'Preparation reduces anxiety', 'Professional tone still needs personality'], `Many strong candidates underperform because they know more than they can communicate under pressure.`, 'Decide what impression you want your materials and conversation to create.'),
      chapter('Strengthen the message', 'What employers or decision-makers need to understand', `Whether the context is a CV, interview, or daily professional growth, the message has to be easy to follow. People trust signals they can understand quickly.`, ['Lead with relevance', 'Use evidence, not vague claims', 'Connect past work to future value'], `A message that feels concrete usually lands better than one that tries to impress too broadly.`, 'Review every sentence or talking point for clarity and usefulness.'),
      chapter('Prepare in a structured way', 'Better preparation creates calmer performance', `Preparation should reduce uncertainty, not just increase reading. The reader needs a simple structure for what to practice, what to refine, and what to stop overcomplicating.`, ['Practice likely questions or scenarios', 'Prepare examples that prove ability', 'Use reflection to tighten weak areas'], `Most interview or career nerves reduce when the person has rehearsed real examples rather than memorising polished lines.`, 'Create a small bank of examples you can reuse clearly.'),
      chapter('Avoid the trust-killing mistakes', 'Where capable people often weaken their own case', `Career communication suffers when the person undersells, overtalks, or stays too generic. Trust grows when the message feels grounded and easy to believe.`, ['Avoid vague self-description', 'Avoid weak examples', 'Avoid passive preparation'], `The strongest presentation often sounds calm, relevant, and well-supported rather than overly formal or overexplained.`, 'Replace vague claims with short evidence-led examples.'),
      chapter('Build stronger long-term habits', 'Career growth depends on more than one moment', `One interview or one CV update matters, but career growth improves most when the person keeps building communication, proof, and confidence over time.`, ['Reflect after key moments', 'Build visible evidence of growth', 'Keep developing the habits behind opportunity'], `Small professional habits often separate steady growth from repeated frustration.`, 'Turn this guide into a reusable professional review tool.')
    ],
    commonMistakes: ['Using vague language about strengths', 'Preparing too passively', 'Talking without enough evidence or examples', 'Treating career growth as only a one-off event'],
    frameworkTitle: 'A stronger career preparation framework',
    frameworkSteps: ['Clarify the message', 'Match it to the opportunity', 'Prepare examples', 'Practice calmly', 'Review and improve after each attempt'],
    checklist: ['Can you explain your value clearly?', 'Do you have proof-based examples ready?', 'Have you prepared for likely questions or objections?', 'Does your tone feel confident and natural?', 'Are you building habits beyond one moment?'],
    resources: ['CV templates and review checklists', 'Interview question frameworks', 'Professional development and networking resources'],
    deliveryNote: 'Educational career guide designed to improve clarity and preparation.'
  });
}

function socialProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'social-media-growth',
    valueProp,
    description: `A structured social growth handbook for improving ${focus.toLowerCase()} with better content systems, clearer audience thinking, and more repeatable habits.`,
    disclaimerType: 'general',
    searchTerms: ['instagram', 'content planning', 'social growth', focus.toLowerCase()],
    whatInside: ['Platform basics in plain language', 'Content and consistency systems that reduce stress', 'The mistakes that usually block growth', 'Actionable ideas for planning and improvement'],
    chapters: [
      chapter('Get clear on the job of the account', `Why ${focus.toLowerCase()} improves when the purpose is clearer`, `Social growth becomes easier when the account has a recognisable role for the audience. The point is not to post more for the sake of activity. It is to make the account more useful, memorable, and consistent.`, ['Define who the account is for', 'Know what value it offers', 'Use clarity before variety'], `Accounts often feel flat because the audience cannot quickly tell why they should keep watching or following.`, 'Write down the audience promise in one sentence.'),
      chapter('Build better content structure', 'Consistency comes from systems, not hope', `Most content stress comes from weak planning, unclear themes, and leaving every post to last-minute mood. Better planning creates better quality and lower friction.`, ['Use content pillars', 'Collect ideas continuously', 'Separate creation from posting'], `A creator with a simple planning habit often looks more creative because they are no longer relying on panic every day.`, 'Choose three repeatable content pillars and build around them.'),
      chapter('Understand what actually earns attention', 'Growth is usually more predictable than it feels', `Platforms reward content that creates clear response signals. That does not mean chasing tricks. It means understanding what makes people stop, stay, save, share, or respond.`, ['Use stronger hooks', 'Create clearer audience relevance', 'Design content for engagement and trust'], `Many people blame reach when the deeper issue is that the content was not specific or compelling enough at the start.`, 'Review the first few seconds or first line of each piece more carefully.'),
      chapter('Avoid the habits that kill growth', 'The patterns that quietly flatten momentum', `Growth drops when the message changes too often, the posting rhythm collapses, or the account tries to speak to everybody. Cleaner growth comes from a stronger identity and steadier execution.`, ['Avoid random posting', 'Avoid copying without context', 'Avoid changing direction too quickly'], `Accounts build trust when they feel recognisable over time, not when they keep reinventing themselves every week.`, 'Use a short weekly review to decide what to repeat and what to remove.'),
      chapter('Make the workflow sustainable', 'The best system is one you can keep', `The reader needs a process that survives normal life. Sustainable output beats short bursts of intense effort followed by silence.`, ['Match output to capacity', 'Batch where helpful', 'Keep a review loop in place'], `A lighter but consistent system usually outperforms an ambitious system that falls apart after ten days.`, 'Set one planning block, one creation block, and one review block each week.')
    ],
    commonMistakes: ['Posting without clear themes', 'Changing style too often', 'Ignoring planning and relying on pressure', 'Treating every post as disconnected from the wider system'],
    frameworkTitle: 'A cleaner content growth framework',
    frameworkSteps: ['Clarify the audience and promise', 'Choose repeatable pillars', 'Plan content in batches', 'Review response signals', 'Repeat what earns trust'],
    checklist: ['Can people tell what the account is about quickly?', 'Do you have consistent content pillars?', 'Are you planning before posting?', 'Are hooks and opening lines strong enough?', 'Are you reviewing results calmly each week?'],
    resources: ['Platform analytics tools', 'Content calendar templates', 'Creator education resources and trend references'],
    deliveryNote: 'Educational guide for stronger content systems and audience growth habits.'
  });
}

function personalBrandProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'personal-branding',
    valueProp,
    description: `A positioning handbook for ${focus.toLowerCase()} with stronger message clarity, profile direction, and a more trustworthy online presence.`,
    disclaimerType: 'general',
    searchTerms: ['personal brand', 'online presence', 'positioning', focus.toLowerCase()],
    whatInside: ['Positioning basics in plain language', 'Profile and message consistency guidance', 'Trust-building content and presence ideas', 'Practical branding checklists and next steps'],
    chapters: [
      chapter('Start with positioning', `Why ${focus.toLowerCase()} depends on clarity first`, `A personal brand becomes more valuable when the message is easier to understand and easier to remember. The strongest brands are usually not louder. They are clearer.`, ['Define what you want to be known for', 'Connect the message to the right audience', 'Avoid broad unclear identity signals'], `People trust a brand faster when they can quickly understand the area of value, tone, and direction.`, 'Write one positioning line that explains who you help or what you stand for.'),
      chapter('Clean up the visible signals', 'Profiles, bios, and visuals should say the same thing', `Online presence becomes stronger when the visible signals support each other. Profile text, images, topics, and tone should feel like one clear message instead of separate pieces.`, ['Align words and visuals', 'Reduce mixed messages', 'Keep credibility visible'], `A profile often underperforms because it is technically complete but strategically unclear.`, 'Review your profile like a stranger seeing it for the first time.'),
      chapter('Use content to build trust', 'Presence grows when people see a pattern of value', `Branding is not only a visual exercise. Trust grows when the person shows useful thinking, clear values, and a recognisable approach over time.`, ['Teach or explain useful ideas', 'Show perspective and standards', 'Let content reinforce identity'], `People often remember consistent points of view more than polished design alone.`, 'Choose a few content themes that support the reputation you want to build.'),
      chapter('Avoid the branding mistakes', 'Where personal brands become vague or forgettable', `A brand weakens when it tries to be too broad, too polished without substance, or too inconsistent to build trust. Cleaner brands feel grounded and specific.`, ['Avoid vague claims', 'Avoid visual polish without message clarity', 'Avoid switching identity too often'], `Many people update colours, logos, or photos while leaving the deeper message untouched.`, 'Fix the strategic message before obsessing over surface polish.'),
      chapter('Make the brand easier to maintain', 'The goal is a usable system, not constant reinvention', `A strong personal brand should help the person make decisions faster: what to post, what to say yes to, and how to present themselves consistently.`, ['Turn the brand into a practical filter', 'Use simple messaging standards', 'Keep reviewing fit with your goals'], `The best brand systems reduce decision fatigue because the direction becomes easier to recognise.`, 'Create a short brand standard for tone, themes, and profile signals.')
    ],
    commonMistakes: ['Trying to appeal to everyone', 'Relying on visuals without message clarity', 'Changing direction too often', 'Posting without a clear reputation goal'],
    frameworkTitle: 'A personal brand clarity framework',
    frameworkSteps: ['Define what you want to be known for', 'Align visible signals', 'Build trust through useful content', 'Review inconsistencies', 'Repeat the strongest message'],
    checklist: ['Is your profile message clear?', 'Do visuals and words match?', 'Can people tell what you stand for quickly?', 'Do your themes support your reputation?', 'Is the system easy to maintain weekly?'],
    resources: ['Profile audit checklists', 'Content positioning worksheets', 'Visual consistency references'],
    deliveryNote: 'Educational brand guide for clearer positioning and stronger online presence.'
  });
}

function fitnessProduct(slug: string, title: string, categorySlug: 'fat-loss' | 'muscle-gain', valueProp: string, focus: string): CollectionProduct {
  const categoryTitle = categorySlug === 'fat-loss' ? 'fat loss' : 'muscle gain';
  return buildProduct({
    slug,
    title,
    categorySlug,
    valueProp,
    description: `An educational fitness guide focused on ${focus.toLowerCase()}, better routines, and more realistic ${categoryTitle} habits.`,
    disclaimerType: 'medical',
    searchTerms: [categoryTitle, 'training', 'nutrition', focus.toLowerCase()],
    whatInside: ['Clear educational foundations', 'Routine and habit guidance that supports consistency', 'Common mistakes that stall progress', 'Practical next steps and checklists'],
    chapters: [
      chapter('Start with a realistic baseline', `Why ${focus.toLowerCase()} needs a believable routine`, `Fitness progress improves when the plan fits real life. Extreme ambition often feels impressive but collapses quickly. A better baseline creates more usable momentum.`, ['Match the plan to your schedule', 'Use simple structure first', 'Avoid all-or-nothing thinking'], `People often believe they need a harsher plan when the real issue is that the routine never fit their normal week.`, 'Set the plan around the days, food decisions, and energy you can actually sustain.'),
      chapter('Understand the core behaviours', `How ${focus.toLowerCase()} is shaped day to day`, `Results usually come from repeated behaviours more than one dramatic choice. That means food structure, training quality, recovery, and daily consistency need more attention than hype.`, ['Use routine over intensity', 'Keep the fundamentals visible', 'Track the habits behind the result'], `A lot of frustration comes from watching only the outcome while ignoring the behaviours that create it.`, 'Review what you are repeating each week, not just what you hope will happen.'),
      chapter('Train and eat with more purpose', 'The basics should feel clear, not complicated', `A useful plan respects available time, appetite, recovery, and stress. The aim is to make the system more repeatable, not more extreme.`, ['Keep training structure simple', 'Use food habits that reduce friction', 'Protect recovery so consistency stays possible'], `A reader who simplifies their food and training decisions usually becomes more consistent because fewer choices depend on mood.`, 'Choose one training structure and one food structure to follow for the next few weeks.'),
      chapter('Avoid the common mistakes', 'Why progress often stalls even when effort feels high', `A lot of effort gets wasted because the plan is too strict, too random, or too dependent on motivation. Better results usually come from making the basics easier to repeat.`, ['Avoid overcomplicating', 'Avoid inconsistent recovery', 'Avoid chasing short-term perfection'], `Many people think they need more motivation when they actually need fewer points of friction inside the routine.`, 'Identify the part of your plan that is hardest to maintain and simplify it first.'),
      chapter('Build a routine you can keep', 'Longer-term progress comes from steadier systems', `A stronger fitness routine should lower restart risk. That means protecting key habits, using a small review rhythm, and adjusting with evidence instead of frustration.`, ['Use weekly reflection', 'Protect the highest-value habits', 'Let the plan evolve with feedback'], `The best routines are not the ones that look hardest. They are the ones that still work after normal life happens.`, 'Use this guide as a reference whenever the routine starts feeling too loose or too extreme.')
    ],
    commonMistakes: ['Using a plan that does not fit real life', 'Going too hard early and fading quickly', 'Ignoring recovery or consistency', 'Treating one bad day like a full reset'],
    frameworkTitle: 'A more sustainable fitness framework',
    frameworkSteps: ['Set a believable baseline', 'Use clear training structure', 'Use simpler food routines', 'Review progress weekly', 'Adjust one friction point at a time'],
    checklist: ['Does the plan fit your actual week?', 'Is your food structure easy to repeat?', 'Are you protecting recovery?', 'Do you know the main mistake that keeps repeating?', 'Can you stay with this for a month?'],
    resources: ['Workout logs or habit trackers', 'Educational public health resources', 'Qualified coaching or physio support if needed'],
    deliveryNote: 'Educational guide only — not medical advice, diagnosis, or treatment.'
  });
}

function groomingProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'mens-grooming',
    valueProp,
    description: `A premium grooming handbook for ${focus.toLowerCase()} with clearer daily habits, product awareness, and avoidable mistake guidance.`,
    disclaimerType: 'medical',
    searchTerms: ['mens grooming', 'haircare', 'beard', 'skin', focus.toLowerCase()],
    whatInside: ['Routine order and daily structure', 'Product-category explanations in plain language', 'Common grooming mistakes to avoid', 'Simple upgrades that improve consistency'],
    chapters: [
      chapter('Start with routine, not product overload', `Why ${focus.toLowerCase()} works better with structure`, `Most grooming improvement comes from using a few sensible habits well. People often waste money because the routine is unclear, not because they lack products.`, ['Simplify the routine', 'Know what each step is for', 'Avoid adding things without a reason'], `A man with a basic consistent grooming routine often looks sharper than someone constantly buying products without using them properly.`, 'Write down the minimum morning and evening routine first.'),
      chapter('Understand the product categories', 'What each type of product is meant to do', `Product awareness helps the reader avoid random buying. The point is to understand purpose and fit instead of chasing packaging or trends.`, ['Cleanse, treat, style, and maintain appropriately', 'Use product types based on need', 'Respect frequency and tolerance'], `Many grooming mistakes happen because a product is used in the wrong place, at the wrong frequency, or for the wrong reason.`, 'Audit your current routine and label each product by purpose.'),
      chapter('Make the routine look cleaner', 'Small habits often create the biggest visual difference', `The best grooming gains are usually simple: consistency, better order, and cleaner maintenance. A sharper appearance often comes from discipline more than dramatic products.`, ['Use regular maintenance habits', 'Keep standards visible', 'Prioritise cleanliness and consistency'], `Regular upkeep often makes more difference than occasional effort-heavy resets.`, 'Choose the one habit that would most visibly improve your appearance if repeated every week.'),
      chapter('Avoid the common grooming mistakes', 'Where effort gets wasted', `People often overuse, underuse, or misunderstand products and then assume grooming does not work for them. Better results come from calmer more intentional use.`, ['Avoid over-washing or over-styling', 'Avoid product stacking without purpose', 'Avoid inconsistent maintenance'], `A lot of poor outcomes are really routine mistakes rather than evidence that the person needs something extreme.`, 'Remove one unnecessary step or badly used product from the routine.'),
      chapter('Build a reliable personal standard', 'Good grooming is easier when it becomes automatic', `The goal is not to become obsessive. It is to create a low-friction personal standard that keeps appearance, hygiene, and confidence more consistent.`, ['Use a fixed routine', 'Keep products accessible', 'Review the routine every few weeks'], `The routine becomes more powerful when it stops feeling optional and starts feeling normal.`, 'Create a grooming checklist you can keep in the bathroom or phone notes.')
    ],
    commonMistakes: ['Buying too many products without a routine', 'Using products too aggressively', 'Ignoring maintenance basics', 'Switching habits too often to judge what works'],
    frameworkTitle: 'A cleaner grooming framework',
    frameworkSteps: ['Set a simple routine', 'Know what each product does', 'Use it consistently', 'Review visible results', 'Refine only after enough time'],
    checklist: ['Do you know the purpose of each product?', 'Is your routine simple enough to repeat?', 'Are you overusing anything?', 'Have you fixed the highest-value maintenance habit?', 'Can you maintain this standard weekly?'],
    resources: ['Basic grooming routine checklists', 'Product ingredient education pages', 'Barber or professional care support where relevant'],
    deliveryNote: 'Educational grooming guide only — not dermatology or medical treatment advice.'
  });
}

function skincareProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'womens-skincare',
    valueProp,
    description: `An educational skincare guide focused on ${focus.toLowerCase()}, routine order, and more supportive daily care habits.`,
    disclaimerType: 'medical',
    searchTerms: ['womens skincare', 'skin type', 'routine', focus.toLowerCase()],
    whatInside: ['Skin-type explanation in plain language', 'Morning and evening routine order', 'Common product categories and when they help', 'Mistakes and supportive habits to watch closely'],
    chapters: [
      chapter('Understand the skin pattern first', `Why ${focus.toLowerCase()} needs the right routine fit`, `Good skincare starts with understanding the skin pattern being worked with. A routine that feels normal on one skin type can feel irritating or ineffective on another.`, ['Learn the typical concerns', 'Avoid guessing from trends alone', 'Build around tolerance and consistency'], `People often copy routines that sound impressive but do not fit their skin pattern at all.`, 'Start by naming the main skin behaviour you are trying to support.'),
      chapter('Use the routine in the right order', 'Order and simplicity matter more than overload', `Skincare becomes more effective when the steps are used in a sensible order and with a clear reason. More products do not automatically mean better skin support.`, ['Keep cleansing, hydration, and protection clear', 'Layer products thoughtfully', 'Respect skin sensitivity'], `A calmer routine often helps the skin feel more stable because fewer variables are changing at once.`, 'Write down a simple morning and evening order before adding complexity.'),
      chapter('Know the common product categories', 'Understand what a product type is meant to support', `A better routine comes from knowing the purpose of the product category: cleanser, hydrator, moisturiser, protection, and targeted support where needed.`, ['Use products for a reason', 'Avoid trend-driven stacking', 'Match product type to skin behaviour'], `Routine confusion often starts because the person knows product names but not how they fit together.`, 'Audit the current products and label them by category and purpose.'),
      chapter('Avoid the common skincare mistakes', 'Where people often irritate or confuse their own skin', `A lot of skincare frustration comes from overdoing, changing too quickly, or reacting emotionally every few days. Better results often come from more patience and less chaos.`, ['Avoid over-exfoliation', 'Avoid changing too many variables at once', 'Avoid judging too quickly'], `Skin usually responds better to steady routines than to constant experimentation.`, 'Pick one part of the routine to simplify if your skin currently feels reactive or inconsistent.'),
      chapter('Support the routine with habits', 'Lifestyle and consistency still matter', `Skincare sits inside a wider pattern that includes consistency, hygiene, product handling, and supportive daily habits. The goal is not perfection. It is steadier care.`, ['Use clean simple habits', 'Protect the basics daily', 'Review the routine with patience'], `The best routine is often the one that feels calm enough to keep.`, 'Use this guide to maintain a supportive baseline before making bigger routine changes.')
    ],
    commonMistakes: ['Using too many active products at once', 'Switching routines too quickly', 'Ignoring routine order', 'Treating irritation as proof that something is working'],
    frameworkTitle: 'A calmer skincare routine framework',
    frameworkSteps: ['Identify the skin pattern', 'Use a simple routine order', 'Choose products by category and purpose', 'Change one thing at a time', 'Review with patience'],
    checklist: ['Do you know your main skin concern?', 'Is your morning routine simple and clear?', 'Is your evening routine easy to maintain?', 'Are you overloading the skin?', 'Are you giving the routine enough time?'],
    resources: ['Ingredient education references', 'Routine tracking notes', 'Qualified dermatology support if symptoms or reactions are significant'],
    deliveryNote: 'Educational skincare guide only — not medical or dermatology treatment advice.'
  });
}

function mindsetProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'mindset-discipline',
    valueProp,
    description: `A structured discipline handbook that explains ${focus.toLowerCase()} with stronger systems, habit structure, and calmer self-management.`,
    disclaimerType: 'general',
    searchTerms: ['discipline', 'procrastination', 'habits', focus.toLowerCase()],
    whatInside: ['Habit and behaviour patterns explained clearly', 'Self-sabotage patterns to watch for', 'A simple structure for stronger daily follow-through', 'Useful resets and checklists for staying on track'],
    chapters: [
      chapter('See the behaviour pattern', `Why ${focus.toLowerCase()} is usually a system issue before a personality issue`, `People often talk about discipline as if it is an identity trait. In practice, it is usually shaped by routine design, emotional friction, and how decisions are structured.`, ['Notice repeated trigger points', 'Separate identity from behaviour', 'Focus on systems, not only self-talk'], `A person may feel “lazy” when the real issue is that their day has too many friction points and not enough structure.`, 'Write down the moment your routine most often breaks down.'),
      chapter('Design the day more deliberately', 'Discipline improves when the environment helps', `Good discipline often looks ordinary: fewer decisions, clearer starts, and easier transitions into the work or habit that matters.`, ['Reduce friction around the right action', 'Use visible cues', 'Protect the first important move'], `Many people fail later in the day because the first hour never created enough structure.`, 'Design tomorrow’s start before today ends.'),
      chapter('Understand self-sabotage better', 'Why good intentions still collapse', `Self-sabotage usually appears when the plan is too vague, too emotional, or too dependent on ideal energy. Stronger habits need a lower-friction design.`, ['Name the recurring avoidance pattern', 'Build a response for low-energy moments', 'Keep the plan simple enough to survive stress'], `A useful routine respects the fact that motivation changes.`, 'Choose one fallback habit for the days when energy is lower.'),
      chapter('Use weekly resets properly', 'Resetting should improve the system, not restart the fantasy', `A weekly reset is helpful when it becomes a review tool, not a guilt ritual. The point is to notice what worked, what failed, and what needs tightening next.`, ['Review honestly', 'Adjust one weak point at a time', 'Avoid rebuilding the whole week from scratch'], `People often burn time on planning aesthetics while ignoring the one habit that actually keeps failing.`, 'Use a short review template with one win, one miss, and one adjustment.'),
      chapter('Build a stronger standard', 'Discipline becomes lighter when it feels normal', `The goal is not intensity. It is self-respect through reliable action. A good discipline system makes the right move easier to repeat under normal conditions.`, ['Protect the key habits', 'Keep the standards visible', 'Use reflection to maintain rather than only repair'], `A stronger personal standard often changes identity quietly through repetition rather than through dramatic statements.`, 'Choose the one behaviour that would most improve your self-respect if repeated for 30 days.')
    ],
    commonMistakes: ['Treating discipline like a personality trait only', 'Overplanning and underdesigning the routine', 'Restarting too dramatically after one bad day', 'Ignoring trigger moments'],
    frameworkTitle: 'A practical discipline framework',
    frameworkSteps: ['See the pattern', 'Reduce friction', 'Protect the first key action', 'Review weekly', 'Raise the standard gradually'],
    checklist: ['Do you know your main trigger point?', 'Is the first important action protected?', 'Do you have a fallback habit?', 'Are weekly resets honest and simple?', 'Is the routine built for normal life?'],
    resources: ['Habit trackers and weekly review templates', 'Focus timer tools', 'Behaviour design worksheets'],
    deliveryNote: 'Educational guide for habits, routine structure, and better daily follow-through.'
  });
}

function confidenceProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'confidence-building',
    valueProp,
    description: `A grounded confidence handbook focused on ${focus.toLowerCase()}, self-respect, and more grounded communication habits.`,
    disclaimerType: 'general',
    searchTerms: ['confidence', 'self-respect', 'communication', focus.toLowerCase()],
    whatInside: ['What healthy confidence actually looks like', 'The habits that strengthen self-respect', 'Communication and behaviour basics', 'A practical action checklist for daily use'],
    chapters: [
      chapter('Understand confidence correctly', `Why ${focus.toLowerCase()} is built through action`, `Healthy confidence is not loudness or instant certainty. It usually grows when the person acts more clearly, communicates better, and sees evidence that they can handle situations with more steadiness.`, ['Separate confidence from performance', 'Treat confidence as trainable', 'Build it through repeated action'], `Many people chase a feeling when what they really need is a better behavioural standard.`, 'Define one situation where you want to show up more clearly this week.'),
      chapter('Raise self-respect first', 'Confidence usually follows personal standards', `Self-respect improves when the person keeps small promises, uses better boundaries, and behaves in a way they can trust. That creates a stronger base than motivational talk alone.`, ['Use cleaner standards', 'Reduce self-betrayal patterns', 'Link confidence to behaviour'], `People often feel more secure after a week of cleaner habits than after a long period of trying to think more positively.`, 'Choose one small promise you will keep daily.'),
      chapter('Use body language and communication better', 'Visible behaviour matters', `How a person stands, speaks, pauses, and responds changes how they are perceived and how they perceive themselves. Calm communication often feels stronger than forced intensity.`, ['Use grounded posture', 'Slow down rushed speech', 'Speak clearly rather than apologetically'], `A small improvement in tone and delivery can change a conversation more than a dramatic script.`, 'Practice one clearer speaking habit in your next conversation.'),
      chapter('Avoid the confidence traps', 'Where people accidentally weaken themselves', `Confidence drops when the person over-explains, seeks too much reassurance, or keeps acting against their own standards. Better confidence comes from cleaner behaviour, not constant self-analysis.`, ['Avoid apologising unnecessarily', 'Avoid overexplaining your value', 'Avoid comparing constantly'], `A lot of confidence problems grow because people treat every social moment like a verdict rather than feedback.`, 'Remove one weak communication habit from your default behaviour.'),
      chapter('Build a daily confidence rhythm', 'The goal is steadier self-trust', `Daily confidence improves when posture, routine, communication, and self-respect begin to support each other. The result is less internal conflict and more grounded presence.`, ['Use a short daily standard', 'Review progress realistically', 'Let confidence grow from consistency'], `Real confidence usually feels quieter and more stable than people expect.`, 'Use this guide to set a daily confidence checklist you can actually keep.')
    ],
    commonMistakes: ['Waiting to feel confident before acting', 'Using people-pleasing as a safety strategy', 'Overexplaining or shrinking in conversation', 'Treating confidence like pure mindset instead of behaviour'],
    frameworkTitle: 'A grounded confidence framework',
    frameworkSteps: ['Set one personal standard', 'Use cleaner body language', 'Speak more clearly', 'Reflect without overjudging', 'Repeat until self-trust improves'],
    checklist: ['Are you keeping small promises to yourself?', 'Is your body language more grounded?', 'Are you speaking clearly instead of apologetically?', 'Did you reduce one weak habit this week?', 'Are you building evidence instead of waiting for a feeling?'],
    resources: ['Communication practice notes', 'Habit and posture reminders', 'Journaling prompts for reflection'],
    deliveryNote: 'Educational self-development guide for building steadier confidence and self-respect.'
  });
}

function relationshipProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'relationships',
    valueProp,
    description: `A respectful relationship handbook focused on ${focus.toLowerCase()}, better communication, and healthier day-to-day habits.`,
    disclaimerType: 'relationship',
    searchTerms: ['relationships', 'communication', 'boundaries', focus.toLowerCase()],
    whatInside: ['Healthy communication basics', 'Respect, boundaries, and emotional awareness', 'Common patterns that damage trust', 'Practical habits that support stronger connection'],
    chapters: [
      chapter('Start with healthier communication', `Why ${focus.toLowerCase()} depends on how people speak and listen`, `Stronger relationships usually improve through clearer communication, calmer responses, and a better understanding of what respect looks like in daily behaviour.`, ['Use listening as part of communication', 'Stay specific instead of vague', 'Avoid escalating quickly'], `A lot of tension grows because people feel unheard or misread, not only because the topic itself is impossible.`, 'Choose one way to communicate more clearly in your next important conversation.'),
      chapter('Understand emotional patterns', 'The way people react shapes the relationship climate', `Emotion is part of relationships, but unmanaged reaction patterns often create avoidable damage. Better awareness helps people respond with more care and clarity.`, ['Notice defensive patterns', 'Recognise triggers', 'Create pause before reaction'], `Many repeated arguments are not new problems. They are the same emotional pattern replaying with different details.`, 'Name the pattern you most want to interrupt.'),
      chapter('Use boundaries properly', 'Boundaries support respect and stability', `Boundaries are not only about saying no. They help people act with self-respect, clarity, and emotional steadiness. Healthy boundaries often reduce confusion and resentment.`, ['Be clear and calm', 'Avoid mixed signals', 'Link boundaries to values and respect'], `A relationship often becomes healthier when expectations and limits are more visible.`, 'Write down one boundary that needs clearer communication.'),
      chapter('Avoid the common relationship mistakes', 'Where trust is quietly weakened', `Trust often drops through repeated small habits: poor listening, sarcasm, emotional avoidance, and a lack of repair after difficult moments.`, ['Avoid contempt or disrespectful tone', 'Avoid passive resentment', 'Avoid vague unresolved tension'], `A relationship usually feels safer when conflict is handled with more honesty and less emotional chaos.`, 'Identify one repeated habit that weakens trust and commit to reducing it.'),
      chapter('Build healthier habits daily', 'Relationship quality is often built in ordinary moments', `Small daily habits can make connection feel stronger, safer, and more respectful. The goal is not perfection. It is consistency in how people show up.`, ['Use small repair habits', 'Protect regular check-ins', 'Make respect visible in behaviour'], `A healthier relationship often feels steadier long before it feels dramatic.`, 'Choose one repeatable daily or weekly habit that would improve the relationship climate.')
    ],
    commonMistakes: ['Communicating only when upset', 'Using vague or reactive language', 'Letting resentment build quietly', 'Avoiding boundaries until things escalate'],
    frameworkTitle: 'A healthier relationship framework',
    frameworkSteps: ['Communicate clearly', 'Notice patterns early', 'Use boundaries with respect', 'Repair after difficult moments', 'Build steady habits'],
    checklist: ['Are conversations specific and respectful?', 'Are emotional triggers being noticed earlier?', 'Are boundaries clear?', 'Is trust being protected in small moments?', 'Do you have one regular relationship check-in habit?'],
    resources: ['Relationship journaling prompts', 'Communication practice tools', 'Professional support if more serious relationship help is needed'],
    deliveryNote: 'Educational relationship guide — not therapy, diagnosis, or mental health treatment advice.'
  });
}

function parentingProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'parenting-guides',
    valueProp,
    description: `A supportive parenting handbook focused on ${focus.toLowerCase()} with practical routines, calmer structure, and educational family habits.`,
    disclaimerType: 'parenting',
    searchTerms: ['parenting', 'routine', 'children', focus.toLowerCase()],
    whatInside: ['Supportive routine and structure ideas', 'Practical parent-led communication habits', 'Common home habit mistakes to watch for', 'Simple frameworks that make day-to-day parenting clearer'],
    chapters: [
      chapter('Start with a calmer structure', `Why ${focus.toLowerCase()} improves when the home rhythm is clearer`, `Children usually respond better when expectations, routines, and transitions feel more predictable. The aim is not rigid control. It is steadier support.`, ['Keep routines simple', 'Use clarity more than intensity', 'Make expectations visible'], `Many behaviour or learning struggles feel heavier when the day itself is unclear or constantly shifting.`, 'Choose one daily transition that needs a clearer routine.'),
      chapter('Use repetition well', 'Children usually learn through consistent patterns', `Parenting often becomes easier when small patterns are repeated calmly. A clear repeated habit usually teaches more than occasional big lectures.`, ['Repeat the same cue or rhythm', 'Keep instructions simple', 'Reinforce with consistency'], `Children often respond faster when the adult message stays predictable and calm.`, 'Use one repeated phrase or cue for the routine you want to strengthen.'),
      chapter('Support without overloading', 'Helpful parenting often looks steady rather than dramatic', `Parents often feel pressure to solve everything quickly. In practice, progress often comes from reducing overload, improving the environment, and staying consistent with a few key habits.`, ['Avoid too many changes at once', 'Focus on one family habit first', 'Support the child without creating constant tension'], `A home routine usually improves when the adult stops trying to fix every issue simultaneously.`, 'Choose one routine or behaviour goal for the next two weeks.'),
      chapter('Avoid common parenting mistakes', 'Where good intentions can still create friction', `Parents often lose momentum by being inconsistent, overexplaining when the child needs clarity, or using screens and rewards without a longer-term plan.`, ['Avoid mixed expectations', 'Avoid constant negotiation in every moment', 'Avoid reacting differently each day to the same issue'], `Children usually feel safer when the response pattern is more stable.`, 'Identify one inconsistency that keeps repeating and simplify it.'),
      chapter('Build a more supportive home system', 'The home works better when habits are easier to keep', `A strong parenting rhythm supports the child and lowers stress for the adult too. The point is to create a home system that feels calmer, clearer, and more supportive over time.`, ['Use visual cues where helpful', 'Keep routines reviewable', 'Protect the habits that make the biggest difference'], `The best home systems reduce friction for everyone instead of relying on repeated last-minute correction.`, 'Use this guide to tighten the one home routine that matters most right now.')
    ],
    commonMistakes: ['Changing expectations too often', 'Overloading the child with too many instructions', 'Using inconsistent responses', 'Trying to solve too many habits at once'],
    frameworkTitle: 'A calmer parenting routine framework',
    frameworkSteps: ['Choose one habit or routine to improve', 'Make expectations simple and visible', 'Repeat calmly', 'Review what is working', 'Adjust one piece at a time'],
    checklist: ['Is the routine clear?', 'Are expectations consistent?', 'Is the home response calmer and more predictable?', 'Are you focusing on one priority first?', 'Is the child being supported rather than overloaded?'],
    resources: ['Visual routine chart ideas', 'Parent reflection notes', 'Family support resources where additional help is needed'],
    deliveryNote: 'Educational parenting guide only — not diagnostic, medical, or therapeutic advice.'
  });
}

function kidsLearningProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'kids-learning-development',
    valueProp,
    description: `A practical home-learning handbook for supporting ${focus.toLowerCase()} with clearer structure, calmer routines, and child-friendly study habits.`,
    disclaimerType: 'parenting',
    searchTerms: ['kids learning', 'focus', 'study', focus.toLowerCase()],
    whatInside: ['How to support learning without overload', 'Better focus-friendly environment ideas', 'Common home-study mistakes', 'Simple routines parents can actually use'],
    chapters: [
      chapter('Start with the environment', `Why ${focus.toLowerCase()} becomes easier when the setup is calmer`, `Children often learn better when the environment is simpler, expectations are clearer, and distraction is reduced without turning learning into constant pressure.`, ['Use a low-friction setup', 'Reduce visible distraction', 'Keep timing predictable'], `A child often looks “unfocused” when the setup around them is too noisy, unclear, or demanding.`, 'Choose one learning space and make it easier to use consistently.'),
      chapter('Use shorter clearer routines', 'Children usually respond better to manageable blocks', `Better learning support often comes from shorter, calmer learning blocks rather than long stressful sessions. The goal is engagement, not exhaustion.`, ['Keep sessions shorter', 'Use clear starting and ending points', 'Build momentum slowly'], `A child who resists long sessions may still respond well to a more manageable rhythm.`, 'Break learning support into smaller blocks with a simple pause plan.'),
      chapter('Support focus more deliberately', 'Focus is easier when adults guide the pattern well', `Focus improves when the child understands what the task is, what success looks like, and when the environment protects attention for a short period.`, ['Use simple task framing', 'Remove one distraction at a time', 'Build concentration gradually'], `Children often focus better when the task is made more visible and more achievable.`, 'Name one task clearly before asking the child to begin.'),
      chapter('Avoid the common home-learning mistakes', 'Where support can accidentally become pressure', `Parents often help too much, expect too much at once, or turn every session into correction. Better learning support is calm, clear, and appropriately paced.`, ['Avoid too much pressure', 'Avoid correcting every tiny detail immediately', 'Avoid making every session feel high-stakes'], `A child usually learns better when correction and encouragement are balanced more thoughtfully.`, 'Choose one way to reduce pressure in the next learning session.'),
      chapter('Make learning support sustainable', 'The goal is a better pattern, not one perfect day', `Home-learning support works best when it becomes a repeatable pattern. Small clear improvements usually help more than big occasional pushes.`, ['Use review and adjustment', 'Protect routine where possible', 'Celebrate clearer effort and engagement'], `A sustainable learning rhythm usually creates more confidence for both child and parent.`, 'Use this guide as a reference whenever the home study routine starts feeling too heavy.')
    ],
    commonMistakes: ['Expecting too much concentration too quickly', 'Using overly long sessions', 'Correcting too aggressively', 'Changing routines too often'],
    frameworkTitle: 'A better home-learning support framework',
    frameworkSteps: ['Improve the environment', 'Use shorter learning blocks', 'Clarify the task', 'Reduce pressure', 'Review and repeat'],
    checklist: ['Is the learning space calm enough?', 'Are study blocks short and manageable?', 'Does the child understand the task clearly?', 'Are you reducing pressure where possible?', 'Is the routine sustainable week to week?'],
    resources: ['Printable study routine sheets', 'Learning environment checklists', 'School support conversations and teacher notes'],
    deliveryNote: 'Educational home-learning guide only — not diagnostic or clinical advice.'
  });
}

function studyProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'study-success',
    valueProp,
    description: `A structured study handbook for improving ${focus.toLowerCase()} with better revision structure, focus habits, and planning.`,
    disclaimerType: 'general',
    searchTerms: ['study', 'revision', 'focus', focus.toLowerCase()],
    whatInside: ['Study methods explained simply', 'Focus and planning strategies', 'Mistakes that waste revision time', 'Useful checklists for stronger study habits'],
    chapters: [
      chapter('Study with a clearer method', `Why ${focus.toLowerCase()} improves when the approach is more structured`, `Students often feel overwhelmed because they spend time around studying without being clear on the method. Stronger results usually come from structure before intensity.`, ['Know the purpose of each study block', 'Use method instead of passive rereading', 'Keep planning visible'], `A student can spend hours “studying” without actually creating much recall or understanding.`, 'Choose one method and use it on purpose instead of mixing everything together.'),
      chapter('Use revision more actively', 'Better retention usually comes from better engagement', `Study becomes more effective when the learner retrieves, explains, tests, and applies material rather than only seeing it repeatedly.`, ['Use recall-based methods', 'Break large topics into smaller pieces', 'Review understanding, not only exposure'], `Passive rereading often feels productive but creates weaker memory than active practice.`, 'Turn one topic into a short active recall session today.'),
      chapter('Protect focus properly', 'Concentration improves when the session is designed better', `Focus is not only about willpower. The study environment, timing, and task design all affect whether attention stays usable.`, ['Reduce distraction before starting', 'Use manageable study blocks', 'Make the task specific'], `A lot of procrastination is really task vagueness combined with easy distraction.`, 'Write the exact task for the next study block before you begin.'),
      chapter('Avoid the common study mistakes', 'Why effort often feels high but results stay weaker than expected', `Students often leave studying too late, use weak methods, or build revision around panic instead of planning. Better study habits usually feel calmer and more deliberate.`, ['Avoid passive repetition', 'Avoid huge last-minute sessions', 'Avoid vague planning'], `A better routine usually lowers stress because the learner knows what the study session is meant to achieve.`, 'Replace one low-value revision habit with a stronger method this week.'),
      chapter('Turn studying into a repeatable routine', 'Longer-term success comes from cleaner habits', `Good study systems make it easier to return to the work consistently. The goal is not burnout. It is better progress through a stronger routine.`, ['Use a weekly study map', 'Track what actually gets done', 'Review what methods are working'], `A student who understands their study system often feels calmer before exams because less is left to guesswork.`, 'Use this guide to create a repeatable weekly revision structure.')
    ],
    commonMistakes: ['Rereading too passively', 'Leaving revision too late', 'Studying without a clear method', 'Trying to focus in a weak environment'],
    frameworkTitle: 'A stronger study framework',
    frameworkSteps: ['Choose the right method', 'Use active revision', 'Protect focus', 'Review progress weekly', 'Adjust weak points early'],
    checklist: ['Do you know the aim of this study block?', 'Are you using active revision?', 'Is the environment helping or hurting focus?', 'Are you planning before pressure spikes?', 'Are you reviewing what methods work best?'],
    resources: ['Revision timetables', 'Flashcard or recall tools', 'Exam board specifications and official learning resources'],
    deliveryNote: 'Educational guide for stronger study habits, planning, and revision techniques.'
  });
}

function constructionProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'construction-business',
    valueProp,
    description: `A builder-focused business handbook for improving ${focus.toLowerCase()} with clearer positioning, better trust, and stronger client systems.`,
    disclaimerType: 'construction',
    searchTerms: ['construction business', 'builder leads', 'quotes', focus.toLowerCase()],
    whatInside: ['Lead, trust, and communication basics in builder-friendly language', 'Mistakes that usually weaken quotes or local growth', 'Simple systems for follow-up, referrals, and better-fit clients', 'UK-aware educational guidance without legal certainty claims'],
    chapters: [
      chapter('Understand the real growth problem', `Why ${focus.toLowerCase()} is rarely solved by noise alone`, `Construction businesses often assume growth is mainly about getting more attention. In reality, the issue is usually a mix of positioning, trust, speed, and whether the right clients understand the business clearly.`, ['Lead quality matters more than random volume', 'Clear positioning improves trust', 'Fast follow-up protects serious enquiries'], `A builder can be highly skilled but still lose work because the business looks too broad, too slow, or too uncertain before the quote is even reviewed.`, 'Define the type of jobs and clients you actually want more of first.'),
      chapter('Make the business easier to trust', 'Trust signals often matter before price is judged', `Clients usually notice process clarity, proof of work, communication, and responsiveness before they decide whether the builder feels reliable enough.`, ['Use visible project proof', 'Explain the process clearly', 'Reduce client uncertainty early'], `A cleaner trust system can improve conversion without changing anything about workmanship itself.`, 'Review the visible trust signals across your website, social pages, and quote process.'),
      chapter('Use better quote and follow-up habits', 'A lot of work is lost after the initial conversation', `Many construction businesses leak work after the first conversation because the quote process feels too passive or too unclear. Better follow-up usually improves conversion quality.`, ['Clarify next steps', 'Follow up on a timeline', 'Answer the confidence questions clients actually have'], `A good site visit can still turn into a lost job if the quote process does not maintain trust.`, 'Create one simple quote follow-up sequence and use it every time.'),
      chapter('Avoid the common business mistakes', 'Where growth is usually weakened', `Weak growth often comes from mixed positioning, inconsistent proof, slow response habits, and failing to use old jobs to create new trust.`, ['Avoid broad vague messaging', 'Avoid waiting too long to follow up', 'Avoid underusing referrals and testimonials'], `Many builders underuse the strongest marketing assets they already have: completed work, past client trust, and clear communication.`, 'Pick one weak business system and tighten it this week.'),
      chapter('Build a steadier local growth system', 'The goal is cleaner momentum, not chaos', `A better construction business system should create a steadier rhythm of leads, quotes, follow-up, and referral opportunities without making the business feel louder or more chaotic.`, ['Use repeatable local growth habits', 'Track where leads come from', 'Keep the best-fit client in mind'], `Small system improvements often do more for local growth than random bursts of marketing spend.`, 'Use this guide to build one repeatable weekly business-growth rhythm.')
    ],
    commonMistakes: ['Waiting too long to follow up quotes', 'Trying to market too broadly', 'Not showing enough proof of process or results', 'Leaving referrals to chance instead of using a system'],
    frameworkTitle: 'A construction business growth framework',
    frameworkSteps: ['Clarify positioning', 'Strengthen trust signals', 'Improve quote follow-up', 'Use referrals deliberately', 'Review lead quality regularly'],
    checklist: ['Is the main trade focus clear?', 'Do clients see enough proof?', 'Is there a follow-up process for quotes?', 'Are referrals being asked for at the right time?', 'Are you reviewing lead quality rather than only volume?'],
    resources: ['Local business listing and review tools', 'Project photo and testimonial systems', 'Official UK guidance placeholders and local authority references where relevant'],
    deliveryNote: 'Educational construction business guide only — always verify legal, planning, regulatory, and local council matters through official sources.'
  });
}

function productivityProduct(slug: string, title: string, valueProp: string, focus: string): CollectionProduct {
  return buildProduct({
    slug,
    title,
    categorySlug: 'productivity-routine',
    valueProp,
    description: `A structured productivity handbook for improving ${focus.toLowerCase()} with better planning, focus protection, and realistic routine design.`,
    disclaimerType: 'general',
    searchTerms: ['productivity', 'routine', 'time management', focus.toLowerCase()],
    whatInside: ['A clearer explanation of the productivity issue', 'Practical planning and focus structures', 'Common burnout or inefficiency patterns', 'A repeatable checklist for better daily execution'],
    chapters: [
      chapter('Start with a cleaner structure', `Why ${focus.toLowerCase()} works better with a realistic plan`, `Productivity improves when the day has clearer priorities and fewer hidden decisions. Many people work hard but still feel behind because the structure itself is weak.`, ['Clarify what matters today', 'Protect the first high-value task', 'Reduce unnecessary decision load'], `A person often feels unproductive not because they did nothing, but because the day was shaped by reaction rather than intention.`, 'Choose the one task that would make the day feel meaningfully better if completed.'),
      chapter('Protect focus better', 'Attention needs support, not only pressure', `Focus is easier when the task is defined, the environment is cleaner, and interruptions are reduced in advance. Good productivity design reduces leak points before work begins.`, ['Use clearer work blocks', 'Reduce task switching', 'Start with a specific outcome'], `A lot of wasted time is really the cost of weak focus design rather than a lack of effort.`, 'Write down the exact output needed before starting a focus block.'),
      chapter('Plan with more realism', 'Better plans usually look simpler', `Planning becomes useful when it reflects actual time, energy, and capacity. Overloading the day often creates frustration more than progress.`, ['Underplan slightly', 'Leave room for admin and interruption', 'Protect recovery and transition time'], `A more realistic plan often leads to more completed work because less of the day is based on fantasy.`, 'Review your task list and cut what does not truly fit today.'),
      chapter('Avoid the common productivity traps', 'Where people quietly lose time and momentum', `Common problems include multitasking, vague lists, overloading, and using pressure as the only productivity tool. A better system should feel clearer and calmer.`, ['Avoid vague task lists', 'Avoid constant checking and switching', 'Avoid building routines that require perfect energy'], `People often think they need more motivation when they really need a better system for execution.`, 'Replace one vague task with a defined next action.'),
      chapter('Build a repeatable routine', 'The goal is useful momentum without burnout', `A stronger routine should support focus, planning, and recovery together. Sustainable productivity feels cleaner, not endlessly intense.`, ['Use start and end rituals', 'Review the day honestly', 'Improve one routine weakness each week'], `Good routines reduce restart friction and make useful work easier to repeat.`, 'Use this guide to set a realistic daily and weekly productivity rhythm.')
    ],
    commonMistakes: ['Overloading the day', 'Switching tasks too often', 'Using vague task lists', 'Treating productivity like constant intensity'],
    frameworkTitle: 'A calmer productivity framework',
    frameworkSteps: ['Set the priority clearly', 'Protect a focus block', 'Use realistic planning', 'Review weak points', 'Repeat the strongest routine elements'],
    checklist: ['Is the key task clear?', 'Have you protected focus time?', 'Is the plan realistic?', 'Are tasks specific enough to start?', 'Is the routine sustainable without burnout?'],
    resources: ['Planning templates', 'Focus timers and block scheduling tools', 'Weekly review worksheets'],
    deliveryNote: 'Educational guide for stronger productivity habits and more realistic routines.'
  });
}

const rawCollectionProducts: CollectionProduct[] = [
  tradingProduct('beginner-trading-basics', 'Trading Foundations Guide', 'A stronger beginner foundation for understanding charts, structure, and safer early trading habits.', 'trading foundations'),
  tradingProduct('candlestick-basics-explained', 'Candlestick Reading Guide', 'Understand candlestick language, chart behaviour, and what price action is actually showing.', 'candlestick reading'),
  tradingProduct('risk-management-for-beginners', 'Risk Management Blueprint for Beginners', 'Learn why downside control matters more than chasing exciting setups or quick wins.', 'risk management'),

  cryptoProduct('crypto-beginner-starter-guide', 'Crypto Starter Guide', 'A safer starting point for understanding crypto basics without hype or confusion.', 'crypto basics'),
  cryptoProduct('how-crypto-wallets-work', 'Understanding Wallets, Exchanges & Safety', 'Learn wallet basics, exchange roles, storage thinking, and cleaner security habits.', 'wallets, exchanges, and crypto safety'),
  cryptoProduct('common-crypto-mistakes-beginners-make', 'Crypto Mistakes Beginners Must Avoid', 'Understand the avoidable errors that catch new users early and weaken confidence fast.', 'common crypto mistakes'),

  moneyProduct('budgeting-for-beginners', 'Smart Budgeting Blueprint', 'A practical budgeting handbook that feels clear enough to use every week.', 'smart budgeting'),
  moneyProduct('stop-overspending-guide', 'Stop Overspending Workbook', 'A behaviour-focused handbook for understanding spending triggers and reducing money leaks.', 'stopping overspending'),
  moneyProduct('30-day-money-reset', 'Money Reset Guide', 'A structured handbook for stabilising money habits over the next month.', 'a money reset'),

  sideHustleProduct('beginner-side-hustle-ideas', 'Side Hustle Ideas Handbook', 'A clearer way to compare side-hustle options and judge them with more realism.', 'beginner side hustle ideas'),
  sideHustleProduct('how-to-choose-the-right-side-hustle', 'How to Choose the Right Side Hustle', 'Use a clearer filter before committing time and energy.', 'choosing the right side hustle'),
  sideHustleProduct('side-hustle-setup-basics', 'Side Hustle Setup Handbook', 'Learn the early setup steps that make a small venture feel more real and more organised.', 'side hustle setup basics'),

  businessStarterProduct('how-to-start-a-small-service-business', 'How to Start a Small Service Business', 'Start with a clearer offer, cleaner positioning, and stronger basics.', 'starting a small service business'),
  businessStarterProduct('first-client-blueprint', 'First Client Blueprint', 'A clearer path to first clients without overcomplicating outreach or trust-building.', 'winning your first client'),
  businessStarterProduct('pricing-your-service-properly', 'Pricing Your Service Properly', 'Understand pricing with more confidence and less panic discounting.', 'pricing your service properly'),

  careerProduct('cv-improvement-guide', 'CV Upgrade Handbook', 'Improve clarity, relevance, and credibility across your CV.', 'cv improvement'),
  careerProduct('interview-confidence-guide', 'Interview Confidence Handbook', 'Prepare better, speak more clearly, and feel calmer in interviews.', 'interview confidence'),
  careerProduct('career-growth-habits', 'Career Growth Habits', 'Build the habits that support better long-term professional progress.', 'career growth habits'),

  socialProduct('instagram-growth-basics', 'Instagram Growth Structure Guide', 'A clearer structure for content, consistency, and audience growth on Instagram.', 'instagram growth'),
  socialProduct('content-planning-for-beginners', 'Content Planning Handbook', 'Make planning easier so consistency feels more realistic and more organised.', 'content planning'),
  socialProduct('social-media-mistakes-that-kill-growth', 'Social Media Mistakes That Kill Growth', 'Spot the patterns that flatten reach, trust, and momentum.', 'social media mistakes'),

  personalBrandProduct('personal-brand-starter-guide', 'Personal Brand Foundations', 'Build a clearer message and stronger identity from the start.', 'building a personal brand'),
  personalBrandProduct('build-your-online-presence', 'Build Your Online Presence', 'Use clearer profile signals and stronger content habits online.', 'building your online presence'),
  personalBrandProduct('clear-positioning-for-creators-and-professionals', 'Clear Positioning for Creators and Professionals', 'Sharpen how people understand what you do and why it matters.', 'clear positioning'),

  fitnessProduct('fat-loss-starter-guide', 'Fat Loss Foundations Handbook', 'fat-loss', 'Educational foundations for creating a steadier fat-loss routine.', 'fat-loss basics'),
  fitnessProduct('better-fat-loss-habits', 'Fat Loss Habit Reset', 'fat-loss', 'Use more realistic food and routine habits that support consistency.', 'fat-loss habits'),
  fitnessProduct('common-fat-loss-mistakes', 'Fat Loss Mistakes to Fix', 'fat-loss', 'Spot the avoidable routine and mindset errors that slow progress.', 'fat-loss mistakes'),

  fitnessProduct('muscle-gain-basics', 'Muscle Gain Foundations Handbook', 'muscle-gain', 'Build a clearer understanding of training, food, and recovery basics.', 'muscle-gain basics'),
  fitnessProduct('beginner-gym-structure-guide', 'Beginner Gym Structure Guide', 'muscle-gain', 'A cleaner starting point for organising gym sessions properly.', 'beginner gym structure'),
  fitnessProduct('eating-for-muscle-gain-basics', 'Eating for Muscle Gain Handbook', 'muscle-gain', 'Understand food structure for muscle gain without overcomplication.', 'eating for muscle gain'),

  groomingProduct('mens-skin-routine-starter-guide', 'Men’s Skin Routine Handbook', 'A clearer daily structure for cleaner skin habits and better product order.', 'men’s skin routine'),
  groomingProduct('mens-haircare-basics', 'Men’s Haircare Handbook', 'Understand cleaner haircare, maintenance, and everyday routine decisions.', 'men’s haircare'),
  groomingProduct('beard-and-grooming-guide', 'Beard & Grooming Guide', 'Better beard maintenance, grooming order, and upkeep habits.', 'beard grooming'),
  groomingProduct('mens-glow-up-habits-guide', 'Men’s Glow-Up Habits Handbook', 'Sharpen the daily habits that improve appearance, presence, and routine quality.', 'men’s appearance habits'),

  skincareProduct('womens-skincare-basics', 'Women’s Skincare Foundations', 'A premium introduction to routine order, product categories, and calmer skincare habits.', 'women’s skincare basics'),
  skincareProduct('skincare-for-oily-skin', 'Clear Skin Routine for Oily Skin', 'A skin-type-specific handbook for managing oily-skin routines more clearly.', 'oily skin support'),
  skincareProduct('skincare-for-dry-skin', 'Nourishing Routine for Dry Skin', 'A more supportive routine for dry skin with calmer product choices and better order.', 'dry skin support'),
  skincareProduct('skincare-for-combination-skin', 'Balanced Routine for Combination Skin', 'Understand how to support different skin needs more thoughtfully.', 'combination skin support'),
  skincareProduct('skincare-for-sensitive-skin', 'Calmer Routine for Sensitive Skin', 'Use a calmer routine and avoid common sensitive-skin mistakes.', 'sensitive skin support'),

  mindsetProduct('discipline-builder-guide', 'Discipline Builder Guide', 'A more practical way to build discipline without fake intensity.', 'discipline building'),
  mindsetProduct('stop-procrastination-guide', 'Stop Procrastination Guide', 'Understand procrastination patterns and build a cleaner response system.', 'stopping procrastination'),
  mindsetProduct('stronger-daily-habits-guide', 'Daily Habits Structure Guide', 'Create a routine structure that supports better follow-through.', 'stronger daily habits'),

  confidenceProduct('confidence-reset-guide', 'Confidence Reset Guide', 'Build steadier confidence through behaviour, not empty hype.', 'confidence reset'),
  confidenceProduct('self-respect-habits', 'Self-Respect Habits', 'Improve the habits that make self-trust and confidence stronger.', 'self-respect habits'),
  confidenceProduct('better-communication-confidence', 'Better Communication Confidence', 'Speak more clearly and show up with more grounded presence.', 'communication confidence'),

  relationshipProduct('better-communication-in-relationships', 'Relationship Communication Handbook', 'A respectful structure for speaking and listening more clearly.', 'relationship communication'),
  relationshipProduct('healthy-relationship-habits', 'Healthy Relationship Habits', 'Use stronger daily habits to support trust and steadier connection.', 'healthy relationship habits'),
  relationshipProduct('dating-confidence-and-self-respect-guide', 'Dating Confidence & Self-Respect Guide', 'Approach dating with stronger standards, confidence, and clarity.', 'dating confidence and self-respect'),

  parentingProduct('parenting-for-better-routine-and-discipline', 'Parenting for Better Routine & Discipline', 'Create calmer structure and clearer expectations at home.', 'better routine and discipline at home'),
  parentingProduct('helping-children-learn-better-at-home', 'Helping Children Learn Better at Home', 'Support learning with simpler home routines and less friction.', 'learning better at home'),
  parentingProduct('building-confidence-in-children', 'Building Confidence in Children', 'Use supportive daily habits that help confidence grow more steadily.', 'building confidence in children'),
  parentingProduct('better-screen-time-and-daily-habit-guide', 'Better Screen-Time and Daily Habit Guide', 'Create healthier screen habits and stronger daily structure at home.', 'screen-time and daily habits'),

  kidsLearningProduct('helping-kids-focus-better', 'Helping Kids Focus Better', 'Practical home-learning ideas for supporting focus more calmly.', 'helping kids focus better'),
  kidsLearningProduct('learning-habits-for-children', 'Learning Habits for Children', 'Build stronger child-friendly study and routine habits at home.', 'learning habits for children'),
  kidsLearningProduct('better-home-study-support-for-kids', 'Better Home Study Support for Kids', 'Support study time without overload or constant pressure.', 'home study support for kids'),

  studyProduct('study-smarter-guide', 'Study Smarter Guide', 'Use clearer methods so study time becomes more productive.', 'studying smarter'),
  studyProduct('revision-strategy-basics', 'Revision Strategy Handbook', 'A clearer structure for building better revision method and consistency.', 'revision strategy'),
  studyProduct('focus-and-memory-study-habits', 'Focus & Memory Study Habits', 'Improve concentration and recall with better study habits.', 'focus and memory study habits'),

  constructionProduct('getting-more-construction-leads', 'Construction Leads Handbook', 'A builder-friendly structure for stronger local lead flow and cleaner enquiry quality.', 'getting more construction leads'),
  constructionProduct('better-builder-quote-follow-up-guide', 'Better Builder Quote Follow-Up Guide', 'Improve conversion by tightening the quote and follow-up process.', 'builder quote follow-up'),
  constructionProduct('construction-business-basics', 'Construction Business Foundations', 'A practical growth foundation for trades and contractor businesses.', 'construction business basics'),
  constructionProduct('winning-better-clients-as-a-builder', 'Winning Better Clients as a Builder', 'Attract more serious clients with stronger trust, messaging, and proof.', 'winning better clients'),

  productivityProduct('daily-routine-reset', 'Daily Routine Reset', 'Reset the day with a cleaner structure and stronger habits.', 'daily routine reset'),
  productivityProduct('time-management-basics', 'Time Management Handbook', 'A clearer system for using time more deliberately and realistically.', 'time management basics'),
  productivityProduct('productivity-without-burnout', 'Productivity Without Burnout', 'Build stronger output while protecting energy and consistency.', 'productivity without burnout')
] as CollectionProduct[];

function normalizeCollectionProduct(product: CollectionProduct): CollectionProduct {
  return {
    ...product,
    slug: product.slug.trim(),
    title: product.title.trim(),
    description: product.description.trim(),
    valueProp: product.valueProp.trim(),
    categorySlug: product.categorySlug.trim(),
    downloadFileKey: product.downloadFileKey?.trim() || product.slug.trim(),
    fileVersion: product.fileVersion?.trim() || 'v1',
    emailTemplateKey: product.emailTemplateKey?.trim() || 'collection-guide'
  };
}

function validateCollectionCatalog(categories: CollectionCategory[], products: CollectionProduct[]) {
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const seenSlugs = new Set<string>();

  return products
    .map(normalizeCollectionProduct)
    .filter((product) => {
      if (seenSlugs.has(product.slug)) {
        console.warn(`[Growth Library] Duplicate product slug skipped: ${product.slug}`);
        return false;
      }

      if (!categoryMap.has(product.categorySlug)) {
        console.warn(
          `[Growth Library] Product skipped because category is missing: ${product.slug} -> ${product.categorySlug}`
        );
        return false;
      }

      const missingCoreFields =
        !product.slug ||
        !product.title ||
        !product.description ||
        !product.valueProp ||
        !product.downloadFileKey ||
        !product.fileVersion;

      if (missingCoreFields) {
        console.warn(`[Growth Library] Product skipped because required fields are incomplete: ${product.slug}`);
        return false;
      }

      seenSlugs.add(product.slug);
      return true;
    })
    .sort((left, right) => {
      if (left.categorySlug === right.categorySlug) {
        return left.title.localeCompare(right.title);
      }

      return left.categorySlug.localeCompare(right.categorySlug);
    });
}

export const collectionProducts = validateCollectionCatalog(collectionCategories, rawCollectionProducts);

export function getCollectionCategoryBySlug(slug: string) {
  return collectionCategories.find((category) => category.slug === slug);
}

export function getCollectionProductBySlug(slug: string) {
  return collectionProducts.find((product) => product.slug === slug);
}

export function getCollectionProductsByCategory(categorySlug: string) {
  return collectionProducts.filter((product) => product.categorySlug === categorySlug);
}
