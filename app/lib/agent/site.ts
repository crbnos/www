/**
 * One description of Carbon's public surface, shared by everything an agent
 * reads: the Organization/WebSite JSON-LD graph in `root.tsx`, the `/developers`
 * page, the Markdown representations, the OpenAPI document and the MCP manifest.
 *
 * Keeping it in one module is what stops those artifacts from disagreeing with
 * each other — an agent that finds two different MCP endpoints trusts neither.
 */

export const SITE_URL = "https://carbon.ms";
export const APP_URL = "https://app.carbon.ms";
export const DOCS_URL = "https://docs.carbon.ms";
export const REST_URL = "https://rest.carbon.ms";
export const LEARN_URL = "https://learn.carbon.ms";
export const STATUS_URL = "https://status.carbon.ms";
export const REPO_URL = "https://github.com/crbnos/carbon";

/** The Streamable HTTP MCP endpoint, as registered in an agent's config. */
export const MCP_URL = `${APP_URL}/api/mcp`;

/**
 * OAuth 2.0 lives on the app, not here.
 *
 * `app.carbon.ms` is the authorization server and the resource server; carbon.ms
 * is the marketing domain and issues no tokens. RFC 8414 requires the `issuer` in
 * authorization-server metadata to match the origin the document is served from,
 * so carbon.ms REDIRECTS to the app's metadata rather than mirroring it — a copy
 * served here would carry `issuer: app.carbon.ms` at a carbon.ms URL, and a
 * conforming client is required to reject exactly that.
 */
export const OAUTH_METADATA = {
  authorizationServer: `${APP_URL}/.well-known/oauth-authorization-server`,
  protectedResource: `${APP_URL}/.well-known/oauth-protected-resource`,
} as const;

/**
 * What an agent can rely on about the API's shape over time.
 *
 * Stated as fact, not aspiration: the first two points describe artifacts served
 * from this repo and are enforced by tests. The REST surface itself carries no
 * version segment today — saying so plainly is more useful to an integrator than
 * implying a guarantee that does not exist.
 */
export const API_VERSIONING = {
  /** Bumped when the published contract changes; see RULES below. */
  specVersion: "1.0.0",
  rules: [
    "The OpenAPI document is versioned by `info.version`, semver. It is served from a stable URL (`/openapi.json`) and its version is bumped whenever the published contract changes.",
    "A breaking change to a published operation — a removed operation, a removed or retyped field, a new required parameter — bumps the MAJOR. Additive changes bump the MINOR.",
    "The REST API itself carries no version segment in its URL today: resources are addressed directly (`/item`, `/salesOrder`). Pin the spec version you built against, and diff `info.version` before upgrading.",
  ],
} as const;

export const SUPPORT_EMAIL = "support@carbon.ms";
export const INFO_EMAIL = "info@carbon.ms";

export const ORGANIZATION = {
  name: "Carbon Manufacturing Systems",
  alternateName: ["Carbon", "Carbon ERP"],
  legalName: "Carbon Manufacturing Systems Corporation",
  description:
    "Carbon is the engineering-first operating system for manufacturers: ERP, MRP, MES and QMS on one live model of your factory. Open-source and API-first.",
  foundingDate: "2022",
  founder: [
    { "@type": "Person", name: "Brad Barbin" },
    { "@type": "Person", name: "Chase Foster" },
  ],
  /** NAICS 513210 — Software Publishers. */
  naics: "513210",
  /**
   * Carbon has no published street address. schema.org allows a PostalAddress
   * with only the fields you can state truthfully, and an incomplete-but-true
   * address is the only correct option here — inventing a street to satisfy a
   * validator would be worse than omitting one. Fill the remaining fields in
   * when the registered business address is public.
   */
  address: {
    addressCountry: "US",
    addressRegion: "DE",
  },
  sameAs: [
    "https://github.com/crbnos",
    "https://x.com/carbon_ms",
    "https://www.linkedin.com/company/carbon-manufacturing-systems",
    "https://www.wikidata.org/wiki/Q141165693",
    "https://www.youtube.com/@CarbonManufacturingSystems",
  ],
} as const;

