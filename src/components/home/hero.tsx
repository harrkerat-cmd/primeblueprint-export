"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/badge";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

const heroBullets = [
  "A report written around your exact goal, not a shared template",
  "Clear next steps for money, fitness, business, social, or construction growth",
  "A private PDF designed to help you move faster with more clarity"
];

const ambitionPoints = [
  "Earn with more direction",
  "Build a stronger body and routine",
  "Choose the right next career or business move",
  "Grow your audience or win better clients"
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(15,39,68,0.13),transparent_34%),radial-gradient(circle_at_top_right,rgba(23,58,97,0.08),transparent_26%),linear-gradient(180deg,#f6f9fd_0%,#ffffff_58%)]" />
      <div className="absolute left-1/2 top-[-180px] -z-10 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(255,255,255,0))] blur-3xl" />
      <Container className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <Badge>Premium personalized reports</Badge>
          <div className="space-y-6">
            <h1 className="max-w-5xl font-display text-5xl tracking-tight text-navy-950 sm:text-6xl lg:text-7xl">
              The private blueprint for your next level
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Whether you want more money, better fitness, a clearer career move, stronger business direction, social growth, or better construction leads, PrimeBlueprint turns your answers into a premium PDF built for your exact next step.
            </p>
            <p className="max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              No generic advice. No recycled template. Your final report is shaped around your focus, your situation, your pace, and what you actually want to improve.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/categories">
              Create My Report
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="secondary">
              See How It Works
            </ButtonLink>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {ambitionPoints.map((item) => (
              <div key={item} className="rounded-[20px] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium text-navy-950 shadow-soft backdrop-blur">
                {item}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroBullets.map((bullet) => (
              <div key={bullet} className="rounded-[24px] border border-white/80 bg-white/75 px-5 py-4 shadow-soft backdrop-blur">
                <p className="text-sm leading-7 text-slate-600">{bullet}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {siteConfig.trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 shadow-soft backdrop-blur">
                  <Icon className="h-4 w-4 text-navy-900" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[42px] bg-[radial-gradient(circle,rgba(15,39,68,0.12),transparent_68%)] blur-3xl" />
          <div className="relative rounded-[36px] border border-white/80 bg-white/86 p-5 shadow-premium backdrop-blur sm:p-6">
            <div className="rounded-[30px] bg-[linear-gradient(180deg,#0f2744_0%,#173a61_100%)] p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/62">PrimeBlueprint preview</p>
                  <p className="mt-3 font-display text-3xl">Finance Reset Blueprint for Amelia Reed</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/72">
                  Starter and Premium available
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] border border-white/10 bg-white/7 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.26em] text-white/55">Visible first page</p>
                      <p className="mt-2 text-sm text-white/72">Category, priorities, and first recommendations</p>
                    </div>
                    <Sparkles className="h-5 w-5 text-white/65" />
                  </div>
                  <div className="mt-6 space-y-3 rounded-[22px] border border-white/10 bg-white p-5 text-slate-700">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Prepared for Amelia Reed</p>
                    <h3 className="font-display text-3xl text-navy-950">A smarter route to more control and income growth</h3>
                    <p className="text-sm leading-7 text-slate-600">
                      Clear money priorities, better discipline, stronger decisions, and a weekly plan shaped around her answers instead of one generic finance guide.
                    </p>
                    <div className="space-y-2 pt-1">
                      <div className="h-2.5 rounded-full bg-slate-100" />
                      <div className="h-2.5 rounded-full bg-slate-100" />
                      <div className="h-2.5 w-4/5 rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((page) => (
                    <div key={page} className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/8 p-4">
                      <div className="absolute inset-0 bg-white/35 backdrop-blur-sm" />
                      <div className="relative space-y-3 blur-[1.5px]">
                        <div className="h-2.5 w-24 rounded-full bg-white/35" />
                        <div className="h-2.5 rounded-full bg-white/20" />
                        <div className="h-2.5 rounded-full bg-white/20" />
                        <div className="h-2.5 w-3/5 rounded-full bg-white/20" />
                      </div>
                    </div>
                  ))}
                  <div className="rounded-[24px] border border-white/12 bg-white/8 p-5">
                    <div className="flex items-start gap-3">
                      <Lock className="mt-1 h-5 w-5 text-white/70" />
                      <div>
                        <p className="font-display text-2xl">Unlock the rest after checkout</p>
                        <p className="mt-2 text-sm leading-7 text-white/72">
                          The full PDF includes strategy sections, action steps, mistakes to avoid, and a 30-day focus plan built only for the answers chosen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                  <div className="mb-2 inline-flex items-center gap-2 text-white/82">
                    <ShieldCheck className="h-4 w-4" />
                    Secure checkout
                  </div>
                  Stripe-powered payment with a calm success flow and live report status.
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-white/72">
                  <div className="mb-2 inline-flex items-center gap-2 text-white/82">
                    <Sparkles className="h-4 w-4" />
                    Personalized output
                  </div>
                  The cover, sections, and action plan shift with the answers, not one generic template.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
