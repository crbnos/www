/**
 * Accept-header content negotiation (RFC 9110 §12.5.1) for the
 * `Accept: text/markdown` convention documented at https://acceptmarkdown.com.
 *
 * The rule that convention insists on is: do NOT substring-match the header.
 * Parse it, rank by q-value, break ties by specificity. A browser sends
 * `text/html,application/xhtml+xml,application/xml;q=0.9,*\/*;q=0.8`, where a
 * naive `includes("markdown")` never fires — but an agent sending
 * `text/markdown, text/html;q=0.1` would wrongly satisfy `includes("text/html")`
 * and get served HTML.
 *
 * Nothing here touches the network or the filesystem, so it runs unchanged on
 * the Vercel edge runtime and is directly unit-testable.
 */

/** Media types we treat as a request for the Markdown representation. */
export const MARKDOWN_MEDIA_TYPES = [
  "text/markdown",
  "text/x-markdown",
] as const;

/** The exact `Content-Type` a Markdown response must carry. */
export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/**
 * The exact `Vary` value every negotiated response must carry. Without `Accept`
 * a CDN happily hands the cached HTML variant to an agent asking for Markdown
 * (or the reverse), depending only on which variant landed in the cache first.
 */
export const NEGOTIATED_VARY = "Accept, Accept-Encoding";

export type MediaRange = {
  type: string;
  subtype: string;
  /** Quality value, 0–1. Absent `q` means 1. */
  q: number;
  /** 2 = `type/subtype`, 1 = `type/*`, 0 = `*\/*` — RFC 9110 precedence. */
  specificity: 0 | 1 | 2;
  /** Media-type parameter count; a finer tie-break than specificity alone. */
  params: number;
};

type Match = Pick<MediaRange, "q" | "specificity" | "params">;

/** Parse an `Accept` header into media ranges. Malformed entries are skipped. */
export function parseAccept(header: string | null | undefined): MediaRange[] {
  if (!header) return [];

  const ranges: MediaRange[] = [];

  for (const part of header.split(",")) {
    const [rawRange, ...rawParams] = part.split(";");
    const value = rawRange?.trim().toLowerCase();
    if (!value) continue;

    const [type, subtype] = value.split("/");
    if (!type || !subtype) continue;

    let q = 1;
    let params = 0;

    for (const rawParam of rawParams) {
      const [rawKey, rawValue] = rawParam.split("=");
      const key = rawKey?.trim().toLowerCase();
      if (!key) continue;

      if (key === "q") {
        const parsed = Number.parseFloat(rawValue ?? "");
        // A malformed q is not a rejection — RFC 9110 says ignore it, which
        // leaves the default of 1.
        q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;
        continue;
      }

      params += 1;
    }

    ranges.push({
      type,
      subtype,
      q,
      specificity: type === "*" ? 0 : subtype === "*" ? 1 : 2,
      params,
    });
  }

  return ranges;
}

/** True when `a` outranks `b` for the same candidate media type. */
function outranks(a: Match, b: Match): boolean {
  if (a.specificity !== b.specificity) return a.specificity > b.specificity;
  if (a.params !== b.params) return a.params > b.params;
  return a.q > b.q;
}

/**
 * The most specific range matching `mediaType`, which is the one whose q-value
 * applies. `null` when no range matches at all.
 */
function bestMatch(ranges: MediaRange[], mediaType: string): Match | null {
  const [type, subtype] = mediaType.toLowerCase().split("/");
  let best: Match | null = null;

  for (const range of ranges) {
    const matches =
      (range.type === "*" && range.subtype === "*") ||
      (range.type === type && range.subtype === "*") ||
      (range.type === type && range.subtype === subtype);
    if (!matches) continue;

    if (!best || outranks(range, best)) {
      best = { q: range.q, specificity: range.specificity, params: range.params };
    }
  }

  return best;
}

/**
 * Pick the best representation for a client from `candidates`.
 *
 * Ties resolve to the EARLIER candidate, so callers express the server's own
 * preference through the argument order. Returns `null` when the client accepts
 * none of them (the caller decides between 406 and a default).
 */
export function preferredMediaType(
  header: string | null | undefined,
  candidates: readonly string[],
): string | null {
  const ranges = parseAccept(header);

  // No (or unparseable) Accept header means `*\/*` — the server chooses, so the
  // server's own first preference wins.
  if (ranges.length === 0) return candidates[0] ?? null;

  let winner: string | null = null;
  let winnerMatch: Match | null = null;

  for (const candidate of candidates) {
    const match = bestMatch(ranges, candidate);
    if (!match || match.q <= 0) continue;

    if (
      !winnerMatch ||
      match.q > winnerMatch.q ||
      (match.q === winnerMatch.q && outranks(match, winnerMatch))
    ) {
      winner = candidate;
      winnerMatch = match;
    }
  }

  return winner;
}

/**
 * True when the client ranks Markdown ABOVE HTML. `text/html` is listed first
 * so a tie — the `Accept: *\/*` that curl and most crawlers send — keeps the
 * HTML page, which is what a human behind a generic client expects.
 */
export function prefersMarkdown(header: string | null | undefined): boolean {
  const preferred = preferredMediaType(header, [
    "text/html",
    ...MARKDOWN_MEDIA_TYPES,
  ]);
  return preferred !== null && preferred !== "text/html";
}

/**
 * True when the client explicitly named `text/html` (every browser does, on
 * every document request). A generic `*\/*` does NOT count: it tells us the
 * client has no opinion, not that it can render a page.
 */
export function acceptsHtmlExplicitly(
  header: string | null | undefined,
): boolean {
  return parseAccept(header).some(
    (range) => range.type === "text" && range.subtype === "html" && range.q > 0,
  );
}

/**
 * Merge `Accept, Accept-Encoding` into an existing `Vary` value without
 * duplicating or dropping what is already there.
 */
export function mergeVary(existing: string | null | undefined): string {
  const seen = new Map<string, string>();

  for (const value of [existing ?? "", NEGOTIATED_VARY]) {
    for (const field of value.split(",")) {
      const trimmed = field.trim();
      if (!trimmed) continue;
      // `Vary: *` swallows everything else and cannot be narrowed.
      if (trimmed === "*") return "*";
      // First writer wins, so a `Vary` the app already set keeps its own casing.
      if (!seen.has(trimmed.toLowerCase())) seen.set(trimmed.toLowerCase(), trimmed);
    }
  }

  return [...seen.values()].join(", ");
}
