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
import { BookOpen, Moon, Play, Sun } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import Tailwind from "~/styles/tailwind.css?url";
import { Footer } from "./components/footer";
import { Button } from "./components/ui/button";
import { ClientHintCheck, getHints } from "./components/ui/client-hints";
import { DiscordLogo } from "./components/ui/discord-logo";
import { GithubLogo } from "./components/ui/github-logo";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu";
import {
	defaultAnswers,
	type FormAnswers,
	useWizard,
	WizardContext,
	WizardForm,
} from "./components/wizard-form";
import { useMode } from "./hooks/useMode";
import { cn } from "./lib/utils";
import { getMode, setMode } from "./services/mode.server";
import { path } from "./utils/path";

export const config = { runtime: "edge" };

export function links() {
	return [{ rel: "stylesheet", href: Tailwind }];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
	const requestUrl = new URL(request.url);
	const siteUrl = requestUrl.protocol + "//" + requestUrl.host;
	const hints = getHints(request);

	return { siteUrl, mode: getMode(request, hints.theme), hints };
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const mode = String(formData.get("mode"));

	if (!["light", "dark"].includes(mode)) {
		return json(
			{ error: "Invalid mode" },
			{
				status: 400,
			},
		);
	}

	return json(
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
	const fetcher = useFetcher<typeof action>();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 200);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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
				className="h-[100dvh] w-[100dvw] flex flex-col bg-background text-foreground antialiased selection:bg-[#60ffd3] selection:text-[#000000] "
			>
				<header
					className={cn(
						"fixed lg:top-4 left-1/2 lg:w-[960px] lg:rounded-2xl shadow-sm z-header flex select-none items-center py-4 pl-5 pr-2 h-[var(--header-height)] border-b lg:border bg-background/80 backdrop-blur-md lg:transition-[width,transform] lg:duration-500 lg:ease-in-out lg:-translate-x-1/2",
						scrolled && "lg:w-[640px]",
						!scrolled && "left-0 right-0 lg:left-1/2",
					)}
				>
					<div className=" mx-auto flex px-2 items-center justify-between gap-2 z-logo text-foreground w-full">
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
							<NavigationMenu
								className={cn(
									"hidden md:flex transition-[opacity,transform] duration-500 ease-in-out",
									scrolled &&
										"lg:opacity-0 lg:scale-95 lg:hidden lg:pointer-events-none",
								)}
							>
								<NavigationMenuList>
									<NavigationMenuItem>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
											asChild
										>
											<a
												href="https://learn.carbon.ms"
												target="_blank"
												rel="noopener"
											>
												Product
											</a>
										</NavigationMenuLink>
									</NavigationMenuItem>
									<NavigationMenuItem>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
											asChild
										>
											<Link prefetch="intent" to="/pricing">
												Pricing
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<NavigationMenuTrigger>Developers</NavigationMenuTrigger>
										<NavigationMenuContent>
											<div className="flex flex-col p-3 w-[325px]">
												<NavigationMenuLink asChild>
													<a
														href="https://discord.gg/gxckQyanG"
														className="flex items-center gap-3 p-3 hover:bg-accent rounded-md"
													>
														<DiscordLogo className="size-12 bg-[#5865F2] text-white rounded-lg p-2" />
														<div className="flex flex-col gap-0">
															<span>Discord</span>
															<span className="text-xs text-muted-foreground">
																Join our community chat
															</span>
														</div>
													</a>
												</NavigationMenuLink>
												<NavigationMenuLink asChild>
													<a
														href="https://github.com/crbnos/carbon"
														className="flex items-center gap-3 p-3 hover:bg-accent rounded-md"
													>
														<GithubLogo className="size-12 bg-[#333333] text-white dark:bg-white dark:text-[#333333] rounded-lg p-2" />
														<div className="flex flex-col gap-0">
															<span>GitHub</span>
															<span className="text-xs text-muted-foreground">
																View our source code and contribute
															</span>
														</div>
													</a>
												</NavigationMenuLink>
												<NavigationMenuLink asChild>
													<a
														href="https://docs.carbon.ms"
														className="flex items-center gap-3 p-3 hover:bg-accent rounded-md"
													>
														<BookOpen className="size-12 bg-primary dark:bg-secondary text-primary-foreground dark:text-secondary-foreground rounded-lg p-2" />
														<div className="flex flex-col gap-0">
															<span>Documentation</span>
															<span className="text-xs text-muted-foreground">
																Developer guides and API reference
															</span>
														</div>
													</a>
												</NavigationMenuLink>
											</div>
										</NavigationMenuContent>
									</NavigationMenuItem>

									<NavigationMenuItem>
										<NavigationMenuLink
											className={navigationMenuTriggerStyle()}
											asChild
										>
											<Link to="/sales">Enterprise</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								</NavigationMenuList>
							</NavigationMenu>
							<fetcher.Form action={path.to.root} method="post">
								<input
									type="hidden"
									name="mode"
									value={mode === "light" ? "dark" : "light"}
								/>
								<Button
									type="submit"
									variant="ghost"
									size="icon"
									className={cn(
										"cursor-pointer",
										mode === "dark" && "hover:rotate-180 transition-all",
									)}
								>
									{mode === "light" ? <Moon /> : <Sun />}
								</Button>
							</fetcher.Form>
							<Button
								variant="default"
								className="cursor-pointer hidden sm:flex"
								asChild
							>
								<a href="https://app.carbon.ms">
									Try It Now
									<Play className="size-4" />
								</a>
							</Button>
						</div>
					</div>
				</header>

				<div className="relative flex h-full w-full items-start justify-center">
					{/* <LightRays /> */}
					<main className="flex flex-col w-full pt-[var(--header-height)]">
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
		? (error.data.message ?? error.data)
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
