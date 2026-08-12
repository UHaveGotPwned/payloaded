import { describe, expect, it } from "vitest";
import { findBrokenReferences, findDuplicateIds, idFromPath } from "../../src/lib/integrity";

describe("idFromPath", () => {
  it("collapses index files to the name of their folder", () => {
    expect(idFromPath("ransomware/index.md")).toBe("ransomware");
  });

  it("flattens any other file, dropping the folder", () => {
    expect(idFromPath("ransomware/leakware.md")).toBe("leakware");
  });

  it("treats .mdx exactly like .md", () => {
    expect(idFromPath("virus/index.mdx")).toBe("virus");
    expect(idFromPath("virus/resident-virus.mdx")).toBe("resident-virus");
  });

  it("leaves a file at the collection root alone", () => {
    expect(idFromPath("social-engineering.md")).toBe("social-engineering");
  });
});

describe("findDuplicateIds", () => {
  it("passes when every file resolves to its own id", () => {
    expect(
      findDuplicateIds([
        "/src/content/types/ransomware/index.md",
        "/src/content/types/ransomware/leakware.md",
        "/src/content/types/virus/index.md",
      ]),
    ).toEqual([]);
  });

  it("catches the same base name in two family folders", () => {
    const clashes = findDuplicateIds([
      "/src/content/types/ransomware/encryption.md",
      "/src/content/types/virus/encryption.md",
    ]);

    expect(clashes).toHaveLength(1);
    expect(clashes[0].id).toBe("types/encryption");
    expect(clashes[0].paths).toHaveLength(2);
  });

  it("catches the same entry offered as both .md and .mdx", () => {
    const clashes = findDuplicateIds([
      "/src/content/attack-vectors/phishing.md",
      "/src/content/attack-vectors/phishing.mdx",
    ]);

    expect(clashes).toHaveLength(1);
  });

  it("does not confuse the same id in different collections", () => {
    expect(
      findDuplicateIds([
        "/src/content/types/ransomware/index.md",
        "/src/content/malware/ransomware.md",
      ]),
    ).toEqual([]);
  });
});

describe("findBrokenReferences", () => {
  const families = new Set(["ransomware", "virus"]);
  const vectors = new Set(["social-engineering"]);

  const entry = (over: Partial<Parameters<typeof findBrokenReferences>[0][number]> = {}) => ({
    id: "ransomware",
    family: "ransomware",
    vectors: [],
    ...over,
  });

  it("passes on a sound taxonomy", () => {
    expect(
      findBrokenReferences(
        [entry(), entry({ id: "leakware", parent: "ransomware", vectors: ["social-engineering"] })],
        families,
        vectors,
      ),
    ).toEqual([]);
  });

  it("catches a family that does not exist", () => {
    const errors = findBrokenReferences([entry({ family: "made-up" })], families, vectors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('family "made-up"');
  });

  it("catches a parent that does not exist", () => {
    const errors = findBrokenReferences(
      [entry({ id: "leakware", parent: "made-up" })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('parent "made-up"');
  });

  it("catches a vector that does not exist", () => {
    const errors = findBrokenReferences([entry({ vectors: ["made-up"] })], families, vectors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('vector "made-up"');
  });

  it("catches a subtype whose parent is itself a subtype", () => {
    const errors = findBrokenReferences(
      [
        entry(),
        entry({ id: "leakware", parent: "ransomware" }),
        entry({ id: "deep", parent: "leakware" }),
      ],
      families,
      vectors,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("max depth is 1");
  });

  it("reports every problem at once rather than stopping at the first", () => {
    const errors = findBrokenReferences(
      [entry({ family: "made-up", vectors: ["also-made-up"] })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(2);
  });
});
