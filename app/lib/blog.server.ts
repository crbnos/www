import { LRUCache } from "lru-cache";
import fs from "node:fs";
import path from "node:path";
import { processMarkdown } from "./md.server";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tag: string;
  author: string;
};

type Author = {
  name: string;
  avatar: string;
  title: string;
};

type BlogPost = {
  metadata: Metadata;
  slug: string;
  html: string;
  author?: Author;
};

const authors: Record<string, Author> = {
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
  tom: {
    name: "Tom Smith",
    avatar: "/faces/tom.webp",
    title: "Co-Founder",
  },
} as const;

const postsCache = new LRUCache<string, BlogPost>({
  max: 100, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // 1 hour TTL
});

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match?.[1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock?.trim().split("\n") || [];
  const metadata: Partial<Metadata> = {};

  for (const line of frontMatterLines) {
    const [key, ...valueArr] = line.split(": ");
    if (key) {
      let value = valueArr.join(": ").trim();
      value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      metadata[key.trim() as keyof Metadata] = value;
    }
  }

  return {
    metadata: metadata as Metadata,
    content,
    author: metadata.author
      ? authors[metadata.author as keyof typeof authors]
      : undefined,
  };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

async function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  const posts = [];

  for await (const file of mdxFiles) {
    const { metadata, content, author } = readMDXFile(path.join(dir, file));
    const { html } = await processMarkdown(content);
    const slug = path.basename(file, path.extname(file));
    const post = { metadata, slug, html, author };

    postsCache.set(slug, post);
    posts.push(post);
  }

  return posts;
}

export async function getBlogPosts() {
  return await getMDXData(
    path.join(process.cwd(), "app", "routes", "blog+", "posts")
  );
}

export async function getBlogPost(slug: string) {
  // Try to get from cache first
  const cached = postsCache.get(slug);
  if (cached) return cached;

  // If not in cache, load all posts (which will populate cache)
  await getBlogPosts();

  // Return from cache
  return postsCache.get(slug);
}
