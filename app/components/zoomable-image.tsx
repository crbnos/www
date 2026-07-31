import { Trans } from "@lingui/react/macro";
import { X } from "lucide-react";
import { type ReactNode, useCallback, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "~/lib/utils";

/**
 * Shared across every zoomable image. Only one element may carry a given
 * view-transition-name at a time, so the name is assigned imperatively to
 * whichever image is mid-transition and cleared as soon as it settles.
 */
const VT_NAME = "zoomed-image";

function canAnimate() {
	return (
		typeof document !== "undefined" &&
		typeof document.startViewTransition === "function" &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

/**
 * Click-to-zoom for the product screenshots: the thumbnail morphs into a
 * full-size dialog via the View Transition API, and back on close. Browsers
 * without the API (Firefox, Safari < 18) still get the dialog, just cut rather
 * than morphed — same for anyone who asked for reduced motion.
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

	// The <dialog> has to enter/leave the top layer inside the view transition's
	// update callback, so drive it from a layout effect (flushSync runs these
	// synchronously) rather than from the click handler.
	useLayoutEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	const thumbImage = useCallback(
		() => thumbRef.current?.querySelector("img") ?? null,
		[],
	);

	const zoomIn = useCallback(() => {
		if (!canAnimate()) {
			setOpen(true);
			return;
		}
		const img = thumbImage();
		// Name the thumbnail so it is captured as the "old" state...
		if (img) img.style.viewTransitionName = VT_NAME;
		document
			.startViewTransition(() => {
				// ...then hand the name over to the dialog image, so the two are
				// never named at the same time.
				if (img) img.style.viewTransitionName = "";
				flushSync(() => setOpen(true));
			})
			.finished.finally(() => {
				if (img) img.style.viewTransitionName = "";
			});
	}, [thumbImage]);

	const zoomOut = useCallback(() => {
		if (!canAnimate()) {
			setOpen(false);
			return;
		}
		const img = thumbImage();
		document
			.startViewTransition(() => {
				flushSync(() => setOpen(false));
				// The thumbnail is the "new" state on the way back.
				if (img) img.style.viewTransitionName = VT_NAME;
			})
			.finished.finally(() => {
				if (img) img.style.viewTransitionName = "";
			});
	}, [thumbImage]);

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
							style={{ viewTransitionName: VT_NAME }}
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
