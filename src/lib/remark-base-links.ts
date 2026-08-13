import { visit } from "unist-util-visit";

/** Prefixes root-relative links and images written in Markdown with the site
 *  base, so authors can write `/types/ransomware` and never think about the
 *  GitHub Pages subpath. Doing it here rather than per file is what keeps the
 *  content portable: change `base` and every link follows. */
export function remarkBaseLinks({ base }: { base: string }) {
  // A trailing slash would turn `/types` into `//types`, which a browser reads
  // as a protocol-relative URL pointing at a host called "types".
  const prefix = base.replace(/\/$/, "");

  return (tree: unknown) => {
    visit(tree as never, ["link", "image"], (node: { url?: string }) => {
      if (typeof node.url !== "string") return;
      // Only root-relative ones: "//host" is protocol-relative, "#a" an anchor,
      // "http(s)://" and "mailto:" external, "./x" already relative.
      if (!node.url.startsWith("/") || node.url.startsWith("//")) return;
      if (prefix && node.url.startsWith(`${prefix}/`)) return;
      node.url = `${prefix}${node.url}`;
    });
  };
}
