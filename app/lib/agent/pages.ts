/**
 * The Markdown representation of every static page on carbon.ms.
 *
 * One URL, two representations: `Accept: text/html` gets the React page,
 * `Accept: text/markdown` gets the text below. Both are served from the same
 * URL with `Vary: Accept`, and `<path>.md` addresses the Markdown variant
 * directly for clients that cannot set headers.
 *
 * These are literals rather than a conversion of the rendered DOM on purpose:
 * the pages are marketing layouts whose value is in the copy, not in the
 * chrome, and a converted page would hand an agent the nav, the footer and the
 * decorative SVGs on every request. The legal pages carry their outline and
 * point at the HTML, which is the authoritative text — a paraphrased contract
 * would be worse than a pointer to the real one.
 */

import {
  API_VERSIONING,
  APP_URL,
  DEVELOPER_RESOURCES,
  DOCS_URL,
  OAUTH_METADATA,
  LEARN_URL,
  MCP_URL,
  REPO_URL,
  REST_URL,
  SITE_URL,
  STATUS_URL,
  SUPPORT_EMAIL,
} from "./site";

export type AgentPage = {
  /** Canonical pathname, no trailing slash (the site root is `/`). */
  path: string;
  title: string;
  markdown: string;
};

/** Links every Markdown page ends with, so an agent can always keep moving. */
const FOOTER = [
  "## Elsewhere on carbon.ms",
  "",
  `- [Agent guidance](${SITE_URL}/llms.txt)`,
  `- [Developer resources](${SITE_URL}/developers)`,
  `- [OpenAPI specification](${SITE_URL}/openapi.json)`,
  `- [MCP manifest](${SITE_URL}/.well-known/mcp.json)`,
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
].join("\n");

function page(path: string, title: string, body: string): AgentPage {
  return {
    path,
    title,
    markdown: `# ${title}\n\n${body.trim()}\n\n${FOOTER}\n`,
  };
}

const INDEX = page(
  "/",
  "Carbon Manufacturing Systems",
  `
Carbon is the engineering-first operating system for manufacturers. Quote, plan,
buy, build, inspect and ship on one live model of your factory — from a
ten-person prototype shop to a rate-production line.

## What Carbon is

Legacy ERPs were built for accountants in the 1990s. Carbon is four systems —
ERP, MRP, MES and QMS — on one schema, so there is nothing to integrate. Every
stage writes to the same record: no handoffs, no re-keying, no reconciliation.

- **CAD to cash, unbroken.** The engineering record and the production record
  are the same record.
- **An API for the entire organization.** Every capability in the product is
  reachable over the [REST API](${REST_URL}) and the
  [MCP server](${MCP_URL}).
- **If it has a bill of materials, Carbon runs it.** Regulated or not, one-off
  or rate production — the primitives are the same, and the configuration is
  yours.
- **Auditable by construction.** Immutable ledgers, granular permissions, and
  the controls regulated programs are held to.
- **Source available.** The whole system is on
  [GitHub](${REPO_URL}); run it hosted or self-host it.

## Where to go next

- [Pricing](${SITE_URL}/pricing) — plans, and the source-available option.
- [Developers](${SITE_URL}/developers) — API, MCP, webhooks, and the OpenAPI spec.
- [Documentation](${DOCS_URL}) — guides and reference.
- [Sign in or start a trial](${APP_URL}).
- [Contact sales](${SITE_URL}/contact).
`,
);

const PRICING = page(
  "/pricing",
  "Carbon pricing",
  `
Simple pricing based on your needs. Billed per user, monthly. 30-day free trial.
Cancel anytime.

## Starter — $40/user/month

A managed cloud-hosted version of Carbon. Self-serve.

- Automatic updates and backups
- Basic ERP, MES, and QMS functionality
- Unlimited records
- Self-onboarding
- Community support

[Start a 30-day free trial](${APP_URL})

## Business — $100/user/month

A managed cloud-hosted version of Carbon that includes support and all advanced
features. 5 user minimum.

- Technical support
- API, webhooks, and integrations
- Accounting
- Audit logging
- All advanced features available

[Start a 30-day free trial](${APP_URL})

## Enterprise — contact us

A custom solution to meet your needs.

- Self-hosted or managed
- Forward deployed engineer
- Customizations, training, and integrations
- ITAR compliant
- Full setup and migrations
- SSO/SAML
- Unlimited functional support

[Contact us](${SITE_URL}/contact)

## Self-host

The open source core is on [GitHub](${REPO_URL}) under a source-available
license. See the [documentation](${DOCS_URL}) for deployment.
`,
);

