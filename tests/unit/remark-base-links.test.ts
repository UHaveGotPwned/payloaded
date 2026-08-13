import { describe, expect, it } from "vitest";
import { remarkBaseLinks } from "../../src/lib/remark-base-links";

/** Minimal mdast: the plugin only ever reads `type` and `url`. */
function rewrite(urls: string[], base = "/payloaded"): string[] {
  const nodes = urls.map((url) => ({ type: "link", url }));
  const tree = { type: "root", children: nodes };
  remarkBaseLinks({ base })(tree);
  return nodes.map((node) => node.url);
}

describe("remarkBaseLinks", () => {
  it("prefixes a root-relative link", () => {
    expect(rewrite(["/types/ransomware"])).toEqual(["/payloaded/types/ransomware"]);
  });

  it("leaves external links alone", () => {
    expect(rewrite(["https://example.org", "mailto:a@b.c"])).toEqual([
      "https://example.org",
      "mailto:a@b.c",
    ]);
  });

  it("leaves protocol-relative URLs alone", () => {
    expect(rewrite(["//cdn.example.org/x.png"])).toEqual(["//cdn.example.org/x.png"]);
  });

  it("leaves anchors and relative paths alone", () => {
    expect(rewrite(["#fuentes", "./sibling", "../up"])).toEqual(["#fuentes", "./sibling", "../up"]);
  });

  it("does not prefix twice when the base is already there", () => {
    expect(rewrite(["/payloaded/types/virus"])).toEqual(["/payloaded/types/virus"]);
  });

  it("produces a single slash when the site sits at the root", () => {
    expect(rewrite(["/types/virus"], "/")).toEqual(["/types/virus"]);
  });

  it("rewrites images too", () => {
    const node = { type: "image", url: "/diagram.png" };
    remarkBaseLinks({ base: "/payloaded" })({ type: "root", children: [node] });
    expect(node.url).toBe("/payloaded/diagram.png");
  });
});
