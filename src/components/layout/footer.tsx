import Link from "next/link";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-14">
      <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.9fr]">
        <div className="space-y-4">
          <p className="font-display text-3xl text-navy-950">{siteConfig.name}</p>
          <p className="max-w-md text-sm leading-7 text-slate-600">{siteConfig.description}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            {siteConfig.assuranceStrip.map((item) => (
              <span key={item.label} className="rounded-full border border-slate-200 px-3 py-2">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-navy-950">Explore</p>
          <Link href="/collection" className="block hover:text-navy-950">
            Growth Library
          </Link>
          <Link href="/categories" className="block hover:text-navy-950">
            Categories
          </Link>
          <Link href="/how-it-works" className="block hover:text-navy-950">
            How It Works
          </Link>
          <Link href="/quality" className="block hover:text-navy-950">
            See the Quality
          </Link>
          <Link href="/blog" className="block hover:text-navy-950">
            Blog
          </Link>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-navy-950">Support</p>
          <p>{siteConfig.email}</p>
          <p>{siteConfig.phone}</p>
          <Link href="/contact" className="block hover:text-navy-950">
            Contact
          </Link>
          <Link href="/privacy" className="block hover:text-navy-950">
            Privacy Policy
          </Link>
          <Link href="/terms" className="block hover:text-navy-950">
            Terms & Conditions
          </Link>
        </div>
      </Container>
    </footer>
  );
}
