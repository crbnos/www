/**
 * The OpenAPI 3.1 description of the Carbon REST API, served at
 * `/openapi.json`, `/openapi.yaml` and `/.well-known/openapi.json`.
 *
 * Scope: a curated set of resources, each one FULLY described — a unique
 * `operationId`, a real description, typed parameters and a response schema on
 * every operation, which is what makes the document usable as a function-calling
 * tool definition. The complete catalogue (700+ tables) is generated into the
 * reference at https://docs.carbon.ms/api-reference; a document that large is a
 * catalogue to search, not a spec an agent can load.
 *
 * The property schemas come from the API's own PostgREST schema by way of
 * `scripts/generate-api-schemas.mjs`, so the field names and types here are the
 * database's, not a transcription.
 */

import { API_SCHEMAS } from "./api-schemas.generated";
import type {
  JsonSchema,
  OpenApiDocument,
  Operation,
  Parameter,
  PathItem,
} from "./openapi-types";
import { DOCS_URL, MCP_URL, REST_URL, SITE_URL, SUPPORT_EMAIL } from "./site";

/** Bumped when the shape of the document changes, not when Carbon ships. */
export const OPENAPI_INFO_VERSION = "1.0.0";

type ResourceName = keyof typeof API_SCHEMAS;

type Resource = {
  /** Table name; also the path segment, since PostgREST paths are table names. */
  name: ResourceName;
  tag: string;
  /** Singular noun used in generated summaries: "a sales order". */
  singular: string;
  /** Plural noun used in generated summaries: "sales orders". */
  plural: string;
  description: string;
  /** Columns worth naming as query parameters. `id` is added automatically. */
  filters: readonly string[];
  /** A representative `id` value, used as the parameter example. */
  idExample: string;
};

const RESOURCES: readonly Resource[] = [
  {
    name: "item",
    tag: "Items",
    singular: "an item",
    plural: "items",
    description:
      "The master record every other module points at: parts, materials, tools, services, consumables and fixtures. `readableId` is the human part number; `id` is the stable key used by every relation.",
    filters: ["readableId", "type", "active", "revisionStatus", "companyId"],
    idExample: "itm_01hxy",
  },
  {
    name: "part",
    tag: "Items",
    singular: "a part",
    plural: "parts",
    description:
      "The part-specific record for an item of type `Part`. Shares its `id` with the item.",
    filters: ["approved", "companyId"],
    idExample: "itm_01hxy",
  },
  {
    name: "material",
    tag: "Items",
    singular: "a material",
    plural: "materials",
    description:
      "The material-specific record for an item of type `Material`, carrying substance, form, grade, dimension and finish.",
    filters: ["approved", "materialSubstanceId", "materialFormId", "companyId"],
    idExample: "itm_01hxy",
  },
  {
    name: "customer",
    tag: "Sales",
    singular: "a customer",
    plural: "customers",
    description:
      "Companies you sell to. Quotes, sales orders and sales invoices all reference `customer.id`.",
    filters: ["readableId", "name", "customerTypeId", "customerStatusId", "companyId"],
    idExample: "cus_01hxy",
  },
  {
    name: "supplier",
    tag: "Purchasing",
    singular: "a supplier",
    plural: "suppliers",
    description:
      "Companies you buy from. Purchase orders, receipts and supplier quotes reference `supplier.id`.",
    filters: ["readableId", "name", "supplierTypeId", "supplierStatus", "companyId"],
    idExample: "sup_01hxy",
  },
  {
    name: "salesOrder",
    tag: "Sales",
    singular: "a sales order",
    plural: "sales orders",
    description:
      "A confirmed customer order. `salesOrderId` is the document number a customer would quote back at you; `status` drives fulfilment.",
    filters: ["salesOrderId", "status", "customerId", "orderDate", "locationId", "companyId"],
    idExample: "so_01hxy",
  },
  {
    name: "salesOrderLine",
    tag: "Sales",
    singular: "a sales order line",
    plural: "sales order lines",
    description:
      "One line of a sales order: what was ordered, how much, at what price, and how much of it has shipped and been invoiced.",
    filters: ["salesOrderId", "itemId", "status", "companyId"],
    idExample: "sol_01hxy",
  },
  {
    name: "purchaseOrder",
    tag: "Purchasing",
    singular: "a purchase order",
    plural: "purchase orders",
    description:
      "An order placed with a supplier. `purchaseOrderType` separates a normal purchase from a return or outside processing.",
    filters: ["purchaseOrderId", "status", "supplierId", "orderDate", "purchaseOrderType", "companyId"],
    idExample: "po_01hxy",
  },
  {
    name: "purchaseOrderLine",
    tag: "Purchasing",
    singular: "a purchase order line",
    plural: "purchase order lines",
    description:
      "One line of a purchase order, including the purchase unit of measure and the conversion factor back to the inventory unit.",
    filters: ["purchaseOrderId", "itemId", "jobId", "companyId"],
    idExample: "pol_01hxy",
  },
  {
    name: "quote",
    tag: "Sales",
    singular: "a quote",
    plural: "quotes",
    description:
      "A priced offer to a customer. A quote that is accepted becomes a sales order; `status` records where it got to.",
    filters: ["quoteId", "status", "customerId", "expirationDate", "companyId"],
    idExample: "quo_01hxy",
  },
  {
    name: "quoteLine",
    tag: "Sales",
    singular: "a quote line",
    plural: "quote lines",
    description:
      "One line of a quote, including the quantity breaks and the method used to price it.",
    filters: ["quoteId", "itemId", "status", "companyId"],
    idExample: "qln_01hxy",
  },
  {
    name: "job",
    tag: "Production",
    singular: "a job",
    plural: "jobs",
    description:
      "A production order: what is being made, how many, by when, and how far along it is. Jobs carry the operations and materials the shop floor reports against.",
    filters: ["jobId", "status", "itemId", "locationId", "dueDate", "customerId", "companyId"],
    idExample: "job_01hxy",
  },
  {
    name: "employee",
    tag: "People",
    singular: "an employee",
    plural: "employees",
    description:
      "A person with access to a company in Carbon, and the employee type that grants their permissions.",
    filters: ["employeeTypeId", "active", "companyId"],
    idExample: "usr_01hxy",
  },
];

