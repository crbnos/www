import { describe, expect, it } from "vitest";
import { WELL_KNOWN_REDIRECT_STATUS, wellKnownRedirect } from "./oauth";
import { API_VERSIONING, APP_URL, OAUTH_METADATA, SITE_URL } from "./site";

describe("OAUTH_METADATA", () => {
  it("points at the app, which is the issuer", () => {
    // RFC 8414 §3.3: the client checks that `issuer` matches the origin it
    // derived the metadata URL from. app.carbon.ms issues the tokens, so the
    // documents have to be served from — and validated against — that origin.
    expect(OAUTH_METADATA.authorizationServer).toBe(
      `${APP_URL}/.well-known/oauth-authorization-server`,
    );
    expect(OAUTH_METADATA.protectedResource).toBe(
      `${APP_URL}/.well-known/oauth-protected-resource`,
    );
    for (const url of Object.values(OAUTH_METADATA)) {
      expect(url.startsWith(SITE_URL), url).toBe(false);
    }
  });
});

describe("wellKnownRedirect", () => {
  const response = wellKnownRedirect(OAUTH_METADATA.authorizationServer);

  it("redirects rather than mirroring the document", () => {
    // Serving a copy here would put `issuer: app.carbon.ms` at a carbon.ms URL,
    // which a conforming client MUST reject.
    expect(response.status).toBe(WELL_KNOWN_REDIRECT_STATUS);
    expect(response.headers.get("Location")).toBe(
      OAUTH_METADATA.authorizationServer,
    );
    expect(response.body).toBeNull();
  });

  it("is a temporary redirect", () => {
    // The marketing/app origin split is a deployment fact, not a permanent
    // property of the URL — a 301 is expensive to walk back.
    expect(response.status).toBe(302);
  });

  it("is readable cross-origin", () => {
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("API_VERSIONING", () => {
  it("matches the version the spec publishes", async () => {
    const { openApiDocument } = await import("./openapi");
    expect(openApiDocument.info.version).toBe(API_VERSIONING.specVersion);
  });

  it("is semver", () => {
    expect(API_VERSIONING.specVersion).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("states the rules an agent can actually rely on", () => {
    const text = API_VERSIONING.rules.join(" ");
    expect(API_VERSIONING.rules.length).toBeGreaterThanOrEqual(3);
    expect(text).toContain("info.version");
    expect(text).toContain("MAJOR");
    // Says plainly that the URL is unversioned rather than implying otherwise.
    expect(text).toContain("no version segment");
  });

  it("is published in the spec description", async () => {
    const { openApiDocument } = await import("./openapi");
    const description = String(openApiDocument.info.description);

    expect(description).toContain("Versioning and deprecation");
    for (const rule of API_VERSIONING.rules) {
      expect(description).toContain(rule);
    }
  });

  it("publishes OAuth discovery in the spec description", async () => {
    const { openApiDocument } = await import("./openapi");
    const description = String(openApiDocument.info.description);

    expect(description).toContain(OAUTH_METADATA.authorizationServer);
    expect(description).toContain(OAUTH_METADATA.protectedResource);
  });
});
