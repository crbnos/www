import type { MetaDescriptor } from "react-router";
import { describe, expect, it } from "vitest";
import { mergeMeta, pageMeta, TITLE_SUFFIX } from "./seo";

const ROOT_META: MetaDescriptor[] = [
  { tagName: "link", rel: "canonical", href: "https://carbon.ms/about" },
  { "script:ld+json": { "@type": "Organization" } },
  { title: "Carbon Manufacturing Systems" },
  { name: "description", content: "Site description" },
  { name: "robots", content: "index,follow" },
  { property: "og:site_name", content: "Carbon" },
  { property: "og:title", content: "Carbon Manufacturing Systems" },
  { property: "og:image", content: "https://carbon.ms/images/og.webp" },
];

const MATCHES = [{ id: "root", meta: ROOT_META }, { id: "routes/about" }];

function has(descriptors: MetaDescriptor[], predicate: (d: any) => boolean) {
  return descriptors.filter((descriptor) => predicate(descriptor));
}

describe("mergeMeta", () => {
  it("keeps root tags the page does not override", () => {
    const merged = mergeMeta(MATCHES, [{ title: "About Carbon" }]);
    expect(has(merged, (d) => "script:ld+json" in d)).toHaveLength(1);
    expect(has(merged, (d) => d.property === "og:image")).toHaveLength(1);
    expect(has(merged, (d) => d.rel === "canonical")).toHaveLength(1);
    expect(has(merged, (d) => d.name === "robots")).toHaveLength(1);
  });

  it("replaces rather than duplicating an overridden tag", () => {
    const merged = mergeMeta(MATCHES, [{ title: "About Carbon" }]);
    const titles = has(merged, (d) => "title" in d);
    expect(titles).toHaveLength(1);
    expect((titles[0] as { title: string }).title).toBe("About Carbon");
  });

  it("survives a missing root match", () => {
    expect(mergeMeta([undefined, null], [{ title: "x" }])).toEqual([
      { title: "x" },
    ]);
  });
});

describe("pageMeta", () => {
  it("keeps the title as written when it already names the product", () => {
    const merged = pageMeta(MATCHES, {
      title: "Carbon pricing",
      description: "d",
    });
    expect(has(merged, (d) => "title" in d)[0]).toEqual({
      title: "Carbon pricing",
    });
  });

  it("appends the product name when the title does not carry it", () => {
    const merged = pageMeta(MATCHES, { title: "Sub-processors", description: "d" });
    expect(has(merged, (d) => "title" in d)[0]).toEqual({
      title: `Sub-processors | ${TITLE_SUFFIX}`,
    });
  });

  it("keeps the social title and description in step with the page's", () => {
    const merged = pageMeta(MATCHES, {
      title: "Carbon developers",
      description: "The Carbon developer surface.",
    });

    for (const key of ["og:title", "og:description"]) {
      expect(has(merged, (d) => d.property === key), key).toHaveLength(1);
    }
    for (const key of ["twitter:title", "twitter:description"]) {
      expect(has(merged, (d) => d.name === key), key).toHaveLength(1);
    }
    expect(
      has(merged, (d) => d.property === "og:title")[0],
    ).toEqual({ property: "og:title", content: "Carbon developers" });
  });

  it("appends page-specific extras such as JSON-LD", () => {
    const merged = pageMeta(MATCHES, {
      title: "Carbon developers",
      description: "d",
      extra: [{ "script:ld+json": { "@type": "ItemList" } }],
    });
    expect(has(merged, (d) => "script:ld+json" in d)).toHaveLength(2);
  });
});
