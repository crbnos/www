import { Link } from "react-router";

type ArticleProps = {
  data: {
    slug: string;
    metadata: {
      tag?: string;
      title: string;
      summary: string;
      image?: string;
      publishedAt?: string;
    };
    // Optional: preview cards (the /learn index) omit the body to keep the
    // page payload small. The full-article render below supplies it.
    html?: string;
    author?: {
      name: string;
      avatar: string;
      title: string;
    };
  };
  preview?: boolean;
};

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Byline({
  author,
  publishedAt,
}: {
  author?: ArticleProps["data"]["author"];
  publishedAt?: string;
}) {
  const date = formatDate(publishedAt);
  if (!author && !date) return null;
  return (
    <div className="flex items-center gap-3">
      {author && (
        <img
          src={author.avatar}
          alt={author.name}
          className="size-9 object-cover rounded-full corner-squircle"
          width={36}
          height={36}
          loading="lazy"
        />
      )}
      <div className="flex flex-col">
        {author && (
          <span className="text-foreground font-semibold leading-tight">
            {author.name}
          </span>
        )}
        <span className="text-sm text-muted-foreground leading-tight">
          {[author?.title, date].filter(Boolean).join(" · ")}
        </span>
      </div>
    </div>
  );
}

export function Article({ data, preview = false }: ArticleProps) {
  if (preview) {
    return (
      <article
        key={data.slug}
        className="group border-b border-border pb-12 last:border-b-0"
      >
        {data.metadata.tag && (
          <div className="mb-3 font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-muted-foreground">
            {data.metadata.tag}
          </div>
        )}
        <Link prefetch="intent" className="block" to={`/learn/${data.slug}`}>
          <h2 className="font-medium text-2xl tracking-tight transition-colors group-hover:text-secondary">
            {data.metadata.title}
          </h2>
        </Link>
        {data.metadata.summary && (
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {data.metadata.summary}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-4">
          <Byline
            author={data.author}
            publishedAt={data.metadata.publishedAt}
          />
          <Link
            prefetch="intent"
            to={`/learn/${data.slug}`}
            className="text-sm font-medium text-secondary hover:underline"
          >
            Read more<span className="sr-only">: {data.metadata.title}</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article key={data.slug} className="pt-28 -mt-28 mb-20 " id={data.slug}>
      {data.metadata.tag && (
        <div className="mb-3 font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-muted-foreground">
          {data.metadata.tag}
        </div>
      )}
      <h1 className="font-medium text-3xl tracking-tight mb-6">
        {data.metadata.title}
      </h1>

      <div className="mb-8">
        <Byline author={data.author} publishedAt={data.metadata.publishedAt} />
      </div>

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
        <div
          className="prose prose-md dark:prose-invert max-w-none mt-4"
          dangerouslySetInnerHTML={{ __html: data.html ?? "" }}
        />
        {data.author && (
          <div className="flex items-center gap-2 mt-12 pt-8 border-t border-border">
            <img
              src={data.author.avatar}
              alt={data.author.name}
              className="size-10 object-cover rounded-full corner-squircle"
            />
            <div className="flex flex-col">
              <span className="text-foreground font-semibold">
                {data.author.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {data.author.title}
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
