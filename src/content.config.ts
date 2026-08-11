import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

/** Adding a family means adding a YAML file, never editing this one. */
const families = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/families" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string().max(160),
    order: z.number().default(99),
    icon: z.string().optional(),
  }),
});

const entry = z.object({
  title: z.string(),
  summary: z.string().max(280),
  order: z.number().default(99),
  draft: z.boolean().default(false),
  sources: z.array(z.string()).default([]),
});

/** Subfolders group entries by family, but ids stay flat so a URL never depends
 *  on where the file sits: reclassifying a subtype must not break its links.
 *  `index.md` takes the name of its folder, any other file its own. */
const markdown = (dir: string) =>
  glob({
    pattern: "**/*.{md,mdx}",
    base: `./src/content/${dir}`,
    generateId: ({ entry }) => {
      const segments = entry.replace(/\.mdx?$/, "").split("/");
      const name = segments.pop() ?? entry;
      return name === "index" ? (segments.pop() ?? name) : name;
    },
  });

export const collections = {
  families,
  malware: defineCollection({ loader: markdown("malware"), schema: entry }),
  "attack-vectors": defineCollection({
    loader: markdown("attack-vectors"),
    schema: entry,
  }),
  indicators: defineCollection({
    loader: markdown("indicators"),
    // Enum, not a reference: ioa/ioc is a closed conceptual pair, not a list
    // that grows. Reference where the domain is open, enum where it is closed.
    schema: entry.extend({ kind: z.enum(["ioa", "ioc"]) }),
  }),
  types: defineCollection({
    loader: markdown("types"),
    schema: entry.extend({
      family: reference("families"),
      parent: reference("types").optional(),
      vectors: z.array(reference("attack-vectors")).default([]),
      notableCases: z.array(z.string()).default([]),
    }),
  }),
};
