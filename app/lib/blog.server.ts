import { LRUCache } from "lru-cache";
import { BlogPost } from "./types";

const postsCache = new LRUCache<string, BlogPost>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 1 day
});

let staticPosts: BlogPost[] | undefined;

export async function getBlogPosts() {
  if (process.env.VERCEL_ENV === "production") {
    if (!staticPosts) {
      // In production, use static import
      // @ts-ignore -- this is generated at build time
      const { blogData } = await import("./blog.edge.server");
      // @ts-ignore
      staticPosts = blogData;
    }
    return staticPosts;
  } else {
    const { getBlogPosts } = await import("./blog.local.server");
    return getBlogPosts();
  }
}

export async function getBlogPost(slug: string) {
  if (process.env.VERCEL_ENV === "production") {
    const cachedPost = postsCache.get(slug);
    if (cachedPost) {
      return cachedPost;
    }
  }

  const posts = await getBlogPosts();
  const post = posts?.find((post: BlogPost) => post.slug === slug);

  if (post) {
    postsCache.set(slug, post);
  }

  return post;
}
