import { Link } from "@remix-run/react";
import { BookOpen, Check, LucideHandCoins } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { cn } from "~/lib/utils";

const plans = [
	{
		name: "Starter",
		priceHeadline: "$33",
		priceSubtext: "/user/month",
		action: "Start 30-day free trial",
		url: "https://app.carbon.ms",
		description: "A managed cloud-hosted version of Carbon",
		featured: false,
		features: [
			"Automatic updates and backups",
			"Basic ERP, MES, and QMS functionality",
			"Unlimited records",
			"Self-onboarding",
			"Community support",
		],
	},
	{
		name: "Business",
		description:
			"A managed cloud-hosted version of Carbon that includes support and all advanced features",
		priceHeadline: "$92",
		priceSubtext: "/user/month",
		action: "Start 30-day free trial",
		url: "https://app.carbon.ms",
		featured: true,
		features: [
			"5 user minimum",
			"Everything from Starter",
			"Implementation support",
			"Unlimited functional support",
			"API, webhooks, and integrations",
			"AI-powered workflows",
			"All advanced features available",
		],
	},
	{
		name: "Enterprise",
		priceHeadline: "Contact us",
		priceSubtext: "",
		action: "Contact us",
		url: "/sales",
		description: "A custom solution to meet your needs",
		featured: false,
		features: [
			"Self-hosted or managed",
			"ITAR compliant",
			"Advanced audit logging",
			"Full setup and migrations",
			"Custom integrations",
			"Custom development",
			"SSO/SAML",
			"Unlimited functional support",
			"Training",
		],
	},
];

export default function Pricing() {
	return (
		<section
			id="pricing"
			className="mx-auto flex w-screen max-w-7xl px-6 flex-col gap-8 py-14 md:px-8 min-h-[calc(100dvh-100px)] justify-center items-center"
		>
			<div className="flex flex-col gap-4 mx-auto text-center">
				<div>
					<Button variant="outline" className="cursor-default">
						<LucideHandCoins />
						Pricing
					</Button>
				</div>
				<h2 className="font-display text-balance mx-auto text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl w-full">
					Simple pricing based on your needs
				</h2>
			</div>

			<div className="mx-auto grid w-full justify-center grid-cols-1 lg:grid-cols-3 gap-4">
				{plans.map((plan) => (
					<div
						key={plan.name}
						className={cn(
							"relative flex w-full flex-col gap-8 rounded-2xl bg-muted p-4 text-foreground overflow-hidden h-full border border-border",
							plan.featured
								? "bg-[linear-gradient(to_bottom,#000000_0%,#010215_20%,#0F356E_50%,#4b93aa_65%,#E2E8F2_95%,#FFFFFF_100%)] text-white"
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
							<Button variant="default" className="w-full" size="xl" asChild>
								<Link to={plan.url}>{plan.action}</Link>
							</Button>
						</div>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-4 bg-muted dark:bg-muted bg-[url('/cta.webp')] dark:bg-none bg-[0_0] bg-no-repeat bg-cover rounded-2xl py-24 justify-center items-center px-4 w-full">
				<h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl w-full">
					Get started for free
				</h2>
				<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-lg">
					View the docs and start developing locally
				</p>
				<div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
					<Button variant="default" size="xl" asChild>
						<a href="https://docs.carbon.ms">
							Read the Docs
							<BookOpen />
						</a>
					</Button>
					<Button variant="outline" size="xl" asChild>
						<a href="https://github.com/crbnos/carbon">
							<GithubLogo />
							Star on GitHub
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
