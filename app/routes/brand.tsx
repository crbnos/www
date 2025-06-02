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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-900">
            <div className="bg-black p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-light-mark.svg"
                alt="Dark Mark"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-light-mark.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-light-mark.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-900">
            <div className="bg-white p-8 rounded-md flex items-center justify-center">
              <img
                src="/brand/carbon-dark-mark.svg"
                alt="Dark Mark"
                className="h-24"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-dark-mark.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-dark-mark.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-900">
            <div className="bg-black p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-light-word.svg"
                alt="Light Wordmark"
                className="h-12"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-light-word.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-light-word.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-lg bg-zinc-900">
            <div className="bg-white p-8 rounded-md flex items-center justify-center min-h-[160px]">
              <img
                src="/brand/carbon-dark-word.svg"
                alt="Dark Wordmark"
                className="h-12"
              />
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-dark-word.svg" download>
                  SVG
                </a>
              </Button>
              <Button asChild variant="secondary" className="text-sm">
                <a href="/brand/carbon-dark-word.png" download>
                  PNG
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-8 mb-16 w-full bg-zinc-900 rounded-lg p-6 gap-4">
          <Button variant="secondary" asChild>
            <a href="/brand/logos.zip" download>
              Download Logo Kit
              <DownloadIcon className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
