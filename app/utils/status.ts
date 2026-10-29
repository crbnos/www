// The root loader streams this promise. Crawlers and agents (anything `isbot`
// matches — ChatGPT-User, ClaudeBot, GPTBot) are served with `onAllReady`, so
// their response is held until every streamed promise settles. Without a cap,
// a slow status page stalls the homepage for exactly the clients least willing
// to wait, and past `streamTimeout` it fails the render outright.
export const STATUS_TIMEOUT_MS = 1500;

// Checkmate's public status-page payload for status.carbon.ms (no CORS, so server-side only).
// Same rule as the docs footer: up unless a monitor is down.
const STATUS_URL =
	"https://status.carbon.ms/api/v1/status-page/resolve?domain=status.carbon.ms&type=uptime";

export function fetchStatus(
	fetcher: typeof fetch = fetch,
	timeoutMs: number = STATUS_TIMEOUT_MS,
): Promise<{ up: boolean }> {
	return fetcher(STATUS_URL, { signal: AbortSignal.timeout(timeoutMs) })
		.then((res) => res.json())
		.then((json: { data?: { monitors?: { status: string }[] } }) => {
			const monitors = json.data?.monitors;
			return { up: !!monitors && monitors.every((m) => m.status !== "down") };
		})
		.catch(() => ({ up: false }));
}
