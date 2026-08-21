/**
 * Derive the JSON Schemas published in /openapi.json from the Carbon REST API's
 * own PostgREST schema.
 *
 *   node scripts/generate-api-schemas.mjs --from ../carbon/packages/database/src/swagger-docs-schema.ts
 *
 * The output (`app/lib/agent/api-schemas.generated.ts`) IS committed: this site
 * does not depend on the carbon monorepo, and the OpenAPI route needs the
 * schemas at runtime. Re-run this after a migration that changes one of the
 * published resources, and commit the result.
 *
 * Only the resources in RESOURCES are emitted. The complete catalogue — every
 * table Carbon exposes — is documented at https://docs.carbon.ms/api-reference;
 * /openapi.json is a curated, fully-described subset an agent can load whole.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../app/lib/agent/api-schemas.generated.ts");

/** The resources published in /openapi.json, in the order they appear there. */
const RESOURCES = [
  "item",
  "part",
  "material",
  "customer",
  "supplier",
  "salesOrder",
  "salesOrderLine",
  "purchaseOrder",
  "purchaseOrderLine",
  "quote",
  "quoteLine",
  "job",
  "employee",
];

/** Columns that exist in the database but are not part of the public contract. */
const INTERNAL_COLUMNS = new Set(["embedding"]);

function parseArgs(argv) {
  const fromIndex = argv.indexOf("--from");
  if (fromIndex === -1 || !argv[fromIndex + 1]) {
    throw new Error(
      "usage: node scripts/generate-api-schemas.mjs --from <path to swagger-docs-schema.ts>",
    );
  }
  return { from: resolve(process.cwd(), argv[fromIndex + 1]) };
}

/** Map a PostgREST column format onto JSON Schema. */
function jsonSchemaFor(column) {
  if (column.enum) return { type: "string", enum: column.enum };

  const format = column.format ?? "";

  if (format === "text" || format === "character varying") return { type: "string" };
  if (format === "boolean") return { type: "boolean" };
  if (format === "integer" || format === "bigint" || format === "smallint") {
    return { type: "integer" };
  }
  if (format === "numeric" || format === "double precision" || format === "real") {
    return { type: "number" };
  }
  if (format === "date") return { type: "string", format: "date" };
  if (format.startsWith("timestamp")) return { type: "string", format: "date-time" };
  if (format === "uuid") return { type: "string", format: "uuid" };
  if (format === "json" || format === "jsonb") {
    return { type: "object", additionalProperties: true };
  }
  if (format.endsWith("[]")) return { type: "array", items: { type: "string" } };

  // Anything else (vectors, geometry, domain types) is not part of the public
  // contract. Dropping it is safer than guessing at a type.
  return null;
}

function main() {
  const { from } = parseArgs(process.argv.slice(2));

  const raw = readFileSync(from, "utf8")
    .replace(/^export default\s*/, "")
    .replace(/;\s*$/, "");
  // Trusted, build-time only: the file is Carbon's own generated object literal.
  const spec = (0, eval)(`(${raw})`);

  const schemas = {};

  for (const table of RESOURCES) {
    const definition = spec.definitions?.[table];
    if (!definition) throw new Error(`no definition for "${table}" in ${from}`);

    const properties = {};
    for (const [name, column] of Object.entries(definition.properties ?? {})) {
      if (INTERNAL_COLUMNS.has(name)) continue;
      const schema = jsonSchemaFor(column);
      if (!schema) continue;
      if (column.description) {
        schema.description = String(column.description).split("\n")[0];
      }
      properties[name] = schema;
    }

    schemas[table] = {
      type: "object",
      required: (definition.required ?? []).filter((name) => name in properties),
      properties,
    };
  }

  const header = [
    "// GENERATED FILE — do not edit by hand.",
    "//",
    "// Produced by `node scripts/generate-api-schemas.mjs --from <swagger-docs-schema.ts>`",
    "// from the Carbon REST API's own PostgREST schema. Re-run it after a",
    "// migration that changes one of these resources, and commit the result.",
    "",
    'import type { JsonSchema } from "./openapi-types";',
    "",
  ].join("\n");

  const body = `export const API_SCHEMAS = ${JSON.stringify(
    schemas,
    null,
    2,
  )} as const satisfies Record<string, JsonSchema>;\n`;

  writeFileSync(OUT, `${header}\n${body}`);
  console.log(`Wrote ${Object.keys(schemas).length} resource schemas to ${OUT}`);
}

main();
