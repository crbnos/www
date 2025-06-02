import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { json } from "@vercel/remix";
import { Article } from "~/components/article";
import { getBlogPosts } from "~/lib/blog.server";

export const config = {
  runtime: "edge",
};

export const meta: MetaFunction = () => {
  return [
    { title: "Blog | Carbon" },
    {
      name: "description",
      content: "Latest articles and updates from Carbon",
    },
  ];
};

export async function loader() {
  const posts = (await getBlogPosts()) || [];
  return json({
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
