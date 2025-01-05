import { generateStaticBlogData } from "../app/lib/blog.local.server";

async function main() {
  console.log("Generating static blog data...");
  await generateStaticBlogData();
  console.log("Static blog data generated successfully!");
}

main().catch((error) => {
  console.error("Error generating static blog data:", error);
  process.exit(1);
});
