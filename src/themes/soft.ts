import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, fitted, digits, CAP, stack, part, rect, topRound } from "../kit.ts";
import { renderIcon } from "../render.ts";

const SOFT: Rect = [90, 149, 230, 204];

/**
 * The `soft` design's drawing, for the package's own renderer: flat red-orange header, three amber rings, a cream page with a side shade and a rounded coral number.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/soft";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [40, 48, 292, 312],
  numeral: "centre",
  layout: () => ({ page: SOFT, yearZone: SOFT }),
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { head: "#d0553c", headHi: "#e2694f", body: "#352c27", side: "#2a221e", ring: "#e9a73a", ringDark: "#cf8d22", num: "#f08a6f", hi: "#ffffff" }
      : { head: "#ee5a3a", headHi: "#ef6f4f", body: "#fbe8cb", side: "#f8d08f", ring: "#f7b844", ringDark: "#f0a130", num: "#ee6a4c", hi: "#ffffff" };
    const ring = (cx: number) => rect(cx - 12, 62, 24, 52, 12, k.ring) + rect(cx - 12, 88, 24, 26, 12, k.ringDark, 'opacity=".65"');
    const [x, y, w, h] = l.page;
    const cx = x + w / 2;
    const ink = (100 * 15) / 16 + 24;
    const [db, yb] = stack(y, y + h, [[ink, 0], ...(p.year ? [[21 * CAP, 16] as const] : [])]);
    return (
      rect(52, 132, 76, 218, 28, k.side) +
      topRound(52, 88, 266, 60, 28, k.head) +
      rect(90, 95, 230, 258, 30, k.body) +
      topRound(90, 95, 230, 54, 30, k.headHi) +
      ring(137) + ring(205) + ring(273) +
      fitted(cx, 134, p.monthShort, 34, 160, 0.6, "#ffffff", 700) +
      part("day", digits(p.day, cx, db! - ink / 2, 100, 24, k.num, { gap: 6 })) +
      rect(306, 163, 7, 28, 3.5, k.hi, 'opacity=".75"') + rect(306, 205, 7, 56, 3.5, k.hi, 'opacity=".75"') +
      part("year", tx(cx, yb!, p.year, 21, k.num, 700, { opacity: 0.8 }))
    );
  },
};

/**
 * Draws the `soft` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/soft";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["soft", theme]);
}
