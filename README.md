# PrimeBlueprint

PrimeBlueprint is a premium PDF platform with two product lines:

- Personalized AI reports generated from questionnaire answers
- Growth Library fixed digital handbooks with instant checkout and delivery

This repository contains the full Next.js codebase, API routes, PDF rendering system, Stripe checkout flow, webhook handling, Prisma schema, email delivery logic, and supporting configs.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL / Supabase Postgres
- Stripe Checkout + webhooks
- OpenAI API
- Resend email delivery
- Framer Motion
- React Hook Form + Zod
- `pdf-lib` for branded PDF generation

## Main folders

- `src/app` — app pages and API routes
- `src/components` — UI sections, forms, pricing, questionnaire, success states
- `src/config` — categories, packages, site content, construction lead plans
- `src/lib` — report generation, Growth Library generation, PDF system, Stripe, Resend, Prisma, helpers
- `prisma` — schema and seed file
- `supabase` — SQL helpers
- `public` — static assets if added later

## Important app areas

### Website pages

- `src/app/page.tsx`
- `src/app/categories/page.tsx`
- `src/app/questionnaire/[category]/page.tsx`
- `src/app/preview/[requestId]/page.tsx`
- `src/app/pricing/[requestId]/page.tsx`
- `src/app/success/page.tsx`
- `src/app/collection/page.tsx`
- `src/app/collection/[slug]/page.tsx`
- `src/app/collection/success/page.tsx`
- `src/app/how-it-works/page.tsx`
- `src/app/quality/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`

### API routes

- `src/app/api/checkout/route.ts`
- `src/app/api/collection/checkout/route.ts`
- `src/app/api/report-requests/route.ts`
- `src/app/api/report-requests/[requestId]/route.ts`
- `src/app/api/reports/[requestId]/status/route.ts`
- `src/app/api/reports/[requestId]/download/route.ts`
- `src/app/api/collection/purchases/[purchaseId]/status/route.ts`
- `src/app/api/collection/purchases/[purchaseId]/download/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/contact/route.ts`
- `src/app/api/blog/refresh/route.ts`

### Core business logic

- `src/lib/report/builder.ts`
- `src/lib/report/generate.ts`
- `src/lib/report/process.ts`
- `src/lib/report-store.ts`
- `src/lib/collection/catalog.ts`
- `src/lib/collection/content.ts`
- `src/lib/collection/process.ts`
- `src/lib/collection/store.ts`
- `src/lib/pdf/design-system.ts`
- `src/lib/pdf/render-report.ts`
- `src/lib/collection/render-pdf.ts`
- `src/lib/stripe.ts`
- `src/lib/resend.ts`
- `src/lib/prisma.ts`

## Environment setup

1. Copy `.env.example` to `.env`
2. Fill in all required values
3. Do not commit your real `.env`

Required variables:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `BLOG_ADMIN_TOKEN`

## Install

```bash
npm install
```

## Database setup

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to database:

```bash
npm run db:push
```

Optional seed:

```bash
npm run db:seed
```

## Run locally

Start the dev server:

```bash
npm run dev
```

Production build check:

```bash
npx tsc --noEmit
npm run build
```

## Stripe local webhook listener

Use Stripe CLI in test mode and forward events to the app:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Recommended events:

- `checkout.session.completed`
- `checkout.session.expired`

## Test personalized report checkout

1. Start from homepage or categories page
2. Select a category
3. Complete the questionnaire
4. Choose Starter or Premium
5. Complete Stripe Checkout in test mode
6. Wait for webhook confirmation
7. Confirm success page updates
8. Confirm PDF download works
9. Confirm email delivery works

## Test Growth Library checkout

1. Open `/collection`
2. Open any product page
3. Enter email and optional name
4. Complete Stripe Checkout in test mode
5. Confirm success page download works
6. Confirm email delivery works

## Test PDF generation

### Personalized reports

- Requires `OPENAI_API_KEY`
- Triggered after confirmed payment/webhook
- Final PDF is rendered by `src/lib/pdf/render-report.ts`

### Growth Library guides

- Generated from fixed handbook content in `src/lib/collection/content.ts`
- Rendered by `src/lib/collection/render-pdf.ts`

## Test email sending

- Requires `RESEND_API_KEY`
- Requires a valid `RESEND_FROM_EMAIL`
- Delivery logic is in:
  - `src/lib/report/process.ts`
  - `src/lib/collection/process.ts`

## Notes for handoff / redeploy

- The app supports fallback local JSON storage when the database is unavailable for some draft and collection flows
- For production, use a working Postgres/Supabase database and verified Resend domain
- Stripe is set up for Checkout Sessions and webhook-based fulfilment
- The OpenAI key should be added only in deployment environment settings, not committed to source control

## Clean export contents

The export archive should include source and config files such as:

- `src/`
- `prisma/`
- `supabase/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.env.example`
- `README.md`

The export should not include:

- `.env`
- `.next/`
- `node_modules/`
- local store data in `.primeblueprint/`
- OS junk files like `.DS_Store`

## Launch checklist

- Env variables added in deployment platform
- Database reachable from deployment
- Stripe test checkout verified
- Stripe webhook forwarding or production webhook configured
- OpenAI report generation verified
- Resend sender verified
- Success page download verified
- Legal pages reviewed
- Support email confirmed

