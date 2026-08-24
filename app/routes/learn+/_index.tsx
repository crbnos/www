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
    // Ship only the fields the preview cards render. Each BlogPost also carries
    // the full rendered `html` and source `markdown`; serializing those for all
    // ~56 posts pushed the index HTML past 1.7 MB, hurting LCP and wasting
    // crawl budget on content already served at each /learn/<slug>.
    data: posts
      .map((post) => ({
        slug: post.slug,
        metadata: post.metadata,
        author: post.author,
      }))
      .sort((a, b) => {
        if (
          new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
        ) {
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
      {/* Page header, deliberately unlike an article card: no eyebrow (the
          layout's floating "Learning Center" pill already labels the section),
          a larger display-type title, a real subheadline, and a divider that
          sets the intro apart from the list of guides below it. */}
      <header className="mb-16 border-b border-border pb-10">
        <h1 className="max-w-[20ch] font-display font-semibold text-4xl sm:text-5xl tracking-tight text-balance">
          Manufacturing systems, explained
        </h1>
        <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground text-pretty">
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
