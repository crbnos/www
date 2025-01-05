// @ts-nocheck
import { blogPosts } from "./static-blog-data";
import type { BlogPost } from "./types";

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}
