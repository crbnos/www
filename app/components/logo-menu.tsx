import { Trans } from "@lingui/react/macro";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useMode } from "~/hooks/useMode";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "./ui/context-menu";

/**
 * The header wordmark. Left-click navigates home; right-click opens a small
 * brand menu (à la Ramp) to copy the logo SVG or jump to the brand assets page.
 *
 * Uses Radix ContextMenu so the right-click gesture is handled natively — the
 * browser's default menu is suppressed and left-clicks on the link are
 * untouched.
 */
export function LogoMenu() {
	const mode = useMode();
	const [copied, setCopied] = useState(false);

	async function copySvg() {
		try {
			const res = await fetch(`/brand/carbon-word-${mode}.svg`);
			const svg = await res.text();
			await navigator.clipboard.writeText(svg);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1200);
		} catch {
			// Clipboard can be unavailable (insecure context / denied); fail quietly.
		}
	}

	return (
		<ContextMenu onOpenChange={(open) => !open && setCopied(false)}>
			<ContextMenuTrigger asChild>
				<Link
					to="/"
					aria-label="Homepage"
					className="flex shrink-0 select-none items-center justify-self-start font-display"
				>
					<img
						src="/brand/carbon-word-light.svg"
						alt="Carbon"
						className="h-7 w-auto dark:hidden"
					/>
					<img
						src="/brand/carbon-word-dark.svg"
						alt="Carbon"
						className="hidden h-7 w-auto dark:block"
					/>
				</Link>
			</ContextMenuTrigger>
			<ContextMenuContent className="z-[1000] w-52">
				<ContextMenuItem
					onSelect={(e) => {
						// Keep the menu open briefly to show the copied state.
						e.preventDefault();
						copySvg();
					}}
				>
					{copied ? <Check /> : <Copy />}
					{copied ? <Trans>Copied</Trans> : <Trans>Copy .SVG</Trans>}
				</ContextMenuItem>
				<ContextMenuItem asChild>
					<a href="/brand/carbon-logos.zip" download>
						<Download />
						<Trans>Media Kit</Trans>
					</a>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
