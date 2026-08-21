/**
 * Markdown representations for `/learn` and `/learn/<slug>`.
 *
 * Unlike the static pages these are generated from the same source the HTML
 * renders from, so they cannot drift: a post's `markdown` field is the article's
 * own source, front matter stripped.
 */

import type { BlogPost } from "../types";
import { SITE_URL } from "./site";

/** Markdown index of every post, newest first. */
export function blogIndexMarkdown(posts: BlogPost[]): string {
  const sorted = [...posts].sort((a, b) =>
    a.metadata.publishedAt < b.metadata.publishedAt ? 1 : -1,
  );

  const entries = sorted.flatMap((post) => [
    `## [${post.metadata.title}](${SITE_URL}/learn/${post.slug})`,
    "",
    `*${post.metadata.publishedAt}${post.metadata.author ? ` · ${post.metadata.author}` : ""}*`,
    "",
    post.metadata.summary ?? "",
    "",
  ]);

  return [
    "# Carbon blog",
    "",
    "Articles on manufacturing systems and Carbon.",
    "",
    ...(entries.length ? entries : ["No posts yet.", ""]),
    `Each post is also available as Markdown at \`${SITE_URL}/learn/<slug>.md\`.`,
    "",
  ].join("\n");
}

/** A single post as Markdown, with its metadata restored as a readable header. */
export function blogPostMarkdown(post: BlogPost): string {
  const byline = [post.metadata.publishedAt, post.metadata.author]
    .filter(Boolean)
    .join(" · ");

  return [
    `# ${post.metadata.title}`,
    "",
    byline ? `*${byline}*` : "",
    "",
    post.markdown.trim(),
    "",
    "---",
    "",
    `[Read on carbon.ms](${SITE_URL}/learn/${post.slug}) · [All posts](${SITE_URL}/learn)`,
    "",
  ]
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n");
}
