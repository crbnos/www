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
import { Analytics } from "@vercel/analytics/remix";
import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { json } from "@vercel/remix";
import { ReactNode, useState } from "react";

import { motion } from "framer-motion";
import { Fingerprint, Play } from "lucide-react";
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

export const config = { runtime: "edge" };

export function links() {
  return [{ rel: "stylesheet", href: Tailwind }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  let requestUrl = new URL(request.url);
  let siteUrl = requestUrl.protocol + "//" + requestUrl.host;

  return json({ siteUrl });
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
      title: "Carbon | The operating system for manufacturing",
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
      content: "Carbon | The operating system for manufacturing",
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
      content: "Carbon | The operating system for manufacturing",
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
  mode = "dark",
}: {
  children: ReactNode;
  title?: string;
  mode?: "light" | "dark";
}) {
  const { showWizard, setShowWizard } = useWizard();

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
        className="h-[100dvh] w-[100dvw] flex flex-col bg-background text-foreground antialiased selection:bg-[#fdffa1] selection:text-[#000000] "
      >
        <header className="flex select-none items-center pl-5 pr-2 h-[var(--header-height)] fixed top-0 left-0 right-0 z-header backdrop-filter backdrop-blur-xl bg-opacity-5">
          <div className="flex items-center justify-between gap-2 z-logo text-foreground w-full">
            <Link
              to="/"
              className="cursor-pointer flex flex-row items-center gap-2 flex-shrink-0"
            >
              <img
                src="/brand/carbon-logo-dark.svg"
                alt="Carbon"
                className="size-6 block dark:hidden"
              />
              <img
                src="/brand/carbon-logo-light.svg"
                alt="Carbon"
                className="size-6 hidden dark:block"
              />
              <span className="hidden md:block text-2xl font-semibold tracking-tighter">
                Carbon
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0">
                <Button variant="ghost" asChild className="cursor-pointer">
                  <Link prefetch="intent" to="/learn">
                    Learn
                  </Link>
                </Button>
                <Button variant="ghost" className="cursor-pointer" asChild>
                  <a href="https://app.carbonos.dev">
                    Login
                    <Fingerprint className="size-4" />
                  </a>
                </Button>
              </div>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => setShowWizard(true)}
              >
                Book a demo
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

function LightRays() {
  return ["one", "two", "three", "four", "five"].map((ray) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 0.3, duration: 2.0 }}
      className="ray"
      data-theme="dark"
    >
      <div className={`light-ray ray-${ray}`} />
    </motion.div>
  ));
}

export default function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [answers, setAnswers] = useState<FormAnswers>(defaultAnswers);
  const [currentStep, setCurrentStep] = useState(0);

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
      <Document mode="dark">
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
      <div className="dark">
        <div className="flex flex-col w-[100dvw] h-screen items-center justify-center space-y-4 ">
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
