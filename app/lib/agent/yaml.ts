/**
 * Minimal JSON-to-YAML serializer for the OpenAPI document.
 *
 * Every scalar is emitted as a YAML double-quoted string, whose escape rules are
 * JSON's — so `JSON.stringify` on a string is already a valid YAML scalar. That
 * sidesteps the whole class of YAML quoting bugs (a version like `1.0` read as a
 * float, a `yes` read as a boolean, a `:` inside an unquoted description ending
 * the mapping) without pulling in a YAML library for one route.
 */

type Json =
  | string
  | number
  | boolean
  | null
  | readonly Json[]
  | { readonly [key: string]: Json };

function scalar(value: string | number | boolean | null): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : JSON.stringify(String(value));
  }
  return JSON.stringify(value);
}

function isPlainObject(value: Json): value is { readonly [key: string]: Json } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function emit(value: Json, indent: number): string {
  const pad = "  ".repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((entry) => {
        if (isPlainObject(entry) || Array.isArray(entry)) {
          const nested = emit(entry, indent + 1);
          // The first line of a nested block sits on the dash itself.
          return `${pad}- ${nested.slice((indent + 1) * 2)}`;
        }
        return `${pad}- ${scalar(entry as string | number | boolean | null)}`;
      })
      .join("\n");
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).filter(
      ([, entry]) => entry !== undefined,
    );
    if (entries.length === 0) return "{}";

    return entries
      .map(([key, entry]) => {
        const name = JSON.stringify(key);
        if (Array.isArray(entry)) {
          return entry.length === 0
            ? `${pad}${name}: []`
            : `${pad}${name}:\n${emit(entry, indent + 1)}`;
        }
        if (isPlainObject(entry)) {
          return Object.keys(entry).length === 0
            ? `${pad}${name}: {}`
            : `${pad}${name}:\n${emit(entry, indent + 1)}`;
        }
        return `${pad}${name}: ${scalar(entry as string | number | boolean | null)}`;
      })
      .join("\n");
  }

  // Arrays and objects returned above; what is left is a scalar. `Array.isArray`
  // does not narrow a `readonly Json[]` out of the union, hence the assertion.
  return `${pad}${scalar(value as string | number | boolean | null)}`;
}

/** Serialize a JSON-compatible value as YAML. */
export function toYaml(value: unknown): string {
  return `${emit(JSON.parse(JSON.stringify(value)) as Json, 0)}\n`;
}
