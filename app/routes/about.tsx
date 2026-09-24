import { Trans } from "@lingui/react/macro";
import type { MetaFunction } from "react-router";
import { Button } from "~/components/ui/button";
import { DiscordLogo } from "~/components/ui/discord-logo";
import { GithubLogo } from "~/components/ui/github-logo";
import { pageMeta } from "~/lib/seo";

const GITHUB_URL = "https://github.com/crbnos/carbon";

export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "About Carbon Manufacturing Systems",
		description:
			"A founder memo on why we built Carbon and open-sourced it for the manufacturing community.",
	});

export default function About() {
	return (
		<div className="flex flex-1 flex-col">
			<div className="mx-auto flex flex-col px-4 w-full max-w-3xl mb-28 pt-28">
				<div className="flex flex-col gap-4 text-lg">
					<h1 className="mb-6 font-display text-3xl tracking-[-0.005em] text-pretty sm:text-4xl">
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
							API-first, realtime subscriptions, forward/finite scheduling, and 1,000
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
								<p className="font-display text-2xl leading-tight text-foreground">
									Brad Barbin
								</p>
								<p className="mt-1 font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-muted-foreground">
									<Trans>Co-Founder and CTO</Trans>
								</p>
							</div>
						</a>
						<div className="mt-2 flex flex-wrap gap-2.5">
							<Button asChild variant="accentOutline" size="cta">
								<a
									href="https://discord.gg/ntzBZ3yYj"
									target="_blank"
									rel="noopener"
								>
									<DiscordLogo className="size-4" />
									<Trans>Join our Discord community</Trans>
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
				</div>
			</div>
		</div>
	);
}
