import { Trans, useLingui } from "@lingui/react/macro";
import { Check, Cloud, Server } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import type { MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "Pricing",
		description:
			"Carbon pricing: Starter at $40/user/mo, Business at $100/user/mo with API access and support, and self-hosted Enterprise. ERP, MRP, MES and QMS on one system, with a 30-day free trial and no sales call.",
	});

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
	"font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
	"font-display tracking-[-0.015em] text-[clamp(2.125rem,4.4vw,3.875rem)] leading-[1.08]";

const DOCS_URL = "https://docs.carbon.ms";
const GITHUB_URL = "https://github.com/crbnos/carbon";
const SELF_HOSTING_DOCS_URL =
	"https://docs.carbon.ms/docs/platform/self-hosting";

type Deployment = "cloud" | "self-hosted";

function usePlans(deployment: Deployment) {
	const { t } = useLingui();
	const selfHosted = deployment === "self-hosted";
	return [
		{
			name: selfHosted ? t`Community Edition` : t`Starter`,
			tag: selfHosted ? t`Open source` : t`Self-serve`,
			priceHeadline: selfHosted ? "$0" : "$40",
			priceSubtext: t`/user/month`,
			action: selfHosted ? t`Self-Host Carbon` : t`Start 30-day free trial`,
			url: selfHosted ? SELF_HOSTING_DOCS_URL : "https://app.carbon.ms",
			description: selfHosted
				? t`The open-source core of Carbon, free under AGPL-3.0`
				: t`A managed cloud-hosted version of Carbon`,
			featured: false,
			features: [
				selfHosted
					? t`Runs on your servers or in your VPC with Docker`
					: t`Automatic updates and cloud backups`,
				t`Basic ERP, MES, MRP, and QMS functionality`,
				t`Accounting with general ledger, financial reports, fixed assets, and multi-currency`,
				t`Product configurator with rules-based BOMs and routings`,
				t`Unlimited records`,
				selfHosted ? t`Self-guided installation` : t`Self-onboarding`,
				t`Community support`,
			],
		},
		{
			name: t`Business`,
			tag: selfHosted ? t`Self-hosted + support` : t`Cloud + support`,
			description: selfHosted
				? t`Everything in Community Edition, and the features below`
				: t`Everything in Starter, and the features below`,
			priceHeadline: "$100",
			priceSubtext: t`/user/month`,
			action: selfHosted ? t`Get a license` : t`Contact us`,
			url: "/sales",
			featured: false,
			features: [
				t`Technical support`,
				t`API, webhooks, integrations, and MCP`,
				t`Workflow automation with custom triggers`,
				t`Demand forecasting to plan ahead of orders`,
				t`Shop floor console mode`,
				t`Customer portals with live order status and files`,
				t`Email and Slack notifications`,
				t`Custom roles, permissions, and approval rules`,
				t`Audit logging, 2FA enforcement, and backup/restore`,
				t`5 user minimum`,
			],
		},
		{
			name: t`Enterprise`,
			tag: t`Most popular`,
			priceHeadline: t`Contact us`,
			priceSubtext: "",
			action: t`Contact us`,
			url: "/sales",
			description: t`Everything in Business, plus a custom solution to meet your needs`,
			featured: true,
			features: [
				selfHosted
					? t`On-prem, private cloud, or air-gapped`
					: t`Runs on your cloud`,
				t`Forward deployed engineer`,
				t`Customizations, training, and integrations`,
				t`CMMC Level 2 compliance`,
				t`Air-gapped and ITAR deployments`,
				t`Full setup and migrations`,
				t`SSO/SAML`,
				t`Unlimited functional support`,
			],
		},
	];
}

