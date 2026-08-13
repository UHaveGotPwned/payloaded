// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { remarkBaseLinks } from "./src/lib/remark-base-links";

const base = "/payloaded";

export default defineConfig({
  site: "https://uhavegotpwned.github.io",
  base,
  // Opt-in per file: .md and .mdx coexist in the same collection.
  integrations: [mdx()],
  // Lets articles link with plain "/types/ransomware": the plugin adds the base,
  // so a root-relative link in Markdown no longer 404s under the Pages subpath.
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base }]],
  },
});
