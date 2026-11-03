import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, dayText, CAP, stack, part, rect, topRound } from "../kit.ts";
import { renderIcon } from "../render.ts";

const SQUIRCLE: Rect = [44, 118, 168, 94];

/**
 * The `squircle` design's drawing, for the package's own renderer: a soft rounded-square tile in a teal-to-blue gradient, a white page with a coloured top band and two binding tabs, a large bold day.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [0, 0, 256, 256],
  numeral: "centre",
  rings: [44, 56, 168],
  layout: () => ({ page: SQUIRCLE, yearZone: SQUIRCLE }),
  draw: ({ p, dark, uid, l, rings }) => {
    const k = dark
      ? { from: "#238089", to: "#1a3a68", paper: "#16222d", band: "#22928f", bandDeep: "#1b7673", ink: "#f2f9fc", muted: "#93b4c7", tab: "#e8f4f6", slot: "#12595a", shade: "#000000" }
      : { from: "#5ccdc6", to: "#2b6bac", paper: "#ffffff", band: "#2fb0a8", bandDeep: "#23968f", ink: "#1d5b8f", muted: "#6a8ba5", tab: "#ffffff", slot: "#1b807a", shade: "#0b3a5c" };
    const [x, y, w, h] = l.page;
    const size = p.year ? 80 : 90;
    const [db, yb] = stack(y, y + h, [[size * CAP, 0], ...(p.year ? [[18 * CAP, 7] as const] : [])]);
    const tab = (cx: number) => rect(cx - 9.5, 36, 19, 44, 9.5, k.tab) + rect(cx - 5, 44, 10, 28, 5, k.slot);
    return (
      `<defs><linearGradient id="${uid}-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${k.from}"/><stop offset="1" stop-color="${k.to}"/></linearGradient>` +
      `<linearGradient id="${uid}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="${dark ? ".1" : ".28"}"/><stop offset=".55" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>` +
      `<path d="M128 0C232 0 256 24 256 128S232 256 128 256 0 232 0 128 24 0 128 0Z" fill="url(#${uid}-t)"/>` +
      `<path d="M128 0C232 0 256 24 256 128S232 256 128 256 0 232 0 128 24 0 128 0Z" fill="url(#${uid}-s)"/>` +
      rect(44, 62, 168, 156, 26, k.shade, `opacity=".22"`) +
      rect(44, 56, 168, 156, 26, k.paper) +
      topRound(44, 56, 168, 58, 26, k.band) +
      (rings ? "" : tab(92) + tab(164)) +
      part("month", tx(x + w / 2, 106, p.monthUp, 22, "#ffffff", 800, { spacing: 1.5 })) +
      part("day", dayText(x + w / 2, db!, p.day, size, k.ink, 800)) +
      part("year", tx(x + w / 2, yb!, p.year, 18, k.muted, 700))
    );
  },
};

/**
 * Draws the `squircle` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["squircle", theme]);
}
