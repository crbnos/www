/**
 * The body of a 404.
 *
 * A real 404 status is only half of what an agent needs: told "not here" and
 * nothing else, it either gives up or guesses at more URLs. The Markdown body
 * below names the machine-readable indexes and every top-level page, so one
 * failed request is enough to recover from.
 */

import { AGENT_PAGE_PATHS } from "./pages";
import { onOrigin, RECOVERY_LINKS, SITE_URL } from "./site";

/**
 * Markdown for a 404 at `pathname`. Kept short on purpose — this is a recovery
 * aid, not a page.
 *
 * `origin` is the origin the client actually reached, so the links it gets back
 * point at the deployment it is talking to. Handing a preview deploy's caller a
 * list of production URLs is how a recovery aid sends someone somewhere else.
 */
export function notFoundMarkdown(
  pathname: string,
  origin: string = SITE_URL,
): string {
  const pages = AGENT_PAGE_PATHS.map(
    (path) => `- [${origin}${path === "/" ? "" : path}](${origin}${path})`,
  );

  return [
    "# 404 Not Found",
    "",
    `\`${pathname}\` does not exist on ${origin}. Nothing was moved — this path has no resource behind it.`,
    "",
    "## Where to look next",
    "",
    ...RECOVERY_LINKS.map(
      (link) => `- [${link.label}](${onOrigin(link.href, origin)})`,
    ),
    "",
    "## Pages on this site",
    "",
    ...pages,
    "",
    "Every page above is also available as Markdown: send `Accept: text/markdown`, or append `.md` to the path.",
    "",
  ].join("\n");
}
