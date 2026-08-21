import { describe, expect, it } from "vitest";
import { notFoundMarkdown } from "./not-found";
import { AGENT_PAGE_PATHS, getAgentPage, resolveMarkdownPath } from "./pages";
import { RECOVERY_LINKS, SITE_URL } from "./site";

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
});