const TAGS = [
  {
    name: "Items",
    description:
      "Parts, materials, tools, services, consumables and fixtures — the master data everything else references.",
  },
  {
    name: "Sales",
    description: "Customers, quotes, sales orders and their lines.",
  },
  {
    name: "Purchasing",
    description: "Suppliers, purchase orders and their lines.",
  },
  { name: "Production", description: "Jobs and the work that fulfils them." },
  { name: "People", description: "Employees and their access." },
];

function pascal(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * PostgREST filters are `?column=op.value` — `eq.`, `gt.`, `in.(a,b)`, `like.`
 * and so on. Every filter parameter carries that syntax in its description,
 * because a model that does not know it will send `?status=Draft` and silently
 * get everything back.
 */
function filterParameter(
  resource: Resource,
  column: string,
  schema: JsonSchema,
): Parameter {
  const values = schema.enum
    ? ` One of: ${schema.enum.map((value) => `\`${value}\``).join(", ")}.`
    : "";

  const example =
    column === "id"
      ? `eq.${resource.idExample}`
      : schema.enum
        ? `eq.${schema.enum[0]}`
        : schema.type === "boolean"
          ? "is.true"
          : "eq.value";

  return {
    name: column,
    in: "query",
    description: `Filter on \`${column}\`. Takes a PostgREST operator prefix, e.g. \`eq.\`, \`neq.\`, \`gt.\`, \`gte.\`, \`lt.\`, \`lte.\`, \`like.\`, \`ilike.\`, \`in.(a,b)\`, \`is.null\`.${values}`,
    required: false,
    schema: { type: "string" },
    example,
  };
}

/** The columns a resource can be filtered on, `id` first. */
function filterColumns(resource: Resource): string[] {
  return ["id", ...resource.filters];
}

