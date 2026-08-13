import type { Locale } from "./integrity";

/** Labels that belong to the article rather than the chrome. The Taskbar and
 *  window stay English by convention; these sit inside the prose, so they follow
 *  the language of the text around them. */
export const strings = {
  es: {
    name: "Español",
    switchTo: "Ver en español",
    subtypes: "Subtipos",
    vectors: "Vectores de entrada",
    cases: "Casos notables",
    sources: "Fuentes",
    subtypeOf: (parent: string) => `subtipo de ${parent}`,
    empty: "Todavía no hay entradas en esta sección.",
    notFound: "Esta página no existe.",
    backHome: "Volver al inicio",
    home: {
      welcome: "Bienvenido a",
      about: "Quiénes somos",
      description:
        "Enciclopedia estática y educativa sobre malware. Contenido conceptual y defensivo.",
      intro:
        "Enciclopedia estática y educativa sobre malware. Todo el contenido es conceptual y defensivo: describe qué hace cada familia y cómo se detecta o mitiga, nunca cómo construirla.",
      basedOn: "Basado en el TFM «NEMESIS: Análisis y estudio de Malware» (UCLM, 2025).",
      thesisAuthor: "Autor TFM",
      siteAuthor: "Autor Payloaded",
      fact: "enciclopedia de malware",
    },
    bar: {
      trigger: "buscar",
      label: "Buscar en la wiki",
      placeholder: "Escribe y pulsa Enter",
      /** El campo se queda en ~16 caracteres en móvil, y ahí no hay Enter:
       *  el teclado virtual ofrece su propio botón de búsqueda. */
      placeholderShort: "escribe…",
      close: "Cerrar la búsqueda",
    },
    search: {
      title: "Buscar · Payloaded",
      description: "Buscar en la wiki.",
      prompt: "Buscar",
      label: "Términos de búsqueda",
      placeholder: "ransomware, phishing, persistencia…",
      submit: "Buscar",
      idle: "Escribe algo para buscar.",
      running: "Buscando “{q}”…",
      none: "Sin resultados para “{q}”.",
      one: "1 resultado para “{q}”.",
      many: "{n} resultados para “{q}”.",
      failed: "No se pudo cargar el buscador.",
    },
    units: {
      subtype: ["subtipo", "subtipos"],
      vector: ["vector", "vectores"],
      case: ["caso", "casos"],
      source: ["fuente", "fuentes"],
      entry: ["entrada", "entradas"],
    },
  },
  en: {
    name: "English",
    switchTo: "Switch to English",
    subtypes: "Subtypes",
    vectors: "Entry vectors",
    cases: "Notable cases",
    sources: "Sources",
    subtypeOf: (parent: string) => `subtype of ${parent}`,
    empty: "No entries in this section yet.",
    notFound: "This page does not exist.",
    backHome: "Back to the home page",
    home: {
      welcome: "Welcome to",
      about: "About us",
      description: "A static, educational encyclopedia of malware. Conceptual, defensive content.",
      intro:
        "A static, educational encyclopedia of malware. Everything here is conceptual and defensive: it describes what each family does and how it is detected or mitigated, never how to build one.",
      basedOn:
        "Based on the master's thesis «NEMESIS: Análisis y estudio de Malware» (UCLM, 2025).",
      thesisAuthor: "Thesis author",
      siteAuthor: "Payloaded author",
      fact: "malware encyclopedia",
    },
    bar: {
      trigger: "search",
      label: "Search the wiki",
      placeholder: "type and press Enter",
      placeholderShort: "type…",
      close: "Close the search",
    },
    search: {
      title: "Search · Payloaded",
      description: "Search the wiki.",
      prompt: "Search",
      label: "Search terms",
      placeholder: "ransomware, phishing, persistence…",
      submit: "Search",
      idle: "Type something to search.",
      running: "Searching “{q}”…",
      none: "No results for “{q}”.",
      one: "1 result for “{q}”.",
      many: "{n} results for “{q}”.",
      failed: "The search index could not be loaded.",
    },
    units: {
      subtype: ["subtype", "subtypes"],
      vector: ["vector", "vectors"],
      case: ["case", "cases"],
      source: ["source", "sources"],
      entry: ["entry", "entries"],
    },
  },
} as const;

export type Strings = (typeof strings)[Locale];

/** "3 vectores" / "1 vector", or null at zero — a status line advertising
 *  "0 casos" is noise. */
export function count(n: number, unit: keyof Strings["units"], locale: Locale): string | null {
  if (n <= 0) return null;
  const [one, many] = strings[locale].units[unit];
  return `${n} ${n === 1 ? one : many}`;
}

/** Every URL carries its language, so there is no default-locale exception to
 *  remember anywhere. */
export function pathFor(base: string, locale: Locale, section = "", slug = ""): string {
  return [base, locale, section, slug].filter(Boolean).join("/");
}
