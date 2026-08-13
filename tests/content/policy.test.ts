import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOCALES, idFromPath, splitLocale } from "../../src/lib/integrity";

/** The content policy (spec §1) is the project's hardest rule, and reviewing it
 *  by eye will not survive migrating a whole thesis. */

const ROOT = "src/content";

/** A collection with no entries yet has no folder either: git cannot track an
 *  empty directory, so it never survives a clone. */
function articles(dir = ROOT): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return articles(path);
    return /\.mdx?$/.test(name) ? [path] : [];
  });
}

const files = articles().map((path) => ({ path, text: readFileSync(path, "utf8") }));

/** Every page the site serves, derived from the content rather than listed by
 *  hand so a new entry is reachable without touching this file. The id keeps
 *  the language at the front; the URL puts it before the collection instead. */
const ROUTES = new Set([
  ...LOCALES.flatMap((locale) => [`/${locale}`, `/${locale}/search`]),
  ...["malware", "types", "attack-vectors", "indicators"].flatMap((collection) => [
    ...LOCALES.map((locale) => `/${locale}/${collection}`),
    ...articles(join(ROOT, collection)).map((path) => {
      const id = idFromPath(path.slice(join(ROOT, collection).length + 1));
      const { locale, slug } = splitLocale(id);
      return `/${locale}/${collection}/${slug}`;
    }),
  ]),
]);

/** Read-only evidence: an analyst can study these, nobody can run them.
 *  Executable languages are declared per article via `codeBlocks`. */
const SAFE_LANGUAGES = new Set([
  "yara",
  "sigma",
  "snort",
  "text",
  "log",
  "json",
  "yaml",
  "ini",
  "asm",
  "nasm",
  "diff",
]);

/** Opening fences only: the closing delimiter carries no tag and would
 *  otherwise register as an untagged block. */
function fences(text: string): string[] {
  const opened: string[] = [];
  let inside = false;

  for (const line of text.split("\n")) {
    const match = line.match(/^```([a-z0-9+-]*)/i);
    if (!match) continue;
    if (inside) {
      inside = false;
      continue;
    }
    inside = true;
    opened.push(match[1].toLowerCase());
  }

  return opened;
}

function allowedLanguages(text: string): string[] {
  const frontmatter = text.split(/^---$/m)[1] ?? "";
  const block = frontmatter.match(/^codeBlocks:\s*\n((?:\s+-\s+.*\n)+)/m);
  if (block) return [...block[1].matchAll(/-\s+"?([^"\n]+)"?/g)].map((m) => m[1].trim());

  const inline = frontmatter.match(/^codeBlocks:\s*\[(.*)\]/m);
  return inline ? inline[1].split(",").map((s) => s.trim().replace(/^"|"$/g, "")) : [];
}

describe("content policy", () => {
  it("finds articles to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("$path keeps every URL defanged", ({ text }) => {
    expect(text).not.toMatch(/https?:\/\//);
  });

  it.each(files)("$path keeps every domain defanged", ({ text }) => {
    const domains = text.match(/\b[a-z0-9-]+\.(com|net|org|io|ru|cn)\b/gi) ?? [];
    expect(domains).toEqual([]);
  });

  it.each(files)("$path only uses IP ranges reserved for documentation", ({ text }) => {
    const ips = text.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) ?? [];
    const reserved = /^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/;
    expect(ips.filter((ip) => !reserved.test(ip))).toEqual([]);
  });

  it.each(files)("$path labels every code block with a language", ({ text }) => {
    // An untagged fence hides what it holds, so it can never be judged safe.
    expect(fences(text).filter((lang) => lang === "")).toEqual([]);
  });

  it.each(files)("$path only uses code blocks it is cleared for", ({ text }) => {
    const declared = new Set([...SAFE_LANGUAGES, ...allowedLanguages(text)]);
    expect(fences(text).filter((lang) => lang && !declared.has(lang))).toEqual([]);
  });

  // remarkBaseLinks adds the base, so "/types/virus" is now the way to write an
  // internal link. What it cannot do is invent a page that was never authored.
  it.each(files)("$path only links to entries that exist", ({ text }) => {
    const body = text.split(/^---$/m).slice(2).join("---");
    const links = [...body.matchAll(/\]\((\/[^)#\s]*)/g)].map((m) => m[1].replace(/\/$/, ""));
    expect(links.filter((link) => !ROUTES.has(link))).toEqual([]);
  });
});
