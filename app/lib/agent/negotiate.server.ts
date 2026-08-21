/**
 * Server-side glue for Markdown content negotiation.
 *
 * `entry.server.tsx` asks this module for a Markdown response before it renders
 * React. Returning `null` means "render the page as usual", which is the answer
 * for every browser request and for every route that has no Markdown
 * representation.
 */

import { getBlogPosts } from "../blog.server";
import {
  acceptsHtmlExplicitly,
  MARKDOWN_CONTENT_TYPE,
  mergeVary,
  NEGOTIATED_VARY,
  prefersMarkdown,
} from "./accept";
import { blogIndexMarkdown, blogPostMarkdown } from "./blog";
import { notFoundMarkdown } from "./not-found";
import { getAgentPage, resolveMarkdownPath } from "./pages";

const BLOG_ROOT = "/learn";

/** Resolve a canonical path to Markdown, consulting blog data only when needed. */
export async function markdownForPath(path: string): Promise<string | null> {
  if (path === BLOG_ROOT || path.startsWith(`${BLOG_ROOT}/`)) {
    const posts = (await getBlogPosts()) ?? [];

    if (path === BLOG_ROOT) return blogIndexMarkdown(posts);

    const slug = path.slice(`${BLOG_ROOT}/`.length);
    const post = posts.find((entry) => entry.slug === slug);
    return post ? blogPostMarkdown(post) : null;
  }

  return getAgentPage(path)?.markdown ?? null;
}

function markdownResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": MARKDOWN_CONTENT_TYPE,
      Vary: NEGOTIATED_VARY,
      // Short shared cache; the Vary above is what keeps a CDN from handing this
      // variant to a browser.
      "Cache-Control": "public, max-age=0, s-maxage=300",
      "X-Robots-Tag": status === 404 ? "noindex" : "all",
    },
  });
}

/**
 * The Markdown response for this request, or `null` to render HTML.
 *
 * Three cases, in order:
 *
 * 1. The client wants Markdown (by `Accept`, or by a `.md` suffix) and the path
 *    has one — serve it, status 200 even when the router 404'd on `/x.md`.
 * 2. The router produced a 404 and the client is not a browser — serve the
 *    Markdown 404 body, which names the sitemap, llms.txt and the docs index so
 *    one failed request is enough to recover from. A client that explicitly
 *    accepts `text/html` still gets the HTML 404 page.
 * 3. Anything else — `null`.
 */
export async function negotiateMarkdown(
  request: Request,
  responseStatusCode: number,
): Promise<Response | null> {
  const accept = request.headers.get("Accept");
  const { pathname } = new URL(request.url);
  const { path, explicit } = resolveMarkdownPath(pathname);
  const wantsMarkdown = explicit || prefersMarkdown(accept);

  if (wantsMarkdown) {
    const markdown = await markdownForPath(path);
    if (markdown) return markdownResponse(markdown, 200);
  }

  if (responseStatusCode === 404 && (wantsMarkdown || !acceptsHtmlExplicitly(accept))) {
    return markdownResponse(notFoundMarkdown(pathname), 404);
  }

  return null;
}

/**
 * Stamp `Vary` on an HTML document response, and advertise the Markdown variant
 * with a `Link: rel="alternate"` header so a client can find it without
 * guessing.
 */
export async function applyNegotiationHeaders(
  request: Request,
  responseHeaders: Headers,
): Promise<void> {
  responseHeaders.set("Vary", mergeVary(responseHeaders.get("Vary")));

  const url = new URL(request.url);
  const { path } = resolveMarkdownPath(url.pathname);
  if (!(await markdownForPath(path))) return;

  const alternate = new URL(url.pathname === "/" ? "/index.md" : `${path}.md`, url.origin);
  responseHeaders.append(
    "Link",
    `<${alternate.href}>; rel="alternate"; type="text/markdown"`,
  );
}
