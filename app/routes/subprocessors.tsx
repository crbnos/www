import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Carbon | Sub-Processors List" },
    {
      name: "description",
      content:
        "Third-party sub-processors engaged by Carbon Manufacturing Systems, Corp. to support delivery of the Carbon platform.",
    },
  ];
};

type Row = {
  name: string;
  purpose: string;
  location: string;
  website: string;
  href: string;
};

type Section = {
  title: string;
  rows: Row[];
};

const sections: Section[] = [
  {
    title: "Infrastructure & Hosting",
    rows: [
      {
        name: "Amazon Web Services (AWS)",
        purpose: "Cloud infrastructure for Carbon's commercial cloud",
        location: "United States",
        website: "aws.amazon.com",
        href: "https://aws.amazon.com",
      },
      {
        name: "AWS GovCloud (US)",
        purpose:
          "Isolated cloud infrastructure for ITAR/CUI workloads (ENT GovCloud customers only)",
        location: "United States",
        website: "aws.amazon.com/govcloud-us",
        href: "https://aws.amazon.com/govcloud-us",
      },
      {
        name: "Cloudflare",
        purpose: "DNS, edge protection, DDoS mitigation, WAF",
        location: "Global edge network",
        website: "cloudflare.com",
        href: "https://cloudflare.com",
      },
    ],
  },
  {
    title: "Application Services",
    rows: [
      {
        name: "Supabase",
        purpose: "Managed PostgreSQL database backend",
        location: "United States",
        website: "supabase.com",
        href: "https://supabase.com",
      },
      {
        name: "Upstash",
        purpose: "Managed Redis (caching, rate-limiting)",
        location: "United States",
        website: "upstash.com",
        href: "https://upstash.com",
      },
      {
        name: "Trigger.dev",
        purpose: "Background job orchestration",
        location: "United States",
        website: "trigger.dev",
        href: "https://trigger.dev",
      },
    ],
  },
  {
    title: "Monitoring & Observability",
    rows: [
      {
        name: "Datadog",
        purpose:
          "Application performance monitoring, log aggregation, anomaly detection",
        location: "United States",
        website: "datadoghq.com",
        href: "https://datadoghq.com",
      },
    ],
  },
  {
    title: "Customer Communications",
    rows: [
      {
        name: "Resend (or Novu)",
        purpose: "Transactional email delivery",
        location: "United States",
        website: "resend.com / novu.co",
        href: "https://resend.com",
      },
      {
        name: "Slack",
        purpose:
          "Internal Carbon team communications (no customer data stored)",
        location: "United States",
        website: "slack.com",
        href: "https://slack.com",
      },
      {
        name: "Gmail (Google Workspace)",
        purpose:
          "Carbon employee email, including correspondence with customers",
        location: "United States",
        website: "google.com/workspace",
        href: "https://workspace.google.com",
      },
    ],
  },
  {
    title: "Payments",
    rows: [
      {
        name: "Stripe",
        purpose: "Payment processing for self-signup customers",
        location: "United States",
        website: "stripe.com",
        href: "https://stripe.com",
      },
    ],
  },
];

export default function SubProcessors() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-9xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">
            Sub-Processors List
          </h1>
          <h2 className="font-medium text-xl text-muted-foreground max-w-5xl text-balance leading-relaxed tracking-tight">
            Last updated April 2026
          </h2>
        </div>
      </div>
      <div className="mx-auto flex flex-col px-4 w-full max-w-9xl mb-28">
        <div className="prose dark:prose-invert lg:prose-lg mx-auto">
          <p>
            This page lists the third-party sub-processors that{" "}
            <strong>Carbon Manufacturing Systems, Corp.</strong> ("Carbon")
            engages to support delivery of the Carbon platform. Carbon performs
            a security and privacy review of each sub-processor before
            engagement and reviews relationships at least annually. Customers
            are notified of material additions or changes, consistent with
            Carbon's Data Processing Addendum.
          </p>
          <p>
            <strong>Scope:</strong> The sub-processors below apply to all{" "}
            <strong>Starter</strong> and <strong>Business</strong>{" "}
            subscriptions, as well as to <strong>Enterprise</strong>{" "}
            subscriptions with Carbon-managed hosting. Carbon is open-source and
            available for self-hosting; customers running Carbon on their own
            infrastructure under the Self-Hosted Commercial License operate the
            platform independently, and the sub-processors below do not apply
            to those deployments.
          </p>
          <p>
            For questions about this list, contact{" "}
            <a href="mailto:support@carbon.ms">support@carbon.ms</a>.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Sub-Processor</th>
                    <th>Purpose</th>
                    <th>Data Location</th>
                    <th>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={row.name}>
                      <td>
                        <strong>{row.name}</strong>
                      </td>
                      <td>{row.purpose}</td>
                      <td>{row.location}</td>
                      <td>
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.website}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}

          <h2>Notes</h2>
          <ul>
            <li>
              <strong>Customer data scope:</strong> Sub-processors above process
              customer data only as needed to deliver the Carbon platform and
              only under contractual confidentiality and data-protection
              obligations equivalent to Carbon's commitments to its customers.
            </li>
            <li>
              <strong>Sub-processor changes:</strong> Carbon will provide
              reasonable advance notice of any material change to this list
              (typically 30 days) so customers can object as provided in the
              DPA.
            </li>
            <li>
              <strong>AWS GovCloud customers:</strong> ITAR-controlled data and
              CUI for ENT GovCloud customers is processed exclusively in AWS
              GovCloud (US). The non-GovCloud sub-processors above (Datadog,
              Cloudflare, etc.) do not receive GovCloud customer data.
            </li>
            <li>
              <strong>Self-Hosted customers:</strong> Customers running Carbon
              under the Self-Hosted Commercial License operate the platform on
              their own infrastructure; the sub-processor list above does not
              apply to those deployments.
            </li>
          </ul>
          <p>
            This list is incorporated by reference into Carbon's Data Processing
            Addendum (Schedule 1). It is provided for informational purposes;
            the executed DPA controls.
          </p>
        </div>
      </div>
    </div>
  );
}
