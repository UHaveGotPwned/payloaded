/** No `astro:content` imports on purpose: the collection config and the guard
 *  both need these, and tests get them without spinning up Astro. */

/** Ids stay flat so a URL never depends on where the file sits. */
export function idFromPath(relative: string): string {
  const segments = relative.replace(/\.mdx?$/, "").split("/");
  const name = segments.pop() ?? relative;
  return name === "index" ? (segments.pop() ?? name) : name;
}

export interface Clash {
  id: string;
  paths: string[];
}

/** Two files can collapse onto one id and the loader drops one silently. The
 *  file list is the only place to catch it: querying a collection is too late. */
export function findDuplicateIds(paths: string[]): Clash[] {
  const seen = new Map<string, string[]>();

  for (const path of paths) {
    const match = path.match(/^\/src\/content\/([^/]+)\/(.+)$/);
    if (!match) continue;
    const [, collection, relative] = match;
    const key = `${collection}/${idFromPath(relative)}`;
    seen.set(key, [...(seen.get(key) ?? []), path]);
  }

  return [...seen.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([id, paths]) => ({ id, paths }));
}

export interface TypeRefs {
  id: string;
  family: string;
  parent?: string;
  vectors: string[];
}

/** Astro 7 resolves references lazily: a broken one is a warning, not an error,
 *  and is silent when nothing reads it. This restores the build-time guarantee
 *  the taxonomy design assumes. */
export function findBrokenReferences(
  types: TypeRefs[],
  families: ReadonlySet<string>,
  vectors: ReadonlySet<string>,
): string[] {
  const byId = new Map(types.map((type) => [type.id, type]));
  const errors: string[] = [];

  for (const type of types) {
    if (!families.has(type.family)) {
      errors.push(`types/${type.id}: family "${type.family}" does not exist`);
    }

    if (type.parent !== undefined) {
      const parent = byId.get(type.parent);
      if (!parent) {
        errors.push(`types/${type.id}: parent "${type.parent}" does not exist`);
      } else if (parent.parent !== undefined) {
        errors.push(`types/${type.id}: parent "${parent.id}" is itself a subtype (max depth is 1)`);
      }
    }

    for (const vector of type.vectors) {
      if (!vectors.has(vector)) {
        errors.push(`types/${type.id}: vector "${vector}" does not exist`);
      }
    }
  }

  return errors;
}
