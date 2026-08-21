import { openApiDocument } from "~/lib/agent/openapi";
import { machineReadable } from "~/lib/agent/response";
import { toYaml } from "~/lib/agent/yaml";

export const config = { runtime: "edge" };

/** The same document as /openapi.json, for tooling that expects YAML. */
export function loader() {
  return machineReadable(toYaml(openApiDocument), "application/yaml; charset=utf-8");
}
