import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** The content policy (spec §1) is the project's hardest rule, and reviewing it
 *  by eye will not survive migrating a whole thesis. */

const ROOT = "src/content";

function articles(dir = ROOT): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return articles(path);
    return /\.mdx?$/.test(name) ? [path] : [];
  });
}

const files = articles().map((path) => ({ path, text: readFileSync(path, "utf8") }));

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

  it.each(files)("$path uses no absolute internal links", ({ text }) => {
    // They would 404 under the GitHub Pages subpath.
    const body = text.split(/^---$/m).slice(2).join("---");
    expect(body).not.toMatch(/\]\(\//);
  });
});
