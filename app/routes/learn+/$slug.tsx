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
  // Fall back to the site OG image when a post has no hero of its own, so the
  // article never ships a broken `${siteUrl}undefined` social card.
  const socialImageUrl = post.metadata.image
    ? `${siteUrl}${post.metadata.image}`
    : `${siteUrl}/images/og.webp`;

  // BlogPosting JSON-LD so search engines and answer engines can attribute the
  // article to its author and publisher, and resolve it as a first-class
  // article rather than an anonymous page. Author identity (name + title) is
  // what carries E-E-A-T for these SEO articles.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url ? `${url}#article` : undefined,
    headline: post.metadata.title,
    description: post.metadata.summary,
    image: socialImageUrl,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.updatedAt ?? post.metadata.publishedAt,
    inLanguage: "en",
    mainEntityOfPage: url ?? undefined,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.title,
          image: `${siteUrl}${post.author.avatar}`,
        }
      : { "@type": "Organization", name: "Carbon Manufacturing Systems" },
    publisher: siteUrl ? { "@id": `${siteUrl}/#organization` } : undefined,
  };

  // Breadcrumb trail (Home > Learn > article). Breadcrumb rich results are
  // still fully supported by Google, and these long-tail, two-levels-deep
  // articles are exactly the pages that benefit from an explicit hierarchy.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: siteUrl ? `${siteUrl}/learn` : undefined,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.metadata.title,
        item: url ?? undefined,
      },
    ],
  };

  // `seoTitle` (when set) shortens only the <title> tag; the full `title` still
  // renders as the article's H1 and as the BlogPosting/breadcrumb name above.
  const seoTitle = post.metadata.seoTitle ?? post.metadata.title;

  return pageMeta(matches, {
    title: `${seoTitle} | Carbon`,
    description: post.metadata.summary,
    extra: [
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: post.metadata.publishedAt },
      { property: "article:author", content: post.author?.name },
      { property: "og:image", content: socialImageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: socialImageUrl },
      { "script:ld+json": articleSchema },
      { "script:ld+json": breadcrumbSchema },
    ],
  });
};

export default function Blog() {
  const { post } = useLoaderData<typeof loader>();

  return <Article data={post} />;
}
