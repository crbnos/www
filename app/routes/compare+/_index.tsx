import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { getComparisons } from "~/lib/compare";
import { pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

export const config = {
  runtime: "edge",
};

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
  "font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
  "font-display font-semibold tracking-[-0.035em] leading-[0.95] text-[clamp(2.125rem,4.4vw,3.875rem)]";

export const meta: MetaFunction = ({ matches }) =>
  pageMeta(matches, {
    title: "Compare Carbon to other manufacturing software",
    description:
      "How Carbon — an open-source, API-first manufacturing platform with ERP, MRP, MES and QMS on one data model — compares to NetSuite, Manufacturo, Fulcrum and other manufacturing software.",
  });

export default function CompareIndex() {
  const comparisons = getComparisons();

  return (
    <section className="py-24 sm:py-28">
      <div className={shell}>
        <div className={eyebrow}>Compare</div>
        <h1 className={cn(heading, "mt-5 max-w-[18ch]")}>
          Carbon, next to the alternatives.
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
          One platform for ERP, MRP, MES and QMS on a single data model —
          open-source, API-first, and priced in the open. Here's how it stacks
          up against the software manufacturers usually weigh it against.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((c) => (
            <Link
              key={c.slug}
              to={`/compare/${c.slug}`}
              prefetch="intent"
              className="group flex flex-col bg-card p-8 transition-colors hover:bg-muted"
            >
              <div className={eyebrow}>{c.category}</div>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">
                {c.headline}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {c.subheadline}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                See the comparison
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
