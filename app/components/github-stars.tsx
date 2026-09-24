import { useLingui } from "@lingui/react/macro";
import { Suspense } from "react";
import { Await } from "react-router";
import { cn } from "~/lib/utils";
import { GithubLogo } from "./ui/github-logo";

const REPO_URL = "https://github.com/crbnos/carbon";

function StarCount({ stars }: { stars: number | null }) {
	const { i18n } = useLingui();
	if (stars === null) return null;
	return (
		<span className="tabular-nums">
			{new Intl.NumberFormat(i18n.locale, {
				notation: "compact",
				maximumFractionDigits: 1,
			}).format(stars)}
		</span>
	);
}

export function GithubStars({
	starsPromise,
	className,
}: {
	starsPromise: Promise<number | null>;
	className?: string;
}) {
	const { t } = useLingui();
	return (
		<a
			href={REPO_URL}
			target="_blank"
			rel="noopener"
			aria-label={t`Star Carbon on GitHub`}
			className={cn(
				"inline-flex items-center gap-2 px-2 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground",
				className,
			)}
		>
			<GithubLogo className="size-4" />
			<Suspense fallback={null}>
				<Await resolve={starsPromise} errorElement={null}>
					{(stars) => <StarCount stars={stars} />}
				</Await>
			</Suspense>
		</a>
	);
}
