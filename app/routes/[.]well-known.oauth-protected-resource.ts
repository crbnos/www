import { OAUTH_METADATA } from "~/lib/agent/site";
import { wellKnownRedirect } from "~/lib/agent/oauth";

export const config = { runtime: "edge" };

/** RFC 9728 protected-resource metadata. Lives on the app; see the sibling route. */
export function loader() {
  return wellKnownRedirect(OAUTH_METADATA.protectedResource);
}
