import { describe, expect, it } from "vitest";
import { notFoundMarkdown } from "./not-found";
import { AGENT_PAGE_PATHS, getAgentPage, resolveMarkdownPath } from "./pages";
import {
  DEVELOPER_RESOURCES,
  internalHref,
  onOrigin,
  RECOVERY_LINKS,
  SITE_URL,
} from "./site";

describe("resolveMarkdownPath", () => {
  it.each([
    ["/pricing", { path: "/pricing", explicit: false }],
    ["/pricing.md", { path: "/pricing", explicit: true }],
    ["/pricing/", { path: "/pricing", explicit: false }],
    ["/", { path: "/", explicit: false }],
    ["/index.md", { path: "/", explicit: true }],
    ["/learn/some-post.md", { path: "/learn/some-post", explicit: true }],
  ])("%s", (pathname, expected) => {
    expect(resolveMarkdownPath(pathname)).toEqual(expected);
  });
});

describe("page markdown", () => {
  it("covers every top-level page", () => {
    expect(AGENT_PAGE_PATHS).toEqual(
      expect.arrayContaining([
        "/",
        "/pricing",
        "/about",
        "/contact",
        "/brand",
        "/developers",
        "/privacy",
        "/terms",
        "/subprocessors",
        "/learn",
      ]),
    );
  });

  it("starts every page with a single h1 and ends with the recovery footer", () => {
    for (const path of AGENT_PAGE_PATHS) {
      const page = getAgentPage(path);
      expect(page, path).not.toBeNull();
      expect(page?.markdown.startsWith(`# ${page.title}\n`), path).toBe(true);
      expect(page?.markdown.match(/^# /gm)?.length, path).toBe(1);
      expect(page?.markdown, path).toContain(`${SITE_URL}/openapi.json`);
    }
  });

  it("has no page for an unknown path", () => {
    expect(getAgentPage("/nope")).toBeNull();
  });
});

describe("notFoundMarkdown", () => {
  const markdown = notFoundMarkdown("/some-path-that-does-not-exist");

  it("names the path that failed", () => {
    expect(markdown).toContain("/some-path-that-does-not-exist");
  });

  it("is a markdown document, not a sentence", () => {
    expect(markdown.startsWith("# 404 Not Found")).toBe(true);
    expect(markdown).toContain("## Where to look next");
  });

  it("links every recovery target the HTML 404 screen shows", () => {
    for (const link of RECOVERY_LINKS) {
      expect(markdown).toContain(link.href);
    }
  });

  it("lists the site's own pages", () => {
    expect(markdown).toContain(`${SITE_URL}/pricing`);
    expect(markdown).toContain(`${SITE_URL}/developers`);
  });

  it("points at the origin the client actually reached", () => {
    // A preview deploy handing back production URLs is a recovery aid that
    // sends the caller somewhere else.
    const preview = notFoundMarkdown("/nope", "https://preview.vercel.app");

    expect(preview).toContain("https://preview.vercel.app/pricing");
    expect(preview).toContain("https://preview.vercel.app/llms.txt");
    expect(preview).not.toContain(SITE_URL);
    // External recovery targets are not rebased.
    expect(preview).toContain("https://docs.carbon.ms");
  });
});

describe("onOrigin / internalHref", () => {
  it("rebases a same-origin URL", () => {
    expect(onOrigin(`${SITE_URL}/openapi.json`, "https://preview.test")).toBe(
      "https://preview.test/openapi.json",
    );
  });

  it("leaves an external URL alone", () => {
    for (const url of [
      "https://docs.carbon.ms/mcp",
      "https://app.carbon.ms/api/mcp",
      "https://github.com/crbnos/carbon",
    ]) {
      expect(onOrigin(url, "https://preview.test"), url).toBe(url);
    }
  });

  it("makes a same-origin URL root-relative for an href", () => {
    // This is the bug it exists to prevent: /developers linked to
    // https://carbon.ms/openapi.json, so clicking it from a preview deploy left
    // that deploy and 404'd on production, where the route did not exist yet.
    expect(internalHref(`${SITE_URL}/openapi.json`)).toBe("/openapi.json");
    expect(internalHref(`${SITE_URL}/.well-known/mcp.json`)).toBe(
      "/.well-known/mcp.json",
    );
    expect(internalHref(SITE_URL)).toBe("/");
    expect(internalHref("https://docs.carbon.ms")).toBe(
      "https://docs.carbon.ms",
    );
  });

  it("turns every same-origin developer resource into a working path", () => {
    const internal = DEVELOPER_RESOURCES.filter((resource) =>
      resource.url.startsWith(SITE_URL),
    );

    expect(internal.length).toBeGreaterThan(0);
    for (const resource of internal) {
      const href = internalHref(resource.url);
      expect(href.startsWith("/"), resource.name).toBe(true);
      expect(href, resource.name).not.toContain(SITE_URL);
    }
  });
});
