import { openApiDocument } from "~/lib/agent/openapi";
import { jsonDocument } from "~/lib/agent/response";

export const config = { runtime: "edge" };

/**
 * The OpenAPI 3.1 description of the Carbon REST API. Also served as YAML at
 * /openapi.yaml and mirrored at /.well-known/openapi.json.
 */
export function loader() {
  return jsonDocument(openApiDocument);
}
