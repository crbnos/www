/**
 * Open roles at Carbon. Posting copy is kept in English on purpose: every role
 * is US-only and the eligibility text is legal language we don't want
 * paraphrased by a translation pass.
 */

export const CAREERS_EMAIL = "chase@carbon.ms";
export const GITHUB_URL = "https://github.com/crbnos/carbon";

export type JobItem = string | { label: string; text: string };

export type JobSection = {
  title: string;
  intro?: string;
  items: JobItem[];
  ordered?: boolean;
};

export type Job = {
  slug: string;
  title: string;
  /** Short name used on the list page and in the mailto subject. */
  shortTitle: string;
  summary: string;
  location: string;
  employmentType: string;
  travel?: string;
  /** Annual base pay in USD. Leave unset until a range is approved. */
  salary?: { min: number; max: number };
  datePosted: string;
  metaDescription: string;
  intro: string;
  sections: JobSection[];
};

export const ABOUT_CARBON = [
  "Carbon is open-source software that runs a manufacturing business from the sales order to the shipped part. Planning, purchasing, inventory, the shop floor, quality, maintenance and accounting all run on one database.",
  "Our customers get the source code, so they can change anything and never get locked in. They run Carbon in our cloud, in their own cloud (including AWS GovCloud), or on their own servers. Our code is public at github.com/crbnos/carbon, so you can read it before you apply.",
  "We work with manufacturers that build hard things, including aerospace, defense, robotics and electronics companies. Customers include M3 Aerospace, Kform, Minimal, Sygnal and Digital Metal. Carbon is bootstrapped and profitable.",
];

export const ELIGIBILITY = [
  "This role involves technical data controlled under the International Traffic in Arms Regulations (ITAR). Under ITAR, U.S. persons can work with that data without a government export license. U.S. persons include U.S. citizens and nationals, lawful permanent residents (green card holders), and people granted asylum or refugee status. We can't sponsor work visas for this role.",
  "Carbon is an equal opportunity employer. We don't discriminate based on race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status or any other protected characteristic.",
];

const CHECKRIDE =
  "In your first weeks, you'll build a mock manufacturer in Carbon and run it end to end. Then you'll pass our checkride, which is a live demo of Carbon to the whole team.";

const FORWARD_DEPLOYED_ENGINEER: Job = {
  slug: "forward-deployed-engineer",
  title: "Forward Deployed Engineer (US)",
  shortTitle: "Forward Deployed Engineer",
  summary:
    "Get manufacturers running their factories on Carbon. Work on site with the customer's team, write the code that's missing, and stay until their people use it every day.",
  location: "Remote in the United States",
  employmentType: "Full-time",
  travel: "Up to 50% travel to customer sites",
  datePosted: "2026-11-11",
  metaDescription:
    "Carbon is hiring a US-based forward deployed engineer to get manufacturers running their factories on Carbon, the open-source ERP, MES and QMS.",
  intro:
    "Carbon is hiring a forward deployed engineer to get manufacturers running their factories on Carbon. You'll work inside a customer's team, often on site at their factory for weeks at a time. You'll set Carbon up around how the factory actually runs, write the code that's missing, and stay with the customer until their people use it every day.",
  sections: [
    {
      title: "What you'll do",
      items: [
        "Run a customer's rollout from kickoff to production. In the first two weeks, you'll agree on one specific goal with them, like running the full production cycle for their first product. That goal sets the pace for everything after it.",
        "Learn how the customer quotes, plans, buys, builds, inspects and ships. Then set up their parts, bills of materials, routings, work centers and quality checks in Carbon to match.",
        "Move the customer's data out of spreadsheets, QuickBooks or their old ERP and into Carbon, and check that it's right.",
        "Connect Carbon to the customer's other software and equipment, like CAD tools, accounting systems, label printers, scanners and machines. You'll use Carbon's API, webhooks and built-in automation to do it.",
        "Write code in Carbon when a customer needs something it doesn't do yet, and fix bugs when you find them. You'll decide what belongs in Carbon's core product, what belongs in the customer's own copy of the code, and when the answer is no.",
        "Set up and run Carbon in the customer's own AWS account, including AWS GovCloud for customers with export-controlled data.",
        "Train the people who use Carbon every day, from shop floor operators to the finance team. You'll also be the customer's first call at Carbon.",
      ],
    },
    {
      title: "How you'll be measured",
      intro:
        "This role sits between our sales team, which includes customer success and support, and our engineering team. There are no engineering metrics for this role, and you'll be measured on three customer outcomes:",
      items: [
        {
          label: "Speed",
          text: "how quickly the customer reaches the goal you set together in the first two weeks.",
        },
        {
          label: "Time to production",
          text: "how quickly the customer's factory is running on Carbon, which should take about 90 days for most customers.",
        },
        {
          label: "Renewal",
          text: "whether the customer renews Carbon. When something you build solves a customer's problem, we look for ways to make it part of the product.",
        },
      ],
    },
    {
      title: "What you'll bring",
      items: [
        "You've written production software for at least three years, and you're comfortable in TypeScript and SQL.",
        "You've worked in or with a factory, and you know how bills of materials, routings, work orders, inventory and inspections fit together.",
        "You've implemented, built or customized an ERP, MES or similar system for a manufacturer.",
        "You can find your way around a large codebase you didn't write.",
        "You're comfortable setting up and running cloud environments on AWS or a similar provider.",
        "You can lead a training session for shop floor operators and a status review with a customer's executives.",
        "You can travel up to 50% of the time, including stretches of two weeks or more on site at a customer's factory.",
      ],
    },
    {
      title: "Nice to have",
      items: [
        "You've worked with AWS GovCloud, ITAR, CMMC or NIST SP 800-171.",
        "You've connected software to shop floor equipment like label printers, barcode scanners, torque tools or machines.",
        "You've used or contributed to Carbon's open-source code.",
      ],
    },
    {
      title: "How we work",
      items: [
        "We're a team of about ten people. You'll work directly with our CEO and our Head of Engineering.",
        "Some customers have a dedicated FDE, and others share one with a few other customers. You may do both.",
        CHECKRIDE,
      ],
    },
    {
      title: "How we hire",
      ordered: true,
      items: [
        "You'll have a 30-minute intro call with our CEO.",
        "You'll complete a take-home exercise: set up a sample manufacturing company in a Carbon sandbox and record a short walkthrough, as if you were showing it to the customer's team.",
        "You'll have a technical conversation with our Head of Engineering.",
        "We'll have a final conversation, and then we'll make an offer.",
      ],
    },
  ],
};

