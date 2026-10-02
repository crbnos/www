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
		title: "Carbon Pricing — Cloud & Self-Hosted",
		description:
			"Compare Carbon cloud and self-hosted plans. Starter is $40 per user per month, Business is $100, and the open-source Community edition is free to self-host.",
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
			priceSubtext: selfHosted ? "AGPL-3.0" : t`/user/month`,
			action: selfHosted ? t`View Installation Guide` : t`Start 30-Day Trial`,
			url: selfHosted ? SELF_HOSTING_DOCS_URL : "https://app.carbon.ms",
			description: selfHosted
				? t`Core manufacturing modules under AGPL-3.0`
				: t`Managed Carbon for small manufacturing teams`,
			featured: false,
			features: [
				selfHosted
					? t`Deploy with Docker on your servers or in your VPC`
					: t`Managed updates and backups`,
				t`Core ERP, MRP, MES and QMS workflows`,
				t`General ledger, financial reports, fixed assets and multi-currency`,
				t`Rules-based product configurator, BOMs and routings`,
				t`Unlimited records`,
				selfHosted
					? t`Self-managed installation and upgrades`
					: t`Self-service onboarding`,
				t`Community support`,
			],
		},
		{
			name: selfHosted ? t`Enterprise Edition` : t`Business`,
			tag: selfHosted ? t`Self-hosted + support` : t`Cloud + support`,
			description: selfHosted
				? t`Community Edition plus APIs, automation and support`
				: t`Starter plus APIs, automation and support`,
			priceHeadline: "$100",
			priceSubtext: t`/user/month`,
			action: selfHosted ? t`Request a License` : t`Talk to a Human`,
			url: "/sales",
			featured: false,
			features: [
				t`Technical support from Carbon`,
				t`REST API, webhooks, integrations and MCP`,
				t`Workflow automation and custom triggers`,
				t`Demand forecasting`,
				t`Shop floor console mode`,
				t`Customer portals for order status and files`,
				t`Email and Slack notifications`,
				t`Custom roles, permissions and approval rules`,
				t`Audit logs, enforced 2FA and backup/restore`,
				t`5 user minimum`,
			],
		},
		{
			name: selfHosted ? t`Regulated Enterprise` : t`Enterprise`,
			tag: selfHosted ? t`Regulated deployment` : t`Bring your own cloud`,
			priceHeadline: t`Contact us`,
			priceSubtext: "",
			action: t`Talk to a Human`,
			url: "/sales",
			description: selfHosted
				? t`Enterprise Edition with a deployment designed for your security boundary`
				: t`Business with dedicated deployment and implementation support`,
			featured: true,
			features: [
				selfHosted
					? t`On-prem, private cloud or air-gapped deployment`
					: t`Single-tenant deployment in your cloud account`,
				t`Forward-deployed engineer`,
				t`Custom development, training and integrations`,
				t`CMMC Level 2 and NIST 800-171 deployment support`,
				selfHosted
					? t`Air-gapped and ITAR-controlled environments`
					: t`Dedicated deployment for regulated environments`,
				t`Implementation and data migration`,
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
		searchParams.get("mode") === "self-hosted" ? "self-hosted" : "cloud",
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
							Use Carbon's managed cloud or run it on your infrastructure. Cloud
							plans include a 30-day trial with no sales call.
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
							Review the source and deploy the core manufacturing modules in your
							own environment under AGPL-3.0.
						</Trans>{" "}
						<Trans>
							Need APIs, MCP, advanced controls or deployment support?{" "}
							<Link
								to="/sales"
								className="font-medium text-secondary hover:underline"
							>
								Request an Enterprise license
							</Link>
							.
						</Trans>
					</p>
					<div className="mt-10 flex flex-wrap justify-center gap-3">
						<Button asChild variant="accent" size="cta">
							<a href={DOCS_URL}>
								<Trans>View Installation Guide</Trans>
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