/**
 * Rebase a canonical carbon.ms URL onto another origin. External URLs are
 * returned untouched.
 *
 * Navigation has to resolve on whatever origin is serving the page — a preview
 * deploy, local dev, a self-hosted copy. A hard-coded `https://carbon.ms` in an
 * `href` walks the visitor off the deployment they are looking at and onto
 * production: that is how the link to /openapi.json on /developers 404'd when
 * clicked from a preview, before the route existed on the production domain.
 *
 * Citation is the opposite and stays absolute — the Markdown pages and the
 * JSON-LD name canonical carbon.ms URLs on purpose, because an agent reads them
 * with no origin for context.
 */
export function onOrigin(url: string, origin: string): string {
  if (!url.startsWith(SITE_URL)) return url;
  return `${origin}${url.slice(SITE_URL.length)}` || "/";
}

/** Root-relative form of a same-origin URL, for use in an `href`. */
export function internalHref(url: string): string {
  return onOrigin(url, "");
}

/**
 * Where a lost client should look first, in the order it should look. Rendered
 * on the HTML 404 screen and listed in the Markdown 404 body, so a human and an
 * agent that hit the same dead URL get the same way out.
 *
 * Lives here rather than next to the Markdown 404 so the error boundary can
 * import it without pulling every page's Markdown into the client bundle.
 */
export const RECOVERY_LINKS = [
  { label: "agent guidance", href: `${SITE_URL}/llms.txt` },
  { label: "sitemap", href: `${SITE_URL}/sitemap.xml` },
  { label: "developers", href: `${SITE_URL}/developers` },
  { label: "documentation", href: DOCS_URL },
  { label: "openapi spec", href: `${SITE_URL}/openapi.json` },
] as const;

export type DeveloperResource = {
  /** Stable, human-searchable name. Used verbatim in headings and link text. */
  name: string;
  url: string;
  description: string;
};

/**
 * The developer surface, by name, at predictable URLs. `/developers`, the
 * Markdown representations and `llms.txt` all render from this list, so adding
 * a resource here publishes it everywhere an agent looks.
 */
export const DEVELOPER_RESOURCES: DeveloperResource[] = [
  {
    name: "Carbon API documentation",
    url: `${DOCS_URL}/api-reference`,
    description:
      "Generated reference for every REST resource: endpoints, attributes, request and response shapes, and copy-paste examples.",
  },
  {
    name: "Carbon OpenAPI specification",
    url: `${SITE_URL}/openapi.json`,
    description:
      "Machine-readable OpenAPI 3.1 description of the Carbon REST API, with an operationId, a description and typed response schemas on every operation. Also served as YAML at /openapi.yaml.",
  },
  {
    name: "Carbon REST API",
    url: REST_URL,
    description:
      "The API itself. Every table Carbon exposes is a resource, governed by the same row-level security as the app.",
  },
  {
    name: "Carbon MCP server",
    url: MCP_URL,
    description:
      "Model Context Protocol endpoint over Streamable HTTP, so Claude, ChatGPT and other agents can call Carbon natively. Manifest at /.well-known/mcp.json.",
  },
  {
    name: "Carbon MCP guide",
    url: `${DOCS_URL}/mcp`,
    description:
      "How to connect an agent to Carbon over MCP, including the available tools and their permission scopes.",
  },
  {
    name: "Carbon API authentication",
    url: `${DOCS_URL}/api-reference/authentication`,
    description:
      "Creating a scoped API key and sending it as `Authorization: Bearer <api-key>` (or the `carbon-key` header).",
  },
  {
    name: "Carbon webhooks and integrations",
    url: `${DOCS_URL}/integrations`,
    description:
      "Event-driven integrations, webhook payloads, and the first-party connectors (Onshape, QuickBooks, Xero, Slack, Jira, Linear, Paperless Parts).",
  },
  {
    name: "Carbon source code",
    url: REPO_URL,
    description:
      "The Carbon monorepo. The whole ERP, MES and QMS, self-hostable, under a source-available license.",
  },
  {
    name: "Carbon agent guidance (llms.txt)",
    url: `${SITE_URL}/llms.txt`,
    description:
      "Where an agent should start: what Carbon is, and the canonical URL for every product surface.",
  },
  {
    name: "Carbon system status",
    url: STATUS_URL,
    description: "Live availability and incident history for the hosted product.",
  },
];
