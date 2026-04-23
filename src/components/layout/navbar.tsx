"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/shared/button";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/78 backdrop-blur-2xl">
      <Container className="flex h-24 items-center justify-between gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-4" onClick={() => setIsOpen(false)}>
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-navy-950 text-xl font-semibold text-white shadow-soft">
            PB
          </div>
          <div className="min-w-0">
            <p className="font-display text-[2.15rem] leading-[0.92] tracking-[-0.03em] text-navy-950">
              {siteConfig.name}
            </p>
            <p className="mt-1 whitespace-nowrap text-[0.72rem] uppercase tracking-[0.32em] text-slate-500">
              {siteConfig.tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap text-[0.98rem] font-medium tracking-[-0.01em] transition",
                pathname === item.href ? "text-navy-950" : "text-slate-600 hover:text-navy-950"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/quality" variant="secondary" className="px-6 py-3.5 text-[0.98rem]">
            See the Quality
          </ButtonLink>
          <ButtonLink href="/categories" className="px-6 py-3.5 text-[0.98rem]">
            Create My Report
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-navy-950 shadow-soft lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/96 px-5 py-5 shadow-soft backdrop-blur xl:hidden">
          <Container className="px-0">
            <nav className="flex flex-col gap-2">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-navy-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quality" variant="secondary" onClick={() => setIsOpen(false)}>
                See the Quality
              </ButtonLink>
              <ButtonLink href="/categories" onClick={() => setIsOpen(false)}>
                Create My Report
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
