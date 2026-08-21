export type Metadata = {
  title: string;
  publishedAt: string;
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
} as const;
