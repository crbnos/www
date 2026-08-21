/**
 * OAuth discovery from the marketing domain.
 *
 * An agent handed `carbon.ms` probes `carbon.ms/.well-known/oauth-authorization-server`
 * to find out whether the product speaks OAuth. Carbon does — but the
 * authorization server is `app.carbon.ms`, and until this existed the probe got
 * a 404 and the answer read as "no".
 *
 * This REDIRECTS rather than serving a copy. RFC 8414 §3.3 requires the client
 * to verify that the `issuer` in the returned metadata matches the origin it
 * derived the request URL from, so a document carrying `issuer:
 * "https://app.carbon.ms"` served at a carbon.ms URL is one a conforming client
 * MUST reject. A redirect keeps the metadata authoritative at its own origin:
 * the client follows, validates against `app.carbon.ms`, and the issuer matches.
 *
 * 302 rather than 301 — the split between the marketing domain and the app is a
 * deployment fact, not a permanent property of the URL, and a cached-forever
 * redirect is expensive to undo.
 */

/** Where this redirect points. Exported so tests read the same value the route does. */
export const WELL_KNOWN_REDIRECT_STATUS = 302;

export function wellKnownRedirect(location: string): Response {
  return new Response(null, {
    status: WELL_KNOWN_REDIRECT_STATUS,
    headers: {
      Location: location,
      // Public, unauthenticated discovery — agents fetch it cross-origin.
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      // Short: the target moves if the app's origin ever changes.
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
