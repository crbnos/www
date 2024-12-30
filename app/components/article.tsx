import { Link } from "@remix-run/react";

type ArticleProps = {
  data: {
    slug: string;
    metadata: {
      tag: string;
      title: string;
      summary: string;
      image?: string;
    };
    html: string;
    author?: {
      name: string;
      avatar: string;
    };
  };
  preview?: boolean;
};

export function Article({ data, preview = false }: ArticleProps) {
  return (
    <article key={data.slug} className="pt-28 -mt-28 mb-20 " id={data.slug}>
      <Link prefetch="intent" className="mb-6 block" to={`/blog/${data.slug}`}>
        <h2 className="font-medium text-2xl mb-6">{data.metadata.title}</h2>
      </Link>
      {data.author && (
        <div className="flex items-center gap-2 mb-6">
          <img
            src={data.author.avatar}
            alt={data.author.name}
            className="size-8 object-cover rounded-full"
          />
          <span className="text-sm text-gray-500">{data.author.name}</span>
        </div>
      )}
      <div className="updates">
        {data.metadata.image && (
          <img
            src={data.metadata.image}
            alt={data.metadata.title}
            className="w-full h-auto rounded-lg"
            width={680}
            height={340}
          />
        )}
        {!preview && (
          <div
            className="prose prose-md prose-invert max-w-none mt-12"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        )}
      </div>
    </article>
  );
}
