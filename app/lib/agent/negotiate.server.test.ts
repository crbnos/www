import { describe, expect, it } from "vitest";
import { MARKDOWN_CONTENT_TYPE, NEGOTIATED_VARY } from "./accept";
import {
  applyNegotiationHeaders,
  negotiateMarkdown,
} from "./negotiate.server";

const BROWSER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";

function request(path: string, accept?: string): Request {
  return new Request(`https://carbon.ms${path}`, {
    headers: accept ? { Accept: accept } : undefined,
  });
}

describe("negotiateMarkdown", () => {
  it("returns null for a browser on a real page, so the React page renders", async () => {
    expect(await negotiateMarkdown(request("/pricing", BROWSER), 200)).toBeNull();
  });

  it("returns null for any successful route with no markdown variant", async () => {
    // /openapi.json must never be replaced by a 404 markdown body just because
    // the client asked for markdown.
    expect(
      await negotiateMarkdown(request("/openapi.json", "text/markdown"), 200),
    ).toBeNull();
  });

  it("serves markdown when the client asks for it", async () => {
    const response = await negotiateMarkdown(
      request("/pricing", "text/markdown"),
      200,
    );
    expect(response?.status).toBe(200);
    expect(response?.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
    expect(response?.headers.get("Vary")).toBe(NEGOTIATED_VARY);
    expect(await response?.text()).toContain("# Carbon pricing");
  });

  it("serves markdown for a .md path even though the router 404'd", async () => {
    const response = await negotiateMarkdown(request("/pricing.md", BROWSER), 404);
    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain("$40");
  });

  it("names the HTML page as canonical, so the pair is not duplicate content", async () => {
    const response = await negotiateMarkdown(request("/pricing.md"), 404);
    expect(response?.headers.get("Link")).toBe(
      '<https://carbon.ms/pricing>; rel="canonical"',
    );
  });

  it("leaves the 404 body uncanonicalised and noindex", async () => {
    const response = await negotiateMarkdown(request("/nope"), 404);
    expect(response?.headers.get("Link")).toBeNull();
    expect(response?.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("serves the home page markdown at /index.md", async () => {
    const response = await negotiateMarkdown(request("/index.md"), 404);
    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain("# Carbon Manufacturing Systems");
  });

  it("serves a blog post's own source markdown", async () => {
    const response = await negotiateMarkdown(
      request("/learn/what-is-mrp.md"),
      404,
    );
    expect(response?.status).toBe(200);
    const body = (await response?.text()) ?? "";
    expect(body).toContain("# ");
    expect(body).toContain("carbon.ms/learn");
  });

  it("indexes the blog", async () => {
    const response = await negotiateMarkdown(
      request("/learn", "text/markdown"),
      200,
    );
    expect(await response?.text()).toContain(
      "carbon.ms/learn/what-is-mrp",
    );
  });

  describe("404s", () => {
    it("gives a markdown recovery body to a client with no opinion", async () => {
      const response = await negotiateMarkdown(request("/nope", "*/*"), 404);
      expect(response?.status).toBe(404);
      expect(response?.headers.get("Content-Type")).toBe(MARKDOWN_CONTENT_TYPE);
      expect(response?.headers.get("X-Robots-Tag")).toBe("noindex");
      const body = (await response?.text()) ?? "";
      expect(body).toContain("# 404 Not Found");
      expect(body).toContain("https://carbon.ms/sitemap.xml");
      expect(body).toContain("https://carbon.ms/llms.txt");
    });

    it("gives the same body when no Accept header is sent at all", async () => {
      const response = await negotiateMarkdown(request("/nope"), 404);
      expect(response?.status).toBe(404);
    });

    it("recovers the caller on the origin it reached, not on production", async () => {
      const response = await negotiateMarkdown(
        new Request("https://preview.vercel.app/nope"),
        404,
      );
      const body = (await response?.text()) ?? "";

      expect(body).toContain("https://preview.vercel.app/sitemap.xml");
      expect(body).not.toContain("https://carbon.ms");
    });

    it("leaves a browser on the HTML 404 screen", async () => {
      expect(await negotiateMarkdown(request("/nope", BROWSER), 404)).toBeNull();
    });

    it("404s a .md path with no page behind it", async () => {
      const response = await negotiateMarkdown(request("/nope.md"), 404);
      expect(response?.status).toBe(404);
    });

    it("404s an unknown blog post rather than serving an empty page", async () => {
      const response = await negotiateMarkdown(
        request("/learn/no-such-post", "text/markdown"),
        404,
      );
      expect(response?.status).toBe(404);
    });
  });
});

describe("applyNegotiationHeaders", () => {
  it("adds Accept to Vary on the HTML variant", async () => {
    const headers = new Headers();
    await applyNegotiationHeaders(request("/pricing", BROWSER), headers);
    expect(headers.get("Vary")).toBe(NEGOTIATED_VARY);
  });

  it("keeps a Vary the app already set", async () => {
    const headers = new Headers({ Vary: "Cookie" });
    await applyNegotiationHeaders(request("/pricing", BROWSER), headers);
    expect(headers.get("Vary")).toBe("Cookie, Accept, Accept-Encoding");
  });

  it("advertises the markdown variant", async () => {
    const headers = new Headers();
    await applyNegotiationHeaders(request("/pricing", BROWSER), headers);
    expect(headers.get("Link")).toBe(
      '<https://carbon.ms/pricing.md>; rel="alternate"; type="text/markdown"',
    );
  });

  it("advertises /index.md for the home page", async () => {
    const headers = new Headers();
    await applyNegotiationHeaders(request("/", BROWSER), headers);
    expect(headers.get("Link")).toContain("https://carbon.ms/index.md");
  });

  it("still sets Vary on a page with no markdown variant", async () => {
    const headers = new Headers();
    await applyNegotiationHeaders(request("/nope", BROWSER), headers);
    expect(headers.get("Vary")).toBe(NEGOTIATED_VARY);
    expect(headers.get("Link")).toBeNull();
  });
});
