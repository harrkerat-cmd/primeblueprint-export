"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <Container className="space-y-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Clear answers help the product feel premium, trustworthy, and easy to understand."
        />
        <div className="space-y-4">
          {siteConfig.faqs.map((item, index) => {
            const open = openIndex === index;
            return (
              <button
                key={item.question}
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="w-full rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-3xl text-navy-950">{item.question}</h3>
                  <ChevronDown className={cn("h-5 w-5 text-slate-400 transition", open && "rotate-180")} />
                </div>
                {open ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{item.answer}</p> : null}
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
