// The text that puts a calendar in a page, for each way a page is made. The package draws SVG text, so every way ends in the same call: an import and `calendarIcon(...)` (or `monthCalendar(...)`).
// The demo's two "Copy the code" panels (the stage and the builder) share this file; the tests run each snippet's call and compare its drawing with the package's own.
import { embedSnippet } from "@johnmorrisdotca/kazoku-ui/embed-panel";

declare const __KOYOMI_VERSION__: string | undefined;

const PACKAGE = "@johnmorrisdotca/koyomi-calendars";
const SITE = "https://johnmorrisdotca.github.io/koyomi-calendars/";
const cdn = (): string => `https://cdn.jsdelivr.net/npm/${PACKAGE}@${typeof __KOYOMI_VERSION__ === "string" ? __KOYOMI_VERSION__ : "latest"}`;

/** What to draw: the function, the import it comes from (a sub-path after the package's name, or none) and the call. */
export interface Draw {
  name: "calendarIcon" | "monthCalendar";
  sub: string;
  call: string;
  /** The name of the component in the framework tabs. */
  part: string;
}

/** The choices that make an icon, as the demo and the builder hold them. */
export interface IconChoice {
  theme: string;
  year: number;
  month: number;
  day: number;
  scheme: "light" | "dark";
  size: number;
  locale?: "ja";
  housing?: "circle";
  rings?: boolean;
  turn?: number;
}

/** The size the package draws at when `size` is left out. */
export const DEFAULT_ICON_SIZE = 96;

/** The call for an icon. `alone` imports the one design's own file, a few kilobytes, instead of the whole package. */
export function iconDraw(c: IconChoice, alone: boolean): Draw {
  const extra = [c.locale ? `locale: "ja"` : "", c.housing ? `housing: "circle"` : "", c.rings ? "rings: true" : "", c.turn ? `turn: ${c.turn}` : "", c.size !== DEFAULT_ICON_SIZE ? `size: ${c.size}` : ""].filter(Boolean);
  const args = [`month: ${c.month}`, `day: ${c.day}`, `year: ${c.year}`, ...extra, `scheme: "${c.scheme}"`];
  const call = alone ? `calendarIcon({ ${args.join(", ")} })` : `calendarIcon({ ${[`theme: "${c.theme}"`, ...args].join(", ")} })`;
  return { name: "calendarIcon", sub: alone ? `/themes/${c.theme}` : "", call, part: "Calendar" };
}

/** The choices that make a month page. */
export interface MonthChoice {
  year: number;
  month: number;
  design: string;
  scheme: "light" | "dark";
  locale?: "ja";
  monday?: boolean;
  note?: { key: string; text: string };
}

/** The call for a month page. */
export function monthDraw(c: MonthChoice): Draw {
  const lines = [`year: ${c.year}`, `month: ${c.month}`, `design: "${c.design}"`, ...(c.monday ? [`weekStart: "monday"`] : []), ...(c.locale ? [`locale: "ja"`] : []), `scheme: "${c.scheme}"`, ...(c.note ? [`notes: { "${c.note.key}": "${c.note.text}" }`] : [])];
  return { name: "monthCalendar", sub: "/month", call: `monthCalendar({ ${lines.join(", ")} })`, part: "Month" };
}

/** The address of the embed page for these choices: `embed.html?...` after `base`. */
export function frameAddress(base: string, query: string): string {
  return `${base}embed.html${query === "" ? "" : `?${query}`}`;
}

/** Where the frame's picture is made from: the choices, as the embed page reads them (`icon` or a month). */
export function iconQuery(c: IconChoice, withDate: boolean): string {
  const q = new URLSearchParams();
  if (withDate) q.set("date", `${String(c.year).padStart(4, "0")}-${String(c.month).padStart(2, "0")}-${String(c.day).padStart(2, "0")}`);
  q.set("theme", c.theme);
  q.set("scheme", c.scheme);
  if (c.housing) q.set("housing", c.housing);
  if (c.rings) q.set("rings", "1");
  if (c.turn) q.set("turn", String(c.turn));
  if (c.locale) q.set("locale", c.locale);
  return q.toString();
}

/** The address of the embed page for a month page. */
export function monthQuery(c: MonthChoice): string {
  const q = new URLSearchParams({ month: "1", date: `${String(c.year).padStart(4, "0")}-${String(c.month).padStart(2, "0")}-01`, design: c.design, scheme: c.scheme });
  if (c.monday) q.set("week", "monday");
  if (c.locale) q.set("locale", c.locale);
  return q.toString();
}

const imported = (draw: Draw, from: string): string => `import { ${draw.name} } from "${from}";`;

/**
 * The code for one of the family's ways a page is made: `html`, `module`, `react`, `vue`, `angular` or `svelte`. The `iframe` way is `frame`.
 *
 * @param kind - The way.
 * @param draw - What to draw.
 * @returns The text, or `undefined` for a way this file does not write.
 */
export function embedCode(kind: string, draw: Draw): string | undefined {
  const from = `${PACKAGE}${draw.sub}`;
  const { call, part } = draw;
  switch (kind) {
    case "html":
      return `<div id="calendar"></div>\n<script type="module">\n  import { ${draw.name} } from "${cdn()}${draw.sub}/+esm";\n\n  document.getElementById("calendar").innerHTML = ${call};\n</script>`;
    case "module":
      return `${imported(draw, from)}\n\nelement.innerHTML = ${call};`;
    case "react":
      return `${imported(draw, from)}\n\nexport function ${part}() {\n  return <div dangerouslySetInnerHTML={{ __html: ${call} }} />;\n}`;
    case "vue":
      return `<script setup>\n${imported(draw, from)}\n\nconst svg = ${call};\n</script>\n\n<template>\n  <div v-html="svg"></div>\n</template>`;
    case "angular":
      return `import { Component, inject } from "@angular/core";\nimport { DomSanitizer } from "@angular/platform-browser";\n${imported(draw, from)}\n\n@Component({\n  selector: "app-${part.toLowerCase()}",\n  standalone: true,\n  template: \`<div [innerHTML]="svg"></div>\`,\n})\nexport class ${part}Component {\n  svg = inject(DomSanitizer).bypassSecurityTrustHtml(${call});\n}`;
    case "svelte":
      return `<script>\n  ${imported(draw, from)}\n\n  const svg = ${call};\n</script>\n\n{@html svg}`;
    default:
      return undefined;
  }
}

/** The `iframe` way: the embed page at the size chosen. `root` is the way up to the demo's top from the page that shows it, for the picture; the copied code names the published demo. */
export function frameCode(query: string, title: string, size: number, preview: boolean, root: string): string {
  return embedSnippet("iframe", { package: PACKAGE, cdn: cdn(), tag: "koyomi-calendar", element: "", entries: [], attrs: [], name: "calendar", iframe: { src: frameAddress(preview ? root : SITE, query), title, width: size, height: size } });
}

/** Writing the package out to a file on a server (Node). */
export function fileCode(draw: Draw): string {
  const file = draw.name === "monthCalendar" ? "month.svg" : "today.svg";
  return `import { writeFileSync } from "node:fs";\n${imported(draw, `${PACKAGE}${draw.sub}`)}\n\nwriteFileSync("${file}", ${draw.call});`;
}
