// The root loader streams this promise. Crawlers and agents (anything `isbot`
// matches — ChatGPT-User, ClaudeBot, GPTBot) are served with `onAllReady`, so
// their response is held until every streamed promise settles. Without a cap,
// a slow status page stalls the homepage for exactly the clients least willing
// to wait, and past `streamTimeout` it fails the render outright.
export const STATUS_TIMEOUT_MS = 1500;

export function fetchStatus(
	fetcher: typeof fetch = fetch,
	timeoutMs: number = STATUS_TIMEOUT_MS,
): Promise<{ up: boolean }> {
	return fetcher("https://status.carbon.ms/api/badge/1/status", {
		signal: AbortSignal.timeout(timeoutMs),
	})
		.then((res) => res.text())
		.then((html) => ({ up: html.includes("Up") }))
		.catch(() => ({ up: false }));
}
