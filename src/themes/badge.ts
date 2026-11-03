import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, dayText, CAP, stack, part, rect } from "../kit.ts";
import { renderIcon } from "../render.ts";

const BADGE: Rect = [29.5, 34, 58.7, 63];

/**
 * The `badge` design's drawing, for the package's own renderer: a white tile and a soft blue page with a light top lip and a white number.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/badge";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [3.4, 7.8, 110.9, 110.9],
  numeral: "centre",
  rings: [31.5, 31, 56],
  layout: () => ({ page: BADGE, yearZone: BADGE }),
  draw: ({ p, dark, uid, l }) => {
    const k = dark ? { tile: "#2a303c", a: "#6f95f7", b: "#4d79e6", lip: "#c1d8fb", tint: "#a09cf7" } : { tile: "#fdfdfb", a: "#6a92f7", b: "#4b78e6", lip: "#cfe3fb", tint: "#9d99f5" };
    const [x, y, w, h] = l.page;
    const [db, yb] = stack(y, y + h, [[41 * CAP, 0], ...(p.year ? [[8.5 * CAP, 5] as const] : [])]);
    return (
      `<defs><linearGradient id="${uid}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.tint}"/><stop offset=".22" stop-color="${k.a}"/><stop offset="1" stop-color="${k.b}"/></linearGradient></defs>` +
      rect(5.6, 10, 106.5, 106.5, 9, k.tile, `stroke="${dark ? "#3a4150" : "#dde1e6"}" stroke-width="1.4"`) +
      `<g transform="translate(-1.65 0)">` +
      `<path d="M38 29Q60 25 82 29Q87 30 88 36H32Q33 30 38 29Z" fill="${k.lip}"/>` +
      `<path d="M38 34H82Q90 34 91 42C92 52 89 60 91 70C92 80 93 86 90 90Q88 97 80 97H40Q32 97 30 90C28 86 30 80 31 70C32 60 28 52 30 42Q31 34 38 34Z" fill="url(#${uid}-g)"/>` +
      `</g>` +
      part("day", dayText(x + w / 2, db!, p.day, 41, "#ffffff", 400)) +
      part("year", tx(x + w / 2, yb!, p.year, 8.5, "#ffffff", 600, { opacity: 0.85 }))
    );
  },
};

/**
 * Draws the `badge` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/badge";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["badge", theme]);
}
