import { mcpManifest } from "~/lib/agent/mcp";
import { jsonDocument } from "~/lib/agent/response";

export const config = { runtime: "edge" };

/** The MCP server manifest. Mirrored at /mcp.json. */
export function loader() {
  return jsonDocument(mcpManifest);
}
