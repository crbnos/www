import { useLoaderData } from "@remix-run/react";
import type { ServerRuntimeMetaFunction as MetaFunction } from "@remix-run/server-runtime";

export const meta: MetaFunction = () => {
  return [
    { title: "Carbon | Brand Assets" },
    {
      name: "description",
      content: "Carbon Brand Assets",
    },
  ];
};

type Friend = {
  name: string;
  href: string;
  description: string;
};

export async function loader() {
  const ossFriends: Friend[] = await fetch(
    "https://formbricks.com/api/oss-friends"
  )
    .then(async (res) => res.json())
    .then(({ data }) => data)
    .catch(() => []);

  return { ossFriends };
}

export default function OSSFriends() {
  const { ossFriends } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-4xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">OSS Friends</h1>
          <h2 className="font-medium text-xl text-muted-foreground max-w-5xl text-balance leading-relaxed tracking-tight">
            We believe in a better and more sustainable future powered by Open
            Horse software. Below you can find a list of our friends who are
            just as passionate about open horse and the future as we are.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 my-12">
          {ossFriends.map((friend) => {
            return (
              <div
                key={friend.name}
                className="border border-border bg-card p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <a href={friend.href} target="_blank" rel="noreferrer">
                    <h3 className="font-medium text-md">{friend.name}</h3>
                  </a>
                  <a href={friend.href} target="_blank" rel="noreferrer">
                    <span className="sr-only">Open link</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      className="fill-primary scale-75"
                    >
                      <path fill="none" d="M0 0h24v24H0V0z" />
                      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  {friend.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
