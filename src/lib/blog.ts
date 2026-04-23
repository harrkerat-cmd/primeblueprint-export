import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { openai } from "@/lib/openai";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryFocus: string;
  publishedAt: string;
  readTime: string;
  coverLabel: string;
  content: string[];
  aiGenerated: boolean;
};

const storePath = path.join(process.cwd(), ".primeblueprint", "blog-posts.json");

const fallbackPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "why-personalized-pdfs-beat-generic-advice",
    title: "Why personalized PDFs beat generic advice",
    excerpt:
      "A premium report should reflect the user's goal, pace, challenge, and situation - not repeat the same guidance to everyone.",
    categoryFocus: "Product positioning",
    publishedAt: "2026-04-21T09:00:00.000Z",
    readTime: "4 min read",
    coverLabel: "PrimeBlueprint Journal",
    aiGenerated: false,
    content: [
      "Generic advice sounds acceptable until a user tries to act on it. The gap shows up immediately: the steps feel broad, the examples feel disconnected, and the person still has to do the real thinking alone.",
      "That is why PrimeBlueprint is built around a consultation-style flow. The category changes the structure, the answers change the priorities, and the package depth changes how far the final guidance goes.",
      "A finance user trying to reduce debt should not receive the same rhythm, mistakes list, or 30-day focus plan as somebody trying to launch a side hustle. The same applies across fitness, business, social growth, and construction.",
      "The real value of a premium PDF is not only presentation. It is the feeling that the plan understands the person enough to be worth following."
    ]
  },
  {
    id: "blog-2",
    slug: "how-construction-businesses-can-use-a-growth-pdf",
    title: "How construction businesses can actually use a growth PDF",
    excerpt:
      "For trades and contractors, the right PDF should help with leads, quoting, trust, and local visibility - not just motivation.",
    categoryFocus: "Construction growth",
    publishedAt: "2026-04-18T09:00:00.000Z",
    readTime: "5 min read",
    coverLabel: "Construction Insight",
    aiGenerated: false,
    content: [
      "Many construction businesses already know they want more leads. The problem is that most advice stops there and never turns into a repeatable plan.",
      "A better report starts with the trade mix, areas covered, current lead sources, client type preference, and biggest growth bottleneck. That context changes everything.",
      "If the user focuses on extensions and loft conversions, the report should talk about trust signals, quote follow-up, project galleries, referrals, and local credibility. If the user wants more commercial work, the priority stack should look different.",
      "The goal is simple: a PDF that feels useful enough to act on this week, not one more document that gets ignored after download."
    ]
  },
  {
    id: "blog-3",
    slug: "what-makes-a-premium-ai-report-feel-worth-paying-for",
    title: "What makes a premium AI report feel worth paying for",
    excerpt:
      "Design matters, but people really pay for clarity, relevance, structure, and the confidence to take the next step.",
    categoryFocus: "Premium UX",
    publishedAt: "2026-04-15T09:00:00.000Z",
    readTime: "4 min read",
    coverLabel: "Premium UX",
    aiGenerated: false,
    content: [
      "If a report is going to feel premium, it needs more than nice typography. The content has to feel like it belongs to the person who bought it.",
      "That means clear section flow, practical next steps, category-specific reasoning, and a polished finish from cover page to email delivery.",
      "It also helps when the site itself communicates trust: a clean preview, secure checkout language, honest positioning, and proof that the final PDF is different for different users.",
      "Users do not need hype. They need the sense that they are buying a useful plan with real thought behind it."
    ]
  }
];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureStore() {
  await mkdir(path.dirname(storePath), { recursive: true });

  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as BlogPost[];
    if (parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fall through to seed fallback posts
  }

  await writeFile(storePath, JSON.stringify(fallbackPosts, null, 2), "utf8");
  return fallbackPosts;
}

async function savePosts(posts: BlogPost[]) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(posts, null, 2), "utf8");
}

export async function getBlogPosts() {
  const posts = await ensureStore();
  return [...posts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

async function generateAiPosts() {
  if (!openai) {
    return fallbackPosts.map((post, index) => ({
      ...post,
      id: `${post.id}-refresh-${index}`,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString()
    }));
  }

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.2",
    input: [
      "Create 3 premium blog posts for PrimeBlueprint.",
      "Audience: users considering premium personalized PDF reports in finance, fitness, business, social growth, and construction.",
      "Tone: premium, intelligent, warm, concise, high-trust, practical.",
      "Return JSON only with an array called posts.",
      "Each post needs: title, excerpt, categoryFocus, readTime, coverLabel, and content paragraphs (3 to 4 paragraphs).",
      "Avoid hype and spam language. Keep the posts useful and believable."
    ].join("\n")
  });

  const text = response.output_text;
  const parsed = JSON.parse(text) as {
    posts: Array<{
      title: string;
      excerpt: string;
      categoryFocus: string;
      readTime: string;
      coverLabel: string;
      content: string[];
    }>;
  };

  return parsed.posts.slice(0, 3).map((post, index) => ({
    id: randomUUID(),
    slug: toSlug(post.title),
    title: post.title,
    excerpt: post.excerpt,
    categoryFocus: post.categoryFocus,
    publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
    readTime: post.readTime,
    coverLabel: post.coverLabel,
    content: post.content,
    aiGenerated: true
  } satisfies BlogPost));
}

export async function refreshBlogPosts() {
  let posts: BlogPost[];

  try {
    posts = await generateAiPosts();
  } catch {
    posts = fallbackPosts.map((post, index) => ({
      ...post,
      id: `${post.id}-fallback-${index}`,
      publishedAt: new Date(Date.now() - index * 86400000).toISOString()
    }));
  }

  await savePosts(posts);
  return posts;
}
