import { Trans } from "@lingui/react/macro";
import { BookOpen, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { flushSync } from "react-dom";
import { Link, useFetcher } from "react-router";
import { setClientMode, useMode } from "~/hooks/useMode";
import { startModeTransition } from "~/utils/dom";
import { path } from "~/utils/path";
import { AppCtaLabel } from "./app-cta-label";
import { LogoMenu } from "./logo-menu";
import { Button } from "./ui/button";
import { DiscordLogo } from "./ui/discord-logo";
import { GithubLogo } from "./ui/github-logo";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

const APP_URL = "https://app.carbon.ms";

const developerLinks = [
	{
		href: "https://discord.gg/gxckQyanG",
		title: <Trans>Discord</Trans>,
		desc: <Trans>Join our community chat</Trans>,
		icon: (
			<DiscordLogo className="size-12 rounded-lg bg-[#5865F2] p-2 text-white" />
		),
	},
	{
		href: "https://github.com/crbnos/carbon",
		title: <Trans>GitHub</Trans>,
		desc: <Trans>View our source code and contribute</Trans>,
		icon: (
			<GithubLogo className="size-12 rounded-lg bg-[#333333] p-2 text-white dark:bg-white dark:text-[#333333]" />
		),
	},
	{
		href: "https://docs.carbon.ms",
		title: <Trans>Documentation</Trans>,
		desc: <Trans>Developer guides and API reference</Trans>,
		icon: (
			<BookOpen className="size-12 rounded-lg bg-primary p-2 text-primary-foreground dark:bg-secondary dark:text-secondary-foreground" />
		),
	},
];

export function Header() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-header w-full border-b bg-background/90 backdrop-blur-sm">
			<div className="mx-auto flex h-[var(--header-height)] w-full max-w-[1360px] items-center justify-between gap-6 px-6 sm:px-7 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:justify-normal">
					<LogoMenu />
                    
					<NavigationMenu className="hidden justify-self-center lg:flex">
						<NavigationMenuList className="gap-1">
							<NavigationMenuItem>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link prefetch="intent" to="/about">
										<Trans>About</Trans>
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<a href="https://docs.carbon.ms" target="_blank" rel="noopener">
										<Trans>Docs</Trans>
									</a>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link prefetch="intent" to="/pricing">
										<Trans>Pricing</Trans>
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									<Trans>Developers</Trans>
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="flex w-[325px] flex-col p-3">
										{developerLinks.map((link) => (
											<NavigationMenuLink key={link.href} asChild>
												<a
													href={link.href}
													className="flex items-center gap-3 rounded-md p-3 hover:bg-accent"
												>
													{link.icon}
													<div className="flex flex-col gap-0">
														<span>{link.title}</span>
														<span className="text-xs text-muted-foreground">
															{link.desc}
														</span>
													</div>
												</a>
											</NavigationMenuLink>
										))}
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Link to="/sales">
										<Trans>Enterprise</Trans>
									</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>

				{/* right: utilities */}
				<div className="flex items-center justify-self-end gap-1 sm:gap-3">
					{/* Theme toggle is a dev-only affordance; production ships a single theme. */}
					{import.meta.env.DEV && <ModeToggle />}
					<Button
						asChild
						variant="accentOutline"
						size="ctaSm"
						className="hidden sm:inline-flex"
					>
						<a href={APP_URL}>
							<AppCtaLabel />
						</a>
					</Button>
					<Button
						asChild
						variant="accent"
						size="ctaSm"
						className="hidden sm:inline-flex"
					>
						<Link to="/sales">
							<Trans>Contact Sales</Trans>
						</Link>
					</Button>
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground lg:hidden"
					>
						{open ? <X className="size-5" /> : <Menu className="size-5" />}
					</button>
				</div>
			</div>

			{open && <MobileMenu onClose={() => setOpen(false)} />}
		</header>
	);
}

function ModeToggle() {
	const mode = useMode();
	const fetcher = useFetcher();
	return (
		<button
			type="button"
			aria-label="Toggle theme"
			onClick={() => {
				const next = mode === "light" ? "dark" : "light";
				startModeTransition(next, () => {
					flushSync(() => setClientMode(next));
					fetcher.submit(
						{ mode: next },
						{ method: "post", action: path.to.root },
					);
				});
			}}
			className="inline-flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
		>
			{mode === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
		</button>
	);
}

function MobileMenu({ onClose }: { onClose: () => void }) {
	return (
		<div className="absolute inset-x-0 top-full border-b bg-background lg:hidden">
			<nav className="mx-auto flex w-full max-w-[1360px] flex-col px-6 py-4 sm:px-7">
				<Link
					to="/about"
					onClick={onClose}
					className="border-b border-border/60 py-3 text-sm text-foreground"
				>
					<Trans>About</Trans>
				</Link>
				<a
					href="https://docs.carbon.ms"
					target="_blank"
					rel="noopener"
					onClick={onClose}
					className="border-b border-border/60 py-3 text-sm text-foreground"
				>
					<Trans>Docs</Trans>
				</a>
				<Link
					to="/pricing"
					onClick={onClose}
					className="border-b border-border/60 py-3 text-sm text-foreground"
				>
					<Trans>Pricing</Trans>
				</Link>
				<Link
					to="/sales"
					onClick={onClose}
					className="border-b border-border/60 py-3 text-sm text-foreground"
				>
					<Trans>Enterprise</Trans>
				</Link>

				<div className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
					<Trans>Developers</Trans>
				</div>
				<div className="mt-2 flex flex-col">
					{developerLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={onClose}
							className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							{link.title}
						</a>
					))}
				</div>

				<div className="mt-4 flex items-center gap-3">
					<Button asChild variant="accentOutline" size="ctaSm" className="flex-1">
						<a href={APP_URL}>
							<AppCtaLabel />
						</a>
					</Button>
					<Button asChild variant="accent" size="ctaSm" className="flex-1">
						<Link to="/sales" onClick={onClose}>
							<Trans>Contact Sales</Trans>
						</Link>
					</Button>
				</div>
			</nav>
		</div>
	);
}
