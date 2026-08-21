import { handleRequest as vercelHandleRequest } from "@vercel/react-router/entry.server";
import type { EntryContext } from "react-router";
import {
  applyNegotiationHeaders,
  negotiateMarkdown,
} from "./lib/agent/negotiate.server";

export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: any,
) {
  // Content negotiation runs before React does: an agent asking for
  // `text/markdown` gets Markdown, and an agent that hit a dead URL gets a 404
  // it can recover from. Browsers fall straight through to the rendered page.
  const markdown = await negotiateMarkdown(request, responseStatusCode);
  if (markdown) return markdown;

  // Mutating the headers React Router hands us is what puts `Vary` on the HTML
  // variant too — without it a CDN can serve a cached HTML body to an agent
  // that asked for Markdown.
  await applyNegotiationHeaders(request, responseHeaders);

  return vercelHandleRequest(
    request,
    responseStatusCode,
    responseHeaders,
    routerContext,
    loadContext,
  );
}
