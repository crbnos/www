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
      title: string;
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
        {data.author && (
          <div className="flex items-center gap-2 mt-6">
            <img
              src={data.author.avatar}
              alt={data.author.name}
              className="size-10 object-cover rounded-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm text-foreground font-semibold">
                {data.author.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {data.author.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
