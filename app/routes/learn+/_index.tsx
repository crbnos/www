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
    <div className="flex flex-col">
      <header className="mb-14">
        <div className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground">
          Learning Center
        </div>
        <h1 className="mt-4 font-medium text-3xl tracking-tight">
          Manufacturing systems, explained
        </h1>
        <p className="mt-4 max-w-[60ch] text-muted-foreground leading-relaxed">
          Practical guides to manufacturing ERP, MRP, MES and QMS — how the
          systems fit together, what they cost, and how to run production on
          them. Written for the people who actually build parts.
        </p>
      </header>
      <div className="flex flex-col gap-12">
        {data.map((post) => (
          <Article key={post.slug} data={post} preview />
        ))}
      </div>
    </div>
  );
}
