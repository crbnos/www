import { openApiDocument } from "~/lib/agent/openapi";
import { jsonDocument } from "~/lib/agent/response";

export const config = { runtime: "edge" };

/**
 * Well-known mirror of /openapi.json. Agents probe both locations; serving the
 * same document from each is cheaper than hoping they guess right.
 */
export function loader() {
  return jsonDocument(openApiDocument);
}