/**
 * Filter parameters live in `components.parameters` and are referenced from the
 * three operations that use them. Inlining them instead put the same paragraph
 * in the document three times per column — 40% of the bytes an agent has to
 * read before it can call anything.
 */
function filterParameterComponents(): Record<string, Parameter> {
  const components: Record<string, Parameter> = {};

  for (const resource of RESOURCES) {
    const properties = (API_SCHEMAS[resource.name] as JsonSchema).properties ?? {};

    for (const column of filterColumns(resource)) {
      const property = properties[column];
      if (!property) {
        // The generated schemas are the source of truth for column names, so a
        // filter naming a column that no longer exists is a bug in RESOURCES —
        // and one that would publish an un-callable parameter.
        throw new Error(
          `openapi: "${resource.name}" has no column "${column}" to filter on`,
        );
      }
      components[`${resource.name}.${column}`] = filterParameter(
        resource,
        column,
        property,
      );
    }
  }

  return components;
}

function filterParameters(resource: Resource): { $ref: string }[] {
  return filterColumns(resource).map((column) => ({
    $ref: `#/components/parameters/${resource.name}.${column}`,
  }));
}

const REF = {
  select: { $ref: "#/components/parameters/select" },
  order: { $ref: "#/components/parameters/order" },
  limit: { $ref: "#/components/parameters/limit" },
  offset: { $ref: "#/components/parameters/offset" },
  prefer: { $ref: "#/components/parameters/prefer" },
  badRequest: { $ref: "#/components/responses/BadRequest" },
  unauthorized: { $ref: "#/components/responses/Unauthorized" },
  forbidden: { $ref: "#/components/responses/Forbidden" },
  tooManyRequests: { $ref: "#/components/responses/TooManyRequests" },
} as const;

const ERROR_RESPONSES = {
  "400": REF.badRequest,
  "401": REF.unauthorized,
  "403": REF.forbidden,
  "429": REF.tooManyRequests,
} as const;

function resourceRef(resource: Resource): JsonSchema {
  return { $ref: `#/components/schemas/${resource.name}` };
}

function listOperation(resource: Resource): Operation {
  return {
    operationId: `list${pascal(resource.name)}`,
    summary: `List ${resource.plural}`,
    description: `Return ${resource.plural} for the company the API key belongs to. ${resource.description} Results are filtered by row-level security, so a key only ever sees rows its scopes allow. Use \`select\` to narrow the columns, \`order\` to sort, and \`limit\`/\`offset\` to page.`,
    tags: [resource.tag],
    parameters: [
      REF.select,
      REF.order,
      REF.limit,
      REF.offset,
      ...filterParameters(resource),
    ],
    responses: {
      "200": {
        description: `Matching ${resource.plural}.`,
        headers: {
          "Content-Range": {
            description:
              "The rows returned and, when `Prefer: count=exact` was sent, the total — e.g. `0-24/1103`.",
            schema: { type: "string" },
          },
        },
        content: {
          "application/json": {
            schema: { type: "array", items: resourceRef(resource) },
          },
        },
      },
      "206": {
        description:
          "A page of results, when the request asked for a range smaller than the result set.",
        content: {
          "application/json": {
            schema: { type: "array", items: resourceRef(resource) },
          },
        },
      },
      ...ERROR_RESPONSES,
    },
  };
}

