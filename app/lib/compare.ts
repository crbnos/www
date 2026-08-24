/**
 * Data for the competitor comparison pages at `/compare/<slug>`.
 *
 * One layout, one data shape, one entry per competitor — so adding the next
 * comparison is a data edit, not a new page. The same data renders the HTML
 * page (`compare+/$competitor.tsx`) and the Markdown representation an agent
 * reads (`agent/negotiate.server.ts`), so the two can never disagree.
 *
 * A note on fairness: every Carbon cell states a capability the product
 * actually ships. Competitor cells describe well-known characteristics in
 * neutral terms, and each page carries a "Where <competitor> still fits"
 * section — a comparison a manufacturer can trust is more persuasive than one
 * that pretends the other product has no strengths.
 */

/** A table cell: a short phrase, or a yes/no we render as an icon. */
export type CompareValue = string | boolean;

export type CompareRow = {
  label: string;
  carbon: CompareValue;
  competitor: CompareValue;
};

/** Rows are grouped so a long table stays scannable. */
export type CompareGroup = {
  title: string;
  rows: CompareRow[];
};

export type CompareCard = {
  title: string;
  body: string;
};

export type Comparison = {
  /** URL segment: `/compare/<slug>`. */
  slug: string;
  /** Short name used in copy and the table header. */
  competitor: string;
  /** Full/legal name for the first mention and metadata. */
  competitorFull: string;
  /** What the competitor is, in three or four words. */
  category: string;
  /** Page `<h1>`, e.g. "Carbon vs. NetSuite". */
  headline: string;
  metaTitle: string;
  metaDescription: string;
  /** The paragraph under the headline. */
  subheadline: string;
  /** Four short proof points shown as chips in the hero. */
  stats: { value: string; label: string }[];
  /** The comparison table, in labelled groups. */
  groups: CompareGroup[];
  /** Fair acknowledgement of where the competitor is the right call. */
  whereItFitsTitle: string;
  whereItFits: string;
  /** "You may be outgrowing <competitor> if…" */
  outgrowingTitle: string;
  outgrowing: CompareCard[];
  /** "Why manufacturers choose Carbon" */
  reasonsTitle: string;
  reasons: CompareCard[];
};

/** The stat chips are the same on every page — Carbon's, not the competitor's. */
const CARBON_STATS: Comparison["stats"] = [
  { value: "4-in-1", label: "ERP, MRP, MES & QMS on one data model" },
  { value: "1 month", label: "implementations" },
  { value: "30 days", label: "free trial, no sales call" },
  { value: "Yours", label: "full source-code ownership" },
];

// ---------------------------------------------------------------------------
// NetSuite
// ---------------------------------------------------------------------------

