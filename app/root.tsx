import {
  isRouteErrorResponse,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useRouteError,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@vercel/remix";
import { ReactNode, useState } from "react";

import { Fingerprint, Moon, Play, Sun } from "lucide-react";
import Tailwind from "~/styles/tailwind.css?url";
import { Footer } from "./components/footer";
import { Button } from "./components/ui/button";
import {
  defaultAnswers,
  FormAnswers,
  useWizard,
  WizardContext,
  WizardForm,
} from "./components/wizard-form";
import { useMode } from "./hooks/useMode";
import { getMode, setMode } from "./services/mode.server";
import { path } from "./utils/path";

export const config = { runtime: "edge" };

export function links() {
  return [{ rel: "stylesheet", href: Tailwind }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  let requestUrl = new URL(request.url);
  let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

  return { siteUrl, mode: getMode(request) };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const mode = String(formData.get("mode"));

  console.log(mode);

  if (!["light", "dark"].includes(mode)) {
    return json(
      { error: "Invalid mode" },
      {
        status: 400,
      }
    );
  }

  return json(
    {},
    {
      headers: { "Set-Cookie": setMode(mode as "light" | "dark") },
    }
  );
}

export const meta: MetaFunction = ({ data }) => {
  const { siteUrl } = data as { siteUrl: string };

  if (!siteUrl) {
    return [
      { title: "404 Not Found | Carbon" },
      {
        name: "description",
        content: "404 Not Found | Carbon",
      },
    ];
  }

  return [
    {
      title: "Carbon Manufacturing Systems",
    },
    {
      name: "description",
      content:
        "Carbon is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
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
      content: "Carbon",
    },
    {
      property: "og:title",
      content: "Carbon Manufacturing Systems",
    },
    {
      property: "og:description",
      content:
        "Carbon is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
    },
    {
      property: "og:image",
      content: `${siteUrl}/screenshots/features-schedule.webp`,
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
      content: "Carbon Manufacturing Systems",
    },
    {
      name: "twitter:description",
      content:
        "Carbon is an API-first operating system for manufacturing that gives you full access to the source code, so you have complete control.",
    },
    {
      name: "twitter:image",
      content: `${siteUrl}/screenshots/features-schedule.webp`,
    },
  ];
};

function Document({
  children,
  title = "Carbon",
  mode = "light",
}: {
  children: ReactNode;
  title?: string;
  mode?: "light" | "dark";
}) {
  const { showWizard, setShowWizard } = useWizard();
  const fetcher = useFetcher<typeof action>();

  return (
    <html lang="en" className={`${mode} h-full overflow-x-hidden w-[100dvw]`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body
        suppressHydrationWarning
        className="h-[100dvh] w-[100dvw] flex flex-col bg-background text-foreground antialiased selection:bg-[#60ffd3] selection:text-[#000000] "
      >
        <header className="flex select-none items-center py-4 pl-5 pr-2 h-[var(--header-height)]">
          <div className="container mx-auto px-4 flex items-center justify-between gap-2 z-logo text-foreground w-full">
            <Link
              to="/"
              className="cursor-pointer flex flex-row items-end gap-2 flex-shrink-0 font-display"
            >
              <img
                src="/brand/carbon-word-light.svg"
                alt="Carbon"
                className="h-7 w-auto block dark:hidden"
              />
              <img
                src="/brand/carbon-word-dark.svg"
                alt="Carbon"
                className="h-7 w-auto hidden dark:block"
              />
            </Link>
            <div className="flex items-center gap-2">
              <div className="items-center gap-0 hidden md:flex">
                <Button variant="ghost" asChild className="cursor-pointer ">
                  <Link prefetch="intent" to="/pricing">
                    Pricing
                  </Link>
                </Button>
                <Button variant="ghost" className="cursor-pointer" asChild>
                  <a href="https://github.com/crbnos/carbon">Developers</a>
                </Button>
                <Button variant="ghost" asChild className="cursor-pointer ">
                  <Link to="/sales">Enterprise</Link>
                </Button>
                <Button variant="ghost" className="cursor-pointer" asChild>
                  <a href="https://app.carbonos.dev">
                    Login
                    <Fingerprint className="size-4" />
                  </a>
                </Button>
              </div>
              <fetcher.Form action={path.to.root} method="post">
                <input
                  type="hidden"
                  name="mode"
                  value={mode === "light" ? "dark" : "light"}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  {mode === "light" ? <Moon /> : <Sun />}
                </Button>
              </fetcher.Form>
              <Button
                variant="default"
                className="cursor-pointer hidden sm:flex"
              >
                Start Now
                <Play className="size-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="relative flex h-full w-full items-start justify-center">
          {/* <LightRays /> */}
          <main className="flex flex-col w-full">
            {children}
            <Footer />
          </main>
          <WizardForm open={showWizard} onClose={() => setShowWizard(false)} />
        </div>

        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [answers, setAnswers] = useState<FormAnswers>(defaultAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const mode = useMode();

  return (
    <WizardContext.Provider
      value={{
        showWizard,
        setShowWizard,
        answers,
        setAnswers,
        currentStep,
        setCurrentStep,
      }}
    >
      <Document mode={mode}>
        <Outlet />
      </Document>
    </WizardContext.Provider>
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
      <div className="light">
        <div className="flex flex-col w-[100dvw] h-screen items-center justify-center space-y-4 ">
          <img
            src="/brand/carbon-mark.svg"
            alt="Carbon Logo"
            className="block max-w-24"
          />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
        </div>
      </div>
    </Document>
  );
}
