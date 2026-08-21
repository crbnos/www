import { data, useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Article } from "~/components/article";
import { getBlogPost } from "~/lib/blog.server";
import { pageMeta } from "~/lib/seo";

export const config = {
  runtime: "edge",
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  let requestUrl = new URL(request.url);
  let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

  const { slug } = params;
  // A missing or unknown slug is a 404, not a crash. Throwing a bare Error here
  // produced an HTTP 500, which tells an agent the site is broken rather than
  // that the URL is wrong.
  if (!slug) throw data(null, { status: 404 });
  const post = await getBlogPost(slug);
  if (!post) throw data(null, { status: 404 });

  return data(
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

export const meta: MetaFunction = ({ data, params, matches }) => {
  const { slug } = params;
  const postData = data as
    | {
        post: Awaited<ReturnType<typeof getBlogPost>>;
        siteUrl: string;
      }
    | undefined;
  const siteUrl = postData?.siteUrl;
  const post = postData?.post;

  if (!post) {
    return pageMeta(matches, {
      title: "404 Not Found",
      description:
        "This article does not exist. Browse every Carbon article at carbon.ms/learn.",
    });
  }

  let url = siteUrl ? `${siteUrl}/learn/${slug}` : null;
  const socialImageUrl = `${siteUrl}${post.metadata.image}`;

  return pageMeta(matches, {
    title: `${post.metadata.title} | Carbon`,
    description: post.metadata.summary,
    extra: [
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "og:image", content: socialImageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: socialImageUrl },
    ],
  });
};

export default function Blog() {
  const { post } = useLoaderData<typeof loader>();

  return <Article data={post} />;
}
