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

const ACCOUNT_EXECUTIVE: Job = {
  slug: "account-executive",
  title: "Account Executive (US)",
  shortTitle: "Account Executive",
  summary:
    "Run your own demos and build our outbound. On-target earnings are $285,000 a year with no cap.",
  location: "Remote in the United States",
  employmentType: "Full-time",
  travel: "Up to 25% travel to customer sites and trade shows",
  datePosted: "2026-11-17",
  metaDescription:
    "Carbon is hiring its first US-based account executive to sell Carbon, the open-source ERP, MES and QMS, to manufacturers. On-target earnings are $285,000 a year.",
  intro:
    "Carbon is hiring its first account executive. Until now, our CEO has run every sales cycle himself. New leads come in about once a day, and we've done almost no outbound. You'll be responsible for hunting and running your own deals from the first call to the signed agreement, and for building our outbound from scratch. On-target earnings are $285,000 a year with no cap.",
  sections: [
    {
      title: "What you'll do",
      items: [
        "Find new deals and run each one from the first call to the signed agreement. We don't have sales engineers or SDRs, so you'll do your own discovery, demos, proposals and contract walkthroughs.",
        "Learn how the buyer quotes, plans, buys, builds, inspects and ships, and work out whether Carbon fits. When it doesn't, you'll tell them early.",
        "Demo Carbon yourself. For your bigger deals, you'll set up the buyer's own parts, bills of materials and routings in a demo environment first, so they see their own factory running in Carbon.",
        "Help the buyer decide how to run Carbon (in our cloud, in their own cloud or on their own servers) and whether they need a forward deployed engineer. Then you'll price the deal and write the proposal and the agreement with our CEO.",
        "Build our outbound. You'll find the manufacturers who should be on Carbon but haven't heard of us, through your own outreach, trade shows and factory visits.",
        "Stay in touch with founders who aren't ready to buy yet, so that Carbon is the obvious choice when they are.",
        "Hand each new customer to the engineer or implementation specialist who will get them live, with a clear record of what they bought and what they're counting on.",
        "Stay with the customers you sign. You'll check in after they go live and handle the renewal.",
        "Build relationships with senior executives at large manufacturers. Moving to a new ERP can be a long process, and your commitment and level of service give our customers the confidence to make the move to Carbon.",
      ],
    },
    {
      title: "How you'll be measured",
      intro:
        "You'll carry a quota for new software revenue, and you'll be measured on two things:",
      items: [
        {
          label: "New software revenue",
          text: "the first-year software revenue from the customers you sign. Your commission is paid on this number.",
        },
        {
          label: "Customers who stay",
          text: "whether the customers you sign are still running their factories on Carbon a year later. You earn again when they grow.",
        },
      ],
    },
    {
      title: "What you'll earn",
      intro:
        "You'll earn a salary and a commission on every customer you sign.",
      items: [
        {
          label: "On-target earnings",
          text: "$285,000 a year, with no cap on commission.",
        },
        { label: "Benefits", text: "health insurance." },
      ],
    },
    {
      title: "What you'll bring",
      items: [
        "You've closed new business with enterprise customers as a full-cycle salesperson.",
        "You've rarely, if ever, missed your quota.",
        "You've sold to manufacturers or worked at one, and you know how bills of materials, routings, work orders, inventory and inspections fit together. If you haven't, you've sold a product technical enough that you can show us you'll learn a factory fast.",
        "You run your own demos. You can learn a deep product and show it live without a sales engineer next to you.",
        "You find your own deals. You've built a pipeline from nothing through outreach, events and your own network.",
        "You're comfortable selling to a founder, a software engineer, and a COO or head of production at a Fortune 500 company in the same week, and you know when to bring one of our engineers into the call.",
        "You tell buyers the truth, including when Carbon isn't the right fit, and you don't run down competitors to win a deal.",
        "You can travel up to 25% of the time for customer visits and trade shows.",
        "You take ownership, work independently and don't need much direction to get things done.",
      ],
    },
    {
      title: "Nice to have",
      items: [
        "You've sold ERP, MES, QMS or other software that runs a factory.",
        "You've sold to aerospace and defense manufacturers, and you know what ITAR, CMMC and AS9100 mean to a buyer.",
        "You've sold open-source or self-hosted software.",
      ],
    },
    {
      title: "How we work",
      items: [
        "We're a team of 10 to 20 people. You'll report to our CEO and work closely with our Head of Engineering and our forward deployed engineers.",
        "Many of our customers get a forward deployed engineer with their subscription. You'll bring our engineers into your deals when you need them.",
        CHECKRIDE,
      ],
    },
    {
      title: "How we hire",
      intro: "We're hiring now for a January start.",
      ordered: true,
      items: [
        "You'll have a 30-minute intro call with our CEO.",
        "You'll complete a take-home exercise: set up a sample manufacturing company in a Carbon sandbox and record a short demo, as if you were showing it to a buyer.",
        "You'll run a mock sales call with our CEO as the buyer, from the first question to the price.",
        "We'll have a final conversation, and then we'll make an offer.",
      ],
    },
  ],
};

const JOBS: Job[] = [
  FORWARD_DEPLOYED_ENGINEER,
  SOFTWARE_ENGINEER,
  ACCOUNT_EXECUTIVE,
];

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
