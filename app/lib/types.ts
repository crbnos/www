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
  rob: {
    name: "Rob Carrington",
    avatar: "/faces/rob.webp",
    title: "CEO & Co-Founder",
  },
  brad: {
    name: "Brad Barbin",
    avatar: "/faces/brad.webp",
    title: "CTO & Co-Founder",
  },
} as const;
