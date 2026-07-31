import { Trans, useLingui } from "@lingui/react/macro";
import { Check } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { cn } from "~/lib/utils";

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
	"font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
	"font-display font-semibold tracking-[-0.035em] leading-[0.95] text-[clamp(2.125rem,4.4vw,3.875rem)]";

const DOCS_URL = "https://docs.carbon.ms";
const GITHUB_URL = "https://github.com/crbnos/carbon";

function usePlans() {
	const { t } = useLingui();
	return [
		{
			name: t`Starter`,
			tag: t`Self-serve`,
			priceHeadline: "$40",
			priceSubtext: t`/user/month`,
			action: t`Start 30-day free trial`,
			url: "https://app.carbon.ms",
			description: t`A managed cloud-hosted version of Carbon`,
			featured: false,
			features: [
				t`Automatic updates and backups`,
				t`Basic ERP, MES, and QMS functionality`,
				t`Unlimited records`,
				t`Self-onboarding`,
				t`Community support`,
			],
		},
		{
			name: t`Business`,
			tag: t`Most popular`,
			description: t`A managed cloud-hosted version of Carbon that includes support and all advanced features`,
			priceHeadline: "$100",
			priceSubtext: t`/user/month`,
			action: t`Start 30-day free trial`,
			url: "https://app.carbon.ms",
			featured: true,
			features: [
				t`Technical support`,
				t`API, webhooks, and integrations`,
				t`Accounting`,
				t`Audit logging`,
				t`All advanced features available`,
				t`5 user minimum`,
			],
		},
		{
			name: t`Enterprise`,
			tag: t`Custom`,
			priceHeadline: t`Contact us`,
			priceSubtext: "",
			action: t`Contact us`,
			url: "/sales",
			description: t`A custom solution to meet your needs`,
			featured: false,
			features: [
				t`Self-hosted or managed`,
				t`Forward deployed engineer`,
				t`Customizations, training, and integrations`,
				t`ITAR compliant`,
				t`Full setup and migrations`,
				t`SSO/SAML`,
				t`Unlimited functional support`,
			],
		},
	];
}

export default function Pricing() {
	const plans = usePlans();
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

					<div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
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

								<h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">
									{plan.name}
								</h2>
								<p className="mt-2 min-h-[40px] text-sm leading-snug text-muted-foreground">
									{plan.description}
								</p>

								<div className="mt-6 flex items-end gap-1.5">
									<span className="font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(2.25rem,4vw,3.25rem)]">
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

					<p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
						Billed per user, monthly · 30-day free trial · Cancel anytime
					</p>
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
					<div className={eyebrow}>Open core · Self-host</div>
					<h2 className="mt-6 font-display font-semibold tracking-[-0.045em] leading-[0.96] text-[clamp(2.25rem,5vw,4.5rem)]">
						<Trans>Get started for free.</Trans>
					</h2>
					<p className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
						<Trans>
							Read the source, run it in your own environment, and start
							developing locally.
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
