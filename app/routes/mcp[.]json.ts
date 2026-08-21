import { mcpManifest } from "~/lib/agent/mcp";
import { jsonDocument } from "~/lib/agent/response";

export const config = { runtime: "edge" };

/** Alias of /.well-known/mcp.json. */
export function loader() {
  return jsonDocument(mcpManifest);
}
