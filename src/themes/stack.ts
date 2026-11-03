import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, type TextOptions, tx, CAP, optical, stack, part, rect, r2 } from "../kit.ts";
import { renderIcon } from "../render.ts";

const STACK: Rect = [119, 226, 438, 287];

/**
 * The `stack` design's drawing, for the package's own renderer: solid black glyph with a tilted white page, a curled corner and a sheet underneath.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/stack";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [44, 37, 620, 570],
  numeral: "centre",
  layout: () => ({ page: STACK, yearZone: STACK }),
  draw: ({ p, dark, l }) => {
    const k = dark ? { base: "#ececec", page: "#161616", ink: "#f2f2f2" } : { base: "#050505", page: "#ffffff", ink: "#050505" };
    const hook = (cx: number) =>
      rect(cx - 31, 122, 62, 64, 31, k.page) +
      `<path d="M${cx - 20} 112V98Q${cx - 20} 72 ${cx + 4} 72Q${cx + 28} 72 ${cx + 28} 98V165" fill="none" stroke="${k.base}" stroke-width="20" stroke-linecap="round"/>`;
    const [x, y, w, h] = l.page;
    const cx = x + w / 2;
    const [db, yb] = stack(y, y + h, [[235 * CAP, 0], ...(p.year ? [[44 * CAP, 18] as const] : [])]);
    const slanted = (size: number, base: number, value: string, weight: number, o: TextOptions) =>
      `<g transform="translate(${cx} ${r2(base - (size * CAP) / 2)}) skewX(-14)">${tx(optical(value, size), (size * CAP) / 2, value, size, k.ink, weight, o)}</g>`;
    return (
      `<path d="M110 105H640V582H135V560Z" fill="${k.base}"/>` +
      `<path d="M110 105V215H620V105Z" fill="${k.base}"/>` +
      `<path d="M150 546H606" stroke="${k.page}" stroke-width="12"/>` +
      `<path d="M135 215L596 215 612 285C600 420 556 510 466 524H106Q74 524 80 488Z" fill="${k.page}" stroke="${k.base}" stroke-width="22" stroke-linejoin="round"/>` +
      `<path d="M466 524C476 486 496 454 520 446L610 288C602 420 556 510 466 524Z" fill="${k.base}"/>` +
      hook(235) + hook(492) +
      part("day", slanted(235, db!, p.day, 900, { family: BLACK })) +
      part("year", p.year ? slanted(44, yb!, p.year, 900, { family: BLACK, opacity: 0.55 }) : "")
    );
  },
};

/**
 * Draws the `stack` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/stack";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["stack", theme]);
}
