import type { ServerRuntimeMetaFunction as MetaFunction } from "@remix-run/server-runtime";
import { DownloadIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Carbon | Brand Assets" },
    {
      name: "description",
      content: "Carbon Brand Assets",
    },
  ];
};

export default function Brand() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-4xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">
            Brand Assets
          </h1>
          <h2 className="font-medium text-xl text-muted-foreground max-w-5xl text-balance leading-relaxed tracking-tight">
            All Carbon trademarks, logos, or other brand elements can never be
            modified or used for any other purpose other than to represent
            Carbon Manufacturing Systems Corporation.
          </h2>
        </div>

        <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 mb-8">
          <div className="bg-background p-8 rounded-md flex items-center justify-center">
            <img
              src="/brand/carbon-mark.svg"
              alt="Carbon Mark"
              className="h-36"
            />
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="secondary" className="text-sm">
              <a href="/brand/carbon-mark.svg" download>
                SVG
              </a>
            </Button>
            <Button asChild variant="secondary" className="text-sm">
              <a href="/brand/carbon-mark.png" download>
                PNG
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-black p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-word-dark.svg"
                alt="Dark Wordmark"
                className="h-12"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-dark.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-dark.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-white p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-word-light.svg"
                alt="Light Wordmark"
                className="h-12"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-light.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-light.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-black p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-sub-mark-dark.svg"
                alt="Dark Submark"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-sub-mark.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-sub-mark.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-white p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-sub-mark-light.svg"
                alt="Light Submark"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-sub-mark-light.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-sub-mark-light.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-black p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-sub-mark-plus-dark.svg"
                alt="Dark Submark Plus"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-sub-mark-plus.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-word-sub-mark-plus.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <div className="bg-white p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-sub-mark-plus-light.svg"
                alt="Light Submark Plus"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-sub-mark-plus-light.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-sub-mark-plus-light.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-8 mb-16 w-full bg-zinc-100 dark:bg-zinc-900 rounded-lg p-6 gap-4">
          <Button variant="secondary" asChild>
            <a href="/brand/carbon-logos.zip" download>
              Download Logo Kit
              <DownloadIcon className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
