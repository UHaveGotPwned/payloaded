import { defineCollection, reference } from "astro:content";
// Not the `z` re-exported by astro:content, which is deprecated in Astro 7.
import { z } from "zod";
import { glob } from "astro/loaders";
import { idFromPath } from "./lib/integrity";

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
  /** Runnable languages this article may fence, so the exception shows up in
   *  review. The always-safe set lives in tests/content/policy.test.ts. */
  codeBlocks: z.array(z.string()).default([]),
  /** Renders at the section root instead of behind a link, for sections that
   *  are one article rather than a list. It gets no slug page of its own, so
   *  the text still lives at exactly one URL. */
  overview: z.boolean().default(false),
});

/** Shared with the guard: two implementations would drift and duplicate
 *  detection would silently stop working. */
const markdown = (dir: string) =>
  glob({
    pattern: "**/*.{md,mdx}",
    base: `./src/content/${dir}`,
    generateId: ({ entry }) => idFromPath(entry),
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
