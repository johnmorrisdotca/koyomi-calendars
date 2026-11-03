import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, tx, digits, part, rect, circle, r2 } from "../kit.ts";
import { tearColours, BIG, halfPlane, weekendNumerals, sideColumns, tearBlock, tearExtras } from "../tear.ts";
import { renderIcon } from "../render.ts";

const SUN: Rect = [86, 46, 188, 274];
const SUN_NUMERAL = { h: 186, sw: 20, year: 30, gap: 16, split: { h: 98, dx: 48, dy: 50 } } as const;
const SUN_LEFT: Rect = [18, 52, 58, 262];
const SUN_RIGHT: Rect = [284, 52, 58, 262];

/**
 * The `sun` design's drawing, for the package's own renderer: a square tear-off page: a grey strip to tear off by, a huge black day over a red disc (a slot for any mark), side columns for the weekday, month and holiday.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/sun";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [0, 0, 360, 350],
  numeral: "centre",
  rings: [30, 6, 300],
  weekend: true,
  extras: tearExtras,
  layout: (year, weekend) => tearBlock(SUN, SUN_NUMERAL, year, weekend === true).layout,
  draw: (c) => {
    const { p, dark, uid, l, x } = c;
    const k = tearColours(dark);
    const n = SUN_NUMERAL;
    const cx = SUN[0] + SUN[2] / 2;
    const { rows, centre } = tearBlock(SUN, n, p.year !== "", x.split !== null);
    const disc = x.mark === undefined
      ? circle(cx, centre, 94, k.disc)
      : `<g transform="translate(${r2(cx)} ${r2(centre)}) scale(.94)">${x.mark}</g>`;
    const split = l.split;
    const halves = split && x.mark === undefined
      ? `<defs><clipPath id="${uid}-hu"><polygon points="${halfPlane(split.line, true)}"/></clipPath><clipPath id="${uid}-hd"><polygon points="${halfPlane(split.line, false)}"/></clipPath></defs>` +
        `<g clip-path="url(#${uid}-hu)">${circle(cx, centre, 94, dark ? "#3c5fb0" : "#7aa2e6")}</g><g clip-path="url(#${uid}-hd)">${circle(cx, centre, 94, k.disc)}</g>`
      : disc;
    return (
      rect(9, 12, 342, 336, 6, k.back) +
      rect(6, 6, 348, 336, 6, k.paper, `stroke="${k.edge}" stroke-width="1.4"`) +
      `<path d="M6 36V12a6 6 0 0 1 6-6H348a6 6 0 0 1 6 6V36Z" fill="${k.strip}"/>` +
      `<path d="M6 36H354" stroke="${k.muted}" stroke-width="1.2" stroke-dasharray="2.5 3"/>` +
      halves +
      sideColumns(c, k, SUN_LEFT, SUN_RIGHT, false) +
      (split
        ? weekendNumerals(c, k, uid, { saturday: k.ink, sunday: k.ink }, 150)
        : part("day", digits(p.day, cx, centre, n.h, n.sw, k.ink, BIG))) +
      part("year", tx(cx, rows[0]!, p.year, n.year, k.ink, 900, { family: BLACK, spacing: 3 }))
    );
  },
};

/**
 * Draws the `sun` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/sun";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["sun", theme]);
}