function PlanGrid({ deployment }: { deployment: Deployment }) {
	const plans = usePlans(deployment);
	return (
		<div className="grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
			{plans.map((plan) => (
				<div
					key={plan.name}
					className={cn(
						"flex flex-col p-8",
						plan.featured
							? "bg-muted shadow-[inset_0_2px_0] shadow-secondary"
							: "bg-card",
					)}
				>
					<div
						className={cn(
							"font-mono text-[10px] uppercase leading-none tracking-[0.18em]",
							plan.featured ? "text-secondary" : "text-muted-foreground",
						)}
					>
						{plan.tag}
					</div>

					<h2 className="mt-5 font-display text-2xl tracking-[-0.005em]">
						{plan.name}
					</h2>
					<p className="mt-2 min-h-[40px] text-sm leading-snug text-muted-foreground">
						{plan.description}
					</p>

					<div className="mt-6 flex items-end gap-1.5">
						<span className="font-display tracking-[-0.02em] text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
							{plan.priceHeadline}
						</span>
						{plan.priceSubtext && (
							<span className="mb-1 font-mono text-xs text-muted-foreground">
								{plan.priceSubtext}
							</span>
						)}
					</div>

					<div className="my-7 h-px w-full bg-border" />

					<ul className="flex flex-col gap-3">
						{plan.features.map((feature) => (
							<li key={feature} className="flex items-start gap-2.5">
								<Check className="mt-0.5 size-4 shrink-0 text-secondary" />
								<span className="text-sm leading-snug">{feature}</span>
							</li>
						))}
					</ul>

					<div className="mt-auto pt-8">
						<Button
							asChild
							variant={plan.featured ? "accent" : "accentOutline"}
							size="cta"
							className="w-full"
						>
							<Link to={plan.url}>{plan.action}</Link>
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}

export default function Pricing() {
	const { t } = useLingui();
	const [searchParams] = useSearchParams();
	const [deployment, setDeployment] = useState<Deployment>(
		searchParams.get("deployment") === "self-hosted" ? "self-hosted" : "cloud",
	);
	return (
		<>
			<section className="border-b border-border py-24 sm:py-28">
				<div className={shell}>
					<div className={eyebrow}>Pricing</div>
					<h1 className={cn(heading, "mt-5 max-w-[20ch]")}>
						<Trans>Simple pricing based on your needs.</Trans>
					</h1>
					<p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
						<Trans>
							Managed cloud or self-host the open-source core. Start free for 30
							days — no sales call required.
						</Trans>
					</p>

					<Tabs
						value={deployment}
						onValueChange={(value) => setDeployment(value as Deployment)}
						className="mt-14"
					>
						<TabsList aria-label={t`Deployment`}>
							<TabsTrigger value="cloud">
								<Cloud />
								<Trans>Cloud</Trans>
							</TabsTrigger>
							<TabsTrigger value="self-hosted">
								<Server />
								<Trans>Self-hosted</Trans>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="cloud" className="mt-6">
							<PlanGrid deployment="cloud" />
							<p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
								<Trans>
									Billed per user, monthly · 30-day free trial · Cancel anytime
								</Trans>
							</p>
						</TabsContent>
						<TabsContent value="self-hosted" className="mt-6">
							<PlanGrid deployment="self-hosted" />
							<p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
								<Trans>
									Licensed per user, monthly · Community Edition free under
									AGPL-3.0
								</Trans>
							</p>
						</TabsContent>
					</Tabs>
				</div>
			</section>

			<section className="relative overflow-hidden py-28 sm:py-32">
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0"
					style={{
						backgroundImage:
							"linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
						backgroundSize: "56px 56px",
						maskImage:
							"radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
						WebkitMaskImage:
							"radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
					}}
				/>
				<div className="relative mx-auto max-w-[1000px] px-6 text-center">
					<div className={eyebrow}>Open source · Self-host</div>
					<h2 className="mt-6 font-display tracking-[-0.02em] text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.08]">
						<Trans>Get started for free.</Trans>
					</h2>
					<p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
						<Trans>
							Read the source, run it in your own environment, and start
							developing locally.
						</Trans>{" "}
						<Trans>
							Want Business features on your own servers?{" "}
							<Link
								to="/sales"
								className="font-medium text-secondary hover:underline"
							>
								Unlock them with a commercial license
							</Link>
							.
						</Trans>
					</p>
					<div className="mt-10 flex flex-wrap justify-center gap-3">
						<Button asChild variant="accent" size="cta">
							<a href={DOCS_URL}>
								<Trans>Read the Docs</Trans>
							</a>
						</Button>
						<Button asChild variant="accentOutline" size="cta">
							<a href={GITHUB_URL} target="_blank" rel="noopener">
								<GithubLogo className="size-4" />
								<Trans>Star on GitHub</Trans>
							</a>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}
