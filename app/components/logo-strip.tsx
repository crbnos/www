import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

export type Customer = {
	name: string;
	logo: string;
	url: string;
	tone?: "light" | "color";
};

// Brand names — never translated.
export const customers: Customer[] = [
	{ name: "Minimal", logo: "/logos/minimal.svg", url: "https://minimal.tech" },
	{ name: "Kform", logo: "/logos/kform.png", url: "https://kform.com/" },
	{
		name: "Sygnal",
		logo: "/logos/sygnal.svg",
		url: "https://www.sygnalauto.com/",
		tone: "light",
	},
	{
		name: "Ren-Teq",
		logo: "/logos/ren-teq.webp",
		url: "https://www.ren-teq.com/",
		tone: "light",
	},
	{
		name: "Digital Metal",
		logo: "/logos/digital-metal.svg",
		url: "https://www.digitalmetal.io/",
	},
	{ name: "Zero", logo: "/logos/zero.webp", url: "https://zerofarms.it" },
	{
		name: "Witty Machines",
		logo: "/logos/witty-machines.svg",
		url: "https://www.witty-machines.com/",
	},
	{ name: "Machenit", logo: "/logos/machenit.png", url: "https://machenit.com" },
	{
		name: "Allinol Technologies",
		logo: "/logos/allinol.png",
		url: "https://allinoltec.com",
	},
	{ name: "Saeki", logo: "/logos/saeki.svg", url: "https://saeki.ch/" },
	{
		name: "Black Cat Labs",
		logo: "/logos/black-cat-labs.png",
		url: "https://blackcatlabs.xyz",
	},
	{ name: "M3 Aerospace", logo: "/logos/m3.png", url: "https://m3-aerospace.com/" },
	{ name: "Robo", logo: "/logos/robo.svg", url: "https://robo.inc/" },
];

const SHELL = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";

/**
 * The customer logo marquee — shared by the home page and the self-hosted page
 * so the same social proof appears on both. `headline` renders above the strip
 * (the display-size claim); `label` is the small mono eyebrow. Both are
 * optional so a page can show the strip on its own.
 */
export function LogoStrip({
	headline,
	label,
	className,
}: {
	headline?: ReactNode;
	label?: ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("border-y border-border py-16", className)}>
			<div className={cn(SHELL, "flex flex-col gap-8")}>
				{headline && (
					<p className="mx-auto max-w-[24ch] text-balance text-center font-display tracking-[-0.005em] text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.15]">
						{headline}
					</p>
				)}
				<div className="font-mono text-[11px] text-center uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
					{label ?? <Trans>Trusted by the world's most innovative</Trans>}
				</div>
				<div
					className="group relative flex w-full items-center overflow-hidden [--marquee-gap:4rem]"
					style={{
						maskImage:
							"linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
						WebkitMaskImage:
							"linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
					}}
				>
					<div className="flex w-max shrink-0 animate-marquee items-center gap-[--marquee-gap] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
						{[...customers, ...customers].map((c, index) => (
							<a
								key={`${c.name}-${index}`}
								href={c.url}
								target="_blank"
								rel="noreferrer"
								aria-hidden={index >= customers.length}
								tabIndex={index >= customers.length ? -1 : undefined}
								className="flex h-10 shrink-0 items-center justify-center"
							>
								<img
									alt={c.name}
									src={c.logo}
									className={cn(
										"h-auto max-h-8 w-24 object-contain opacity-70 transition-opacity hover:opacity-100",
										c.tone === "light" ? "invert dark:invert-0" : "dark:invert",
									)}
								/>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
