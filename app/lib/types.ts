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
  author?: Author;
};

export const authors: Record<string, Author> = {
  brad: {
    name: "Brad Barbin",
    avatar: "/faces/brad.webp",
    title: "Co-Founder",
  },
} as const;
