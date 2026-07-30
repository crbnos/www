import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "react-router";
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from "react-router";
import { Analytics } from "@vercel/analytics/react";
import { Trans } from "@lingui/react/macro";
import { type ReactNode, useState } from "react";
import Tailwind from "~/styles/tailwind.css?url";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { LocaleProvider } from "./lib/i18n";
import { ClientHintCheck, getHints } from "./components/ui/client-hints";
import {
	defaultAnswers,
	type FormAnswers,
	useWizard,
	WizardContext,
	WizardForm,
} from "./components/wizard-form";
import { useMode } from "./hooks/useMode";
import { loadLinguiCatalog } from "./services/lingui.server";
import { getLocale } from "./services/locale.server";
import { getMode, setMode } from "./services/mode.server";
import { fetchStatus } from "./utils/status";

export const config = { runtime: "edge" };

export function links() {
	return [
		{ rel: "stylesheet", href: Tailwind },
		{
			rel: "icon",
			type: "image/svg+xml",
			href: "/brand/carbon-mark-light.svg",
			media: "(prefers-color-scheme: light)",
		},
		{
			rel: "icon",
			type: "image/svg+xml",
			href: "/brand/carbon-mark-dark.svg",
			media: "(prefers-color-scheme: dark)",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: "/favicon-32x32.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: "/favicon-16x16.png",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "/apple-touch-icon.png",
		},
		{ rel: "manifest", href: "/site.webmanifest" },
	];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const requestUrl = new URL(request.url);
	const siteUrl = requestUrl.protocol + "//" + requestUrl.host;
	const hints = getHints(request);
	const locale = getLocale(request);
	const linguiCatalog = await loadLinguiCatalog(locale);

	const statusPromise = fetchStatus();

	return { siteUrl, mode: getMode(request, hints.theme), hints, linguiCatalog, locale, statusPromise };
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const mode = String(formData.get("mode"));

	if (!["light", "dark"].includes(mode)) {
		return data(
			{ error: "Invalid mode" },
			{ status: 400 },
		);
	}

	return data(
		{},
		{
			headers: { "Set-Cookie": setMode(mode as "light" | "dark") },
		},
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
			content: `${siteUrl}/images/banner.jpg`,
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
			content: `${siteUrl}/images/banner.jpg`,
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

	return (
		<html lang="en" className={`${mode} h-full overflow-x-hidden w-[100dvw]`}>
			<head>
				<ClientHintCheck />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<title>{title}</title>
				<Links />
			</head>
			<body
				suppressHydrationWarning
				className="min-h-[100dvh] w-[100dvw] flex flex-col bg-background text-foreground antialiased selection:bg-[#60ffd3] selection:text-[#000000] "
			>
				<Header />

				<div className="relative flex w-full justify-center">
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
	const { linguiCatalog, locale } = useLoaderData<typeof loader>();

	return (
		<LocaleProvider locale={locale} catalog={linguiCatalog}>
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
		</LocaleProvider>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	const message = isRouteErrorResponse(error)
		? (error.data.message ?? error.data)
		: error instanceof Error
			? error.message
			: String(error);

	return (
		// LocaleProvider is required because <Document> renders <Header>/<Footer>,
		// which use <Trans>/useLingui. Without it, any error that reaches this
		// boundary throws a second, opaque "Cannot destructure property '_'" error
		// and white-screens instead of rendering the message below.
		<LocaleProvider>
			<Document title="Error!">
				<div className="light">
					<div className="flex flex-col w-[100dvw] h-screen items-center justify-center space-y-4 ">
						<img
							src="/brand/carbon-mark.svg"
							alt="Carbon Logo"
							className="block max-w-24"
						/>
						<h1 className="text-2xl font-bold"><Trans>Something went wrong</Trans></h1>
						<p className="text-muted-foreground max-w-2xl">{message}</p>
					</div>
				</div>
			</Document>
		</LocaleProvider>
	);
}
