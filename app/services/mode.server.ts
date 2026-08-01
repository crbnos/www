import * as cookie from "cookie";
import type { Mode } from "~/types/validators";
import { clientHint } from "~/utils/client-hints";

const cookieName = "mode";

/**
 * Two signals can disagree: the visitor's OS preference (reported by the
 * client-hint script) and the `mode` cookie shared across `.carbon.ms`, which
 * app.carbon.ms also writes.
 *
 * The OS preference always wins once it has been reported. The `mode` cookie is
 * only a first-load fallback, covering the render before the hint script runs.
 *
 * Nothing ever refreshes `mode`, so anything that lets it outrank the OS pins
 * the theme: returning it unconditionally meant switching the OS theme did
 * nothing, and preferring dark on a conflict meant a stale `mode=dark` made
 * light unreachable.
 */
export function getMode(request: Request, hint?: Mode): Mode | null {
	const cookieHeader = request.headers.get("cookie");
	const cookies = cookieHeader ? cookie.parse(cookieHeader) : {};

	// Only trust the hint once the client has actually reported one — otherwise
	// it is just the "light" fallback baked into the hint definition.
	if (cookies[clientHint.cookieName]) return hint ?? null;

	const stored = cookies[cookieName];
	if (stored === "light" || stored === "dark") return stored;

	return null;
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
