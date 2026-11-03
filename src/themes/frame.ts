import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, dayText, CAP, stack, part } from "../kit.ts";
import { renderIcon } from "../render.ts";

const FRAME: Rect = [52, 53, 90, 79];

/**
 * The `frame` design's drawing, for the package's own renderer: four coloured sides round a pale square with a blue number, a folded corner at the bottom right.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/frame";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [0, -1.4, 195, 181],
  numeral: "centre",
  rings: [26, 5, 144],
  layout: () => ({ page: FRAME, yearZone: FRAME }),
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { blue: "#4a74e0", blue2: "#2f55c4", yellow: "#e0a424", green: "#2f9244", green2: "#236a33", red: "#cf4237", inner: "#20232b", num: "#7da1f6" }
      : { blue: "#4285f4", blue2: "#0066d9", yellow: "#f9b600", green: "#00a845", green2: "#188038", red: "#ea4335", inner: "#f8f8f8", num: "#4285f4" };
    const [x, y, w, h] = l.page;
    const [db, yb] = stack(y, y + h, [[56 * CAP, 0], ...(p.year ? [[14 * CAP, 9] as const] : [])]);
    return (
      `<path d="M8 20A15 15 0 0 1 23 5H172a15 15 0 0 1 15 15V132L142 173H23A15 15 0 0 1 8 158Z" fill="${k.blue}"/>` +
      `<path d="M142 5H172a15 15 0 0 1 15 15V53H142Z" fill="${k.blue2}"/>` +
      `<path d="M142 53H187V132H142Z" fill="${k.yellow}"/>` +
      `<path d="M52 132H142V173H52Z" fill="${k.green}"/>` +
      `<path d="M8 132H52V173H23A15 15 0 0 1 8 158Z" fill="${k.green2}"/>` +
      `<path d="M142 132H187L142 173Z" fill="${k.red}"/>` +
      `<rect x="52" y="53" width="90" height="79" fill="${k.inner}"/>` +
      part("day", dayText(x + w / 2, db!, p.day, 56, k.num, 700)) +
      part("year", tx(x + w / 2, yb!, p.year, 14, k.num, 700, { opacity: 0.8 }))
    );
  },
};

/**
 * Draws the `frame` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/frame";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["frame", theme]);
}
