import * as cookie from "cookie";
import type { Mode } from "~/types/validators";
import { clientHint } from "~/utils/client-hints";

const cookieName = "mode";

/**
 * Two signals can disagree: the visitor's OS preference (reported by the
 * client-hint script) and the `mode` cookie shared across `.carbon.ms`, which
 * app.carbon.ms also writes.
 *
 * - Only one reported → use it. That makes `mode` the first-load fallback,
 *   covering the render before the hint script has run.
 * - Both reported and they disagree → dark wins.
 * - Neither → null, and the caller falls back to light.
 *
 * The old order returned the `mode` cookie unconditionally, so a stale value
 * pinned the theme forever — nothing ever refreshed it and switching the OS
 * theme did nothing.
 */
export function getMode(request: Request, hint?: Mode): Mode | null {
	const cookieHeader = request.headers.get("cookie");
	const cookies = cookieHeader ? cookie.parse(cookieHeader) : {};

	// Only trust the hint once the client has actually reported one — otherwise
	// it is just the "light" fallback baked into the hint definition.
	const osMode = cookies[clientHint.cookieName] ? (hint ?? null) : null;

	const stored = cookies[cookieName];
	const appMode = stored === "light" || stored === "dark" ? stored : null;

	if (osMode && appMode && osMode !== appMode) return "dark";

	return osMode ?? appMode ?? null;
}

export function setMode(mode: Mode | "system") {
	if (mode === "system") {
		return cookie.serialize(cookieName, "", {
			domain:
				process.env.VERCEL_ENV === "production" ? ".carbon.ms" : undefined,
			path: "/",
			maxAge: -1,
		});
	} else {
		return cookie.serialize(cookieName, mode, {
			domain:
				process.env.VERCEL_ENV === "production" ? ".carbon.ms" : undefined,
			path: "/",
			maxAge: 31536000,
		});
	}
}
