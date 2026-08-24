import type { LoaderFunctionArgs } from "react-router";
import { machineReadable } from "~/lib/agent/response";
import { getBlogPosts } from "~/lib/blog.server";
import { getComparisons } from "~/lib/compare";

export const config = { runtime: "edge" };

type SitemapEntry = {
  path: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
};

/**
 * Indexable pages that aren't data-driven. `/sales` is intentionally omitted
 * because it ships `noindex`; keeping it out of the sitemap keeps the two
 * signals consistent.
 */
const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
  { path: "/developers", changefreq: "monthly", priority: "0.9" },
  { path: "/learn", changefreq: "weekly", priority: "0.8" },
  { path: "/compare", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/brand", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/subprocessors", changefreq: "yearly", priority: "0.3" },
];

/** W3C date (YYYY-MM-DD) for `<lastmod>`, or undefined if unparseable. */
function toLastmod(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? undefined
    : date.toISOString().slice(0, 10);
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function urlNode(siteUrl: string, entry: SitemapEntry): string {
  const parts = [`    <loc>${xmlEscape(siteUrl + entry.path)}</loc>`];
  if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  if (entry.changefreq)
    parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
  return `  <url>\n${parts.join("\n")}\n  </url>`;
}

/**
 * The sitemap, generated from the same route and data sources the site renders
 * from. Learn articles and comparison pages are data-driven, so a hand-kept
 * static sitemap drifted out of sync every time one was added; generating it
 * here means a new post or competitor is listed automatically.
 */
export async function loader(_args: LoaderFunctionArgs) {
  const { request } = _args;
  const requestUrl = new URL(request.url);
  const siteUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  const posts = (await getBlogPosts()) ?? [];
  const postEntries: SitemapEntry[] = posts.map((post) => ({
    path: `/learn/${post.slug}`,
    changefreq: "monthly",
    priority: "0.6",
    lastmod: toLastmod(post.metadata.publishedAt),
  }));

  const compareEntries: SitemapEntry[] = getComparisons().map((c) => ({
    path: `/compare/${c.slug}`,
    changefreq: "monthly",
    priority: "0.7",
  }));

  const entries = [...STATIC_ENTRIES, ...postEntries, ...compareEntries];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => urlNode(siteUrl, entry)).join("\n")}
</urlset>
`;

  return machineReadable(body, "application/xml; charset=utf-8");
}
