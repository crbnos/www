import {
	data,
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
import { type ReactNode, useState } from "react";
import Tailwind from "~/styles/tailwind.css?url";
import { RootErrorBoundary } from "./components/error/RootErrorBoundary";
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
import { INFO_EMAIL, ORGANIZATION, SUPPORT_EMAIL } from "./lib/agent/site";
import { getCompanyId } from "./services/company.server";
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
	// Canonical URL: origin + path, without query/hash and without a trailing
	// slash (except the root). Gives agents and search engines one stable URL.
	const canonicalPath = requestUrl.pathname.replace(/\/+$/, "") || "/";
	const canonicalUrl = siteUrl + canonicalPath;
	const hints = getHints(request);
	const locale = getLocale(request);
	const linguiCatalog = await loadLinguiCatalog(locale);

	const statusPromise = fetchStatus();

	return {
		siteUrl,
		canonicalUrl,
		mode: getMode(request, hints.theme),
		hints,
		linguiCatalog,
		locale,
		statusPromise,
		// Only the presence matters here — never expose the id itself to the client.
		hasCompany: getCompanyId(request) !== null,
	};
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
	const { siteUrl, canonicalUrl } = (data ?? {}) as {
		siteUrl?: string;
		canonicalUrl?: string;
	};

	if (!siteUrl) {
		return [
			{ title: "404 Not Found | Carbon" },
			{
				name: "description",
				content: "404 Not Found | Carbon",
			},
		];
	}

	// JSON-LD structured data so agents and search engines can resolve the
	// organization, the site, and the product from a single graph.
	const structuredData = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": `${siteUrl}/#organization`,
				name: ORGANIZATION.name,
				legalName: ORGANIZATION.legalName,
				url: siteUrl,
				logo: `${siteUrl}/brand/carbon-mark.svg`,
				description: ORGANIZATION.description,
				email: INFO_EMAIL,
				sameAs: [...ORGANIZATION.sameAs],
				address: {
					"@type": "PostalAddress",
					...ORGANIZATION.address,
				},
				contactPoint: [
					{
						"@type": "ContactPoint",
						contactType: "sales",
						email: INFO_EMAIL,
						url: `${siteUrl}/contact`,
						availableLanguage: ["en"],
					},
					{
						"@type": "ContactPoint",
						contactType: "customer support",
						email: SUPPORT_EMAIL,
						url: `${siteUrl}/contact`,
						availableLanguage: ["en"],
					},
					{
						"@type": "ContactPoint",
						contactType: "technical support",
						email: SUPPORT_EMAIL,
						url: `${siteUrl}/developers`,
						availableLanguage: ["en"],
					},
				],
			},
			{
				"@type": "WebSite",
				"@id": `${siteUrl}/#website`,
				name: "Carbon Manufacturing Systems",
				url: siteUrl,
				publisher: { "@id": `${siteUrl}/#organization` },
				inLanguage: "en",
			},
			{
				"@type": "SoftwareApplication",
				name: "Carbon",
				applicationCategory: "BusinessApplication",
				applicationSubCategory: "ERP",
				operatingSystem: "Web, Self-hosted",
				url: siteUrl,
				publisher: { "@id": `${siteUrl}/#organization` },
				description:
					"An API-first, open-source operating system for manufacturing (ERP/MRP) with full source-code access, available as managed SaaS or self-hosted.",
				offers: {
					"@type": "AggregateOffer",
					url: `${siteUrl}/pricing`,
					category: "SaaS or source-code license",
					priceCurrency: "USD",
					lowPrice: "40",
					highPrice: "100",
					offerCount: 3,
					// Named so an agent asked "what does Carbon cost" can answer
					// from the graph rather than from the rendered page.
					offers: [
						{
							"@type": "Offer",
							name: "Starter",
							price: "40",
							priceCurrency: "USD",
							url: `${siteUrl}/pricing`,
							description: "Managed cloud, per user per month.",
						},
						{
							"@type": "Offer",
							name: "Business",
							price: "100",
							priceCurrency: "USD",
							url: `${siteUrl}/pricing`,
							description:
								"Managed cloud with support, API access and all advanced features, per user per month. 5 user minimum.",
						},
						{
							"@type": "Offer",
							name: "Enterprise",
							url: `${siteUrl}/contact`,
							description:
								"Self-hosted or managed, with migrations, SSO/SAML and ITAR compliance. Priced on request.",
						},
					],
				},
			},
		],
	};

	return [
		...(canonicalUrl
			? [{ tagName: "link" as const, rel: "canonical", href: canonicalUrl }]
			: []),
		{ "script:ld+json": structuredData },
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
			content: `${siteUrl}/images/og.webp`,
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
			content: `${siteUrl}/images/og.webp`,
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

	// VOID//SYS — the same 404/500 screen the ERP/MES apps use. It renders its
	// own minimal document shell (no Header/Footer/loader data) so it can't crash
	// during SSR the way the old Header/Footer-based boundary did, which is what
	// turned unmatched routes into raw HTTP 500s. React Router routes both
	// unmatched paths (404) and thrown render errors (500) here, and sets the
	// response status from the error, so agents get correct status codes.
	return (
		<html lang="en" className="dark h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body
				suppressHydrationWarning
				className="min-h-svh bg-background text-foreground antialiased"
			>
				<RootErrorBoundary error={error} />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
