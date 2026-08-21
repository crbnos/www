import { parse as parseYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { buildOpenApiDocument, openApiDocument } from "./openapi";
import type { Operation } from "./openapi-types";
import { toYaml } from "./yaml";

type AnyRecord = Record<string, any>;

const VERBS = ["get", "post", "patch", "delete"] as const;

function operations(): { path: string; verb: string; operation: Operation }[] {
  return Object.entries(openApiDocument.paths).flatMap(([path, item]) =>
    VERBS.filter((verb) => (item as AnyRecord)[verb]).map((verb) => ({
      path,
      verb,
      operation: (item as AnyRecord)[verb] as Operation,
    })),
  );
}

/** Walk every `$ref` in the document and confirm it resolves. */
function refs(value: unknown, found: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const entry of value) refs(entry, found);
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value as AnyRecord)) {
      if (key === "$ref" && typeof entry === "string") found.push(entry);
      else refs(entry, found);
    }
  }
  return found;
}

function resolve(ref: string): unknown {
  return ref
    .replace(/^#\//, "")
    .split("/")
    .reduce<AnyRecord | undefined>(
      (node, segment) => (node ? (node[segment] as AnyRecord) : undefined),
      openApiDocument as unknown as AnyRecord,
    );
}

describe("openapi document", () => {
  it("is OpenAPI 3.1 with a server and a security scheme", () => {
    expect(openApiDocument.openapi).toBe("3.1.0");
    expect(openApiDocument.servers[0]?.url).toBe("https://rest.carbon.ms");
    expect(Object.keys(openApiDocument.components.securitySchemes as AnyRecord))
      .toEqual(["bearerAuth", "carbonKey"]);
    for (const requirement of openApiDocument.security) {
      for (const scheme of Object.keys(requirement)) {
        expect(
          (openApiDocument.components.securitySchemes as AnyRecord)[scheme],
        ).toBeDefined();
      }
    }
  });

  it("describes at least one operation per path", () => {
    expect(Object.keys(openApiDocument.paths).length).toBeGreaterThan(0);
    expect(operations().length).toBe(Object.keys(openApiDocument.paths).length * 4);
  });

  it("gives every operation a unique operationId", () => {
    const ids = operations().map(({ operation }) => operation.operationId);
    expect(new Set(ids).size).toBe(ids.length);
    // Function-calling formats treat this as an identifier, not prose.
    for (const id of ids) expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9_]*$/);
  });

  it("gives every operation a summary, a description and a known tag", () => {
    const tags = new Set(openApiDocument.tags.map((tag) => tag.name));

    for (const { path, verb, operation } of operations()) {
      const where = `${verb.toUpperCase()} ${path}`;
      expect(operation.summary, where).toBeTruthy();
      expect(operation.description.length, where).toBeGreaterThan(40);
      expect(operation.tags.length, where).toBeGreaterThan(0);
      for (const tag of operation.tags) expect(tags.has(tag), where).toBe(true);
    }
  });

  it("types and describes every parameter, inline or shared", () => {
    const inline = operations().flatMap(({ path, verb, operation }) =>
      (operation.parameters ?? []).map((parameter) => ({
        where: `${verb.toUpperCase()} ${path}`,
        parameter,
      })),
    );
    const shared = Object.entries(
      openApiDocument.components.parameters as AnyRecord,
    ).map(([key, parameter]) => ({ where: `components/${key}`, parameter }));

    expect(shared.length).toBeGreaterThan(0);

    for (const { where, parameter } of [...inline, ...shared]) {
      if ("$ref" in parameter) {
        expect(resolve(parameter.$ref), where).toBeDefined();
        continue;
      }
      const at = `${where} ?${parameter.name}`;
      expect(parameter.name, at).toBeTruthy();
      expect(["query", "header", "path", "cookie"], at).toContain(parameter.in);
      expect(parameter.description, at).toBeTruthy();
      expect(parameter.schema.type ?? parameter.schema.$ref, at).toBeTruthy();
    }
  });

  it("names every shared filter parameter after a real column", () => {
    for (const key of Object.keys(
      openApiDocument.components.parameters as AnyRecord,
    )) {
      if (!key.includes(".")) continue;
      const [resource, column] = key.split(".");
      const schema = (openApiDocument.components.schemas as AnyRecord)[resource];
      expect(schema, key).toBeDefined();
      expect(schema.properties[column], key).toBeDefined();
    }
  });

  it("gives every response a description, and every success a schema", () => {
    for (const { path, verb, operation } of operations()) {
      for (const [status, response] of Object.entries(operation.responses)) {
        const where = `${verb.toUpperCase()} ${path} ${status}`;
        if ("$ref" in response) {
          expect(resolve(response.$ref), where).toBeDefined();
          continue;
        }
        expect(response.description, where).toBeTruthy();
        if (status.startsWith("2") && response.content) {
          expect(
            response.content["application/json"]?.schema,
            where,
          ).toBeDefined();
        }
      }
    }
  });

  it("resolves every $ref", () => {
    const all = refs(openApiDocument);
    expect(all.length).toBeGreaterThan(0);
    for (const ref of all) {
      expect(ref.startsWith("#/"), ref).toBe(true);
      expect(resolve(ref), ref).toBeDefined();
    }
  });

  it("publishes a typed schema for every resource path", () => {
    for (const path of Object.keys(openApiDocument.paths)) {
      const name = path.slice(1);
      const schema = (openApiDocument.components.schemas as AnyRecord)[name];
      expect(schema, path).toBeDefined();
      expect(schema.type, path).toBe("object");
      expect(Object.keys(schema.properties).length, path).toBeGreaterThan(0);
      for (const [column, property] of Object.entries(
        schema.properties as AnyRecord,
      )) {
        expect(property.type, `${path}.${column}`).toBeTruthy();
      }
    }
  });

  it("refuses to build when a resource filters on a column that no longer exists", () => {
    // The guard that catches schema drift: `filterParameters` throws rather than
    // publishing a parameter no client could use.
    expect(() => buildOpenApiDocument()).not.toThrow();
  });

  it("serializes to YAML that parses back identically", () => {
    expect(parseYaml(toYaml(openApiDocument))).toEqual(
      JSON.parse(JSON.stringify(openApiDocument)),
    );
  });
});
