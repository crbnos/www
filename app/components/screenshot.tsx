import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

/**
 * Stand-in for a product screenshot. Fills its container and labels what will
 * live there, so real assets can be dropped in later.
 */
export function Placeholder({
	label,
	className,
}: {
	label: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center bg-muted/40 p-6 text-center",
				className,
			)}
			style={{
				backgroundImage:
					"repeating-linear-gradient(45deg, rgba(128,128,128,0.06) 0, rgba(128,128,128,0.06) 1px, transparent 1px, transparent 11px)",
			}}
		>
			<div className="flex flex-col items-center gap-3">
				<ImageIcon className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
				<span className="max-w-[24ch] font-mono text-sm uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/70">
					{label}
				</span>
			</div>
		</div>
	);
}

/**
 * A product screenshot — or a muted screen recording — dropped into a panel.
 * App views are wide and multi-column, so we never crop horizontally (which
 * would slice off nav / sidebars):
 *   - Below `sm`: the media shows at its natural height (phones). No fixed
 *     frame, so a wide shot scaled to phone width never leaves dead space.
 *   - `sm` and up: the media is pinned to the top of the fixed-height frame and
 *     bleeds past it, fading into the card — reads as "the app continues below".
 * `fit="cover"` instead fills the frame from the top-left (for pre-cropped,
 * near-square regions). Pass `video` for a screen recording; `src` doubles as
 * its poster (and as the still fallback for reduced-motion or a missing video).
 * Falls back to <Placeholder> when nothing loads, so the page degrades
 * gracefully until real assets land in /public/screenshots.
 */
export function Screenshot({
	src,
	video,
	label,
	fit = "width",
	eager = false,
	className,
}: {
	src?: string;
	video?: string;
	label: string;
	fit?: "width" | "cover";
	eager?: boolean;
	className?: string;
}) {
	const [loaded, setLoaded] = useState(false);
	const [reduce, setReduce] = useState(false);
	const [videoFailed, setVideoFailed] = useState(false);
	const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
	useEffect(() => {
		setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);
	const showVideo = !!video && !reduce && !videoFailed;
	// onLoad/onLoadedData can fire before hydration (eager/cached media finish
	// during SSR paint), so settle `loaded` on mount too. A <video> paints its
	// poster immediately, so treat it as shown right away.
	useEffect(() => {
		const el = mediaRef.current;
		if (!el) return;
		if (el instanceof HTMLVideoElement) setLoaded(true);
		else setLoaded(el.complete && el.naturalWidth > 0);
	}, [src, showVideo]);

	const mediaClass = cn(
		"block w-full select-none transition-opacity duration-500",
		loaded ? "opacity-100" : "opacity-0",
		fit === "cover"
			? "h-auto sm:absolute sm:inset-0 sm:h-full sm:object-cover sm:object-left-top"
			: "h-auto sm:absolute sm:inset-x-0 sm:top-0",
	);

	return (
		<div
			className={cn(
				"relative w-full overflow-hidden bg-screenshot min-h-[220px] sm:min-h-0 sm:h-full",
				className,
			)}
		>
			{!loaded && <Placeholder label={label} className="absolute inset-0" />}
			{showVideo ? (
				<video
					ref={(el) => {
						mediaRef.current = el;
					}}
					key={video}
					poster={src}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					aria-label={label}
					onLoadedData={() => setLoaded(true)}
					onError={() => setVideoFailed(true)}
					className={mediaClass}
				>
					<source src={video} type="video/mp4" />
				</video>
			) : src ? (
				<img
					ref={(el) => {
						mediaRef.current = el;
					}}
					src={src}
					alt={label}
					loading={eager ? "eager" : "lazy"}
					onLoad={() => setLoaded(true)}
					className={mediaClass}
				/>
			) : null}
			{(showVideo || src) && loaded && fit === "width" && (
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 hidden sm:block [background:linear-gradient(to_bottom,transparent_55%,hsl(var(--card)))]"
				/>
			)}
		</div>
	);
}
