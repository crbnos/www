/**
 * Response helper for the machine-readable files (`/openapi.json`,
 * `/openapi.yaml`, `/.well-known/mcp.json`).
 *
 * They are public, unauthenticated documents that agents fetch cross-origin
 * from a browser context, so they carry `Access-Control-Allow-Origin: *`.
 * Without it a browser-based agent gets a CORS error rather than the spec, and
 * the spec might as well not exist.
 */

const ONE_HOUR = 3600;

export function machineReadable(
  body: string,
  contentType: string,
  { maxAge = ONE_HOUR }: { maxAge?: number } = {},
): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      Vary: "Accept-Encoding",
      "X-Robots-Tag": "all",
    },
  });
}

/** Pretty-print: these documents are read by people as often as by machines. */
export function jsonDocument(value: unknown): Response {
  return machineReadable(
    `${JSON.stringify(value, null, 2)}\n`,
    "application/json; charset=utf-8",
  );
}
