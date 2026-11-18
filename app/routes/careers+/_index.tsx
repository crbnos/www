import { Trans } from "@lingui/react/macro";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { getJobs } from "~/lib/careers";
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

export const meta: MetaFunction = ({ matches }) =>
  pageMeta(matches, {
    title: "Careers at Carbon",
    description:
      "Open roles at Carbon, the open-source software that runs manufacturing businesses. We're a small, profitable team building for aerospace, defense, robotics and electronics manufacturers.",
  });

export default function CareersIndex() {
  const jobs = getJobs();

  return (
    <section className="py-24 sm:py-28">
      <div className={shell}>
        <div className={eyebrow}>
          <Trans>Careers</Trans>
        </div>
        <h1 className={cn(heading, "mt-5 max-w-[18ch] text-balance")}>
          <Trans>Build the software that runs factories.</Trans>
        </h1>
        <p className="mt-6 max-w-[56ch] text-pretty text-lg leading-relaxed text-muted-foreground">
          <Trans>
            Carbon is open-source software that runs a manufacturing business
            from the sales order to the shipped part. We're a team of about 15
            people, bootstrapped and profitable, working with manufacturers that
            build hard things.
          </Trans>
        </p>

        <div className="mt-16 flex items-baseline justify-between gap-6 border-b border-border pb-4">
          <h2 className={eyebrow}>
            <Trans>Open roles</Trans>
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
            {String(jobs.length).padStart(2, "0")}
          </span>
        </div>

        <ul>
          {jobs.map((job) => (
            <li key={job.slug} className="border-b border-border">
              <Link
                to={`/careers/${job.slug}`}
                prefetch="intent"
                className="group grid grid-cols-1 gap-x-10 gap-y-3 py-8 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-center [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted"
              >
                <div>
                  <h3 className="font-display text-2xl tracking-[-0.005em]">
                    {job.shortTitle}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted-foreground">
                    {[job.location, job.employmentType, job.travel]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <p className="max-w-[60ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                  <Trans>View role</Trans>
                  <ArrowRight className="size-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
          <Trans>
            Our code is public at{" "}
            <a
              href="https://github.com/crbnos/carbon"
              className="text-foreground underline underline-offset-4"
            >
              github.com/crbnos/carbon
            </a>
            , so you can read it before you apply.
          </Trans>
        </p>
      </div>
    </section>
  );
}
