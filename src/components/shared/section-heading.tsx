import type { ReactNode } from "react";
import { Badge } from "@/components/shared/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-4">
        {eyebrow ? <Badge>{eyebrow}</Badge> : null}
        <div className="space-y-3">
          <h2 className="font-display text-4xl tracking-tight text-navy-950 sm:text-5xl">{title}</h2>
          <p className="text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
        </div>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