const SOFTWARE_ENGINEER: Job = {
  slug: "software-engineer",
  title: "Software Engineer (US)",
  shortTitle: "Software Engineer",
  summary:
    "Build Carbon's core product with a focus on security and compliance, for manufacturers in aerospace and defense who handle export-controlled data.",
  location: "Remote in the United States",
  employmentType: "Full-time",
  datePosted: "2026-11-11",
  metaDescription:
    "Carbon is hiring a US-based software engineer to build its open-source manufacturing platform, with a focus on security, NIST SP 800-171 and CMMC.",
  intro:
    "Carbon is hiring a software engineer in the U.S. to build our core product, with a focus on security and compliance. Many of our customers build aerospace and defense products and handle export-controlled data, so how secure Carbon is matters to them as much as what it does.",
  sections: [
    {
      title: "What you'll do",
      items: [
        "Build features across Carbon, from the database to the screens that operators use on the shop floor.",
        "Own the security of the product, including sign-in and single sign-on, permissions, audit trails, encryption, backups and logging.",
        "Lead our NIST SP 800-171 and CMMC work. You'll find the gaps, close them in the product and in how we deploy it, and keep the security documents that customers give their auditors up to date.",
        "Own the security of our AWS GovCloud environment and of the self-hosted deployments that customers run in their own clouds or on their own servers.",
        "Build the tooling that keeps self-hosted customers current, including upgrades, automated tests, and fewer merge conflicts for customers who maintain their own copy of the code.",
        "Review code with security in mind, and set up the automated checks that catch problems before they ship.",
        "Handle security reports from outside researchers and work through the fixes with the team.",
        "Join customer calls when their security or IT team has questions only an engineer can answer, and help answer security questionnaires.",
      ],
    },
    {
      title: "What you'll bring",
      items: [
        "You've built and shipped production web applications for at least four years.",
        "You've worked at a manufacturer or built software for one, and you understand bills of materials, routings, work orders, traceability and quality.",
        "You're strong in TypeScript and SQL. Our stack is TypeScript, React Router, Postgres on Supabase (with row-level security), Redis and Inngest, in a Turborepo monorepo. We also run a Rust service that turns CAD files into 3D models.",
        "You've done hands-on security work, including authentication, access control, encryption, secrets management, logging and responding to vulnerability reports.",
        "You've helped a company meet NIST SP 800-171, CMMC, FedRAMP, SOC 2 or ISO 27001, and you know what an auditor asks for.",
        "You've run production infrastructure on AWS, and you're comfortable with Docker.",
      ],
    },
    {
      title: "Nice to have",
      items: [
        "You've worked in AWS GovCloud or with ITAR-controlled data.",
        "You've implemented FIPS 140 validated encryption, or enterprise sign-in with Okta, Microsoft Entra ID or SAML.",
        "You've contributed to open-source projects, especially Carbon.",
      ],
    },
    {
      title: "How we work",
      items: [
        "We're a team of about ten people. You'll report to our Head of Engineering, work closely with our CEO, and own security and compliance as your area.",
        CHECKRIDE,
      ],
    },
    {
      title: "How we hire",
      ordered: true,
      items: [
        "You'll have a 30-minute intro call with our CEO.",
        "You'll complete a take-home exercise based on a real problem in Carbon's open-source code.",
        "You'll have a technical interview with our Head of Engineering.",
        "We'll have a final conversation, and then we'll make an offer.",
      ],
    },
  ],
};

const JOBS: Job[] = [FORWARD_DEPLOYED_ENGINEER, SOFTWARE_ENGINEER];

export function getJobs(): Job[] {
  return JOBS;
}

export function getJob(slug: string): Job | undefined {
  return JOBS.find((job) => job.slug === slug);
}

export function applyHref(job: Job): string {
  const subject = encodeURIComponent(`Application: ${job.title}`);
  return `mailto:${CAREERS_EMAIL}?subject=${subject}`;
}