const ABOUT = page(
  "/about",
  "About Carbon Manufacturing Systems",
  `
Carbon Manufacturing Systems Corporation builds Carbon, an API-first operating
system for manufacturing.

The [About page](${SITE_URL}/about) carries the founder memo: why the team
believes manufacturing software should be one schema rather than four
integrations, and why the source code ships with the product.

- [Founder memo](${SITE_URL}/about)
- [Blog and articles](${SITE_URL}/learn)
- [Brand assets](${SITE_URL}/brand)
- [Contact](${SITE_URL}/contact)
- [Source code](${REPO_URL})
`,
);

const CONTACT = page(
  "/contact",
  "Contact Carbon",
  `
Talk to the Carbon team about the product, pricing, migrations, self-hosting, or
an enterprise deployment.

- **Contact form:** [carbon.ms/contact](${SITE_URL}/contact)
- **Sales:** [carbon.ms/sales](${SITE_URL}/sales)
- **Support email:** [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL})
- **System status:** [${STATUS_URL}](${STATUS_URL})
- **Issues and source code:** [${REPO_URL}](${REPO_URL})

The contact form asks for your name, work email, company and a message, and is
rate-limited. It is the fastest route to a human.
`,
);

const BRAND = page(
  "/brand",
  "Carbon brand assets",
  `
Logos, wordmarks and usage guidance for Carbon Manufacturing Systems.

Download the full set from [carbon.ms/brand](${SITE_URL}/brand). Individual
files are served from \`/brand\`:

- \`${SITE_URL}/brand/carbon-word-light.svg\` — wordmark, light backgrounds
- \`${SITE_URL}/brand/carbon-word-dark.svg\` — wordmark, dark backgrounds
- \`${SITE_URL}/brand/carbon-mark-light.svg\` — mark, light backgrounds
- \`${SITE_URL}/brand/carbon-mark-dark.svg\` — mark, dark backgrounds

Use the product name "Carbon" or the legal name "Carbon Manufacturing Systems
Corporation". Do not recolour, rotate, or add effects to the mark.
`,
);

const DEVELOPERS = page(
  "/developers",
  "Carbon developer resources",
  `
Everything needed to build against Carbon: the REST API, the MCP server, the
OpenAPI specification, webhooks, and the source code.

## Quick start

1. Create a scoped API key in Settings → API Keys at
   [${APP_URL}/x/settings/api-keys](${APP_URL}/x/settings/api-keys).
2. Send it on every request as \`Authorization: Bearer <api-key>\` (the
   \`carbon-key\` header works identically).
3. Call a resource:

\`\`\`bash
curl '${REST_URL}/item?limit=1' \\
  -H "Authorization: Bearer <api-key>"
\`\`\`

The key is scoped to one company and to the module permissions you check when
creating it, and the database enforces those scopes with row-level security —
not just the application layer.

## OAuth 2.0

An agent that cannot hold a long-lived key can obtain a token instead.
[${APP_URL}](${APP_URL}) is the authorization server; its metadata is published
at [\`/.well-known/oauth-authorization-server\`](${OAUTH_METADATA.authorizationServer})
(RFC 8414), and protected-resource metadata at
[\`/.well-known/oauth-protected-resource\`](${OAUTH_METADATA.protectedResource})
(RFC 9728). Both paths on \`carbon.ms\` redirect to them, so either origin
resolves.

The MCP endpoint returns \`401\` with
\`WWW-Authenticate: Bearer resource_metadata="..."\` pointing at the same
document, which is the discovery path a compliant MCP client follows on its own.

## Versioning and deprecation

${API_VERSIONING.rules.map((rule) => `- ${rule}`).join("\n")}

## Connect an agent over MCP

Carbon's MCP server speaks the Streamable HTTP transport at
[${MCP_URL}](${MCP_URL}). It authenticates with the same API key (as a bearer
token) or with OAuth. The machine-readable manifest is at
[${SITE_URL}/.well-known/mcp.json](${SITE_URL}/.well-known/mcp.json).

## Resources

${DEVELOPER_RESOURCES.map(
  (resource) => `- [${resource.name}](${resource.url}) — ${resource.description}`,
).join("\n")}
`,
);

