import fs from "fs";
import path from "path";
import { generateStaticBlogData } from "../app/lib/blog.local.server";

async function main() {
  console.log("Generating static blog data...");
  await generateStaticBlogData();
  await removeLocalBlogServer();
  console.log("Static blog data generated successfully!");
}

main().catch((error) => {
  console.error("Error generating static blog data:", error);
  process.exit(1);
});

function removeLocalBlogServer() {
  const newFile = `export async function getBlogPosts() {
  return [];
}
`;

  fs.writeFileSync(
    path.join(process.cwd(), "app", "lib", "blog.local.server.ts"),
    newFile
  );
}
