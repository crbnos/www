import { parse } from "yaml";
import { describe, expect, it } from "vitest";
import { toYaml } from "./yaml";

/** Values that break a naive YAML emitter. */
const TRICKY = {
  version: "1.0",
  yes: "no",
  colon: "key: value, and a # hash",
  multiline: "first line\nsecond line",
  quoted: 'he said "hi"',
  tab: "a\tb",
  emptyString: "",
  nullish: null,
  zero: 0,
  negative: -1.5,
  truthy: true,
  emptyArray: [],
  emptyObject: {},
  nested: { list: [{ a: 1, b: ["x", "y"] }, { a: 2, b: [] }] },
  unicode: "µm ± 0.05 — dash",
};

describe("toYaml", () => {
  it("round-trips every scalar shape a spec can contain", () => {
    expect(parse(toYaml(TRICKY))).toEqual(TRICKY);
  });

  it("does not let a version string become a number", () => {
    expect(parse(toYaml({ version: "3.10" })).version).toBe("3.10");
  });

  it("does not let `no` become a boolean", () => {
    expect(parse(toYaml({ answer: "no" })).answer).toBe("no");
  });

  it("handles a top-level array", () => {
    expect(parse(toYaml([1, "two", { three: true }]))).toEqual([
      1,
      "two",
      { three: true },
    ]);
  });

  it("ends with a newline", () => {
    expect(toYaml({ a: 1 }).endsWith("\n")).toBe(true);
  });
});
