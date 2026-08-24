export type Metadata = {
  title: string;
  /**
   * Optional SEO `<title>` override. The full `title` doubles as the article's
   * on-page H1, so a long, descriptive headline overflows the ~60-char SERP
   * limit. `seoTitle` sets a shorter title tag without touching the visible
   * headline; it falls back to `title` when absent.
   */
  seoTitle?: string;
  publishedAt: string;
  /**
   * Optional last-updated date (YYYY-MM-DD). When set, it feeds the
   * BlogPosting `dateModified` so evergreen posts can emit a real freshness
   * signal instead of reporting they were never touched after publish.
   */
  updatedAt?: string;
  summary: string;
  image?: string;
  tag: string;
  author: string;
};

export type Author = {
  name: string;
  avatar: string;
  title: string;
};

export type BlogPost = {
  metadata: Metadata;
  slug: string;
  html: string;
  /**
   * The post's source Markdown, front matter stripped. Carried alongside the
   * rendered HTML so `Accept: text/markdown` can serve the real article rather
   * than a conversion of the DOM.
   */
  markdown: string;
  author?: Author;
};

export const authors: Record<string, Author> = {
  brad: {
    name: "Brad Barbin",
    avatar: "/faces/brad.webp",
    title: "Co-Founder",
  },
  chase: {
    name: "Chase Foster",
    avatar: "/faces/chase.png",
    title: "Co-Founder and CEO",
  },
} as const;
