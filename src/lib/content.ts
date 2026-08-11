import { getCollection, getEntry, type CollectionEntry } from "astro:content";

/** Mirrors generateId in content.config.ts. If the two drift apart, duplicate
 *  detection silently stops working. */
function idFromPath(relative: string): string {
  const segments = relative.replace(/\.mdx?$/, "").split("/");
  const name = segments.pop() ?? relative;
  return name === "index" ? (segments.pop() ?? name) : name;
}

/** Flattened ids mean two files in different folders can collapse onto the same
 *  id, and the loader keeps only one — silently. getCollection cannot see this
 *  (the loser is already gone), so the file list is the only place to catch it. */
function assertNoDuplicateIds(): void {
  const files = import.meta.glob("/src/content/**/*.{md,mdx}", { eager: false });
  const seen = new Map<string, string[]>();

  for (const path of Object.keys(files)) {
    const match = path.match(/^\/src\/content\/([^/]+)\/(.+)$/);
    if (!match) continue;
    const [, collection, relative] = match;
    const key = `${collection}/${idFromPath(relative)}`;
    seen.set(key, [...(seen.get(key) ?? []), path]);
  }

  const clashes = [...seen.entries()].filter(([, paths]) => paths.length > 1);
  if (clashes.length > 0) {
    const detail = clashes
      .map(([id, paths]) => `  "${id}" <- ${paths.join(", ")}`)
      .join("\n");
    throw new Error(
      `Duplicate content ids. These files collapse onto the same id and all but one would be dropped:\n${detail}`,
    );
  }
}

/** Astro 7 resolves references lazily: a broken one is a warning, not an error,
 *  and is silent when nothing reads it. This restores the build-time guarantee
 *  the taxonomy design assumes. */
async function assertReferencesResolve(): Promise<void> {
  const types = await getCollection("types");
  const errors: string[] = [];

  for (const entry of types) {
    const family = await getEntry(entry.data.family);
    if (!family) errors.push(`types/${entry.id}: family "${entry.data.family.id}" does not exist`);

    if (entry.data.parent) {
      const parent = await getEntry(entry.data.parent);
      if (!parent) {
        errors.push(`types/${entry.id}: parent "${entry.data.parent.id}" does not exist`);
      } else if (parent.data.parent) {
        errors.push(
          `types/${entry.id}: parent "${parent.id}" is itself a subtype (max depth is 1)`,
        );
      }
    }

    for (const vector of entry.data.vectors) {
      const resolved = await getEntry(vector);
      if (!resolved) errors.push(`types/${entry.id}: vector "${vector.id}" does not exist`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Broken content references:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  }
}

let checked = false;

export async function assertContentIntegrity(): Promise<void> {
  if (checked) return;
  assertNoDuplicateIds();
  await assertReferencesResolve();
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
