// @ts-check
import { defineConfig } from 'astro/config';

// Pages serves this under a subpath, so every internal link must go through
// import.meta.env.BASE_URL; absolute "/" links 404 there.
export default defineConfig({
  site: 'https://uhavegotpwned.github.io',
  base: '/payloaded',
});
