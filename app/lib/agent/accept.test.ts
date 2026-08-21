import { describe, expect, it } from "vitest";
import {
  acceptsHtmlExplicitly,
  mergeVary,
  NEGOTIATED_VARY,
  parseAccept,
  preferredMediaType,
  prefersMarkdown,
} from "./accept";

/** Headers real clients send, so the table below is not hypothetical. */
const CHROME =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8";
const CURL = "*/*";
const SAFARI = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";

describe("parseAccept", () => {
  it("defaults a missing q to 1", () => {
    expect(parseAccept("text/markdown")).toEqual([
      { type: "text", subtype: "markdown", q: 1, specificity: 2, params: 0 },
    ]);
  });

  it("reads q values and clamps them to 0–1", () => {
    const [low, high] = parseAccept("text/html;q=0.1, text/markdown;q=2");
    expect(low?.q).toBe(0.1);
    expect(high?.q).toBe(1);
  });

  it("ignores a malformed q rather than rejecting the range", () => {
    expect(parseAccept("text/html;q=banana")[0]?.q).toBe(1);
  });

  it("ranks wildcards below concrete types", () => {
    const ranges = parseAccept("*/*, text/*, text/html");
    expect(ranges.map((range) => range.specificity)).toEqual([0, 1, 2]);
  });

  it("returns nothing for an absent or empty header", () => {
    expect(parseAccept(null)).toEqual([]);
    expect(parseAccept("")).toEqual([]);
    expect(parseAccept(",,")).toEqual([]);
  });
});

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/x-markdown", true],
    ["text/markdown;q=0.9, text/html;q=0.5", true],
    ["text/html, text/markdown", false],
    ["text/markdown;q=0, text/html", false],
    ["text/*", false],
    [CHROME, false],
    [SAFARI, false],
    [CURL, false],
    ["", false],
  ])("%s -> %s", (header, expected) => {
    expect(prefersMarkdown(header)).toBe(expected);
  });

  it("does not fire on a substring match inside another type", () => {
    // A naive `includes("markdown")` would serve Markdown here.
    expect(prefersMarkdown("application/vnd.markdownish+json")).toBe(false);
  });

  it("treats a missing header as no opinion, which keeps HTML", () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown(undefined)).toBe(false);
  });
});

describe("preferredMediaType", () => {
  it("resolves a tie to the server's own first preference", () => {
    expect(preferredMediaType("*/*", ["text/html", "text/markdown"])).toBe(
      "text/html",
    );
    expect(preferredMediaType("*/*", ["text/markdown", "text/html"])).toBe(
      "text/markdown",
    );
  });

  it("lets a specific range beat a higher-q wildcard", () => {
    expect(
      preferredMediaType("text/markdown;q=0.6, */*;q=1", [
        "text/html",
        "text/markdown",
      ]),
    ).toBe("text/html");
  });

  it("returns null when nothing offered is acceptable", () => {
    expect(preferredMediaType("image/png", ["text/html", "text/markdown"])).toBe(
      null,
    );
  });
});

describe("acceptsHtmlExplicitly", () => {
  it("is true for browsers", () => {
    expect(acceptsHtmlExplicitly(CHROME)).toBe(true);
    expect(acceptsHtmlExplicitly(SAFARI)).toBe(true);
  });

  it("is false for a client with no opinion", () => {
    // This is the distinction the 404 handler turns on: `*/*` means "surprise
    // me", so an agent gets the Markdown recovery body.
    expect(acceptsHtmlExplicitly(CURL)).toBe(false);
    expect(acceptsHtmlExplicitly(null)).toBe(false);
  });

  it("is false when html is explicitly refused", () => {
    expect(acceptsHtmlExplicitly("text/html;q=0, text/markdown")).toBe(false);
  });
});

describe("mergeVary", () => {
  it("adds Accept and Accept-Encoding to an empty header", () => {
    expect(mergeVary(null)).toBe(NEGOTIATED_VARY);
  });

  it("keeps existing fields and does not duplicate", () => {
    expect(mergeVary("Cookie, accept")).toBe("Cookie, accept, Accept-Encoding");
  });

  it("leaves a wildcard Vary alone", () => {
    expect(mergeVary("*")).toBe("*");
  });
});
