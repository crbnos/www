import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import type { MetaFunction } from "@vercel/remix";
import React from "react";

import Tailwind from "~/styles/tailwind.css?url";
import { Button } from "./components/ui/button";

export const config = { runtime: "edge" };

export function links() {
  return [{ rel: "stylesheet", href: Tailwind }];
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "CarbonOS | The operating system for manufacturing",
    },
    {
      name: "description",
      content:
        "CarbonOS is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
    },
    {
      name: "robots",
      content: "index,follow",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:site_name",
      content: "CarbonOS",
    },
    {
      property: "og:title",
      content: "CarbonOS | The operating system for manufacturing",
    },
    {
      property: "og:description",
      content:
        "CarbonOS is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
    },
    {
      property: "og:image",
      content: "https://app.carbonos.dev/carbon-logo-dark.png",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:site",
      content: "@carbonos",
    },
    {
      name: "twitter:title",
      content: "CarbonOS | The operating system for manufacturing",
    },
    {
      name: "twitter:description",
      content:
        "CarbonOS is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
    },
    {
      name: "twitter:image",
      content: "https://app.carbonos.dev/carbon-logo-dark.png",
    },
  ];
};

function Document({
  children,
  title = "CarbonOS",
  mode = "dark",
}: {
  children: React.ReactNode;
  title?: string;
  mode?: "light" | "dark";
}) {
  return (
    <html lang="en" className={`${mode} h-full overflow-x-hidden w-[100dvw]`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="h-[100dvh] w-[100dvw] flex flex-col bg-background text-foreground antialiased selection:bg-[#00cc9937] selection:text-[#007763fd] dark:selection:bg-[#00fff61d] dark:selection:text-[#67ffded2]">
        <header className="flex select-none items-center bg-transparent pl-5 pr-4 border-b h-[var(--header-height)] border-transparent fixed top-0 left-0 right-0 z-50">
          <div className="flex items-center justify-between gap-2 z-logo text-foreground w-full">
            <a href="/" className="cursor-pointer">
              <img
                src="https://app.carbonos.dev/carbon-logo-dark.png"
                alt="CarbonOS"
                className="size-6 block dark:hidden"
              />
              <img
                src="https://app.carbonos.dev/carbon-logo-light.png"
                alt="CarbonOS"
                className="size-6 hidden dark:block"
              />
            </a>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="cursor-pointer">
                <Link prefetch="intent" to="/blog">
                  Blog
                </Link>
              </Button>
              <Button variant="outline" asChild className="cursor-pointer">
                <a href="https://app.carbonos.dev">Login</a>
              </Button>
              <Button variant="default" className="cursor-pointer" asChild>
                <Link to="/#try-carbonos">Try It</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="relative flex h-full w-full items-start justify-center">
          <LightRays />
          <main>{children}</main>
        </div>

        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

function LightRays() {
  return ["one", "two", "three", "four", "five"].map((ray) => (
    <div className="ray" data-theme="dark">
      <div className={`light-ray ray-${ray}`} />
    </div>
  ));
}

export default function App() {
  return (
    <Document mode="dark">
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.data.message ?? error.data
    : error instanceof Error
    ? error.message
    : String(error);

  return (
    <Document title="Error!">
      <div className="dark">
        <div className="flex flex-col w-[100dvw] h-screen bg-zinc-900 items-center justify-center space-y-4 ">
          <img
            src="/carbon-logo-light.png"
            alt="Carbon Logo"
            className="block max-w-[60px]"
          />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
        </div>
      </div>
    </Document>
  );
}