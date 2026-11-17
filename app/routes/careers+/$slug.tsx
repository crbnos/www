import { Trans } from "@lingui/react/macro";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { data, Link, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import {
  ABOUT_CARBON,
  applyHref,
  CAREERS_EMAIL,
  ELIGIBILITY,
  GITHUB_URL,
  getJob,
  type Job,
  type JobItem,
  type JobSection,
} from "~/lib/careers";
import { pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

export const config = {
  runtime: "edge",
};

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
  "font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
  "font-display tracking-[-0.015em] text-[clamp(2.125rem,4.4vw,3.875rem)] leading-[1.08]";
const sectionHeading =
  "font-display tracking-[-0.01em] text-[clamp(1.375rem,2.2vw,1.75rem)]";
const body = "text-pretty leading-[1.8] text-muted-foreground";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const siteUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  // An unknown role is a 404, not a crash — the same contract as /compare.
  const { slug } = params;
  if (!slug) throw data(null, { status: 404 });
  const job = getJob(slug);
  if (!job) throw data(null, { status: 404 });

  return data({ job, siteUrl }, { headers: { "X-Robots-Tag": "index" } });
}

function itemText(item: JobItem): string {
  return typeof item === "string" ? item : `${item.label}: ${item.text}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** The full posting as HTML, which is what Google expects in JobPosting.description. */
function descriptionHtml(job: Job): string {
  const paragraphs = (lines: string[]) =>
    lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
  const section = (s: JobSection) => {
    const tag = s.ordered ? "ol" : "ul";
    const items = s.items
      .map((item) => `<li>${escapeHtml(itemText(item))}</li>`)
      .join("");
    return `<h2>${escapeHtml(s.title)}</h2>${s.intro ? paragraphs([s.intro]) : ""}<${tag}>${items}</${tag}>`;
  };
  return [
    paragraphs([job.intro]),
    `<h2>About Carbon</h2>${paragraphs(job.about ?? ABOUT_CARBON)}`,
    ...job.sections.map(section),
    `<h2>Eligibility</h2>${paragraphs(ELIGIBILITY)}`,
  ].join("");
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  const loaderData = data as { job: Job; siteUrl: string } | undefined;
  const job = loaderData?.job;
  const siteUrl = loaderData?.siteUrl;

  if (!job) {
    return pageMeta(matches, {
      title: "Careers at Carbon",
      description:
        "This role isn't open. See every open role at carbon.ms/careers.",
    });
  }

  const url = siteUrl ? `${siteUrl}/careers/${job.slug}` : null;

  // JobPosting makes the role eligible for Google's job search results. Every
  // role is remote and US-only, which Google models as TELECOMMUTE plus an
  // applicant location requirement.
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.shortTitle,
    description: descriptionHtml(job),
    datePosted: job.datePosted,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Carbon Manufacturing Systems",
      sameAs: siteUrl,
      logo: siteUrl ? `${siteUrl}/brand/carbon-mark-light.svg` : undefined,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "USA" },
    directApply: false,
    url: url ?? undefined,
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: {
          "@type": "QuantitativeValue",
          minValue: job.salary.min,
          maxValue: job.salary.max,
          unitText: "YEAR",
        },
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Careers",
        item: siteUrl ? `${siteUrl}/careers` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: job.title,
        item: url ?? undefined,
      },
    ],
  };

  return pageMeta(matches, {
    title: job.title,
    description: job.metaDescription,
    extra: [
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { "script:ld+json": jobSchema },
      { "script:ld+json": breadcrumbSchema },
    ],
  });
};

/** Renders the one GitHub URL in the About copy as a link. */
function WithRepoLink({ text }: { text: string }) {
  const token = "github.com/crbnos/carbon";
  const index = text.indexOf(token);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <a
        href={GITHUB_URL}
        className="text-foreground underline underline-offset-4"
      >
        {token}
      </a>
      {text.slice(index + token.length)}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border pt-10">
      <h2 className={sectionHeading}>{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function ItemList({ section }: { section: JobSection }) {
  const List = section.ordered ? "ol" : "ul";
  return (
    <List className="space-y-3">
      {section.items.map((item, i) => (
        <li key={i} className={cn(body, "flex gap-4")}>
          <span
            aria-hidden
            className={cn(
              "shrink-0 font-mono text-[11px] leading-[2.6] tabular-nums",
              section.ordered ? "text-foreground" : "text-muted-foreground/60",
            )}
          >
            {section.ordered ? String(i + 1).padStart(2, "0") : "—"}
          </span>
          <span>
            {typeof item === "string" ? (
              item
            ) : (
              <>
                <strong className="font-medium text-foreground">
                  {item.label}:
                </strong>{" "}
                {item.text}
              </>
            )}
          </span>
        </li>
      ))}
    </List>
  );
}

function Facts({ job }: { job: Job }) {
  const facts = [
    { label: "Location", value: job.location },
    { label: "Type", value: job.employmentType },
    ...(job.travel ? [{ label: "Travel", value: job.travel }] : []),
    { label: "Eligibility", value: "U.S. persons only (ITAR)" },
  ];
  return (
    <dl className="divide-y divide-border border-y border-border">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1.5 py-4">
          <dt className={eyebrow}>{fact.label}</dt>
          <dd className="text-sm leading-relaxed">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ApplyButton({ job, className }: { job: Job; className?: string }) {
  return (
    <Button
      asChild
      variant="accent"
      size="cta"
      className={cn("active:scale-[0.97] motion-reduce:active:scale-100", className)}
    >
      <a href={applyHref(job)}>
        <Trans>Apply for this role</Trans>
        <ArrowUpRight />
      </a>
    </Button>
  );
}

export default function CareerRole() {
  const { job } = useLoaderData<typeof loader>();

  return (
    <article className="py-20 sm:py-24">
      <div className={shell}>
        <Link
          to="/careers"
          prefetch="intent"
          className={cn(
            eyebrow,
            "inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground",
          )}
        >
          <ArrowLeft className="size-3.5" />
          <Trans>All roles</Trans>
        </Link>

        <h1 className={cn(heading, "mt-8 max-w-[20ch] text-balance")}>
          {job.title}
        </h1>
        <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted-foreground">
          {[job.location, job.employmentType, job.travel]
            .filter(Boolean)
            .join(" · ")}
        </p>

        <ApplyButton job={job} className="mt-8 lg:hidden" />

        <div className="mt-14 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,68ch)_300px] lg:justify-between">
          <div className="space-y-12">
            <p className="text-pretty text-lg leading-relaxed text-foreground">
              {job.intro}
            </p>

            <Section title="About Carbon">
              {(job.about ?? ABOUT_CARBON).map((paragraph, i) => (
                <p key={i} className={body}>
                  <WithRepoLink text={paragraph} />
                </p>
              ))}
            </Section>

            {job.sections.map((section) => (
              <Section key={section.title} title={section.title}>
                {section.intro && <p className={body}>{section.intro}</p>}
                <ItemList section={section} />
              </Section>
            ))}

            <Section title="Eligibility">
              {ELIGIBILITY.map((paragraph, i) => (
                <p key={i} className={body}>
                  {paragraph}
                </p>
              ))}
            </Section>

            <div className="border-t border-border pt-10">
              <ApplyButton job={job} />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                <Trans>
                  Or email{" "}
                  <a
                    href={applyHref(job)}
                    className="text-foreground underline underline-offset-4"
                  >
                    {CAREERS_EMAIL}
                  </a>
                  .
                </Trans>
              </p>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <Facts job={job} />
              <ApplyButton job={job} className="w-full" />
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
