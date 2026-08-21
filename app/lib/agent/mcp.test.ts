import { describe, expect, it } from "vitest";
import { mcpManifest, MCP_SERVER_NAME } from "./mcp";
import { MCP_URL } from "./site";

const META = mcpManifest._meta["ms.carbon/v1"];

describe("mcp manifest", () => {
  it("declares the registry schema and a reverse-DNS name", () => {
    expect(mcpManifest.$schema).toMatch(/server\.schema\.json$/);
    expect(mcpManifest.name).toBe(MCP_SERVER_NAME);
    expect(mcpManifest.name).toMatch(/^[a-z0-9.-]+\/[a-z0-9-]+$/);
  });

  it("advertises Streamable HTTP, which is what earns full transport credit", () => {
    const remote = mcpManifest.remotes[0];
    expect(remote?.type).toBe("streamable-http");
    expect(remote?.url).toBe(MCP_URL);
    expect(META.transport).toBe("streamable-http");
    expect(META.endpoint).toBe(MCP_URL);
  });

  it("names both OAuth discovery documents, and what an unauthed handshake returns", () => {
    // A scanner that opens the transport without a credential gets 401 — that is
    // the discovery handshake, not a broken server, so the manifest says so.
    expect(META.authentication.authorizationServerMetadata).toMatch(
      /\/\.well-known\/oauth-authorization-server$/,
    );
    expect(META.authentication.protectedResourceMetadata).toMatch(
      /\/\.well-known\/oauth-protected-resource$/,
    );
    expect(META.authentication.unauthenticatedInitializeReturns).toBe(401);
  });

  it("says how to authenticate, and marks the credential secret", () => {
    const header = mcpManifest.remotes[0]?.headers[0];
    expect(header?.name).toBe("Authorization");
    expect(header?.isRequired).toBe(true);
    expect(header?.isSecret).toBe(true);
    expect(META.authentication.schemes).toContain("bearer");
    expect(META.authentication.protectedResourceMetadata).toMatch(
      /\/\.well-known\/oauth-protected-resource$/,
    );
  });

  it("describes every tool it exposes", () => {
    expect(META.tools.map((tool) => tool.name)).toEqual([
      "search_tools",
      "describe_tool",
      "call_tool",
    ]);
    for (const tool of META.tools) {
      expect(tool.description.length, tool.name).toBeGreaterThan(40);
      expect(typeof tool.readOnly, tool.name).toBe("boolean");
    }
  });

  it("ships a client config an agent can paste in", () => {
    const server = META.clientConfig.mcpServers.carbon;
    expect(server.type).toBe("http");
    expect(server.url).toBe(MCP_URL);
    expect(server.headers.Authorization).toContain("Bearer");
  });

  it("keeps every Carbon-specific field inside _meta", () => {
    // Top-level keys are the registry schema's; anything else risks failing a
    // strict validator.
    expect(Object.keys(mcpManifest).sort()).toEqual([
      "$schema",
      "_meta",
      "description",
      "name",
      "remotes",
      "repository",
      "version",
      "websiteUrl",
    ]);
  });

  it("is JSON-serializable without loss", () => {
    expect(JSON.parse(JSON.stringify(mcpManifest))).toEqual(mcpManifest);
  });
});
