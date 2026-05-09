import { Trans, useLingui } from "@lingui/react/macro";
import { BookOpen, Check, LucideHandCoins } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { cn } from "~/lib/utils";

function usePlans() {
	const { t } = useLingui();
	return [
		{
			name: t`Starter`,
			priceHeadline: "$33",
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
			description: t`A managed cloud-hosted version of Carbon that includes support and all advanced features`,
			priceHeadline: "$92",
			priceSubtext: t`/user/month`,
			action: t`Start 30-day free trial`,
			url: "https://app.carbon.ms",
			featured: true,
			features: [
				t`Everything from Starter`,
				t`Implementation support`,
				t`API, webhooks, and integrations`,
				t`Accounting`,
				t`Audit logging`,
				t`All advanced features available`,
				t`5 user minimum`,
			],
		},
		{
			name: t`Enterprise`,
			priceHeadline: t`Contact us`,
			priceSubtext: "",
			action: t`Contact us`,
			url: "/sales",
			description: t`A custom solution to meet your needs`,
			featured: false,
			features: [
				t`Self-hosted or managed`,
				t`ITAR compliant`,
				t`Full setup and migrations`,
				t`Custom integrations`,
				t`Custom development`,
				t`SSO/SAML`,
				t`Unlimited functional support`,
				t`Training`,
			],
		},
	];
}

export default function Pricing() {
	const plans = usePlans();
	return (
		<section
			id="pricing"
			className="mx-auto flex w-screen max-w-7xl px-6 flex-col gap-8 py-14 md:px-8 min-h-[calc(100dvh-100px)] justify-center items-center"
		>
			<div className="flex flex-col gap-4 mx-auto text-center">
				<div>
					<Button variant="outline" className="cursor-default">
						<LucideHandCoins />
						<Trans>Pricing</Trans>
					</Button>
				</div>
				<h2 className="font-display text-balance mx-auto text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl w-full">
					<Trans>Simple pricing based on your needs</Trans>
				</h2>
			</div>

			<div className="mx-auto grid w-full justify-center grid-cols-1 lg:grid-cols-3 gap-4">
				{plans.map((plan) => (
					<div
						key={plan.name}
						className={cn(
							"relative flex w-full flex-col gap-8 rounded-2xl bg-muted p-4 text-foreground overflow-hidden h-full border border-border",
							plan.featured
								? "dark:bg-secondary dark:text-secondary-foreground bg-background text-foreground"
								: "",
						)}
					>
						<div className="flex-1 flex flex-col gap-8">
							<div className="flex items-center">
								<div className="ml-4">
									<h2 className="text-4xl font-medium tracking-tighter leading-12">
										{plan.name}
									</h2>
									<p className="h-12 text-sm leading-5 opacity-80">
										{plan.description}
									</p>
								</div>
							</div>

							<div className="flex items-end justify-start gap-1 pl-4">
								<p className="text-5xl font-medium tracking-tighter leading-12">
									{plan.priceHeadline}
								</p>

								<p className="text-xs leading-5 opacity-80">
									{plan.priceSubtext}
								</p>
							</div>

							<hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0" />

							<ul className="flex flex-col gap-2 font-normal">
								{plan.features?.map((feature) => (
									<li
										key={feature}
										className="flex items-center gap-4 text-base font-normal leading-[110%]"
									>
										<Check className="size-5 shrink-0 p-[3px]" />
										<span className="flex">{feature}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-auto w-full">
							<hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0 mb-8" />
							<Button
								variant={plan.featured ? "default" : "outline"}
								className="w-full"
								size="xl"
								asChild
							>
								<Link to={plan.url}>{plan.action}</Link>
							</Button>
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-4 bg-muted dark:bg-muted bg-[url('/cta.webp')] dark:bg-none bg-[0_0] bg-no-repeat bg-cover rounded-2xl py-24 justify-center items-center px-4 w-full">
				<h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl w-full">
					<Trans>Get started for free</Trans>
				</h2>
				<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-lg">
					<Trans>View the docs and start developing locally</Trans>
				</p>
				<div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
					<Button variant="default" size="xl" asChild>
						<a href="https://docs.carbon.ms">
							<Trans>Read the Docs</Trans>
							<BookOpen />
						</a>
					</Button>
					<Button variant="outline" size="xl" asChild>
						<a href="https://github.com/crbnos/carbon">
							<GithubLogo />
							<Trans>Star on GitHub</Trans>
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
