import { LRUCache } from "lru-cache";
import { BlogPost } from "./types";

const postsCache = new LRUCache<string, BlogPost>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 1 day
});

let staticPosts: BlogPost[] | undefined;

export async function getBlogPosts() {
  // import.meta.env.PROD is a Vite build-time constant, so the dev-only branch
  // below (which reads the filesystem) is statically eliminated from the
  // production bundle. That's what keeps node:fs out of the edge build without
  // needing to overwrite blog.local.server.ts with a stub.
  if (import.meta.env.PROD) {
    if (!staticPosts) {
      const { blogPosts } = await import("./static-blog-data");
      staticPosts = blogPosts;
    }
    return staticPosts;
  } else {
    const { getBlogPosts } = await import("./blog.local.server");
    return getBlogPosts();
  }
}

export async function getBlogPost(slug: string) {
  if (import.meta.env.PROD) {
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
