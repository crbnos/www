import { isbot } from "isbot";
import { describe, expect, it } from "vitest";
import { fetchStatus, STATUS_TIMEOUT_MS } from "./status";
import { streamTimeout } from "~/entry.server";

/** A status page that never answers, but honours the abort signal like fetch. */
const hangingFetch = ((_url: string, init?: RequestInit) =>
  new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () =>
      reject(init.signal?.reason ?? new Error("aborted")),
    );
  })) as typeof fetch;

describe("fetchStatus", () => {
  it("reports up when the badge says so", async () => {
    const ok = (async () => new Response("Up")) as unknown as typeof fetch;
    expect(await fetchStatus(ok)).toEqual({ up: true });
  });

  it("reports down instead of throwing when the status page errors", async () => {
    const failing = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await fetchStatus(failing)).toEqual({ up: false });
  });

  it("gives up on a hanging status page instead of holding the response", async () => {
    const started = Date.now();
    expect(await fetchStatus(hangingFetch, 50)).toEqual({ up: false });
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it("settles well inside the stream timeout crawlers are held to", () => {
    // Agent user agents are served with onAllReady, so they wait for this
    // promise; it must settle before entry.server gives up on the render.
    expect(STATUS_TIMEOUT_MS).toBeLessThan(streamTimeout / 2);
  });
});

describe("agent user agents", () => {
  // These are the clients that take the onAllReady path — the reason the
  // streamed loader promises have to be bounded at all.
  it.each([
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)",
  ])("%s is treated as a bot", (userAgent) => {
    expect(isbot(userAgent)).toBe(true);
  });
});
