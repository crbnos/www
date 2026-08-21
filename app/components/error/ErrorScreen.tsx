// Ported from @carbon/react (ErrorBoundary/ErrorScreen).
import { GlitchHeading } from "./GlitchHeading";
import { MagneticLink } from "./MagneticLink";
import { NoiseOverlay } from "./NoiseOverlay";
import { StatusReadout } from "./StatusReadout";

export type ErrorAction = {
	label: string;
	to?: string;
	onClick?: () => void;
	variant?: "solid" | "ghost";
};

export type ErrorLink = {
	label: string;
	href: string;
};

export type ErrorScreenProps = {
	code: string;
	eyebrow: string;
	title: string;
	message: string;
	logLines: string[];
	highlightIndex?: number;
	actions: ErrorAction[];
	/** Quiet secondary links — where to look next after a dead URL. */
	links?: readonly ErrorLink[];
};

export function ErrorScreen({
	code,
	eyebrow,
	title,
	message,
	logLines,
	highlightIndex,
	actions,
	links,
}: ErrorScreenProps) {
	return (
		<main className="relative flex min-h-svh flex-col overflow-hidden bg-background text-foreground">
			<NoiseOverlay />

			{/* Body */}
			<div className="relative z-10 flex flex-1 flex-col justify-center px-5 py-12 sm:px-8">
				<p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground sm:text-xs">
					{eyebrow}
				</p>

				<div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
					<div className="lg:col-span-8">
						<GlitchHeading code={code} srText={`Error ${code}. ${title} `} />
					</div>

					<div className="flex flex-col gap-6 lg:col-span-4 lg:pb-6">
						<h2
							className="font-sans text-2xl font-bold leading-[0.95] tracking-tight text-balance sm:text-3xl"
							style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
						>
							{title}
						</h2>
						<p className="max-w-sm font-mono text-sm leading-relaxed text-muted-foreground text-pretty">
							{message}
						</p>
						<StatusReadout lines={logLines} highlightIndex={highlightIndex} />
					</div>
				</div>

				{/* Actions */}
				<div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
					{actions.map((action) => (
						<MagneticLink
							key={action.label}
							to={action.to}
							onClick={action.onClick}
							variant={action.variant}
						>
							{action.label}
						</MagneticLink>
					))}
				</div>

				{links && links.length > 0 && (
					<nav
						aria-label="Where to look next"
						className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:text-xs"
					>
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="transition-colors duration-200 hover:text-foreground"
							>
								{link.label}
							</a>
						))}
					</nav>
				)}
			</div>
		</main>
	);
}
