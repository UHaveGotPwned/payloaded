// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { remarkBaseLinks } from "./src/lib/remark-base-links";

const base = "/payloaded";

export default defineConfig({
  site: "https://uhavegotpwned.github.io",
  base,
  // Opt-in per file: .md and .mdx coexist in the same collection.
  // The root carries no language, so it hands over to the default one.
  redirects: { "/": "/payloaded/es" },
  integrations: [
    mdx(),
    // `i18n` is what makes the sitemap pair each page with its translation, so
    // the two languages rank as one document instead of competing.
    sitemap({
      i18n: { defaultLocale: "es", locales: { es: "es-ES", en: "en-US" } },
      filter: (page) => !page.endsWith("/search/"),
    }),
  ],
  // Lets articles link with plain "/es/types/ransomware": the plugin adds the
  // base, so a root-relative link in Markdown no longer 404s under the Pages
  // subpath.
  //
  // Astro 7 deprecates this in favour of `unified({...})` from
  // @astrojs/markdown-remark, but that form does not run the plugin: links come
  // out without the base and 404 in production, silently. Keeping the warning is
  // the safer trade until the replacement works.
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base }]],
  },
});