const NETSUITE: Comparison = {
  slug: "netsuite",
  competitor: "NetSuite",
  competitorFull: "Oracle NetSuite",
  category: "General-business cloud ERP",
  headline: "Carbon vs. NetSuite",
  metaTitle: "Carbon vs. NetSuite — a manufacturing ERP comparison",
  metaDescription:
    "NetSuite runs the back office; Carbon runs the factory. Compare ERP, MES and QMS on one open, API-first data model for make-to-order manufacturers.",
  subheadline:
    "NetSuite is a finance-first ERP that bolts manufacturing on through add-ons. Carbon is manufacturing-native — ERP, MRP, MES and QMS on one data model — so quoting, planning, the shop floor, quality and accounting share one record instead of a chain of SuiteApps and integrations.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Manufacturing ERP + MRP + MES + QMS",
          competitor: "General-business cloud ERP; manufacturing is an add-on",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "Multi-entity finance, distribution and services",
        },
        {
          label: "ERP + MES on one model",
          carbon: "One record from quote to shipped, traceable part",
          competitor: "ERP core; shop floor via SuiteApps or third-party MES",
        },
      ],
    },
    {
      title: "Manufacturing depth",
      rows: [
        {
          label: "Shop-floor execution (MES)",
          carbon: true,
          competitor: "Add-on or partner MES",
        },
        {
          label: "Quality (QMS)",
          carbon: "Nonconformance, dispositions, calibration, first-article",
          competitor: "Add-on or third-party",
        },
        {
          label: "MRP & live capacity planning",
          carbon: "Capacity and forecasts update as the floor reports",
          competitor: "Infinite scheduling; finite needs Advanced Mfg add-on",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Parametric BoM, routing and price per order",
          competitor: "CPQ add-on; strains on deep option trees",
        },
        {
          label: "Serial & batch traceability",
          carbon: "Full genealogy, built in",
          competitor: "Add-on",
        },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        { label: "Deployment", carbon: "Cloud or self-host", competitor: "Cloud only" },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "SuiteTalk SOAP + REST; shared concurrency limits",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, read & write",
          competitor: "MCP via add-on SuiteApp; behind license",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "Commercial cloud; no GovCloud residency",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Partner-led; typically many months",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based; negotiated annually",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where NetSuite still fits",
  whereItFits:
    "If your center of gravity is finance — many legal entities, heavy multi-currency consolidation, or a distribution or services business where the shop floor is secondary — NetSuite is a proven system of record. If manufacturing is the point, Carbon is built for the way you actually make it.",
  outgrowingTitle: "You may be outgrowing NetSuite if…",
  outgrowing: [
    {
      title: "The shop floor lives in spreadsheets",
      body: "NetSuite records the transaction, not the operation. If jobs, routings and quality still run outside the ERP, you're paying to integrate what should be one record.",
    },
    {
      title: "Every change is a consulting engagement",
      body: "Customizations mean SuiteScript and a partner. With Carbon the source is yours, and every capability is one API call away.",
    },
    {
      title: "The bill only ever goes up",
      body: "Modules, add-ons and per-seat pricing negotiated behind a sales team. Carbon's pricing is public and starts at $40 per user per month.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Manufacturing-first, not finance-first",
      body: "NetSuite starts from the ledger and bolts manufacturing on as modules. Carbon starts from the part — the BoM, the routing, the operation — with accounting rolling up from what actually happens on the floor.",
    },
    {
      title: "Open and API-first",
      body: "NetSuite opens a curated slice of itself through SuiteScript and SuiteTalk, and steers you to its built-in assistant. Carbon puts the whole backend — every table — on an open REST API and MCP, self-hostable, so you point Claude, ChatGPT or Cursor at your live data.",
    },
    {
      title: "Live capacity planning",
      body: "NetSuite plans on scheduled MRP runs. Carbon's capacity and demand update the moment the floor reports progress, so the plan you're looking at is the plan that's true.",
    },
    {
      title: "No implementation army",
      body: "NetSuite lands through a partner and a multi-month implementation. Carbon starts free for 30 days on published, per-user pricing — no sales call, no consultants required to make a change.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Manufacturo
// ---------------------------------------------------------------------------

const MANUFACTURO: Comparison = {
  slug: "manufacturo",
  competitor: "Manufacturo",
  competitorFull: "Manufacturo (Andea)",
  category: "Cloud MES",
  headline: "Carbon vs. Manufacturo",
  metaTitle: "Carbon vs. Manufacturo — one platform, not a bolt-on MES",
  metaDescription:
    "Manufacturo executes the floor, then hands to a separate ERP. Carbon is ERP, MES and QMS on one data model — no seam between floor and back office.",
  subheadline:
    "Manufacturo is a modern MES: it executes the shop floor, then hands off to an ERP you buy and integrate separately. Carbon is ERP, MRP, MES and QMS on one data model — the same record from quote to shipped part — so there's no seam to build between the floor and the back office.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS in one platform",
          competitor: "Cloud MES (shop-floor execution)",
        },
        {
          label: "Built for",
          carbon: "Regulated discrete manufacturing, prototype to rate production",
          competitor: "High-mix regulated discrete manufacturing",
        },
        {
          label: "Back office / ERP included",
          carbon: "Financials, purchasing, inventory, sales — built in",
          competitor: "No — requires a separate ERP",
        },
      ],
    },
    {
      title: "What's inside the platform",
      rows: [
        { label: "Accounting, GL & job costing", carbon: true, competitor: false },
        { label: "Purchasing / procure-to-pay", carbon: true, competitor: false },
        { label: "Sales orders & quoting", carbon: true, competitor: false },
        {
          label: "MRP & inventory",
          carbon: "One model with finance and the floor",
          competitor: "MRP, inventory & Kanban included",
        },
        {
          label: "Live capacity planning",
          carbon: "Updates as the floor reports",
          competitor: "Not emphasized",
        },
        { label: "Shop-floor execution (MES)", carbon: true, competitor: true },
        { label: "Quality (QMS) & as-built", carbon: true, competitor: true },
        { label: "Serial & batch traceability", carbon: true, competitor: true },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Cloud, private or on-prem (vendor-managed)",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "80+ public integration APIs (subset)",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, read & write",
          competitor: "Partner AI (Magenta); no MCP",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "ITAR, SOC 2; FedRAMP pending",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Enterprise onboarding",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based (enterprise)",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Manufacturo still fits",
  whereItFits:
    "Manufacturo is a capable MES for large aerospace and defense programs that already run a heavyweight ERP and want a modern execution layer on top of it. If you'd rather not run — and integrate — two systems, Carbon covers the same floor with the ERP already inside.",
  outgrowingTitle: "You may be outgrowing Manufacturo if…",
  outgrowing: [
    {
      title: "You're paying for two systems",
      body: "An MES, plus the ERP it plugs into, plus the integration between them. Carbon is one platform on one model — the integration doesn't exist because the seam doesn't.",
    },
    {
      title: "The floor and the office disagree",
      body: "When execution and finance live in different databases, the numbers drift. In Carbon every operation writes to the same record accounting reads.",
    },
    {
      title: "You want to own your stack",
      body: "Manufacturo is proprietary and cloud-only. Carbon is source-available and can run in your own environment, including GovCloud/ITAR.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "The ERP is already inside",
      body: "No separate back office to license and integrate. Accounting, job and product costing, purchasing, inventory and planning ship with the shop floor — so cost rolls up from the operation automatically, on one data model.",
    },
    {
      title: "Open and API-first",
      body: "Manufacturo executes the floor as a cloud MES; the record still lives in an ERP you buy and connect. Carbon keeps the whole backend on an open REST API and MCP, self-hostable, with no seam between the floor and the books.",
    },
    {
      title: "Plan and execute on one model",
      body: "Because ERP and MES are the same data, capacity and demand update the moment the floor reports progress — with no round-trip to a separate system of record.",
    },
    {
      title: "No integration to maintain",
      body: "Nothing to wire between MES and ERP, and nothing to re-test when either side updates. Start free for 30 days on published, per-user pricing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Fulcrum
// ---------------------------------------------------------------------------

const FULCRUM: Comparison = {
  slug: "fulcrum",
  competitor: "Fulcrum",
  competitorFull: "Fulcrum (Fulcrum Pro)",
  category: "Cloud manufacturing ERP",
  headline: "Carbon vs. Fulcrum",
  metaTitle: "Carbon vs. Fulcrum — open, API-first manufacturing platform",
  metaDescription:
    "Fulcrum and Carbon both replace legacy manufacturing software. Carbon adds source availability, an API-first agent-ready platform, self-host and public pricing.",
  subheadline:
    "Fulcrum and Carbon both replace legacy manufacturing software with something modern — but Fulcrum runs the shop floor and syncs the books to a separate system like QuickBooks. Carbon unifies ERP, MRP, MES and QMS — with native accounting and job costing — on one open, API-first data model, with pricing you can read on the website.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS on one data model",
          competitor: "Cloud manufacturing ERP / MRP",
        },
        {
          label: "Built for",
          carbon: "Discrete make-to-order manufacturers and job shops",
          competitor: "Small-to-mid manufacturers and job shops",
        },
        {
          label: "ERP + MES + QMS unified",
          carbon: "One schema, one record",
          competitor: "MRP + MES; accounting lives elsewhere",
        },
        {
          label: "Native accounting & GL",
          carbon: "Built in — GL, AP/AR and job costing",
          competitor: "No native GL; syncs to QuickBooks",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        {
          label: "Scheduling & capacity planning",
          carbon: "Forecasts update as the floor reports",
          competitor: "Autoschedule + demand planning",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Parametric BoM, routing and price",
          competitor: "Quoting & estimating",
        },
        { label: "Quality (QMS)", carbon: true, competitor: true },
        { label: "Serial & batch traceability", carbon: true, competitor: true },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        { label: "Deployment", carbon: "Cloud or self-host", competitor: "Cloud only" },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "Own your data model",
          carbon: "Open Postgres you control",
          competitor: "Closed, vendor-controlled",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "REST API (selected endpoints)",
        },
        {
          label: "MCP server for agents",
          carbon: "Hosted MCP over the full backend",
          competitor: "Fulcrum MCP (curated tools)",
        },
        {
          label: "Choice of AI agent",
          carbon: "Bring any agent — Claude, ChatGPT, Cursor",
          competitor: "Archie only — the vendor's model & limits",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "Self-host or hosted; CMMC / NIST 800-171 ready",
          competitor: "Azure GovCloud (hosted)",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Onboarding + one-time implementation fee",
        },
        { label: "Free trial", carbon: "30 days", competitor: "Demo only" },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based, revenue-tiered",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Fulcrum still fits",
  whereItFits:
    "Fulcrum is a solid modern manufacturing ERP, and if a fully managed, closed SaaS is exactly what you want, it does the job. Carbon is for teams that also want the source code, the full API surface, and the option to run it themselves.",
  outgrowingTitle: "Why teams pick Carbon over Fulcrum",
  outgrowing: [
    {
      title: "Your books live in another system",
      body: "Fulcrum runs the floor but keeps the ledger in QuickBooks, so cost, inventory and accounting never fully reconcile. In Carbon, accounting and job costing are native — they roll up from the same records as production.",
    },
    {
      title: "You don't want to be locked in",
      body: "Fulcrum is proprietary and cloud-only. Carbon is source-available — self-host it, extend it, and keep your data in a Postgres model you own.",
    },
    {
      title: "You want pricing you can read",
      body: "Fulcrum is quote-based and sold on revenue, with no public trial. Carbon publishes per-user pricing and a 30-day free trial — evaluate it before you talk to anyone.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "One system, one record",
      body: "ERP, MRP, MES and QMS share a single data model. Quote, plan, buy, build, inspect and ship all write to the same record — nothing to integrate, nothing to reconcile.",
    },
    {
      title: "Open, and yours",
      body: "The source is yours and the data lives in an open Postgres model you can host, extend and query directly — no black-box cloud, no lock-in. A REST API and a hosted MCP server expose the whole backend, not a curated slice, and it's CMMC / NIST 800-171 ready for defense work.",
    },
    {
      title: "Configuration and CAD, built in",
      body: "A parametric configurator resolves BoM, routing and price per order, and a native 3D/STEP viewer puts the part where the work is — capabilities Fulcrum doesn't offer.",
    },
    {
      title: "Transparent pricing",
      body: "Published, per-user pricing and a 30-day free trial. No revenue-based quote, no sales call to see a number.",
    },
  ],
};

// ---------------------------------------------------------------------------
// SAP Business One
// ---------------------------------------------------------------------------

const SAP_B1: Comparison = {
  slug: "sap-business-one",
  competitor: "SAP Business One",
  competitorFull: "SAP Business One (SAP B1)",
  category: "SMB ERP (distribution-first)",
  headline: "Carbon vs. SAP Business One",
  metaTitle: "Carbon vs. SAP Business One — manufacturing on one model",
  metaDescription:
    "SAP Business One needs add-ons like Beas or Produmex for real manufacturing. Carbon is manufacturing-native — ERP, MRP, MES and QMS on one open model.",
  subheadline:
    "SAP Business One is a small-business ERP built around financials and distribution; real manufacturing depth comes from add-ons like Beas and Produmex. Carbon is manufacturing-native — ERP, MRP, MES and QMS on one data model — with no VAR, no add-on stack, and pricing you can read.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Manufacturing ERP + MRP + MES + QMS",
          competitor: "SMB ERP; manufacturing via add-ons",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "SMB distribution and light or mixed manufacturing",
        },
        {
          label: "Manufacturing on one model",
          carbon: "Native — one record",
          competitor: "Beas / Produmex add-ons, separate licenses",
        },
      ],
    },
    {
      title: "Manufacturing depth",
      rows: [
        {
          label: "Shop-floor execution (MES)",
          carbon: true,
          competitor: "Not native — third-party MES",
        },
        {
          label: "Quality (QMS)",
          carbon: "Nonconformance, calibration, first-article",
          competitor: "Basic; real QMS via Beas add-on",
        },
        {
          label: "MRP & live capacity planning",
          carbon: "Updates as the floor reports",
          competitor: "Basic MRP; finite scheduling via Beas",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Parametric BoM, routing and price",
          competitor: "Not native (add-on)",
        },
        {
          label: "Serial & batch traceability",
          carbon: "Full genealogy, built in",
          competitor: "Serial or batch — not both per item",
        },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "On-prem or partner-hosted cloud",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "Service Layer REST/OData (capable)",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, read & write",
          competitor: "No first-party AI/MCP; third-party bridges",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "Via partner / hosting config",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "VAR-led; weeks to months",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "No public price; VAR-quoted",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where SAP Business One still fits",
  whereItFits:
    "SAP Business One is a proven, globally supported all-in-one for small and mid-size distributors and light manufacturers that value SAP's ecosystem and a large VAR network. If deep, native production is the priority, Carbon puts it on one model instead of an add-on stack.",
  outgrowingTitle: "You may be outgrowing SAP Business One if…",
  outgrowing: [
    {
      title: "Manufacturing means another license",
      body: "Beas for the floor, Produmex for the warehouse, each with its own support. Carbon puts MES, MRP and QMS on the same model as your orders and ledger.",
    },
    {
      title: "You can't get a price without a VAR",
      body: "B1 is quoted through a reseller. Carbon's pricing is public and starts at $40 per user per month, with a 30-day free trial.",
    },
    {
      title: "The interface feels its age",
      body: "B1's classic UI is training-heavy. Carbon is a modern web app your team can pick up without a course.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Manufacturing-first, not finance-first",
      body: "SAP Business One starts from distribution and financials; the factory arrives as add-ons like Beas and Produmex. Carbon starts from the part and the process, with the ledger built on top of real production.",
    },
    {
      title: "Open and API-first",
      body: "Business One exposes itself through the DI API and Service Layer, with real depth arriving via add-ons. Carbon puts the whole backend — every table — on an open REST API and MCP, self-hostable, so the best agents work against your live data.",
    },
    {
      title: "Live capacity planning",
      body: "In Business One, planning depth comes from add-ons like Beas. Carbon's finite capacity and demand are built in and update the moment the floor reports progress.",
    },
    {
      title: "No VAR, no add-on stack",
      body: "Business One is bought and implemented through a reseller, then extended with a stack of licensed add-ons. Carbon is self-serve: start free for 30 days on published, per-user pricing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Epicor Kinetic
// ---------------------------------------------------------------------------

const EPICOR: Comparison = {
  slug: "epicor",
  competitor: "Epicor Kinetic",
  competitorFull: "Epicor Kinetic",
  category: "Mid-market manufacturing ERP",
  headline: "Carbon vs. Epicor Kinetic",
  metaTitle: "Carbon vs. Epicor Kinetic — open, API-first vs. a legacy ERP",
  metaDescription:
    "Epicor Kinetic is a proprietary ERP sold by quote and implemented over months. Carbon matches the model — open, API-first, self-hostable, public pricing.",
  subheadline:
    "Epicor Kinetic is a deep, mature manufacturing ERP — and a proprietary one, sold by quote, implemented by partners over months, with on-prem innovation ending in 2028. Carbon matches the manufacturing model on an open, API-first platform you can self-host, with pricing on the website.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS on one data model",
          competitor: "Mature mid-market manufacturing ERP",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "Mid-to-large discrete / mixed-mode / ETO",
        },
        {
          label: "Architecture",
          carbon: "One unified Postgres schema",
          competitor: "Modular ERP; tiers + a separate CPQ product",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        { label: "Shop-floor execution (MES)", carbon: true, competitor: true },
        { label: "Quality (QMS)", carbon: true, competitor: true },
        {
          label: "Scheduling & capacity planning",
          carbon: "Live; updates as the floor reports",
          competitor: "Finite/infinite APS (deep, mature)",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Built in",
          competitor: "Native config; 3D/visual via separate Epicor CPQ",
        },
        {
          label: "3D CAD / STEP viewer",
          carbon: "Built in",
          competitor: "Via Epicor CPQ / PLM",
        },
        { label: "Serial & batch traceability", carbon: true, competitor: true },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Cloud/Azure; on-prem innovation ends ~2028",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "REST v2 (OData); ERP-shaped, key + auth",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, day one",
          competitor: "Prism agents + MCP (new, 2026); cloud-tied",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "Enterprise-grade, broad",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Partner-led; 6–18+ months",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-only; base fee + per user",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Epicor still fits",
  whereItFits:
    "Epicor's manufacturing depth is real — finite-capacity APS, tiered quality, decades of mixed-mode and ETO know-how. For a complex, multi-plant incumbent buyer willing to run a partner-led implementation, it's a defensible choice. Carbon offers the same manufacturing model, open and API-first, without the six-figure rollout or the 2028 on-prem cliff.",
  outgrowingTitle: "You may be outgrowing Epicor if…",
  outgrowing: [
    {
      title: "You don't want the six-figure rollout",
      body: "Kinetic is partner-led over months. Carbon you start yourself, free for 30 days, on published pricing.",
    },
    {
      title: "On-prem is on the clock",
      body: "Epicor's on-prem innovation ends around 2028, pushing you to its cloud. Carbon is open-source — self-host it as long as you like.",
    },
    {
      title: "Upgrades fight your customizations",
      body: "Customized Kinetic upgrades are painful. Carbon's source is yours, and every capability is an API call.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "One system instead of a module stack",
      body: "Epicor Kinetic is assembled from modules and a separate CPQ product, licensed and configured tier by tier. Carbon ships ERP, MRP, MES, QMS and the configurator on one Postgres schema — nothing to bolt together, nothing to reconcile between modules.",
    },
    {
      title: "Open and API-first",
      body: "The whole backend is yours over REST and MCP — every table, not a curated integration surface — and you can self-host with no lock-in. Point the best agents (Claude, ChatGPT, Cursor) at your live data instead of a vendor's built-in assistant.",
    },
    {
      title: "Live capacity planning, no APS project",
      body: "Epicor's finite scheduling is deep and mature, but standing it up is a configuration effort of its own. Carbon's capacity and demand update the moment the floor reports progress — the plan is live out of the box.",
    },
    {
      title: "Modern and open",
      body: "Start free for 30 days on published, per-user pricing with a self-serve rollout — instead of a partner-led implementation and a negotiated quote.",
    },
  ],
};

// ---------------------------------------------------------------------------
// ECI M1
// ---------------------------------------------------------------------------

const M1: Comparison = {
  slug: "m1",
  competitor: "M1",
  competitorFull: "ECI M1",
  category: "Job-shop ERP (Windows client)",
  headline: "Carbon vs. M1",
  metaTitle: "Carbon vs. M1 (ECI) — a modern, open manufacturing platform",
  metaDescription:
    "ECI M1 is a job-shop ERP with a dated Windows client and quote pricing. Carbon is modern, open and API-first — ERP, MRP, MES and QMS on one model.",
  subheadline:
    "ECI M1 is an established job-shop ERP with a Windows desktop client, a dated interface, quote-based pricing, and AI that hasn't reached M1 yet. Carbon is a modern, open, API-first platform — ERP, MRP, MES and QMS on one model — with a hosted MCP server and pricing in the open.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS on one data model",
          competitor: "Job-shop / discrete ERP",
        },
        {
          label: "Built for",
          carbon: "Discrete make-to-order manufacturers and job shops",
          competitor: "Small-to-mid discrete job shops",
        },
        {
          label: "Client",
          carbon: "Modern web app",
          competitor: "Windows-only desktop client (SQL Server)",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        {
          label: "Quoting, job costing & scheduling",
          carbon: true,
          competitor: true,
        },
        { label: "Shop-floor execution (MES)", carbon: true, competitor: true },
        {
          label: "Quality (QMS)",
          carbon: "Native, on the same model",
          competitor: "Native basic; deeper via uniPoint add-on",
        },
        {
          label: "Serial & batch traceability",
          carbon: "Full genealogy, built in",
          competitor: "Serial; batch/lot & recall noted weak",
        },
        { label: "Product configurator (CPQ)", carbon: true, competitor: false },
        {
          label: "3D CAD / STEP viewer",
          carbon: "Built in",
          competitor: "Via CADLink add-on",
        },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "M1 Cloud or on-prem; Windows client",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "REST API; docs gated via partner program",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, available now",
          competitor: "Announced for M1, not yet shipped; no MCP",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "ITAR-compliant cloud option",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Professional-services-led; ~8–12 weeks",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based; not published",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where M1 still fits",
  whereItFits:
    "M1 is a proven, affordable single-vendor ERP for small and mid job shops that want solid quoting, job costing and scheduling and are comfortable on Windows. Carbon offers the same job-shop loop on a modern, open, web-based platform — with the API and AI story M1 is still building.",
  outgrowingTitle: "You may be outgrowing M1 if…",
  outgrowing: [
    {
      title: "You're tied to a Windows desktop",
      body: "M1's client is a Windows app. Carbon runs in the browser, on any device on the floor.",
    },
    {
      title: "The AI never arrived",
      body: "ECI shipped its assistant to other products first; M1's is still 'coming.' Carbon ships a hosted MCP server for agents today.",
    },
    {
      title: "You want a price on the website",
      body: "M1 is quote-gated. Carbon publishes per-user pricing and a 30-day free trial.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "One record, quality included",
      body: "M1 covers quoting, job costing and scheduling well, but quality lives in the uniPoint add-on. Carbon keeps ERP, MRP, MES and QMS on one data model, so an inspection writes to the same record as the job it came from.",
    },
    {
      title: "A browser, not a desktop install",
      body: "M1 runs a Windows-only desktop client on SQL Server. Carbon is a modern web app your team opens from any machine — nothing to install, image or VPN into, on the floor or off it.",
    },
    {
      title: "Open and API-first",
      body: "The entire backend is open over REST and MCP and yours to self-host, with no lock-in. Point Claude, ChatGPT or Cursor at your live data instead of a bundled assistant.",
    },
    {
      title: "A modern web platform",
      body: "Start free for 30 days on published, per-user pricing — no sales call, and no reseller required to make a change.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Tulip
// ---------------------------------------------------------------------------

const TULIP: Comparison = {
  slug: "tulip",
  competitor: "Tulip",
  competitorFull: "Tulip",
  category: "No-code frontline app platform",
  headline: "Carbon vs. Tulip",
  metaTitle: "Carbon vs. Tulip — a system of record, not just apps",
  metaDescription:
    "Tulip is a no-code app builder for the floor, not a system of record — you still bring an ERP. Carbon is the record: ERP, MRP, MES and QMS on one model.",
  subheadline:
    "Tulip is a no-code app builder for the shop floor — powerful for digitizing work instructions, but not a system of record. You still bring an ERP and wire it in. Carbon is the system of record: ERP, MRP, MES and QMS on one model, with the whole backend on an open API.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Unified ERP + MRP + MES + QMS",
          competitor: "No-code frontline app builder",
        },
        {
          label: "System of record",
          carbon: "Yes — Carbon is the system of record",
          competitor: "No — requires a separate ERP",
        },
        {
          label: "Accounting, costing & purchasing",
          carbon: true,
          competitor: false,
        },
        {
          label: "MRP & live capacity planning",
          carbon: "Built in; updates as the floor reports",
          competitor: "Not included (build or integrate)",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        {
          label: "Work instructions / operator apps",
          carbon: true,
          competitor: true,
        },
        {
          label: "Quality (QMS)",
          carbon: "Native QMS",
          competitor: "Build quality apps; GxP on regulated tier",
        },
        {
          label: "Serial & batch traceability",
          carbon: "Full genealogy, built in",
          competitor: "Weak natively",
        },
        { label: "Product configurator (CPQ)", carbon: true, competitor: false },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Data model",
          carbon: "One unified Postgres schema",
          competitor: "App-scoped Tables + connectors to your systems",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "HTTP API over app-layer objects",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend",
          competitor: "Frontline Copilot + MCP over Tulip objects",
        },
        {
          label: "Deployment",
          carbon: "Cloud or self-host (open source)",
          competitor: "Cloud SaaS; on-prem/edge (proprietary)",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "$100–$250 / mo per interface (per station)",
        },
        { label: "Free trial", carbon: "30 days", competitor: "30 days" },
      ],
    },
  ],
  whereItFitsTitle: "Where Tulip still fits",
  whereItFits:
    "Tulip is excellent at what it's for: standing up flexible operator apps and connecting machines fast, especially in regulated frontline work. But it's a layer, not a system of record — you still run an ERP behind it. Carbon is the whole system on one model, so there's nothing behind it to buy.",
  outgrowingTitle: "You may be outgrowing Tulip if…",
  outgrowing: [
    {
      title: "You still need an ERP behind it",
      body: "Tulip builds the app; your orders, inventory and ledger live somewhere else. Carbon is that somewhere else — on the same model as the floor.",
    },
    {
      title: "You're maintaining apps, not running a factory",
      body: "Composable means you build and maintain it. Carbon ships the manufacturing model finished, and you extend it by API when you want to.",
    },
    {
      title: "Per-station pricing adds up",
      body: "Tulip bills per interface. Carbon is per user, published, with the ERP included.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "A complete system, not a layer",
      body: "Carbon is the system of record — ERP, MRP, MES and QMS on one model — so the floor, inventory, orders, costing and ledger are the same data, not apps wired to someone else's ERP.",
    },
    {
      title: "Open and API-first",
      body: "Tulip builds frontline apps and connects out to your systems. Carbon is the system of record itself, with the whole backend — every table — on an open REST API and MCP, self-hostable and pointed at the best agents.",
    },
    {
      title: "Live capacity planning",
      body: "Tulip digitizes work instructions but doesn't run MRP or capacity. Carbon plans capacity and demand on the same model, updating the moment the floor reports progress.",
    },
    {
      title: "Published pricing, ERP included",
      body: "With Tulip you still buy and wire in an ERP. Carbon includes ERP, MRP, MES and QMS — start free for 30 days on published, per-user pricing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Plex
// ---------------------------------------------------------------------------

const PLEX: Comparison = {
  slug: "plex",
  competitor: "Plex",
  competitorFull: "Plex (Rockwell Automation)",
  category: "Cloud ERP + MES suite",
  headline: "Carbon vs. Plex",
  metaTitle: "Carbon vs. Plex — open, right-sized vs. an enterprise suite",
  metaDescription:
    "Plex is a mature, closed, quote-priced cloud ERP+MES for high-volume plants. Carbon is open and self-hostable, with the full backend on API and MCP.",
  subheadline:
    "Plex (by Rockwell) is a mature cloud ERP+MES built for high-volume, repetitive plants — capable, closed, cloud-only, and priced by quote. Carbon is open and self-hostable, exposes the whole backend over API and MCP, and runs high-volume assembly and prototype parts on one model — without the enterprise weight or lock-in.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS on one data model",
          competitor: "Cloud ERP + MES + QMS suite",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "High-volume, repetitive discrete & process (automotive)",
        },
        {
          label: "Volume range",
          carbon: "High-volume assembly and prototype parts in one system",
          competitor: "High-volume plants; not built for small runs",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        { label: "Shop-floor execution (MES)", carbon: true, competitor: true },
        { label: "Quality (QMS)", carbon: true, competitor: true },
        {
          label: "Scheduling & capacity planning",
          carbon: "Live; updates as the floor reports",
          competitor: "Supply-chain planning via DemandCaster module",
        },
        { label: "Serial & batch traceability", carbon: true, competitor: true },
        { label: "Product configurator (CPQ)", carbon: true, competitor: false },
        {
          label: "3D CAD / STEP viewer",
          carbon: "Built in",
          competitor: "CAD-to-work-instructions authoring",
        },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Cloud-only SaaS; no on-prem",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "REST/JSON API + webhooks (selected endpoints)",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend",
          competitor: "Embedded AI features; no public MCP",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "IATF 16949 / automotive quality focus",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Months to a year+; services-heavy",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-only; per user + per module",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Plex still fits",
  whereItFits:
    "For a Tier-1 or Tier-2 automotive supplier running high-volume lines across plants, Plex is a mature, proven cloud ERP+MES backed by Rockwell's automation ecosystem. Carbon gives you the same unified model — open, self-hostable, and transparently priced — running high-volume assembly and prototype parts side by side, without the enterprise weight or lock-in.",
  outgrowingTitle: "You may be outgrowing Plex if…",
  outgrowing: [
    {
      title: "You run more than high-volume lines",
      body: "Plex is built for high-volume, multi-plant production and says so. Carbon runs those same lines and the prototype and low-volume work beside them — one model, any volume.",
    },
    {
      title: "Cloud-only, closed, and quoted",
      body: "Plex holds your backend in a shared cloud you can't self-host. Carbon is open-source — own the data and run it where you like.",
    },
    {
      title: "You want the whole backend for agents",
      body: "Plex's AI is embedded features. Carbon exposes the entire backend over a hosted MCP server your agents can act on.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "One system across every run size",
      body: "Plex is built for high-volume, repetitive plants. Carbon runs high-volume assembly and one-off prototype parts on the same ERP, MRP, MES and QMS model, so mixed and low-volume work isn't a second-class fit.",
    },
    {
      title: "Open and API-first",
      body: "The whole backend is open over REST and MCP, with full source access and no lock-in. Run Carbon in the cloud or self-host it, and point the best agents (Claude, ChatGPT, Cursor) at your live data instead of a vendor's built-in assistant.",
    },
    {
      title: "Live capacity planning built in",
      body: "Plex plans demand through the separate DemandCaster module. Carbon's capacity and demand update the moment the floor reports progress — on the same record, with nothing extra to license.",
    },
    {
      title: "Right-sized and open",
      body: "Start free for 30 days on published, per-user pricing with a self-serve rollout — instead of an enterprise platform sized and priced for large plants.",
    },
  ],
};

// ---------------------------------------------------------------------------
// First Resonance
// ---------------------------------------------------------------------------

const FIRST_RESONANCE: Comparison = {
  slug: "first-resonance",
  competitor: "First Resonance",
  competitorFull: "First Resonance (ION Factory OS)",
  category: "Cloud MES for hardtech",
  headline: "Carbon vs. First Resonance",
  metaTitle: "Carbon vs. First Resonance — ERP + MES on one open model",
  metaDescription:
    "First Resonance's ION is a modern MES but not a financial ERP — it leans on NetSuite. Carbon is ERP, MRP, MES and QMS on one open, self-hostable model.",
  subheadline:
    "First Resonance's ION is a modern MES for hardware teams — strong on travelers and as-built traceability, but not a financial ERP, so it leans on NetSuite for the books. Carbon is ERP, MRP, MES and QMS on one open model, self-hostable, with the whole backend on an API and MCP.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "ERP + MRP + MES + QMS in one platform",
          competitor: "Cloud MES / 'Factory OS'",
        },
        {
          label: "Built for",
          carbon: "Aerospace, defense and complex hardware, at any volume",
          competitor: "Hardtech scale-ups (space, eVTOL, robotics)",
        },
        {
          label: "Back office / ERP included",
          carbon: "Financials, purchasing, inventory, sales — built in",
          competitor: "No — integrates a separate ERP (e.g. NetSuite)",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        { label: "Work instructions / travelers", carbon: true, competitor: true },
        { label: "As-built / serial traceability", carbon: true, competitor: true },
        { label: "Quality (QMS)", carbon: true, competitor: true },
        { label: "Accounting, GL & job costing", carbon: true, competitor: false },
        {
          label: "MRP & live capacity planning",
          carbon: "Built in; updates as the floor reports",
          competitor: "Autoplan scheduling (Pro tier)",
        },
        { label: "Product configurator (CPQ)", carbon: true, competitor: false },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Cloud SaaS only (AWS/GovCloud)",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "GraphQL API (Pro-tier gated)",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend",
          competitor: "ION Intelligence agents; no public MCP",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "ITAR, GovCloud, SOC 2; FedRAMP in progress",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Enterprise sales; no self-serve",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based; no free trial",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where First Resonance still fits",
  whereItFits:
    "First Resonance is a strong, modern MES for engineering-driven hardware teams that want great travelers and as-built traceability and already run — or plan to run — NetSuite for finance. Carbon puts the MES and the ERP on one model, open and self-hostable, so there's no second system to integrate.",
  outgrowingTitle: "You may be outgrowing First Resonance if…",
  outgrowing: [
    {
      title: "You're running it next to NetSuite",
      body: "ION handles execution; NetSuite handles the books; you pay for and integrate both. Carbon is one model with the ERP inside.",
    },
    {
      title: "You want the whole backend, openly",
      body: "ION's API is Pro-tier and its AI is in-product. Carbon is open-source, with the full backend over REST and a hosted MCP server.",
    },
    {
      title: "You need to own your enclave",
      body: "ION is cloud-only. Carbon can self-host, including CMMC / NIST 800-171 and GovCloud environments you control.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "ERP and MES on one model",
      body: "ION runs travelers and as-built traceability, then leans on NetSuite for the books. Carbon is ERP, MRP, MES and QMS on one data model, so cost and the ledger roll up from the operation automatically — no second system to reconcile.",
    },
    {
      title: "Open and API-first",
      body: "Where ION gates its API behind a Pro tier and keeps its AI in-product, Carbon is open-source, with the whole backend over REST and a hosted MCP server, self-hostable and pointed at the best agents.",
    },
    {
      title: "Live capacity planning",
      body: "Beyond travelers and traceability, Carbon plans finite capacity and demand on the same record, updating the moment the floor reports progress.",
    },
    {
      title: "Own your enclave",
      body: "ION is cloud-only. Carbon can self-host — including CMMC / NIST 800-171 and GovCloud environments you control — and starts free for 30 days on published, per-user pricing.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Palantir
// ---------------------------------------------------------------------------

const PALANTIR: Comparison = {
  slug: "palantir",
  competitor: "Palantir",
  competitorFull: "Palantir (Foundry + AIP)",
  category: "Data & ontology platform",
  headline: "Carbon vs. Palantir",
  metaTitle: "Carbon vs. Palantir — a finished ERP vs. build-your-own",
  metaDescription:
    "Palantir Foundry is a build-your-own platform you model at enterprise cost. Carbon ships manufacturing finished — ERP, MRP, MES and QMS, public pricing.",
  subheadline:
    "Palantir Foundry is a platform for modeling data and building operational apps — powerful, but you define every business object (the ontology) and build the workflows yourself, usually with forward-deployed engineers and an enterprise contract. Carbon ships the manufacturing model finished: ERP, MRP, MES and QMS on one open data model, running in days.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Packaged manufacturing OS: ERP + MRP + MES + QMS",
          competitor: "Data-integration & ontology platform",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "Large enterprise & defense; cross-system integration",
        },
        {
          label: "Manufacturing model",
          carbon: "Ships finished on one Postgres data model",
          competitor: "You define the ontology & build the workflows",
        },
        {
          label: "Out-of-the-box manufacturing",
          carbon: "BOMs, routings, work orders, quality — built in",
          competitor: "None packaged — you build it",
        },
      ],
    },
    {
      title: "Capabilities",
      rows: [
        {
          label: "MRP & live capacity planning",
          carbon: "Built in; updates as the floor reports",
          competitor: "Build it on your ontology",
        },
        {
          label: "Shop-floor execution (MES)",
          carbon: "Built in",
          competitor: "Build it on your ontology",
        },
        {
          label: "Quality (QMS)",
          carbon: "Built in",
          competitor: "Build it on your ontology",
        },
        {
          label: "Serial & batch traceability",
          carbon: "Full genealogy, built in",
          competitor: "Model it yourself",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Built in",
          competitor: "Build it yourself",
        },
        {
          label: "3D CAD / STEP viewer",
          carbon: "Built in",
          competitor: "Build it yourself",
        },
      ],
    },
    {
      title: "Platform & ownership",
      rows: [
        {
          label: "Data model",
          carbon: "One finished Postgres schema",
          competitor: "An ontology you define over your systems",
        },
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "No — proprietary",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "Ontology SDK + Platform APIs",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the finished manufacturing backend",
          competitor: "MCP over the ontology you built",
        },
        {
          label: "Deployment",
          carbon: "Cloud or self-host (open source)",
          competitor: "SaaS, on-prem or air-gapped (Apollo); proprietary",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "FedRAMP High, IL5/IL6, air-gapped (very strong)",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Time to value",
          carbon: "Live in days, self-serve",
          competitor: "Days only with a forward-deployed-engineer build",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Quote-based; ~$250K–$2M+ / year (reported)",
        },
        {
          label: "Free trial",
          carbon: "30 days, production-ready",
          competitor: "Free developer tier (prototyping, not production)",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Palantir still fits",
  whereItFits:
    "Palantir is in a class of its own for huge-scale data integration and building an enterprise-wide operational digital twin across many systems — and for classified, air-gapped defense programs at the IL5/IL6 tier. If you need to unify dozens of messy data sources and have the engineers or budget to build on top, it's formidable. For a manufacturer who needs an ERP and a shop floor, Carbon already is one.",
  outgrowingTitle: "Why manufacturers choose Carbon over Palantir",
  outgrowing: [
    {
      title: "You need an ERP, not a toolkit",
      body: "Palantir gives you the platform to build a manufacturing system; Carbon is the manufacturing system. BOMs, routings, work orders, quality and traceability already exist.",
    },
    {
      title: "You don't have a forward-deployed budget",
      body: "Palantir deployments run from a quarter-million to millions a year, and year one often costs twice the license. Carbon is $40–$100 per user per month, published, with a 30-day free trial.",
    },
    {
      title: "You don't want to model from scratch",
      body: "In Palantir you define every object and workflow before you can run a job. In Carbon the manufacturing model is finished on day one, and you extend it by API when you need to.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Finished, not build-your-own",
      body: "Carbon ships the manufacturing model — BOMs, routings, work orders, quality, traceability and planning — already built on one data model. There's no ontology to define before you can quote a part.",
    },
    {
      title: "Open and API-first",
      body: "The source is yours: run Carbon in the cloud or self-host it, with no lock-in. The whole backend — every table and capability — is reachable over the REST API and a hosted MCP server your agents can read and act on.",
    },
    {
      title: "Live capacity planning",
      body: "Capacity and demand forecasts update the moment the floor reports progress — not on the next overnight run — so the plan you're looking at is the plan that's true.",
    },
    {
      title: "Priced for a manufacturer",
      body: "Published, per-user pricing and a 30-day free trial — not a platform subscription measured in hundreds of thousands and a services engagement to match.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Odoo
// ---------------------------------------------------------------------------

const ODOO: Comparison = {
  slug: "odoo",
  competitor: "Odoo",
  competitorFull: "Odoo (Community & Enterprise)",
  category: "All-in-one business suite",
  headline: "Carbon vs. Odoo",
  metaTitle: "Carbon vs. Odoo — manufacturing-native vs. all-in-one suite",
  metaDescription:
    "In Odoo, manufacturing is one app and Quality/PLM/Shop Floor need paid Enterprise. Carbon is manufacturing-native: ERP, MRP, MES and QMS on one model.",
  subheadline:
    "Odoo grew up as a sales, CRM, ecommerce and accounting suite — it even dropped the “ERP” from its name to sell CRM and websites — and manufacturing is one app among dozens. It shows on the floor: Odoo's own team says it “provides MRP instead of finite capacity,” so real shops bolt on a third-party scheduler, a third-party quality app, and custom code they re-validate on every upgrade. Carbon is manufacturing-native — ERP, MRP, MES and QMS on one model, with finite planning, nested BOMs and real quality built in.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Manufacturing ERP + MRP + MES + QMS on one model",
          competitor: "Sales, CRM, ecommerce & accounting suite; manufacturing is one app",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "SMBs across many departments — sales, ecommerce, accounting, light manufacturing",
        },
        {
          label: "Manufacturing focus",
          carbon: "The whole product",
          competitor: "One app among ~80; depth needs paid Enterprise plus add-ons",
        },
      ],
    },
    {
      title: "Manufacturing depth",
      rows: [
        {
          label: "Finite capacity planning",
          carbon: "Live finite planning; updates as the floor reports",
          competitor: "Infinite-capacity MRP; finite scheduling needs a bolt-on (frePPLe)",
        },
        {
          label: "Shop-floor execution (MES)",
          carbon: "Full MES on the same model",
          competitor: "Shop Floor app — Enterprise-only; lighter than a dedicated MES",
        },
        {
          label: "Quality (QMS)",
          carbon: "Nonconformance, CAPA, dispositions, calibration, first-article",
          competitor: "Control points & alerts (Enterprise); no native CAPA/FAI — build & validate it yourself",
        },
        {
          label: "Multi-level BOM & traceability",
          carbon: "Nested BOMs with full as-built genealogy",
          competitor: "Multi-level & phantom BOMs; deep nesting strains planning — tuning advice is to flatten them",
        },
        {
          label: "PLM / engineering change (ECO)",
          carbon: "Built in",
          competitor: "PLM / ECOs — Enterprise-only",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Parametric BoM, routing and price per order",
          competitor: "Attribute-based product variants, not parametric",
        },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & openness",
      rows: [
        {
          label: "Source & licensing",
          carbon: "Open source; the entire codebase is yours",
          competitor: "Open core: Community (LGPL) free; manufacturing depth needs paid Enterprise",
        },
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Odoo Online, Odoo.sh or self-host",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "XML-RPC / JSON-RPC; newer JSON-2 API; external API on the Custom plan only",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "Hosted MCP over the full backend, read & write",
          competitor: "No official MCP (third-party add-ons); native AI is Enterprise",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "Not offered natively",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Partner-led config that often turns into customization",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Community free; Enterprise ~$31–$76 / user / mo; manufacturing stack needs Enterprise",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where Odoo still fits",
  whereItFits:
    "Odoo is an excellent broad SMB suite — if you want CRM, ecommerce, accounting, inventory and light assembly on one open platform, few things match its breadth or price, and it's a capable light-manufacturing tool. Carbon is the better fit when manufacturing is the point: when nested BOMs, finite scheduling, real quality and as-built traceability are the job, not a module you configure.",
  outgrowingTitle: "You may be outgrowing Odoo if…",
  outgrowing: [
    {
      title: "You're paying Enterprise and still bolting things on",
      body: "Manufacturing depth is Enterprise-only — and even then, finite scheduling means adding frePPLe, real quality means a third-party CAPA app, and complex work means custom code. Carbon ships MES, MRP and QMS as the core product, on one model.",
    },
    {
      title: "The schedule can't see the machine",
      body: "Odoo's own team says it “provides MRP instead of finite capacity,” so nothing stops it booking three jobs onto one work center on the same day. Carbon plans against real capacity and updates the moment the floor reports.",
    },
    {
      title: "Deep BOMs fight the planner",
      body: "On multi-level products, component demand can surface days before the deadline, and the standard tuning advice is to flatten the BOM. Carbon runs nested BOMs with full as-built genealogy — no simplifying the product to fit the tool.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Manufacturing-native, not one app in a sales suite",
      body: "Odoo's roots and strongest apps are CRM, ecommerce and accounting; Carbon is built around the part, the BoM and the routing, with finite planning, MES and QMS as the core — not an Enterprise app plus a frePPLe integration plus a third-party CAPA module.",
    },
    {
      title: "Open, with no Enterprise tier",
      body: "Odoo is open-core: much of what a factory needs sits behind the paid Enterprise edition and third-party apps. Carbon's whole backend — every table — is open over REST and MCP with full source access, and there is no feature-gated tier above you.",
    },
    {
      title: "Finite capacity, built in",
      body: "Odoo's own team says it \"provides MRP instead of finite capacity,\" so shops bolt on a third-party scheduler. Carbon runs finite capacity planning natively, updating the moment the floor reports progress.",
    },
    {
      title: "No Enterprise paywall",
      body: "No Enterprise licence, and no frePPLe or third-party CAPA apps to re-validate on every upgrade. Start free for 30 days on published, per-user pricing, with the source yours.",
    },
  ],
};

// ---------------------------------------------------------------------------
// ERPNext
// ---------------------------------------------------------------------------

const ERPNEXT: Comparison = {
  slug: "erpnext",
  competitor: "ERPNext",
  competitorFull: "ERPNext (Frappe)",
  category: "Open-source all-in-one ERP",
  headline: "Carbon vs. ERPNext",
  metaTitle: "Carbon vs. ERPNext — manufacturing-native vs. all-in-one ERP",
  metaDescription:
    "ERPNext is an open all-in-one ERP where manufacturing is one module. Carbon is manufacturing-native: ERP, MRP, MES and QMS with finite scheduling and a QMS.",
  subheadline:
    "ERPNext is a genuinely good open-source ERP — free, fully self-hostable, with an auto-generated REST API over everything — where manufacturing is one module in a broad suite. Carbon is manufacturing-native: ERP, MRP, MES and QMS on one model, so finite capacity planning, deep quality, as-built genealogy and a parametric configurator are the product, not a module you extend.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "Manufacturing ERP + MRP + MES + QMS on one model",
          competitor: "Open-source all-in-one ERP; manufacturing is one module",
        },
        {
          label: "Built for",
          carbon: "Discrete manufacturers, from prototype to rate production",
          competitor: "SMBs wanting broad ERP breadth on a budget",
        },
        {
          label: "Manufacturing focus",
          carbon: "The whole product",
          competitor: "One module among accounting, CRM, HR, stock, ecommerce…",
        },
      ],
    },
    {
      title: "Manufacturing depth",
      rows: [
        {
          label: "Finite capacity planning",
          carbon: "Live finite planning; updates as the floor reports",
          competitor: "Basic same-day capacity allocation; no APS, Gantt or what-if",
        },
        {
          label: "Shop-floor execution (MES)",
          carbon: "Full MES on the same model",
          competitor: "Job Cards + basic Visual Plant Floor; no first-party operator app",
        },
        {
          label: "Quality (QMS)",
          carbon: "Nonconformance, CAPA, dispositions, calibration, first-article",
          competitor: "Inspections + ISO-goal tracking; no native CAPA engine, calibration or FAI",
        },
        {
          label: "Multi-level BOM & traceability",
          carbon: "Nested BOMs with full as-built genealogy",
          competitor: "Multi-level BOMs & batch/serial; deep as-built genealogy is limited",
        },
        {
          label: "Product configurator (CPQ)",
          carbon: "Parametric BoM, routing and price per order",
          competitor: "Item variants (attributes), not parametric",
        },
        { label: "3D CAD / STEP viewer", carbon: true, competitor: false },
      ],
    },
    {
      title: "Platform & openness",
      rows: [
        {
          label: "Source & licensing",
          carbon: "Open source; the entire codebase is yours",
          competitor: "Open source (GPLv3), fully free — like Carbon",
        },
        {
          label: "Deployment",
          carbon: "Cloud or self-host",
          competitor: "Self-host free; Frappe Cloud (managed)",
        },
        {
          label: "API coverage",
          carbon: "Full backend over REST — every table",
          competitor: "Auto-generated REST over every DocType — genuinely strong",
        },
        {
          label: "AI / agent-ready (MCP)",
          carbon: "First-party hosted MCP over the full backend",
          competitor: "Community MCP servers; no official first-party MCP",
        },
        {
          label: "ITAR / GovCloud / CMMC",
          carbon: "ITAR, GovCloud & CMMC / NIST 800-171 ready",
          competitor: "Not offered natively",
        },
      ],
    },
    {
      title: "Getting started",
      rows: [
        {
          label: "Implementation",
          carbon: "Self-serve; live in days",
          competitor: "Self-host + partner setup; Linux/dev skills to run",
        },
        {
          label: "Pricing",
          carbon: "$40–$100 / user / mo, published",
          competitor: "Free self-hosted; Frappe Cloud is usage-based",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where ERPNext still fits",
  whereItFits:
    "ERPNext is a real achievement: a free, fully open-source ERP with genuine breadth — accounting, inventory, CRM, HR, purchasing and light manufacturing — and one of the best auto-generated REST APIs in the category. If budget is tight, breadth matters more than manufacturing depth, and you have the developers to run and extend it, it's an excellent choice. Carbon is for teams whose center of gravity is the factory, where finite scheduling, deep quality and as-built traceability need to be native, not assembled.",
  outgrowingTitle: "You may be outgrowing ERPNext if…",
  outgrowing: [
    {
      title: "Scheduling can't see real capacity",
      body: "ERPNext does basic same-day allocation — no APS, no Gantt, no what-if. Carbon plans against finite capacity and updates the moment the floor reports.",
    },
    {
      title: "Quality is a tracker, not a system",
      body: "ERPNext has inspections and ISO-goal tracking, but no native CAPA engine, calibration or first-article. Carbon ships a real QMS on the same model as production.",
    },
    {
      title: "Traceability stops short of as-built",
      body: "Batch and serial tracking are there, but deep multi-level genealogy for complex assemblies isn't ERPNext's strength. Carbon carries full as-built genealogy through nested BOMs.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Manufacturing-native, not one module of many",
      body: "ERPNext is a broad ERP with a manufacturing module; Carbon is built around the part, the BoM and the routing, with quality, MES and planning as the core — so manufacturing depth is designed in, not assembled.",
    },
    {
      title: "The depth ERPNext leaves to you",
      body: "Finite capacity planning, a real QMS (CAPA, calibration, first-article), a parametric configurator and a native 3D/STEP viewer ship in the box — where ERPNext needs customization or add-ons.",
    },
    {
      title: "Open, and agent-ready",
      body: "Like ERPNext, Carbon is open source with a full REST API. It adds a first-party hosted MCP server over the whole backend, so you can point Claude, ChatGPT or Cursor at live manufacturing data — plus CMMC / NIST 800-171 readiness for defense work.",
    },
    {
      title: "Live capacity planning",
      body: "Capacity and demand forecasts update the moment the floor reports progress — not on the next planning run — so the plan you're looking at is the plan that's true.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Building it yourself
// ---------------------------------------------------------------------------

const BUILD: Comparison = {
  slug: "build-it-yourself",
  competitor: "Building it yourself",
  competitorFull: "Building it yourself",
  category: "The build-vs-buy decision",
  headline: "Carbon vs. building it yourself",
  metaTitle: "Carbon vs. building your own ERP/MES — buy vs. build",
  metaDescription:
    "Building your own ERP/MES costs years and a standing team. Carbon gives the same control — full source ownership — without building it, live in days.",
  subheadline:
    "The most common reason teams build their own ERP or MES is control — they want to own it and shape it to their process. Carbon gives you that same control: the full source code is yours to run, audit and extend. The difference is you start from a finished manufacturing platform instead of a blank repo and a multi-year roadmap.",
  stats: CARBON_STATS,
  groups: [
    {
      title: "Scope & fit",
      rows: [
        {
          label: "What it is",
          carbon: "A finished platform — ERP, MRP, MES, QMS",
          competitor: "A blank repo and a multi-year roadmap",
        },
        {
          label: "Time to first value",
          carbon: "Live in days",
          competitor: "12–24 months to a usable v1",
        },
        {
          label: "Manufacturing model",
          carbon: "Proven schema out of the box",
          competitor: "You design every table from scratch",
        },
        {
          label: "Coverage on day one",
          carbon: "BOMs, routing, MRP, QMS, traceability, costing, accounting",
          competitor: "Every module built from zero",
        },
      ],
    },
    {
      title: "Ownership & control",
      rows: [
        {
          label: "Full ownership of the code",
          carbon: "Yes — the entire codebase is yours",
          competitor: "Yes — but you write and own every line",
        },
        {
          label: "Customize & extend",
          carbon: "Fork the source; add over REST & MCP",
          competitor: "Total — it's all yours to build",
        },
        {
          label: "Own your data model",
          carbon: "Open Postgres you control",
          competitor: "Yours — once you've built it",
        },
        {
          label: "Run it anywhere (incl. ITAR/GovCloud)",
          carbon: "Ready to self-host",
          competitor: "Yours to host, secure and certify",
        },
      ],
    },
    {
      title: "Cost & risk",
      rows: [
        {
          label: "Upfront investment",
          carbon: "Significantly less than a programmer",
          competitor: "A standing engineering team, indefinitely",
        },
        {
          label: "Ongoing maintenance",
          carbon: "Included — updates, security, backups",
          competitor: "Yours forever",
        },
        {
          label: "Risk of never shipping",
          carbon: "Shipping today",
          competitor: "High — most in-house builds stall or sprawl",
        },
        {
          label: "Compliance (ITAR / CMMC)",
          carbon: "Ready",
          competitor: "Design, build and certify it yourself",
        },
      ],
    },
  ],
  whereItFitsTitle: "Where building it yourself still fits",
  whereItFits:
    "Building your own makes sense if manufacturing software is your product, or your process is so singular that no system could model it. For everyone else, the reason to build — owning and controlling your stack — is exactly what Carbon gives you without the multi-year bill: the full source code is yours from day one.",
  outgrowingTitle: "Reasons not to build it yourself",
  outgrowing: [
    {
      title: "The reason to build is ownership",
      body: "You want to own and control your stack. With Carbon you already do — the full source code is yours — so building from scratch buys you nothing you don't already get.",
    },
    {
      title: "Your engineers should build your product",
      body: "Every month spent on an in-house ERP is a month not spent on what you sell. Carbon frees the team to build the thing customers actually pay for.",
    },
    {
      title: "Most in-house builds never finish",
      body: "ERP/MES is a moving target — new parts, processes and compliance. Carbon ships today and keeps evolving, without a permanent internal software project.",
    },
  ],
  reasonsTitle: "Why manufacturers choose Carbon",
  reasons: [
    {
      title: "Own it without building it",
      body: "Carbon is the one manufacturing system that hands you the full source code. You get the ownership and control that drives teams to build — without the blank repo or the multi-year roadmap.",
    },
    {
      title: "Live in days, not years",
      body: "Start from a finished ERP, MRP, MES and QMS on one data model, and extend it over the API and a hosted MCP server when you need to.",
    },
    {
      title: "Someone else maintains the plumbing",
      body: "Updates, security and backups are handled. Your engineers extend the parts that make you different instead of maintaining an ERP.",
    },
    {
      title: "Priced like software, not a project",
      body: "Published, per-user pricing and a 30-day free trial — not several salaries a year with an uncertain finish line.",
    },
  ],
};

// ---------------------------------------------------------------------------

const COMPARISONS: Comparison[] = [
  NETSUITE,
  MANUFACTURO,
  FULCRUM,
  SAP_B1,
  EPICOR,
  PLEX,
  M1,
  TULIP,
  FIRST_RESONANCE,
  PALANTIR,
  ODOO,
  ERPNEXT,
  BUILD,
];

const BY_SLUG = new Map(COMPARISONS.map((c) => [c.slug, c]));

export function getComparison(slug: string): Comparison | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getComparisons(): Comparison[] {
  return COMPARISONS;
}

export const COMPARISON_SLUGS = COMPARISONS.map((c) => c.slug);

/** Render a cell for the Markdown representation. */
function mdCell(value: CompareValue): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  // Escape pipes so a phrase can't break the Markdown table.
  return value.replace(/\|/g, "\\|");
}

/** The Markdown representation of a comparison, for agents and `.md` URLs. */
export function comparisonMarkdown(c: Comparison, siteUrl: string): string {
  const lines: string[] = [];
  lines.push(`# ${c.headline}`, "");
  lines.push(`> ${c.subheadline}`, "");

  for (const group of c.groups) {
    lines.push(`## ${group.title}`, "");
    lines.push(`| | Carbon | ${c.competitor} |`);
    lines.push(`| --- | --- | --- |`);
    for (const row of group.rows) {
      lines.push(`| ${row.label} | ${mdCell(row.carbon)} | ${mdCell(row.competitor)} |`);
    }
    lines.push("");
  }

  lines.push(`## ${c.whereItFitsTitle}`, "", c.whereItFits, "");

  lines.push(`## ${c.outgrowingTitle}`, "");
  for (const card of c.outgrowing) {
    lines.push(`- **${card.title}.** ${card.body}`);
  }
  lines.push("");

  lines.push(`## ${c.reasonsTitle}`, "");
  for (const card of c.reasons) {
    lines.push(`- **${card.title}.** ${card.body}`);
  }
  lines.push("");

  lines.push(
    `Start a 30-day free trial at ${siteUrl.replace("//carbon", "//app.carbon")}, see pricing at ${siteUrl}/pricing, or read the source at https://github.com/crbnos/carbon.`,
  );

  return lines.join("\n");
}

/** The Markdown index of every comparison. */
export function comparisonsIndexMarkdown(siteUrl: string): string {
  const lines: string[] = [];
  lines.push("# Compare Carbon", "");
  lines.push(
    "> How Carbon — an open-source, API-first manufacturing platform (ERP, MRP, MES and QMS on one data model) — compares to other manufacturing software.",
    "",
  );
  for (const c of COMPARISONS) {
    lines.push(`- [${c.headline}](${siteUrl}/compare/${c.slug}) — vs. ${c.category}.`);
  }
  lines.push("");
  return lines.join("\n");
}
