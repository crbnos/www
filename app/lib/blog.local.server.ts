import fs from "node:fs";
import path from "node:path";
import { processMarkdown } from "./md.server";
import { authors, Metadata } from "./types";

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
      value = value.replace(/^['"](.*)['"]$/, "$1");
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

    posts.push(post);
  }

  return posts;
}

export async function generateStaticBlogData() {
  if (process.env.NODE_ENV === "production") {
    const posts = await getMDXData(
      path.join(process.cwd(), "app", "routes", "learn+", "posts")
    );

    // Write the static data to a JSON file
    const outputPath = path.join(
      process.cwd(),
      "app",
      "lib",
      "static-blog-data.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  }
}

export async function getBlogPosts() {
  // In development, use the filesystem
  return await getMDXData(
    path.join(process.cwd(), "app", "routes", "learn+", "posts")
  );
}
