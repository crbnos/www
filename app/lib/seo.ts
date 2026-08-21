/**
 * Meta merging for leaf routes.
 *
 * React Router does NOT merge a child route's `meta` with its parent's — the
 * leaf's array replaces the root's outright. So every page that exported its own
 * `meta` was silently dropping the canonical link, the Organization/WebSite
 * JSON-LD graph, `og:image`, `og:site_name` and the robots directive that
 * `root.tsx` builds. `mergeMeta` puts them back and lets the page override only
 * the tags it actually cares about.
 */

import type { MetaDescriptor } from "react-router";

type MetaMatch = { id?: string; meta?: MetaDescriptor[] } | undefined | null;

/** The brand suffix every page title carries, so a title names the product. */
export const TITLE_SUFFIX = "Carbon Manufacturing Systems";

/**
 * A stable identity for a descriptor, so an override replaces the root's tag
 * rather than appending a duplicate. Descriptors with no identity (the JSON-LD
 * script, for one) are always kept.
 */
function identify(descriptor: MetaDescriptor): string | null {
  if ("title" in descriptor) return "title";
  if ("name" in descriptor) return `name:${String(descriptor.name)}`;
  if ("property" in descriptor) return `property:${String(descriptor.property)}`;
  if ("tagName" in descriptor && descriptor.tagName === "link") {
    return `link:${String((descriptor as { rel?: string }).rel)}`;
  }
  return null;
}

/** Root's descriptors, with anything this page overrides removed, then the page's. */
export function mergeMeta(
  matches: readonly MetaMatch[],
  overrides: MetaDescriptor[],
): MetaDescriptor[] {
  const root = matches.find((match) => match?.id === "root")?.meta ?? [];
  const overridden = new Set(
    overrides.map(identify).filter((key): key is string => key !== null),
  );

  return [
    ...root.filter((descriptor) => {
      const key = identify(descriptor);
      return key === null || !overridden.has(key);
    }),
    ...overrides,
  ];
}

/**
 * The full tag set for a page: title, description, and the Open Graph and
 * Twitter pairs that mirror them — kept together so a page cannot end up with
 * its own title but the site's `og:title`, which is what search and social
 * previews actually read.
 *
 * `title` is suffixed with the product name unless it already contains
 * "Carbon". A page title that does not name the product is invisible to a
 * name-based search.
 */
export function pageMeta(
  matches: readonly MetaMatch[],
  {
    title,
    description,
    extra = [],
  }: { title: string; description: string; extra?: MetaDescriptor[] },
): MetaDescriptor[] {
  const fullTitle = /carbon/i.test(title) ? title : `${title} | ${TITLE_SUFFIX}`;

  return mergeMeta(matches, [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    ...extra,
  ]);
}
