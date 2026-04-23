import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const baseClassName =
  "inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900";

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  return (
    <button
      className={cn(
        baseClassName,
        variant === "primary" && "bg-navy-950 text-white shadow-soft hover:-translate-y-0.5 hover:bg-navy-900",
        variant === "secondary" && "border border-slate-200 bg-white text-navy-950 hover:border-slate-300",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  variant = "primary",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        baseClassName,
        variant === "primary" && "bg-navy-950 text-white shadow-soft hover:-translate-y-0.5 hover:bg-navy-900",
        variant === "secondary" && "border border-slate-200 bg-white text-navy-950 hover:border-slate-300",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
