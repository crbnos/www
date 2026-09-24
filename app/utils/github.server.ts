import { redis } from "~/lib/upstash.server";

const REPO = "crbnos/carbon";
const CACHE_KEY = `github:stars:${REPO}`;
// Unauthenticated GitHub API calls are limited to 60/hour per IP, so the count
// is cached rather than fetched on every page load.
const CACHE_TTL_SECONDS = 60 * 60;

// The root loader streams this promise, and any promise still pending at the
// `streamTimeout` in entry.server.tsx fails the whole render. The upstash
// client retries with backoff for several seconds when Redis is unreachable,
// so every step is hard-capped to keep the total well under that limit.
const CACHE_TIMEOUT_MS = 500;
const GITHUB_TIMEOUT_MS = 2000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
	return Promise.race([
		promise.catch(() => null),
		new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
	]);
}

export async function fetchGithubStars(): Promise<number | null> {
	const cached = await withTimeout(redis.get<number>(CACHE_KEY), CACHE_TIMEOUT_MS);
	if (typeof cached === "number") return cached;

	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}`, {
			headers: {
				Accept: "application/vnd.github+json",
				"User-Agent": "carbon.ms",
			},
			signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
		});
		if (!res.ok) return null;
		const { stargazers_count } = (await res.json()) as {
			stargazers_count?: unknown;
		};
		if (typeof stargazers_count !== "number") return null;
		// Not awaited: the count is already known, so don't hold the stream open
		// on the cache write.
		redis
			.set(CACHE_KEY, stargazers_count, { ex: CACHE_TTL_SECONDS })
			.catch(() => {});
		return stargazers_count;
	} catch {
		return null;
	}
}
