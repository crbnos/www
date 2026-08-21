import { OAUTH_METADATA } from "~/lib/agent/site";
import { wellKnownRedirect } from "~/lib/agent/oauth";

export const config = { runtime: "edge" };

/**
 * RFC 8414 authorization-server metadata for Carbon.
 *
 * carbon.ms issues no tokens — `app.carbon.ms` is the authorization server — so
 * this redirects rather than mirroring. See `lib/agent/oauth.ts` for why a copy
 * served from this origin would be invalid.
 */
export function loader() {
  return wellKnownRedirect(OAUTH_METADATA.authorizationServer);
}
