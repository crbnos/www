import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import { animateView, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "~/lib/utils";

const MORPH = { duration: 0.32, ease: [0.2, 0, 0, 1] } as const;

/**
 * Click-to-zoom for the product screenshots: the thumbnail morphs into a
 * full-size dialog and back.
 *
 * Motion's `animateView` drives the View Transition. It assigns and releases
 * `view-transition-name` itself — pairing two different elements through
 * `.add(old, new)` — so nothing here has to juggle names, and it falls back to
 * running the update unanimated when the browser has no View Transition API
 * (Firefox, Safari < 18).
 */
export function ZoomableImage({
	src,
	alt,
	children,
	className,
}: {
	src: string;
	alt: string;
	/** The thumbnail, rendered in place. */
	children: ReactNode;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const thumbRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const reduceMotion = useReducedMotion();
	// The dialog image does not exist yet when the zoom-in transition is set up,
	// so it is paired by selector and resolved after the update. `useId` contains
	// colons, which are not valid in a plain attribute selector.
	const zoomId = useId().replace(/[^a-zA-Z0-9]/g, "");

	// The <dialog> has to enter/leave the top layer inside the transition's update
	// callback, so drive it from a layout effect (flushSync runs these
	// synchronously) rather than from the click handler.
	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	const zoomIn = useCallback(() => {
		if (reduceMotion) {
			setOpen(true);
			return;
		}
		const thumb = thumbRef.current?.querySelector("img");
		const transition = animateView(() => flushSync(() => setOpen(true)));
		if (thumb) {
			transition
				.add(thumb, `[data-zoom-image="${zoomId}"]`)
				// The thumbnail sits inside two overflow-hidden wrappers; nesting the
				// layer under them would clip the image as it grows past the card.
				.group(false)
				.layout(MORPH);
		}
	}, [reduceMotion, zoomId]);

	const zoomOut = useCallback(() => {
		if (reduceMotion) {
			setOpen(false);
			return;
		}
		const full = dialogRef.current?.querySelector("img");
		const thumb = thumbRef.current?.querySelector("img");
		const transition = animateView(() => flushSync(() => setOpen(false)));
		if (full && thumb) {
			transition.add(full, thumb).group(false).layout(MORPH);
		}
	}, [reduceMotion]);

	return (
		<>
			<div ref={thumbRef} className={cn("relative w-full sm:h-full", className)}>
				{children}
				<button
					type="button"
					onClick={zoomIn}
					className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
				>
					<span className="sr-only">
						<Trans>Expand image</Trans>
					</span>
				</button>
			</div>

			<dialog
				ref={dialogRef}
				onClose={() => setOpen(false)}
				// Escape fires `cancel` before `close`; intercept it so the exit is
				// animated the same way the close button is.
				onCancel={(event) => {
					event.preventDefault();
					zoomOut();
				}}
				onClick={(event) => {
					// Backdrop clicks land on the dialog element itself.
					if (event.target === dialogRef.current) zoomOut();
				}}
				className="max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/80 open:fixed open:inset-0 open:flex open:h-full open:w-full open:items-center open:justify-center"
			>
				{open && (
					<>
						<img
							src={src}
							alt={alt}
							data-zoom-image={zoomId}
							className="max-h-[92vh] max-w-[94vw] cursor-zoom-out object-contain"
							onClick={zoomOut}
						/>
						<button
							type="button"
							onClick={zoomOut}
							className="absolute right-4 top-4 inline-flex size-10 items-center justify-center bg-background/90 text-foreground transition-colors hover:bg-background"
						>
							<X className="size-5" />
							<span className="sr-only">
								<Trans>Close</Trans>
							</span>
						</button>
					</>
				)}
			</dialog>
		</>
	);
}
