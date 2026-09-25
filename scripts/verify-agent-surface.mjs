#!/usr/bin/env node
/**
 * Probe the agent-facing surface of a running deployment and fail loudly if any
 * of it is unreachable or malformed.
 *
 *   node scripts/verify-agent-surface.mjs                     # https://carbon.ms
 *   node scripts/verify-agent-surface.mjs http://localhost:3000
 *
 * Unit tests cover how each document is built; this covers what a crawler or
 * an agent actually gets back over HTTP — status, content type, CORS, and
 * whether the homepage answers the major agent user agents in time.
 * `vercel.json` redirects only exist on Vercel, so they are checked only when
 * the base URL is not localhost.
 */

const base = (process.argv[2] ?? "https://carbon.ms").replace(/\/$/, "");
const onVercel = !/localhost|127\.0\.0\.1/.test(base);

/** Real-world UA strings, as each vendor documents them. */
const AGENTS = {
  "ChatGPT-User":
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  GPTBot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)",
  ClaudeBot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  "Claude-User":
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Claude-User/1.0; +Claude-User@anthropic.com)",
  PerplexityBot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  DeepSeekBot: "Mozilla/5.0 (compatible; DeepSeekBot/1.0)",
};

/** Agents give up quickly; so does this. */
const AGENT_BUDGET_MS = 5000;

let failures = 0;

function report(ok, label, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
}

async function get(path, init = {}) {
  const started = Date.now();
  const response = await fetch(`${base}${path}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    ...init,
  });
  const body = await response.text();
  return { response, body, ms: Date.now() - started };
}

async function check(label, fn) {
  try {
    const result = await fn();
    report(result.ok, label, result.detail);
  } catch (error) {
    report(false, label, error instanceof Error ? error.message : String(error));
  }
}

const type = (response) => response.headers.get("content-type") ?? "";

for (const [name, userAgent] of Object.entries(AGENTS)) {
  await check(`homepage reachable as ${name}`, async () => {
    const { response, body, ms } = await get("/", {
      headers: { "User-Agent": userAgent, Accept: "text/html" },
    });
    return {
      ok:
        response.status === 200 &&
        type(response).startsWith("text/html") &&
        body.includes("</html>") &&
        ms < AGENT_BUDGET_MS,
      detail: `${response.status} in ${ms}ms`,
    };
  });
}

await check("robots.txt allows agents", async () => {
  const { response, body } = await get("/robots.txt");
  return {
    ok:
      response.status === 200 &&
      /^User-agent: ClaudeBot\nAllow: \/$/m.test(body) &&
      /^User-agent: ChatGPT-User\nAllow: \/$/m.test(body) &&
      !/^Disallow: \/\S*/m.test(body),
    detail: `${response.status}`,
  };
});

await check("llms.txt", async () => {
  const { response, body } = await get("/llms.txt");
  return {
    ok:
      response.status === 200 &&
      type(response).startsWith("text/plain") &&
      body.startsWith("# Carbon\n\n> ") &&
      body.includes("x-api-lifecycle") &&
      body.includes("[Carbon MCP server]"),
    detail: `${response.status} ${type(response)}`,
  };
});

for (const path of ["/openapi.json", "/.well-known/openapi.json"]) {
  await check(`${path} is OpenAPI 3.1 with lifecycle, onboarding and rate-limit headers`, async () => {
    const { response, body } = await get(path);
    const doc = JSON.parse(body);
    const operations = Object.values(doc.paths).flatMap((item) => Object.values(item));
    return {
      ok:
        response.status === 200 &&
        response.headers.get("access-control-allow-origin") === "*" &&
        doc.openapi === "3.1.0" &&
        /^\d+\.\d+\.\d+$/.test(doc.info.version) &&
        doc.info["x-api-lifecycle"]?.deprecation?.minimumNoticeDays > 0 &&
        doc.info["x-onboarding"]?.selfServe === true &&
        operations.every((operation) => typeof operation.deprecated === "boolean") &&
        ["Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"].every(
          (header) => doc.components.responses.TooManyRequests.headers[header],
        ),
      detail: `${response.status} v${doc.info?.version} ${operations.length} operations`,
    };
  });
}

await check("/openapi.yaml", async () => {
  const { response, body } = await get("/openapi.yaml");
  return {
    ok:
      response.status === 200 &&
      /yaml/.test(type(response)) &&
      /^"?openapi"?: "?3\.1\.0"?$/m.test(body) &&
      /^\s+"?x-api-lifecycle"?:$/m.test(body),
    detail: `${response.status} ${type(response)}`,
  };
});

for (const path of ["/.well-known/mcp.json", "/mcp.json"]) {
  await check(`${path} is an MCP server.json`, async () => {
    const { response, body } = await get(path);
    const manifest = JSON.parse(body);
    return {
      ok:
        response.status === 200 &&
        response.headers.get("access-control-allow-origin") === "*" &&
        manifest.remotes?.[0]?.type === "streamable-http",
      detail: `${response.status}`,
    };
  });
}

for (const path of [
  "/.well-known/oauth-authorization-server",
  "/.well-known/oauth-protected-resource",
]) {
  await check(`${path} redirects to the issuer`, async () => {
    const { response } = await get(path);
    const location = response.headers.get("location") ?? "";
    return {
      ok: [301, 302, 307, 308].includes(response.status) && location.startsWith("https://app.carbon.ms/"),
      detail: `${response.status} → ${location}`,
    };
  });
}

await check("/sitemap.xml lists /developers", async () => {
  const { response, body } = await get("/sitemap.xml");
  return {
    ok: response.status === 200 && body.includes("/developers</loc>"),
    detail: `${response.status}`,
  };
});

await check("/developers names the Carbon API", async () => {
  const { response, body } = await get("/developers", { headers: { Accept: "text/html" } });
  return {
    ok:
      response.status === 200 &&
      /<title>[^<]*Carbon API[^<]*<\/title>/.test(body) &&
      body.includes('"@type":"WebAPI"') &&
      body.includes('id="get-access"'),
    detail: `${response.status}`,
  };
});

for (const [label, path, headers] of [
  ["/developers.md", "/developers.md", {}],
  ["/developers as Accept: text/markdown", "/developers", { Accept: "text/markdown" }],
]) {
  await check(label, async () => {
    const { response, body } = await get(path, { headers });
    return {
      ok:
        response.status === 200 &&
        type(response).startsWith("text/markdown") &&
        body.includes("## Get a Carbon API key") &&
        body.includes("## Carbon API versioning and deprecation"),
      detail: `${response.status} ${type(response)}`,
    };
  });
}

await check("unknown path is a real 404 with a markdown way out", async () => {
  const { response, body } = await get("/no-such-page-for-agents", { headers: { Accept: "*/*" } });
  return {
    ok: response.status === 404 && body.includes("llms.txt"),
    detail: `${response.status}`,
  };
});

if (onVercel) {
  for (const [source, destination] of [
    ["/developer", "/developers"],
    ["/api-docs", "https://docs.carbon.ms/api-reference"],
    ["/api-reference", "https://docs.carbon.ms/api-reference"],
    ["/openapi.yml", "/openapi.yaml"],
  ]) {
    await check(`${source} redirects to ${destination}`, async () => {
      const { response } = await get(source);
      const location = response.headers.get("location") ?? "";
      return {
        ok: response.status === 308 && location.endsWith(destination),
        detail: `${response.status} → ${location}`,
      };
    });
  }
}

console.log(failures ? `\n${failures} check(s) failed against ${base}` : `\nAll checks passed against ${base}`);
process.exit(failures ? 1 : 0);
