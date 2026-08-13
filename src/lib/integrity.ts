/** No `astro:content` imports on purpose: the collection config and the guard
 *  both need these, and tests get them without spinning up Astro. */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Shown when no language is asked for. Everything else about the two is
 *  symmetric: same folders, same ids, same URLs. */
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Every entry lives under its language, so the locale always leads the id.
 *  Below that, ids stay flat: `index` takes the name of its folder, any other
 *  file its own, and a URL never depends on where the file sits. */
export function idFromPath(relative: string): string {
  const segments = relative.replace(/\.mdx?$/, "").split("/");
  const locale = segments.shift() ?? "";
  const name = segments.pop() ?? locale;
  const flat = name === "index" ? (segments.pop() ?? locale) : name;
  return segments.length === 0 && flat === locale ? locale : `${locale}/${flat}`;
}

/** Splits an id into its language and the slug shared across translations —
 *  the pairing the language toggle needs. */
export function splitLocale(id: string): { locale: Locale; slug: string } {
  const [head, ...rest] = id.split("/");
  return isLocale(head) && rest.length > 0
    ? { locale: head, slug: rest.join("/") }
    : { locale: DEFAULT_LOCALE, slug: id };
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
    const { locale } = splitLocale(type.id);

    // A reference into another language resolves fine and builds green, but
    // renders that language's labels mid-article. Only this check catches it.
    const check = (kind: string, ref: string, exists: boolean) => {
      if (!exists) {
        errors.push(`types/${type.id}: ${kind} "${ref}" does not exist`);
      } else if (splitLocale(ref).locale !== locale) {
        errors.push(`types/${type.id}: ${kind} "${ref}" belongs to another language`);
      }
    };

    check("family", type.family, families.has(type.family));

    if (type.parent !== undefined) {
      const parent = byId.get(type.parent);
      check("parent", type.parent, parent !== undefined);
      if (parent?.parent !== undefined) {
        errors.push(`types/${type.id}: parent "${parent.id}" is itself a subtype (max depth is 1)`);
      }
    }

    for (const vector of type.vectors) {
      check("vector", vector, vectors.has(vector));
    }
  }

  return errors;
}
