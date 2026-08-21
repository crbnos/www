/**
 * The MCP server manifest, served at `/.well-known/mcp.json` and `/mcp.json`.
 *
 * Shaped as the Model Context Protocol registry's `server.json`: `remotes[]`
 * with `type: "streamable-http"` is the field a client or a registry reads to
 * learn how to connect. Everything Carbon-specific lives under `_meta` so the
 * document stays valid against that schema instead of growing ad-hoc top-level
 * keys a validator would reject.
 */

import { DOCS_URL, MCP_URL, OAUTH_METADATA, REPO_URL, SITE_URL } from "./site";

const SERVER_JSON_SCHEMA =
  "https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json";

/** Reverse-DNS server name, as the MCP registry requires. */
export const MCP_SERVER_NAME = "ms.carbon/carbon-erp";

/** The `_meta` namespace key — reverse-DNS, per the MCP `_meta` convention. */
const META_KEY = "ms.carbon/v1";

/**
 * The tools the server registers. Carbon publishes three meta-tools rather than
 * 1,400 flat ones: a client that loaded every ERP operation as a tool would
 * spend its whole context on definitions before doing any work.
 */
const TOOLS = [
  {
    name: "search_tools",
    description:
      "Search Carbon's ERP operations by name, module or classification (READ, WRITE, DESTRUCTIVE), and make the matches available to call.",
    readOnly: true,
  },
  {
    name: "describe_tool",
    description:
      "Return the full input schema and description for one operation, so its arguments can be built correctly before calling it.",
    readOnly: true,
  },
  {
    name: "call_tool",
    description:
      "Call an operation by name with its arguments. The company and user are taken from the credential, never from the arguments.",
    readOnly: false,
  },
] as const;

/** The modules those operations span. */
const MODULES = [
  "account",
  "accounting",
  "documents",
  "inventory",
  "invoicing",
  "items",
  "people",
  "production",
  "purchasing",
  "quality",
  "resources",
  "sales",
  "settings",
  "shared",
  "users",
] as const;

export function buildMcpManifest() {
  return {
    $schema: SERVER_JSON_SCHEMA,
    name: MCP_SERVER_NAME,
    description:
      "Carbon is an API-first operating system for manufacturing (ERP, MRP, MES, QMS). This MCP server exposes its ERP operations — items, sales, purchasing, production, inventory, quality and accounting — as tools an agent can search, inspect and call.",
    version: "1.0.0",
    websiteUrl: SITE_URL,
    repository: {
      url: REPO_URL,
      source: "github",
    },
    remotes: [
      {
        type: "streamable-http",
        url: MCP_URL,
        headers: [
          {
            name: "Authorization",
            description:
              "Bearer <api-key>. Create a scoped key in Settings → API Keys at https://app.carbon.ms/x/settings/api-keys. OAuth is also supported; an unauthenticated request returns 401 with a WWW-Authenticate pointing at the protected-resource metadata.",
            isRequired: true,
            isSecret: true,
          },
        ],
      },
    ],
    _meta: {
      [META_KEY]: {
        transport: "streamable-http",
        endpoint: MCP_URL,
        serverName: "carbon-erp",
        authentication: {
          schemes: ["bearer", "oauth2"],
          /** RFC 9728 metadata, served by the app that hosts the MCP endpoint. */
          protectedResourceMetadata: OAUTH_METADATA.protectedResource,
          authorizationServerMetadata: OAUTH_METADATA.authorizationServer,
          /**
           * An unauthenticated `initialize` is EXPECTED to return 401 with a
           * `WWW-Authenticate` header naming the metadata above — that is the
           * discovery handshake, not a failure. A scanner that reads a 401 as a
           * broken server is misreading a working one.
           */
          unauthenticatedInitializeReturns: 401,
          scopeModel:
            "A key is scoped to one company and to explicit module permissions; row-level security in the database enforces the same boundary as the app.",
        },
        tools: TOOLS,
        /**
         * The count moves with the product; the shape does not. Stated as a
         * floor so the manifest cannot quietly become wrong.
         */
        operations: {
          description:
            "search_tools, describe_tool and call_tool reach more than 1,400 ERP operations across 15 modules, each classified READ, WRITE or DESTRUCTIVE.",
          modules: MODULES,
          classifications: ["READ", "WRITE", "DESTRUCTIVE"],
        },
        documentation: {
          mcpGuide: `${DOCS_URL}/mcp`,
          apiReference: `${DOCS_URL}/api-reference`,
          authentication: `${DOCS_URL}/api-reference/authentication`,
          openapi: `${SITE_URL}/openapi.json`,
        },
        /** Drop-in config for Claude Desktop, Claude Code and compatible clients. */
        clientConfig: {
          mcpServers: {
            carbon: {
              type: "http",
              url: MCP_URL,
              headers: {
                Authorization: "Bearer ${CARBON_API_KEY}",
              },
            },
          },
        },
      },
    },
  };
}

export const mcpManifest = buildMcpManifest();
