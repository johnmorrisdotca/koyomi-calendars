// The pages: the demo and each doc, once in English and once in Japanese. A page is one language; the header's language picker goes to the same page in the other.
import { readFileSync } from "node:fs";
import { WORDS, type Lang } from "./words.ts";

interface Family {
  FAMILY_WORDS: Record<"en" | "ja", Record<string, string>>;
  FAMILY_SCRIPT: string;
  familyHead(o: { id: string; title: string; description: string }): string;
  familyHeader(o: { id: string; links?: Array<{ href: string; say: string }> }): string;
  familyFooter(o: { id: string }): string;
}
const family = (await import(new URL("./family-template.mjs", import.meta.url).href)) as Family;
export const id = "koyomi-calendars";

/** Puts each element's words in it, from the data-say it carries: the page is complete before any script runs. */
function filled(html: string, lang: Lang): string {
  const all = { ...family.FAMILY_WORDS[lang], ...WORDS[lang] } as Record<string, unknown>;
  return html.replace(/(<(\w+)[^>]*\sdata-say="(\w+)"[^>]*>)(<\/\2>)/g, (whole, open: string, _tag: string, key: string, close: string) => {
    const text = all[key];
    return typeof text === "string" ? `${open}${text}${close}` : whole;
  });
}

function scripts(lang: Lang, root: string, here: string, entry: string | null): string {
  return (
    `<script>${family.FAMILY_SCRIPT}</script>` +
    `<script>(function(){try{localStorage.setItem(${JSON.stringify(`${id}.page.lang`)},${JSON.stringify(lang)});}catch(e){}var q=new URLSearchParams(location.search);if(q.has("lang")){q.delete("lang");var s=q.toString();history.replaceState(null,"",location.pathname+(s?"?"+s:"")+location.hash);}})();` +
    `var familyLang=familyLanguage({id:${JSON.stringify(id)},words:${JSON.stringify({ en: WORDS.en, ja: WORDS.ja })}});` +
    `document.addEventListener("kazoku-languagechange",function(e){var l=e.detail.lang;if(l!==${JSON.stringify(lang)}&&(l==="en"||l==="ja")){location.href=${JSON.stringify(otherUrl(lang, root, here))}+location.search.replace(/[?&]lang=[a-z]+/,"")+location.hash;}});</script>` +
    `<script type="module">import "${root || "./"}kazoku-ui/language-picker/define.js"; import "${root || "./"}kazoku-ui/theme-switch/define.js";</script>` +
    (entry ? `<script type="module" src="${root}${entry}"></script>` : "")
  );
}

/** The address of the same page in the other language, from this one's. `here` is the path under the language's folder (`index.html`, `builder.html`). */
function otherUrl(lang: Lang, root: string, here: string): string {
  // `root` is the way up to the site's top from this page (the Japanese pages sit one folder down, in ja/).
  return lang === "ja" ? `${root}${here}` : `${root}ja/${here}`;
}

function shell(lang: Lang, root: string, here: string, title: string, description: string, links: Array<{ href: string; say: string }>, body: string, entry: string | null): string {
  const head = family.familyHead({ id, title, description });
  const page = `<!doctype html>\n<html lang="${lang}"><head>${head}<link rel="stylesheet" href="${root}family.css"><link rel="stylesheet" href="${root}koyomi.css"></head>\n<body><main>${family.familyHeader({ id, links })}\n${body}\n${family.familyFooter({ id })}</main>${scripts(lang, root, here, entry)}</body></html>\n`;
  return filled(page, lang);
}

/** A demo page. `sizeRows` is the table of bytes, made by the build. */
export function renderDemo(lang: Lang, sizeRows: string): string {
  const root = lang === "ja" ? "../" : "";
  const w = WORDS[lang];
  let body = readFileSync(new URL("../demo/index.html", import.meta.url), "utf8");
  body = body.slice(body.indexOf("<!--family:header-->") + "<!--family:header-->".length, body.indexOf("<!--family:footer-->"));
  body = body.replace("{{sizeRows}}", sizeRows).replace(/\{\{(\w+)\}\}/g, (whole, key: string) => (key in w && typeof (w as Record<string, unknown>)[key] === "string" ? ((w as unknown as Record<string, string>)[key] as string) : whole));
  const links = [{ href: "builder.html", say: "builderLink" }, { href: lang === "ja" ? "../docs/ja/index.html" : "docs/index.html", say: "docs" }];
  return shell(lang, root, "index.html", w.title, w.description, links, body, "demo.js");
}

/** The builder page: choose an icon or a month, see it, copy the code. */
export function renderBuilder(lang: Lang): string {
  const root = lang === "ja" ? "../" : "";
  const w = WORDS[lang];
  let body = readFileSync(new URL("../demo/builder.html", import.meta.url), "utf8");
  body = body.slice(body.indexOf("<!--family:header-->") + "<!--family:header-->".length, body.indexOf("<!--family:footer-->"));
  body = body.replace(/\{\{(\w+)\}\}/g, (whole, key: string) => (key in w && typeof (w as Record<string, unknown>)[key] === "string" ? ((w as unknown as Record<string, string>)[key] as string) : whole));
  const links = [{ href: "index.html", say: "demoLink" }, { href: lang === "ja" ? "../docs/ja/index.html" : "docs/index.html", say: "docs" }];
  return shell(lang, root, "builder.html", w.builderTitle, w.builderDescription, links, body, "builder.js");
}
