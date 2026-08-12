import { getCollection, type CollectionEntry } from "astro:content";
import { findBrokenReferences, findDuplicateIds } from "./integrity";

async function collectIntegrityErrors(): Promise<string[]> {
  const errors: string[] = [];

  const paths = Object.keys(import.meta.glob("/src/content/**/*.{md,mdx}", { eager: false }));
  for (const clash of findDuplicateIds(paths)) {
    errors.push(
      `Duplicate id "${clash.id}": ${clash.paths.join(", ")} collapse onto the same entry, and all but one would be dropped`,
    );
  }

  const [types, families, vectors] = await Promise.all([
    getCollection("types"),
    getCollection("families"),
    getCollection("attack-vectors"),
  ]);

  errors.push(
    ...findBrokenReferences(
      types.map((entry) => ({
        id: entry.id,
        family: entry.data.family.id,
        parent: entry.data.parent?.id,
        vectors: entry.data.vectors.map((vector) => vector.id),
      })),
      new Set(families.map((family) => family.id)),
      new Set(vectors.map((vector) => vector.id)),
    ),
  );

  return errors;
}

let checked = false;

export async function assertContentIntegrity(): Promise<void> {
  if (checked) return;
  const errors = await collectIntegrityErrors();
  if (errors.length > 0) {
    throw new Error(`Content integrity failed:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  }
  checked = true;
}

const visible = <T extends { data: { draft: boolean; order: number; title: string } }>(
  entries: T[],
): T[] =>
  entries
    .filter((entry) => !entry.data.draft)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));

export async function listEntries<C extends "malware" | "attack-vectors" | "indicators" | "types">(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  return visible(await getCollection(collection));
}

/** Returns null at zero: a status line advertising "0 casos" is noise. */
export function count(n: number, singular: string, plural = `${singular}s`): string | null {
  return n > 0 ? `${n} ${n === 1 ? singular : plural}` : null;
}

export async function listFamilies() {
  return (await getCollection("families")).sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name),
  );
}
