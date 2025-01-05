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
      // Looking at static-blog-data.ts, the export is named blogPosts not blogData
      const { blogPosts } = await import("./static-blog-data");
      staticPosts = blogPosts;
    }
    console.log("getBlogPosts", staticPosts);
    return staticPosts;
  } else {
    // We use require here instead of import to ensure this isn't bundled in production
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
