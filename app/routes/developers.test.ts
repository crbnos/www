import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ONBOARDING, RATE_LIMIT_PER_MINUTE } from "~/lib/agent/site";
import Developers, { meta } from "./developers";

type AnyRecord = Record<string, any>;

const descriptors = meta({ matches: [] } as never) as AnyRecord[];
const html = renderToStaticMarkup(createElement(Developers));

describe("/developers meta", () => {
  it("names the Carbon API and MCP server in the title", () => {
    const title = descriptors.find((descriptor) => "title" in descriptor)?.title;
    expect(title).toContain("Carbon API");
    expect(title).toContain("MCP server");
  });

  it("describes the Carbon API as a schema.org WebAPI", () => {
    const graph = descriptors.find((descriptor) => "script:ld+json" in descriptor)?.[
      "script:ld+json"
    ]["@graph"] as AnyRecord[];

    expect(graph.map((node) => node["@type"])).toEqual(["ItemList", "WebAPI"]);
    const api = graph.find((node) => node["@type"] === "WebAPI")!;
    expect(api.name).toBe("Carbon API");
    expect(api.documentation).toBe("https://docs.carbon.ms/api-reference");
    expect(api.provider.name).toBe("Carbon Manufacturing Systems");
  });
});

describe("/developers page", () => {
  const headings = [...html.matchAll(/<h[12][^>]*>(.*?)<\/h[12]>/g)].map(
    (match) => match[1]!,
  );

  it("names the product in its section headings", () => {
    const sections = [...html.matchAll(/<h2 id="[^"]+">(.*?)<\/h2>/g)].map(
      (match) => match[1]!,
    );
    expect(sections.length).toBeGreaterThan(4);
    for (const heading of sections) expect(heading).toMatch(/Carbon/);
    expect(headings).toContain("Carbon MCP server");
  });

  it("walks through self-serve access before the quick start", () => {
    expect(html.indexOf('id="get-access"')).toBeLessThan(
      html.indexOf('id="quick-start"'),
    );
    expect(html).toContain(`href="${ONBOARDING.signupUrl}"`);
    expect(html).toContain(`href="${ONBOARDING.apiKeysUrl}"`);
    expect(html).toContain(`${ONBOARDING.trialDays}-day free trial`);
  });

  it("documents every rate-limit header the API sends", () => {
    expect(html).toContain(`${RATE_LIMIT_PER_MINUTE} requests per minute`);
    for (const header of [
      "Retry-After",
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ]) {
      expect(html).toContain(`<code>${header}</code>`);
    }
  });

  it("publishes the deprecation policy", () => {
    expect(html).toContain('id="versioning"');
    expect(html).toContain("x-sunset");
  });
});
