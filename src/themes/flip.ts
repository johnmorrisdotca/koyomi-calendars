import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, digits, CAP, part, r2 } from "../kit.ts";
import { renderIcon } from "../render.ts";

const flipLeft = (y: number): number => 120 - 0.2857 * (y - 122) + 3.5;
const flipRight = (y: number): number => 318 - 0.2474 * (y - 116) - 3.5;
const flipPage = (top: number, bottom: number): Rect => {
  const mid = (top + bottom) / 2;
  return [flipLeft(mid), top, flipRight(mid) - flipLeft(mid), bottom - top];
};

/**
 * The `flip` design's drawing, for the package's own renderer: a flip calendar in perspective: coils, a pale header, a slanted number, a fan of pages.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/flip";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [52, 78, 340, 262],
  numeral: "centre",
  layout: (year) => {
    const page = flipPage(168, year ? 272 : 312);
    return { page, yearZone: flipPage(168, 314.5) };
  },
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { line: "#9fb7c4", page: "#222c33", head: "#3c5f73", headTop: "#2f4b5b", bar: "#3a464d", ink: "#dcebf2", stack: "#2b363d", edge: "#4c6270" }
      : { line: "#2f4858", page: "#ffffff", head: "#a8dbe9", headTop: "#7fafc0", bar: "#dde1e4", ink: "#2d4858", stack: "#8ea6b3", edge: "#d8e3e9" };
    const coil = (cx: number) =>
      `<path d="M${cx - 7} 126C${cx - 7} 96 ${cx - 5} 90 ${cx} 90s7 6 7 36" fill="none" stroke="${k.line}" stroke-width="6" stroke-linecap="round"/>`;
    const [x, y, w, h] = l.page;
    const bx = (flipLeft(289) + flipRight(289)) / 2;
    const bar = p.year ? `<path d="M${r2(bx - 80)} 276L${r2(bx + 80)} 272 ${r2(bx + 76)} 302 ${r2(bx - 84)} 306Z" fill="${k.bar}"/>` : "";
    return (
      `<path d="M318 116L336 124 376 312 352 322 268 318Z" fill="${k.stack}" stroke="${k.line}" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M326 130L346 316M336 134L356 316M346 142L363 314M318 126L332 318" stroke="${k.edge}" stroke-width="3" fill="none"/>` +
      `<path d="M120 122L318 116 270 310Q268 318 258 318H78Q64 318 68 304Z" fill="${k.page}" stroke="${k.line}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M120 122L318 116 306 164 108 168Z" fill="${k.head}" stroke="${k.line}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M118 126L316 120 312 138 114 144Z" fill="${k.headTop}"/>` +
      bar +
      coil(134) + coil(168) + coil(202) + coil(236) + coil(270) + coil(304) +
      part("day", digits(p.day, x + w / 2, y + h / 2, 72, 11, k.ink, { slant: 12, cap: "square", base: true, gap: 5 })) +
      part("year", tx(bx - 2, 289 + (24 * CAP) / 2, p.year, 24, k.ink, 700, { opacity: 0.6 }))
    );
  },
};

/**
 * Draws the `flip` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/flip";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["flip", theme]);
}