function createOperation(resource: Resource): Operation {
  return {
    operationId: `create${pascal(resource.name)}`,
    summary: `Create ${resource.singular}`,
    description: `Insert ${resource.singular}. ${resource.description} \`companyId\` is taken from the API key and must not be sent. Send \`Prefer: return=representation\` to get the created row back instead of an empty body. An array body inserts several rows in one statement.`,
    tags: [resource.tag],
    parameters: [REF.prefer, REF.select],
    requestBody: {
      description: `The ${resource.singular.replace(/^an? /, "")} to create, or an array of them.`,
      required: true,
      content: {
        "application/json": {
          schema: {
            oneOf: [
              resourceRef(resource),
              { type: "array", items: resourceRef(resource) },
            ],
          },
        },
      },
    },
    responses: {
      "201": {
        description: `Created. The body is empty unless \`Prefer: return=representation\` was sent.`,
        content: {
          "application/json": {
            schema: { type: "array", items: resourceRef(resource) },
          },
        },
      },
      ...ERROR_RESPONSES,
      "409": {
        description:
          "The insert violated a unique or foreign-key constraint — most often a duplicate readable id, or a reference to a row in another company.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
    },
  };
}

function updateOperation(resource: Resource): Operation {
  return {
    operationId: `update${pascal(resource.name)}`,
    summary: `Update ${resource.plural}`,
    description: `Patch every row matching the query. ${resource.description} A filter is REQUIRED: an unfiltered PATCH would rewrite every row the key can reach. Send \`Prefer: return=representation\` to get the updated rows back.`,
    tags: [resource.tag],
    parameters: [REF.prefer, REF.select, ...filterParameters(resource)],
    requestBody: {
      description: "The columns to change. Omitted columns are left alone.",
      required: true,
      content: { "application/json": { schema: resourceRef(resource) } },
    },
    responses: {
      "200": {
        description: "Updated rows, when `Prefer: return=representation` was sent.",
        content: {
          "application/json": {
            schema: { type: "array", items: resourceRef(resource) },
          },
        },
      },
      "204": { description: "Updated. No body." },
      ...ERROR_RESPONSES,
    },
  };
}

function deleteOperation(resource: Resource): Operation {
  return {
    operationId: `delete${pascal(resource.name)}`,
    summary: `Delete ${resource.plural}`,
    description: `Delete every row matching the query. ${resource.description} A filter is REQUIRED. Rows referenced by other records may be refused by a foreign-key constraint rather than cascading.`,
    tags: [resource.tag],
    parameters: [REF.prefer, ...filterParameters(resource)],
    responses: {
      "200": {
        description: "Deleted rows, when `Prefer: return=representation` was sent.",
        content: {
          "application/json": {
            schema: { type: "array", items: resourceRef(resource) },
          },
        },
      },
      "204": { description: "Deleted. No body." },
      ...ERROR_RESPONSES,
      "409": {
        description:
          "The row is referenced by another record and cannot be deleted.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
    },
  };
}

function pathsForResources(): Record<string, PathItem> {
  const paths: Record<string, PathItem> = {};

  for (const resource of RESOURCES) {
    paths[`/${resource.name}`] = {
      get: listOperation(resource),
      post: createOperation(resource),
      patch: updateOperation(resource),
      delete: deleteOperation(resource),
    };
  }

  return paths;
}

const COMMON_PARAMETERS = {
  select: {
    name: "select",
    in: "query",
    description:
      "Columns to return, comma separated — e.g. `id,readableId,name`. Related rows can be embedded by naming the relation: `select=id,salesOrderLine(id,itemId)`. Defaults to every column.",
    required: false,
    schema: { type: "string" },
    example: "id,readableId,name",
  },
  order: {
    name: "order",
    in: "query",
    description:
      "Sort order, comma separated — e.g. `createdAt.desc`, `name.asc.nullslast`.",
    required: false,
    schema: { type: "string" },
    example: "createdAt.desc",
  },
  limit: {
    name: "limit",
    in: "query",
    description: "Maximum rows to return.",
    required: false,
    schema: { type: "integer", minimum: 1, default: 100 },
    example: 50,
  },
  offset: {
    name: "offset",
    in: "query",
    description: "Rows to skip before returning results.",
    required: false,
    schema: { type: "integer", minimum: 0, default: 0 },
    example: 0,
  },
  prefer: {
    name: "Prefer",
    in: "header",
    description:
      "PostgREST response preferences. `return=representation` returns the affected rows, `return=minimal` returns none, `count=exact` puts a total in `Content-Range`, `resolution=merge-duplicates` upserts.",
    required: false,
    schema: { type: "string" },
    example: "return=representation",
  },
} as const;

const ERROR_SCHEMA: JsonSchema = {
  type: "object",
  description: "The error body every failed request returns.",
  properties: {
    message: { type: "string", description: "What went wrong." },
    details: { type: "string", description: "The underlying database detail, when there is one." },
    hint: { type: "string", description: "A suggested fix, when there is one." },
    code: { type: "string", description: "The PostgreSQL or PostgREST error code." },
  },
};

function errorResponse(description: string) {
  return {
    description,
    content: {
      "application/json": { schema: { $ref: "#/components/schemas/Error" } },
    },
  };
}

/** Build the document. Throws if a resource references a column that is gone. */
export function buildOpenApiDocument(): OpenApiDocument {
  return {
    openapi: "3.1.0",
    info: {
      title: "Carbon REST API",
      version: OPENAPI_INFO_VERSION,
      summary:
        "Programmatic read and write access to Carbon, the API-first operating system for manufacturing.",
      description: [
        "Carbon exposes every module — items, sales, purchasing, production, inventory, quality and accounting — over one REST API. This document describes the core resources in full; the complete catalogue of every table Carbon publishes is generated into the reference at " +
          `${DOCS_URL}/api-reference.`,
        "",
        "**Authentication.** Create a scoped API key in Settings → API Keys and send it as `Authorization: Bearer <api-key>`, or in the `carbon-key` header. A key belongs to one company and carries an explicit set of module permissions; row-level security in the database — not just the application — confines every request to that scope.",
        "",
        "**Rate limiting.** Every key allows 60 requests per minute. The limit is platform-controlled, not configurable per key. A refused request returns `429` with `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` and `Retry-After` — wait out `Retry-After` rather than retrying immediately.",
        "",
        "**Querying.** The API is PostgREST-shaped: filter with `?column=eq.value`, choose columns with `select`, sort with `order`, page with `limit`/`offset`, and embed relations inside `select`. There are no `/{id}` paths — address a single row with `?id=eq.<id>`.",
        "",
        `**Agents.** Carbon also speaks the Model Context Protocol over Streamable HTTP at ${MCP_URL}, with the manifest at ${SITE_URL}/.well-known/mcp.json.`,
      ].join("\n"),
      termsOfService: `${SITE_URL}/terms`,
      contact: {
        name: "Carbon support",
        email: SUPPORT_EMAIL,
        url: `${SITE_URL}/contact`,
      },
      license: {
        name: "Carbon source-available license",
        url: "https://github.com/crbnos/carbon/blob/main/LICENSE",
      },
    },
    externalDocs: {
      description: "Carbon documentation and the full API reference",
      url: `${DOCS_URL}/api-reference`,
    },
    servers: [{ url: REST_URL, description: "Carbon hosted REST API" }],
    security: [{ bearerAuth: [] }, { carbonKey: [] }],
    tags: TAGS,
    paths: pathsForResources(),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description:
            "A Carbon API key (`crbn_…`) sent as a bearer token. Create one in Settings → API Keys.",
        },
        carbonKey: {
          type: "apiKey",
          in: "header",
          name: "carbon-key",
          description:
            "The same API key sent in a dedicated header. Equivalent to `bearerAuth`; use whichever your client makes easier.",
        },
      },
      parameters: { ...COMMON_PARAMETERS, ...filterParameterComponents() },
      schemas: { ...API_SCHEMAS, Error: ERROR_SCHEMA },
      responses: {
        BadRequest: errorResponse(
          "The request could not be parsed — usually a malformed filter, an unknown column in `select`, or a body that does not match the resource.",
        ),
        Unauthorized: errorResponse(
          "No API key, or a key that does not resolve — expired, deleted, or belonging to another company.",
        ),
        Forbidden: errorResponse(
          "The key resolved but its scopes do not permit this action on this resource.",
        ),
        TooManyRequests: errorResponse(
          "The key exceeded its allowance of 60 requests per minute. `Retry-After` and the `X-RateLimit-*` headers say when to try again.",
        ),
      },
    },
  };
}

export const openApiDocument = buildOpenApiDocument();