const PRIVACY = page(
  "/privacy",
  "Carbon privacy policy",
  `
The authoritative text is the HTML page at
[${SITE_URL}/privacy](${SITE_URL}/privacy). This is its outline.

1. Information we collect — account and organization data, usage data, and data
   your organization loads into the platform.
2. How we use information — operating the platform, support, security, and
   product communication.
3. Sharing and subprocessors — see [subprocessors](${SITE_URL}/subprocessors).
4. Third-party apps you connect to the platform.
5. Data retention and security.
6. Your rights (access, correction, deletion, objection, portability, consent
   withdrawal) and how to exercise them.
7. Do Not Track — the platform does not track across third-party sites.
8. Changes to this policy.
9. Contact — [info@carbon.ms](mailto:info@carbon.ms).
`,
);

const TERMS = page(
  "/terms",
  "Carbon terms of service",
  `
The authoritative text is the HTML page at
[${SITE_URL}/terms](${SITE_URL}/terms). This is its outline.

1. Acceptance of the terms and eligibility.
2. Accounts, organizations, and your responsibilities.
3. Subscriptions, fees, billing, and trials.
4. Acceptable use and prohibited conduct.
5. Customer data, ownership, and licence grants.
6. Intellectual property and the source-available licence.
7. Third-party services and integrations.
8. Warranties, disclaimers, and limitation of liability.
9. Indemnification.
10. Term, suspension, and termination.
11. Governing law — the State of Delaware — and dispute resolution by
    arbitration.
12. Changes to the terms, and contact at
    [${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).
`,
);

const SUBPROCESSORS = page(
  "/subprocessors",
  "Carbon subprocessors",
  `
The current list, with each subprocessor's purpose and processing location, is
the HTML page at [${SITE_URL}/subprocessors](${SITE_URL}/subprocessors).

Questions about a subprocessor, or a request for notice of changes, go to
[${SUPPORT_EMAIL}](mailto:${SUPPORT_EMAIL}).
`,
);

const LEARN_FALLBACK = page(
  "/learn",
  "Carbon blog",
  `
Articles on manufacturing systems and Carbon.

- [Read on carbon.ms](${SITE_URL}/learn)
- [Learning center](${LEARN_URL})
`,
);

const PAGES: AgentPage[] = [
  INDEX,
  PRICING,
  ABOUT,
  CONTACT,
  BRAND,
  DEVELOPERS,
  PRIVACY,
  TERMS,
  SUBPROCESSORS,
  LEARN_FALLBACK,
];

const PAGES_BY_PATH = new Map(PAGES.map((entry) => [entry.path, entry]));

/** Every path with a Markdown representation, for tests and the sitemap. */
export const AGENT_PAGE_PATHS = PAGES.map((entry) => entry.path);

/**
 * Reduce a request pathname to the canonical page path, and report whether the
 * client addressed the Markdown variant explicitly with a `.md` suffix.
 */
export function resolveMarkdownPath(pathname: string): {
  path: string;
  explicit: boolean;
} {
  let path = pathname;
  let explicit = false;

  if (path.endsWith(".md")) {
    path = path.slice(0, -".md".length);
    explicit = true;
  }

  // `/pricing/` and `/pricing` are the same page; `/` keeps its slash.
  path = path.replace(/\/+$/, "") || "/";

  // The home page's Markdown variant is `/index.md` — `/.md` is not a URL
  // anyone would type, and `/index` is the conventional stand-in.
  if (path === "/index") path = "/";

  return { path, explicit };
}

/** The Markdown page for a canonical path, or `null` if there isn't one. */
export function getAgentPage(path: string): AgentPage | null {
  return PAGES_BY_PATH.get(path) ?? null;
}
