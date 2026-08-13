import { describe, expect, it } from "vitest";
import {
  findBrokenReferences,
  findDuplicateIds,
  idFromPath,
  splitLocale,
} from "../../src/lib/integrity";

describe("idFromPath", () => {
  it("collapses index files to the name of their folder", () => {
    expect(idFromPath("es/ransomware/index.md")).toBe("es/ransomware");
  });

  it("flattens any other file, dropping the family folder", () => {
    expect(idFromPath("es/ransomware/leakware.md")).toBe("es/leakware");
  });

  it("treats .mdx exactly like .md", () => {
    expect(idFromPath("es/virus/index.mdx")).toBe("es/virus");
    expect(idFromPath("es/virus/resident-virus.mdx")).toBe("es/resident-virus");
  });

  it("leaves a file sitting directly under its locale alone", () => {
    expect(idFromPath("es/social-engineering.md")).toBe("es/social-engineering");
  });

  it("keeps the locale even when the entry is named after it", () => {
    expect(idFromPath("es/index.md")).toBe("es");
  });
});

describe("findDuplicateIds", () => {
  it("passes when every file resolves to its own id", () => {
    expect(
      findDuplicateIds([
        "/src/content/types/es/ransomware/index.md",
        "/src/content/types/es/ransomware/leakware.md",
        "/src/content/types/es/virus/index.md",
      ]),
    ).toEqual([]);
  });

  it("catches the same base name in two family folders", () => {
    const clashes = findDuplicateIds([
      "/src/content/types/es/ransomware/encryption.md",
      "/src/content/types/es/virus/encryption.md",
    ]);

    expect(clashes).toHaveLength(1);
    expect(clashes[0].id).toBe("types/es/encryption");
    expect(clashes[0].paths).toHaveLength(2);
  });

  it("catches the same entry offered as both .md and .mdx", () => {
    const clashes = findDuplicateIds([
      "/src/content/attack-vectors/es/phishing.md",
      "/src/content/attack-vectors/es/phishing.mdx",
    ]);

    expect(clashes).toHaveLength(1);
  });

  it("does not confuse the same id in different collections", () => {
    expect(
      findDuplicateIds([
        "/src/content/types/es/ransomware/index.md",
        "/src/content/malware/es/ransomware.md",
      ]),
    ).toEqual([]);
  });

  it("does not treat a translation as a duplicate of its original", () => {
    expect(
      findDuplicateIds([
        "/src/content/types/es/ransomware/index.md",
        "/src/content/types/en/ransomware/index.md",
      ]),
    ).toEqual([]);
  });
});

describe("findBrokenReferences", () => {
  const families = new Set(["es/ransomware", "es/virus", "en/ransomware"]);
  const vectors = new Set(["es/social-engineering", "en/social-engineering"]);

  const entry = (over: Partial<Parameters<typeof findBrokenReferences>[0][number]> = {}) => ({
    id: "es/ransomware",
    family: "es/ransomware",
    vectors: [],
    ...over,
  });

  it("passes on a sound taxonomy", () => {
    expect(
      findBrokenReferences(
        [
          entry(),
          entry({
            id: "es/leakware",
            parent: "es/ransomware",
            vectors: ["es/social-engineering"],
          }),
        ],
        families,
        vectors,
      ),
    ).toEqual([]);
  });

  it("passes on the same taxonomy in another language", () => {
    expect(
      findBrokenReferences(
        [
          entry({
            id: "en/ransomware",
            family: "en/ransomware",
            vectors: ["en/social-engineering"],
          }),
        ],
        families,
        vectors,
      ),
    ).toEqual([]);
  });

  it("catches a family that does not exist", () => {
    const errors = findBrokenReferences([entry({ family: "es/made-up" })], families, vectors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('family "es/made-up"');
  });

  it("catches a parent that does not exist", () => {
    const errors = findBrokenReferences(
      [entry({ id: "es/leakware", parent: "es/made-up" })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('parent "es/made-up"');
  });

  it("catches a vector that does not exist", () => {
    const errors = findBrokenReferences([entry({ vectors: ["es/made-up"] })], families, vectors);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('vector "es/made-up"');
  });

  it("catches a subtype whose parent is itself a subtype", () => {
    const errors = findBrokenReferences(
      [
        entry(),
        entry({ id: "es/leakware", parent: "es/ransomware" }),
        entry({ id: "es/deep", parent: "es/leakware" }),
      ],
      families,
      vectors,
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("max depth is 1");
  });

  it("catches an entry borrowing the family of another language", () => {
    const errors = findBrokenReferences(
      [entry({ id: "en/ransomware", family: "es/ransomware" })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("belongs to another language");
  });

  it("catches an entry borrowing a vector of another language", () => {
    const errors = findBrokenReferences(
      [entry({ vectors: ["en/social-engineering"] })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("belongs to another language");
  });

  it("reports every problem at once rather than stopping at the first", () => {
    const errors = findBrokenReferences(
      [entry({ family: "es/made-up", vectors: ["es/also-made-up"] })],
      families,
      vectors,
    );
    expect(errors).toHaveLength(2);
  });
});

describe("locale handling", () => {
  it("treats both languages identically, prefix included", () => {
    expect(idFromPath("es/ransomware/index.md")).toBe("es/ransomware");
    expect(idFromPath("en/ransomware/index.md")).toBe("en/ransomware");
  });

  it("keeps the locale on a subtype too", () => {
    expect(idFromPath("es/ransomware/leakware.md")).toBe("es/leakware");
    expect(idFromPath("en/ransomware/leakware.md")).toBe("en/leakware");
  });

  it("handles a flat collection in both languages", () => {
    expect(idFromPath("es/social-engineering.md")).toBe("es/social-engineering");
    expect(idFromPath("en/social-engineering.md")).toBe("en/social-engineering");
  });

  it("splits an id back into locale and shared slug", () => {
    expect(splitLocale("en/ransomware")).toEqual({ locale: "en", slug: "ransomware" });
    expect(splitLocale("es/ransomware")).toEqual({ locale: "es", slug: "ransomware" });
  });

  it("pairs a translation with its original through the slug", () => {
    expect(splitLocale("en/leakware").slug).toBe(splitLocale("es/leakware").slug);
  });

  it("falls back to the default language for an id with no prefix", () => {
    expect(splitLocale("ransomware")).toEqual({ locale: "es", slug: "ransomware" });
  });
});
