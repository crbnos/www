import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  API_VERSIONING,
  DEVELOPER_RESOURCES,
  ONBOARDING,
  RATE_LIMIT_PER_MINUTE,
  SITE_URL,
} from "./site";

/**
 * The static files in `public/` that agents read first. They are not generated
 * from `site.ts`, so these tests are what keeps them from drifting away from it.
 */

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("robots.txt", () => {
  const robots = read("public/robots.txt");

  /** RFC 9309 groups: consecutive user-agent lines, then their rules. */
  function groups(): Map<string, string[]> {
    const result = new Map<string, string[]>();
    let agents: string[] = [];
    let inRules = false;

    for (const raw of robots.split("\n")) {
      const line = raw.replace(/#.*/, "").trim();
      if (!line) continue;
      const [field, ...rest] = line.split(":");
      const key = field!.trim().toLowerCase();
      const value = rest.join(":").trim();

      if (key === "user-agent") {
        if (inRules) agents = [];
        inRules = false;
        agents.push(value.toLowerCase());
        result.set(value.toLowerCase(), result.get(value.toLowerCase()) ?? []);
      } else if (key === "allow" || key === "disallow") {
        inRules = true;
        for (const agent of agents) result.get(agent)!.push(`${key}:${value}`);
      }
    }
    return result;
  }

  it.each([
    "*",
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-User",
    "Google-Extended",
    "PerplexityBot",
    "DeepSeekBot",
  ])("lets %s reach the whole site", (agent) => {
    const rules = groups().get(agent.toLowerCase());
    expect(rules, agent).toBeDefined();
    expect(rules).toContain("allow:/");
    // An empty `Disallow:` allows everything; any path is a block.
    expect(rules!.filter((rule) => /^disallow:.+/.test(rule))).toEqual([]);
  });

  it("names an absolute sitemap", () => {
    expect(robots).toMatch(new RegExp(`^Sitemap: ${SITE_URL}/sitemap\\.xml$`, "m"));
  });
});

describe("llms.txt", () => {
  const llms = read("public/llms.txt");
  const lines = llms.split("\n");
  const firstSection = lines.findIndex((line) => line.startsWith("## "));

  it("opens with an H1 and a blockquote summary, per llmstxt.org", () => {
    expect(lines[0]).toMatch(/^# \S/);
    expect(lines[1]).toBe("");
    expect(lines[2]).toMatch(/^> /);
  });

  it("keeps prose above the first H2 and puts only link lists below it", () => {
    // The format allows free-form markdown (but no headings) before the first
    // H2; every H2 section after it is a list of `[name](url)` links, with an
    // optional `: notes`.
    expect(lines.slice(1, firstSection).some((line) => /^#{1,6} /.test(line))).toBe(
      false,
    );
    for (const line of lines.slice(firstSection)) {
      if (!line || line.startsWith("## ") || line.startsWith("  ")) continue;
      expect(line, line).toMatch(/^- \[[^\]]+\]\(https?:\/\/[^)]+\)(:( .+)?)?$/);
    }
  });

  it("links every developer resource but itself", () => {
    for (const resource of DEVELOPER_RESOURCES) {
      if (resource.url === `${SITE_URL}/llms.txt`) continue;
      expect(llms, resource.name).toContain(`(${resource.url})`);
    }
  });

  it("links the machine-readable files", () => {
    for (const path of [
      "/openapi.json",
      "/openapi.yaml",
      "/.well-known/mcp.json",
      "/.well-known/oauth-authorization-server",
      "/.well-known/oauth-protected-resource",
      "/sitemap.xml",
    ]) {
      expect(llms, path).toContain(`(${SITE_URL}${path})`);
    }
  });

  it("names the product in its developer links, so they are findable by name", () => {
    for (const name of [
      "Carbon REST API",
      "Carbon MCP server",
      "Carbon OpenAPI specification",
      "Carbon API documentation",
      "Carbon developers",
    ]) {
      expect(llms, name).toContain(`[${name}]`);
    }
  });

  it("says how to get access, and agrees with site.ts", () => {
    expect(llms).toContain(ONBOARDING.signupUrl);
    expect(llms).toContain(ONBOARDING.apiKeysUrl);
    expect(llms).toContain(`${ONBOARDING.trialDays}-day free trial`);
    expect(llms).toContain(`${RATE_LIMIT_PER_MINUTE} requests per minute`);
    expect(llms.replace(/\s+/g, " ")).toContain(
      `at least ${API_VERSIONING.minimumNoticeDays} days later`,
    );
    expect(llms).toContain("x-api-lifecycle");
  });
});

describe("vercel.json", () => {
  const { redirects } = JSON.parse(read("vercel.json")) as {
    redirects: { source: string; destination: string; permanent: boolean }[];
  };
  const bySource = new Map(redirects.map((entry) => [entry.source, entry]));

  it("has no duplicate sources", () => {
    expect(bySource.size).toBe(redirects.length);
  });

  it.each([
    ["/developer", "/developers"],
    ["/api", "https://docs.carbon.ms/api-reference"],
    ["/api-docs", "https://docs.carbon.ms/api-reference"],
    ["/api-reference", "https://docs.carbon.ms/api-reference"],
    ["/openapi", "/openapi.json"],
    ["/openapi.yml", "/openapi.yaml"],
    ["/mcp", "https://docs.carbon.ms/mcp"],
    ["/auth", "https://docs.carbon.ms/api-reference/authentication"],
  ])("sends the guessable %s to %s", (source, destination) => {
    expect(bySource.get(source)).toMatchObject({ destination, permanent: true });
  });
});
