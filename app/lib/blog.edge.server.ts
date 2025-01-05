import fs from "node:fs";
import path from "node:path";
import type { BlogPost } from "./types";

export async function getBlogPosts() {
  const filePath = path.join(
    process.cwd(),
    "app",
    "lib",
    "static-blog-data.json"
  );
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as BlogPost[];
}
