/**
 * Structural types for the OpenAPI 3.1 document served at /openapi.json.
 *
 * Deliberately narrow: enough to catch a typo in a `$ref` or a missing
 * `operationId` at compile time, without vendoring a full OpenAPI type package
 * for one document. Everything is readonly so the generated schemas (`as const`)
 * assign cleanly.
 */

export type JsonSchema = {
  readonly type?: string;
  readonly format?: string;
  readonly description?: string;
  readonly enum?: readonly string[];
  readonly items?: JsonSchema;
  readonly properties?: Readonly<Record<string, JsonSchema>>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean | JsonSchema;
  readonly example?: unknown;
  readonly default?: unknown;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly $ref?: string;
  readonly oneOf?: readonly JsonSchema[];
};

export type Parameter = {
  readonly name: string;
  readonly in: "query" | "header" | "path" | "cookie";
  readonly description: string;
  readonly required?: boolean;
  readonly schema: JsonSchema;
  readonly example?: unknown;
};

export type MediaTypeObject = {
  readonly schema: JsonSchema;
  readonly example?: unknown;
};

export type HeaderObject = {
  readonly description: string;
  readonly schema: JsonSchema;
  readonly example?: unknown;
};

export type ResponseObject = {
  readonly description: string;
  readonly headers?: Readonly<Record<string, HeaderObject | { readonly $ref: string }>>;
  readonly content?: Readonly<Record<string, MediaTypeObject>>;
};

export type RequestBodyObject = {
  readonly description: string;
  readonly required: boolean;
  readonly content: Readonly<Record<string, MediaTypeObject>>;
};

export type Operation = {
  /** Unique across the document — this is the name a function-calling model uses. */
  readonly operationId: string;
  readonly summary: string;
  readonly description: string;
  readonly tags: readonly string[];
  /**
   * Always stated, never left to the OpenAPI default, so deprecating an
   * operation is a visible one-field diff.
   */
  readonly deprecated: boolean;
  /** RFC 3339 full-date the operation was deprecated. Required when `deprecated`. */
  readonly "x-deprecated-at"?: string;
  /** RFC 3339 full-date on or after which a deprecated operation may be removed. */
  readonly "x-sunset"?: string;
  readonly parameters?: readonly (Parameter | { readonly $ref: string })[];
  readonly requestBody?: RequestBodyObject;
  readonly responses: Readonly<Record<string, ResponseObject | { readonly $ref: string }>>;
};

export type PathItem = Readonly<
  Partial<Record<"get" | "post" | "patch" | "delete" | "put", Operation>>
>;

export type OpenApiDocument = {
  readonly openapi: string;
  readonly info: Record<string, unknown>;
  readonly externalDocs?: { readonly description: string; readonly url: string };
  readonly servers: readonly { readonly url: string; readonly description: string }[];
  readonly security: readonly Readonly<Record<string, readonly string[]>>[];
  readonly tags: readonly { readonly name: string; readonly description: string }[];
  readonly paths: Readonly<Record<string, PathItem>>;
  readonly components: Record<string, unknown>;
};
