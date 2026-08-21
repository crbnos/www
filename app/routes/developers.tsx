import type { MetaFunction } from "react-router";
import {
  APP_URL,
  DEVELOPER_RESOURCES,
  DOCS_URL,
  internalHref,
  MCP_URL,
  REST_URL,
  SITE_URL,
} from "~/lib/agent/site";
import { pageMeta } from "~/lib/seo";

/**
 * The developer surface, at a predictable URL, named by product.
 *
 * Every resource here also exists somewhere else — the docs site, the repo, a
 * well-known file. What this page adds is one page that names all of them
 * together, using the words someone would actually search for ("Carbon API",
 * "Carbon MCP server", "Carbon OpenAPI"), which is what makes them findable by
 * name rather than only by someone who already knows the URL.
 */

const DESCRIPTION =
  "The Carbon developer surface: REST API, OpenAPI specification, MCP server, API keys, webhooks and integrations, and the source code.";

export const meta: MetaFunction = ({ matches }) =>
  pageMeta(matches, {
    title: "Carbon developers — API, OpenAPI, MCP server, and webhooks",
    description: DESCRIPTION,
    extra: [
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Carbon developer resources",
          description: DESCRIPTION,
          url: `${SITE_URL}/developers`,
          itemListElement: DEVELOPER_RESOURCES.map((resource, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: resource.name,
            description: resource.description,
            url: resource.url,
          })),
        },
      },
    ],
  });

const CURL = `curl '${REST_URL}/item?limit=1' \\
  -H "Authorization: Bearer <api-key>"`;

const MCP_CONFIG = `{
  "mcpServers": {
    "carbon": {
      "type": "http",
      "url": "${MCP_URL}",
      "headers": { "Authorization": "Bearer <api-key>" }
    }
  }
}`;

const MACHINE_FILES = [
  {
    path: "/openapi.json",
    description: "OpenAPI 3.1 description of the Carbon REST API.",
  },
  {
    path: "/openapi.yaml",
    description: "The same document, as YAML.",
  },
  {
    path: "/.well-known/mcp.json",
    description: "MCP server manifest — transport, endpoint, and auth.",
  },
  {
    path: "/llms.txt",
    description: "Where an agent should start, and the canonical URL for each surface.",
  },
  {
    path: "/sitemap.xml",
    description: "Every page on this site.",
  },
];

export default function Developers() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-4xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">
            Carbon for developers
          </h1>
          <h2 className="font-medium text-xl text-muted-foreground max-w-5xl text-balance leading-relaxed tracking-tight">
            Every capability in Carbon is reachable over a REST API and an MCP
            server. Nothing in the product is behind a private interface.
          </h2>
        </div>
      </div>
      <div className="mx-auto flex flex-col px-4 w-full lg:max-w-4xl mb-28">
        <div className="prose dark:prose-invert lg:prose-lg w-full lg:max-w-4xl mx-auto">
          <h2 id="quick-start">Quick start</h2>
          <p>
            Create a scoped API key in{" "}
            <a href={`${APP_URL}/x/settings/api-keys`}>Settings → API Keys</a>,
            then send it on every request as{" "}
            <code>Authorization: Bearer &lt;api-key&gt;</code>. The{" "}
            <code>carbon-key</code> header works identically.
          </p>
          <pre>
            <code>{CURL}</code>
          </pre>
          <p>
            A key belongs to one company and carries an explicit set of module
            permissions. Row-level security in the database — not just the
            application — confines every request to that scope, so a key can only
            ever touch the data it was granted.
          </p>
          <p>
            Every key allows 60 requests per minute. A refused request returns{" "}
            <code>429</code> with <code>Retry-After</code> and{" "}
            <code>X-RateLimit-*</code> headers — back off on those rather than
            retrying immediately.
          </p>

          <h2 id="mcp">Connect an agent over MCP</h2>
          <p>
            The Carbon MCP server speaks the Streamable HTTP transport at{" "}
            <a href={MCP_URL}>
              <code>{MCP_URL}</code>
            </a>
            . It authenticates with the same API key as a bearer token, or with
            OAuth. Its manifest is at{" "}
            <a href="/.well-known/mcp.json">
              <code>/.well-known/mcp.json</code>
            </a>
            .
          </p>
          <pre>
            <code>{MCP_CONFIG}</code>
          </pre>
          <p>
            The server exposes three tools — <code>search_tools</code>,{" "}
            <code>describe_tool</code> and <code>call_tool</code> — that reach
            more than 1,400 ERP operations across 15 modules, each classified
            read, write or destructive. The{" "}
            <a href={`${DOCS_URL}/mcp`}>MCP guide</a> covers the details.
          </p>

          <h2 id="resources">Resources</h2>
          <ul>
            {DEVELOPER_RESOURCES.map((resource) => (
              <li key={resource.url}>
                <a href={internalHref(resource.url)}>{resource.name}</a> —{" "}
                {resource.description}
              </li>
            ))}
          </ul>

          <h2 id="machine-readable">Machine-readable files</h2>
          <p>
            Served from this domain, unauthenticated, with CORS open so a
            browser-based agent can read them:
          </p>
          <ul>
            {MACHINE_FILES.map((file) => (
              <li key={file.path}>
                <a href={file.path}>
                  <code>{file.path}</code>
                </a>{" "}
                — {file.description}
              </li>
            ))}
          </ul>
          <p>
            Every page on carbon.ms is also available as Markdown: send{" "}
            <code>Accept: text/markdown</code>, or append <code>.md</code> to the
            path.
          </p>
        </div>
      </div>
    </div>
  );
}
