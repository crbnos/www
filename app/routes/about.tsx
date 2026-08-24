import { Trans } from "@lingui/react/macro";
import { ChevronRight } from "lucide-react";
import type { MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { DiscordLogo } from "~/components/ui/discord-logo";
import { pageMeta } from "~/lib/seo";

export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "About Carbon Manufacturing Systems",
		description:
			"A founder memo on why we built Carbon and open-sourced it for the manufacturing community.",
	});

export default function About() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="mx-auto flex flex-col px-4 w-full max-w-4xl mb-28 pt-28">
				<div className="flex flex-col gap-4 border-[0.5px] bg-card px-8 shadow py-12 lg:p-14 text-lg xl-p-16">
					<div className="mb-4 flex flex-col gap-1.5 md:mb-6 lg:mb-8 tracking-tight">
						<p className="dark:text-muted-foreground font-mono uppercase text-base font-light">
							<Trans>Founder memo</Trans>
						</p>
						<p className="font-mono uppercase font-medium">
							<Trans>Carbon Manufacturing Systems Corp.</Trans>
						</p>
					</div>

					<h1 className="mb-2 font-display text-3xl font-semibold tracking-[-0.02em] text-pretty sm:text-4xl">
						<Trans>Why we built Carbon and open-sourced it</Trans>
					</h1>

					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>
							After spending nearly a decade building end-to-end systems for
							manufacturing, I had a pretty good idea of what an "ideal" solution
							looked like from a technical perspective:
						</Trans>
					</p>

					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>
							API-first, realtime subscriptions, simple scheduling, and 1,000
							little details to make the juice of using an ERP worth the squeeze.
						</Trans>
					</p>
					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>
							But even as we work with our customers to become the best
							off-the-shelf ERP/MES for many types of discrete manufacturing, we
							are faced with the reality that there is no "perfect" off-the-shelf
							solution, because each manufacturing business is unique.
						</Trans>
					</p>

					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>
							We open-sourced Carbon not because it's a great business plan, but
							because that's the system I would have wanted when I was in your
							shoes.
						</Trans>
					</p>

					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>
							I believe open-source has incredible potential because it's not
							just a product–it's a community of like-minded people working to
							build the future of manufacturing in the age of AI and robotics.
						</Trans>
					</p>

					<p className="leading-[1.8] text-foreground text-pretty">
						<Trans>We're glad you're here for it.</Trans>
					</p>

					<div>
						<Button variant="outline" asChild>
							<a
								href="https://discord.gg/yGUJWhNqzy"
								target="_blank"
								rel="noopener"
							>
								<DiscordLogo />
								<Trans>Join our Discord community</Trans>{" "}
								<ChevronRight className="text-muted-foreground size-3" />
							</a>
						</Button>
					</div>

					<div className="mt-8 flex flex-col gap-4">
						<a
							target="_blank"
							className="mt-4 flex items-center gap-4 md:mt-6 lg:mt-8"
							href="https://x.com/barbinbrad"
							rel="noopener"
						>
							<img
								alt="Brad Barbin"
								loading="lazy"
								className="w-14 h-auto rounded-full corner-squircle"
								src="/faces/brad.webp"
							/>
							<div className="flex flex-col">
								<p className="dark:text-tertiary text-foreground">Brad Barbin</p>
								<p className="dark:text-tertiary text-muted-foreground text-sm">
									<Trans>Co-Founder and CTO</Trans>
								</p>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
