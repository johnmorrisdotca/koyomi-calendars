import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, fit, dayText, CAP, stack, part, rect, esc, r2 } from "../kit.ts";
import { renderIcon } from "../render.ts";

const LINE: Rect = [83, 120.5, 206, 146.5];

/**
 * The `line` design's drawing, for the package's own renderer: black line art, a header rule, four tick marks and a big blue number.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/line";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [56, 40, 260, 255],
  numeral: "centre",
  layout: () => ({ page: LINE, yearZone: LINE }),
  draw: ({ p, dark, l }) => {
    const k = dark ? { line: "#f1f1f1", body: "#141414", num: "#5aa0e6" } : { line: "#080808", body: "#ffffff", num: "#2f78bd" };
    const tick = (cx: number) => `<path d="M${cx} 57.5V84.5" stroke="${k.line}" stroke-width="11" stroke-linecap="round"/>`;
    const [x, y, w, h] = l.page;
    const cx = x + w / 2;
    const size = fit([p.monthShortUp, p.year].filter(Boolean).join(" "), 20, 190, 0.72);
    const [db, lb] = stack(y, y + h, [[109 * CAP, 0], [size * CAP, 18]]);
    const label =
      `<text x="${r2(cx)}" y="${r2(lb!)}" text-anchor="middle" font-size="${r2(size)}" font-family="${BLACK}" font-weight="800" fill="${k.num}">` +
      `<tspan data-part="month">${esc(p.monthShortUp)}</tspan>${p.year ? `<tspan data-part="year" dx="${r2(size * 0.35)}">${esc(p.year)}</tspan>` : ""}</text>`;
    return (
      rect(76.5, 73.5, 219, 200, 18, k.body, `stroke="${k.line}" stroke-width="13"`) +
      `<path d="M72 115h228" stroke="${k.line}" stroke-width="11"/>` +
      tick(120) + tick(164) + tick(208) + tick(252) +
      part("day", dayText(cx, db!, p.day, 109, k.num, 900, { family: BLACK })) +
      label
    );
  },
};

/**
 * Draws the `line` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/line";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["line", theme]);
}
