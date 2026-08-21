import { data, useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { Article } from "~/components/article";
import { getBlogPosts } from "~/lib/blog.server";
import { pageMeta } from "~/lib/seo";

export const config = {
  runtime: "edge",
};

export const meta: MetaFunction = ({ matches }) =>
  pageMeta(matches, {
    title: "Carbon blog",
    description:
      "Articles and updates from Carbon Manufacturing Systems on manufacturing ERP, MRP, MES and QMS.",
  });

export async function loader() {
  const posts = (await getBlogPosts()) || [];
  return data({
    data: posts.sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    }),
  });
}

export default function Blog() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-12">
      {data.map((post) => (
        <Article key={post.slug} data={post} preview />
      ))}
    </div>
  );
}
