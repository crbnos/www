import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { json } from "@vercel/remix";
import { Article } from "~/components/article";
import { getBlogPost } from "~/lib/blog.server";

export const config = {
  runtime: "nodejs",
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  let requestUrl = new URL(request.url);
  let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

  const { slug } = params;
  if (!slug) throw new Error("slug not found");
  const post = await getBlogPost(slug);
  if (!post) throw new Error("Post not found");

  return json(
    {
      post,
      siteUrl,
    },
    {
      headers: {
        "X-Robots-Tag": "index",
      },
    }
  );
}

export const meta: MetaFunction = ({ data, params }) => {
  const { slug } = params;
  const postData = data as {
    post: Awaited<ReturnType<typeof getBlogPost>>;
    siteUrl: string;
  };
  const siteUrl = postData.siteUrl;
  const post = postData.post;

  if (!post) {
    return [
      { title: "404 Not Found | CarbonOS" },
      {
        name: "description",
        content: "404 Not Found | CarbonOS",
      },
    ];
  }

  let url = siteUrl ? `${siteUrl}/blog/${slug}` : null;
  const socialImageUrl = `${siteUrl}${post.metadata.image}`;

  return [
    { title: post.metadata.title },
    {
      name: "description",
      content: post.metadata.summary,
    },
    { property: "og:url", content: url },
    { property: "og:title", content: post.metadata.title },
    { property: "og:image", content: socialImageUrl },
    { property: "og:description", content: post.metadata.summary },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.metadata.title },
    { name: "twitter:description", content: post.metadata.summary },
    { name: "twitter:image", content: socialImageUrl },
  ];
};

export default function Blog() {
  const { post } = useLoaderData<typeof loader>();

  return <Article data={post} />;
}
