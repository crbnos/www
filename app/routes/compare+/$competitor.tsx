import { Check, Minus } from "lucide-react";
import { data, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import {
  type CompareValue,
  type Comparison,
  getComparison,
} from "~/lib/compare";
import { pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

export const config = {
  runtime: "edge",
};

const APP_URL = "https://app.carbon.ms";
const GITHUB_URL = "https://github.com/crbnos/carbon";

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
  "font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
  "font-display font-semibold tracking-[-0.035em] leading-[0.95] text-[clamp(2.125rem,4.4vw,3.875rem)]";
const sectionHeading =
  "font-display font-semibold tracking-[-0.03em] text-[clamp(1.5rem,2.6vw,2.25rem)]";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const siteUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  const { competitor } = params;
  // An unknown competitor is a 404, not a crash — the same contract the blog
  // route uses, so an agent reads "wrong URL" rather than "site is broken".
  if (!competitor) throw data(null, { status: 404 });
  const comparison = getComparison(competitor);
  if (!comparison) throw data(null, { status: 404 });

  return data(
    { comparison, siteUrl },
    { headers: { "X-Robots-Tag": "index" } },
  );
}

export const meta: MetaFunction<typeof loader> = ({ data, params, matches }) => {
  const loaderData = data as
    | { comparison: Comparison; siteUrl: string }
    | undefined;
  const comparison = loaderData?.comparison;
  const siteUrl = loaderData?.siteUrl;

  if (!comparison) {
    return pageMeta(matches, {
      title: "Compare Carbon",
      description:
        "How Carbon compares to other manufacturing software. Browse every comparison at carbon.ms/compare.",
    });
  }

  const url = siteUrl ? `${siteUrl}/compare/${params.competitor}` : null;

  // Breadcrumb trail (Home > Compare > Carbon vs. X). Breadcrumb rich results
  // remain fully supported and give these comparison pages an explicit place
  // in the site hierarchy — there is no comparison-specific schema type to add.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Compare",
        item: siteUrl ? `${siteUrl}/compare` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Carbon vs. ${comparison.competitor}`,
        item: url ?? undefined,
      },
    ],
  };

  return pageMeta(matches, {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    extra: [
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { "script:ld+json": breadcrumbSchema },
    ],
  });
};

function Cell({ value, carbon }: { value: CompareValue; carbon?: boolean }) {
  // Booleans carry a short label beside the icon so a Carbon "yes" cell is never
  // a lone checkmark floating in an empty column next to a text-filled rival.
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center gap-2 text-sm leading-snug">
        <Check
          className={cn(
            "size-4 shrink-0",
            carbon ? "text-secondary" : "text-muted-foreground",
          )}
        />
        <span className={carbon ? "font-medium text-foreground" : "text-muted-foreground"}>
          Built in
        </span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 text-sm leading-snug text-muted-foreground">
        <Minus className="size-4 shrink-0 text-muted-foreground/40" />
        <span>Not offered</span>
      </span>
    );
  }
  return (
    <span
      className={cn(
        "text-sm leading-snug",
        carbon ? "font-medium text-foreground" : "text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

export default function Compare() {
  const { comparison: c } = useLoaderData<typeof loader>();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className={shell}>
          <div className={eyebrow}>Compare · {c.category}</div>
          <h1 className={cn(heading, "mt-5")}>{c.headline}</h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {c.subheadline}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="cta">
              <a href={APP_URL}>Start 30-day free trial</a>
            </Button>
            <Button asChild variant="accentOutline" size="cta">
              <Link to="/sales">Talk to us</Link>
            </Button>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
            {c.stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6">
                <dt className="font-display text-3xl font-semibold tracking-[-0.03em]">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-xs leading-snug text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className={shell}>
          <div className={eyebrow}>How they compare</div>
          <h2 className={cn(sectionHeading, "mt-5")}>
            Carbon vs. {c.competitor}, feature by feature
          </h2>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              {/* The Carbon column is highlighted with one continuous tinted
                  <col> rather than per-cell backgrounds, so it reads as a single
                  cohesive lane instead of a stack of disjointed rectangles. */}
              <colgroup>
                <col className="w-[38%]" />
                <col className="w-[31%] bg-secondary/[0.055]" />
                <col className="w-[31%]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border-b border-b-border py-5 pr-6 align-bottom" />
                  <th className="border-t-2 border-t-secondary border-b border-b-border px-5 py-5 align-bottom">
                    <span className="font-display text-lg font-semibold tracking-[-0.02em] text-secondary">
                      Carbon
                    </span>
                  </th>
                  <th className="border-b border-b-border px-5 py-5 align-bottom">
                    <span className="font-display text-lg font-semibold tracking-[-0.02em] text-muted-foreground">
                      {c.competitor}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.groups.map((group) => (
                  <GroupRows key={group.title} group={group} />
                ))}
                {/* Closes the highlighted column with a matching accent cap. */}
                <tr aria-hidden>
                  <td />
                  <td className="border-t-2 border-t-secondary/50 p-0" />
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Where the competitor fits (fair note) */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className={cn(shell, "max-w-[820px]")}>
          <div className={eyebrow}>Being fair</div>
          <h2 className={cn(sectionHeading, "mt-5")}>{c.whereItFitsTitle}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {c.whereItFits}
          </p>
        </div>
      </section>

      {/* Outgrowing the competitor */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className={shell}>
          <div className={eyebrow}>Signs to switch</div>
          <h2 className={cn(sectionHeading, "mt-5")}>{c.outgrowingTitle}</h2>
          <div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
            {c.outgrowing.map((card) => (
              <div key={card.title} className="flex flex-col bg-card p-8">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Carbon */}
      <section className="border-b border-border py-24 sm:py-28">
        <div className={shell}>
          <div className={eyebrow}>The case for Carbon</div>
          <h2 className={cn(sectionHeading, "mt-5")}>{c.reasonsTitle}</h2>
          <div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
            {c.reasons.map((card) => (
              <div key={card.title} className="flex flex-col bg-card p-8">
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden py-28 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-[1000px] px-6 text-center">
          <div className={eyebrow}>Open core · Self-host · API-first</div>
          <h2 className="mt-6 font-display font-semibold tracking-[-0.045em] leading-[0.96] text-[clamp(2.25rem,5vw,4.5rem)]">
            See Carbon on your own parts.
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
            Start free for 30 days, or read the source and run it in your own
            environment. No sales call required.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent" size="cta">
              <a href={APP_URL}>Start 30-day free trial</a>
            </Button>
            <Button asChild variant="accentOutline" size="cta">
              <a href={GITHUB_URL} target="_blank" rel="noopener">
                <GithubLogo className="size-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function GroupRows({ group }: { group: Comparison["groups"][number] }) {
  return (
    <>
      <tr>
        {/* Transparent so the tinted Carbon <col> reads through the group break
            and the highlighted lane stays unbroken. */}
        <th colSpan={3} className="pb-3 pt-9 text-left">
          <span className={eyebrow}>{group.title}</span>
        </th>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-b border-border">
          <td className="py-3.5 pr-6 align-top text-sm font-medium leading-snug text-foreground">
            {row.label}
          </td>
          <td className="px-5 py-3.5 align-top">
            <Cell value={row.carbon} carbon />
          </td>
          <td className="px-5 py-3.5 align-top">
            <Cell value={row.competitor} />
          </td>
        </tr>
      ))}
    </>
  );
}
