import {
  ArrowRight,
  BookOpenText,
  CheckSquare,
  Download,
  FileText,
  LayoutPanelTop,
  Mail,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Workflow
} from 'lucide-react';
import { CollectionBrowser } from '@/components/collection/collection-browser';
import { Badge } from '@/components/shared/badge';
import { ButtonLink } from '@/components/shared/button';
import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { collectionCategories, collectionProducts } from '@/lib/collection/catalog';

const collectionFaqs = [
  {
    question: 'Are these PDFs instant delivery?',
    answer: 'Yes. Once payment is confirmed, the PDF is prepared immediately, shown on the success page, and sent to the buyer by email.'
  },
  {
    question: 'Are these the same as the personalized AI reports?',
    answer: 'No. Growth Library contains fixed premium handbooks. The personalized AI reports are a separate custom product built around a user’s answers.'
  },
  {
    question: 'How detailed are the handbooks?',
    answer: 'Each handbook is built with a minimum 10-page standard, stronger topic depth, practical examples, routines, frameworks, and next-step structure.'
  },
  {
    question: 'Do some handbooks include educational disclaimers?',
    answer: 'Yes. Topics like finance, trading, crypto, fitness, skincare, parenting, and construction include safe educational framing where needed.'
  }
];

const heroBullets = [
  'Detailed 10+ page handbooks',
  'Examples, routines, and practical tasks',
  'Instant email delivery',
  'Premium format, clear structure',
  'Built for real-life use, not filler'
];

const insideGuideCards = [
  {
    title: 'Clear breakdowns',
    description: 'Topics are taught in a chapter-by-chapter format so the reader can follow the logic without noise.',
    icon: LayoutPanelTop
  },
  {
    title: 'Real examples',
    description: 'Worked examples make the topic easier to picture and apply instead of leaving it abstract.',
    icon: FileText
  },
  {
    title: 'Action steps',
    description: 'Each handbook points the reader toward specific tasks, decisions, and next moves.',
    icon: CheckSquare
  },
  {
    title: 'Routines & checklists',
    description: 'Useful routines, review prompts, and checklists help turn the content into real follow-through.',
    icon: Workflow
  },
  {
    title: 'Premium presentation',
    description: 'Clean A4 layouts, stronger hierarchy, and a more serious reading experience from cover to finish.',
    icon: ScrollText
  }
];

export default function CollectionPage() {
  // Headline options kept here for quick testing:
  // 1. Premium digital guides designed to help you learn clearly, act smarter, and move forward faster.
  // 2. In-depth digital handbooks for people who want useful guidance, not shallow advice.
  const heroHeadline = 'Structured premium guides for smarter money, better habits, stronger skills, and practical growth.';

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="space-y-10">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <Badge>GROWTH LIBRARY</Badge>
              <div className="space-y-5">
                <h1 className="max-w-5xl font-display text-5xl tracking-tight text-navy-950 sm:text-6xl lg:text-7xl lg:leading-[1.02]">
                  {heroHeadline}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Browse a premium library of detailed digital guides built to teach properly, explain clearly, and give you practical next steps. Every guide is designed to feel useful, complete, and worth returning for.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {heroBullets.map((item) => (
                  <div key={item} className="inline-flex items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-soft">
                    <Sparkles className="h-4 w-4 text-navy-950" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="#collection-grid">
                  Browse the library
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/categories" variant="secondary">
                  View personalized reports
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-premium sm:p-9">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">What makes these guides different</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-navy-950 sm:text-[2.6rem]">
                Built to be genuinely useful
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Each guide is designed to teach properly, explain clearly, and leave the reader with something practical to use — not just more information to forget.
              </p>
              <div className="mt-7 space-y-3">
                {[
                  '10+ pages of structured, topic-specific depth',
                  'Clear explanations, not rushed summaries',
                  'Action steps, routines, checklists, and examples',
                  'Built to feel worth buying again in other categories'
                ].map((item) => (
                  <div key={item} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
                  <Mail className="h-4 w-4 text-navy-950" />
                  Instant email delivery
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
                  <Download className="h-4 w-4 text-navy-950" />
                  Success-page download
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
                  <ShieldCheck className="h-4 w-4 text-navy-950" />
                  Secure GBP checkout
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="rounded-[36px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6f8fb_100%)] p-8 shadow-soft sm:p-10">
            <div className="max-w-4xl space-y-5">
              <Badge>Premium Positioning</Badge>
              <h2 className="font-display text-4xl tracking-tight text-navy-950 sm:text-5xl">
                Designed like premium handbooks, not throwaway downloads
              </h2>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                These guides are built for people who want clearer understanding, better structure, and something practical to follow. Instead of vague summaries, each guide is created with stronger explanations, useful examples, common mistakes, action points, and structured next steps so the reader can actually use what they learn.
              </p>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                Whether someone wants better financial habits, stronger business direction, clearer skincare routines, smarter trading basics, or more structure in daily life, the goal is the same: make every guide feel complete, useful, and worth coming back for.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50/80 py-20 sm:py-24">
        <Container className="space-y-12">
          <SectionHeading
            eyebrow="Inside every guide"
            title="Inside every guide"
            description="Every guide is designed to help the reader understand the topic better and know what to do next."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {insideGuideCards.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
                  <Icon className="h-5 w-5 text-navy-950" />
                  <h3 className="mt-5 font-display text-[1.9rem] leading-tight text-navy-950">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="collection-grid" className="py-20 sm:py-24">
        <Container className="space-y-12">
          <SectionHeading
            eyebrow="Library"
            title="A premium handbook library built for practical progress"
            description="Search by topic, browse by category, and pick the handbook that matches the next skill, habit, or business area you want to improve."
          />
          <CollectionBrowser categories={collectionCategories} products={collectionProducts} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <div className="grid gap-8 rounded-[36px] border border-slate-200 bg-white p-8 shadow-premium lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-10">
            <div className="space-y-4">
              <Badge>Why buyers return</Badge>
              <h2 className="font-display text-4xl tracking-tight text-navy-950 sm:text-5xl">
                Built to be worth returning for
              </h2>
              <p className="text-base leading-8 text-slate-600 sm:text-lg">
                The goal is not just to sell one PDF. It is to create guides that feel useful enough that buyers come back for the next one. That means clearer explanations, better structure, stronger examples, and practical value across every category.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Stronger explanations instead of vague summaries',
                'Examples, routines, and checklists that support action',
                'Topic-specific structure so categories feel genuinely different',
                'A more serious reading experience that feels worth keeping'
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-100 bg-slate-50 px-5 py-5 text-sm leading-7 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50/80 py-20 sm:py-24">
        <Container className="space-y-10">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions about Growth Library"
            description="Clear answers for instant-delivery handbooks, checkout, and what buyers should expect from the library."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {collectionFaqs.map((item) => (
              <div key={item.question} className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-soft">
                <h3 className="font-display text-2xl text-navy-950">{item.question}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
