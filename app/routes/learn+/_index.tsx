import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { json } from "@vercel/remix";
import { Article } from "~/components/article";
import { getBlogPosts } from "~/lib/blog.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Blog | CarbonOS" },
    {
      name: "description",
      content: "Latest articles and updates from CarbonOS",
    },
  ];
};

export async function loader() {
  return json({
    data: (await getBlogPosts()).sort((a, b) => {
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
      {data.map((post, index) => (
        <Article data={post} preview />
      ))}
    </div>
  );
}
