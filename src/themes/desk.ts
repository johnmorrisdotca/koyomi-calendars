import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, dayText, CAP, part, rect, r2 } from "../kit.ts";
import { renderIcon } from "../render.ts";

const DESK: Rect = [52.5, 55.9, 123.2, 69.4];

/**
 * The `desk` design's drawing, for the package's own renderer: a desk pad seen from an angle: coils, a red banner with a white number, a month of small dates.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/desk";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [27, 14.6, 187, 233],
  numeral: "centre",
  layout: () => ({ page: DESK, yearZone: null }),
  draw: ({ p, dark, uid, month, dayNo, yearNo }) => {
    const k = dark
      ? { paper: "#2d343b", paperEdge: "#46515b", head1: "#a8321f", head2: "#d44a30", grid: "#7fa3d6", gridLine: "#4a6a95", wk: "#e86a56", num: "#ffffff", stack: "#242a30", stack2: "#1b2025", shadow: "#000000" }
      : { paper: "#fbfcfd", paperEdge: "#c9d0d6", head1: "#b83a24", head2: "#e55a3c", grid: "#3d6bab", gridLine: "#7db7ec", wk: "#d6402d", num: "#ffffff", stack: "#cfd7de", stack2: "#8a99a6", shadow: "#33414d" };
    const first = new Date(Date.UTC(yearNo ?? 2000, month - 1, 1)).getUTCDay();
    const count = new Date(Date.UTC(yearNo ?? 2000, month, 0)).getUTCDate();
    let cells = "";
    for (let n = 1; n <= count; n += 1) {
      const slot = first + n - 1;
      const cx = 10 + (slot % 7) * 15.7 + 7.8;
      const cy = 84 + Math.floor(slot / 7) * 11 + 8;
      const hot = n === dayNo;
      if (hot) cells += rect(cx - 6.8, cy - 7.6, 13.6, 10.4, 1.6, k.wk);
      cells += tx(cx, cy, String(n), 7.2, hot ? "#ffffff" : slot % 7 === 0 ? k.wk : k.grid, 700);
    }
    let lines = "";
    for (let i = 0; i <= 7; i += 1) lines += `M${r2(10 + i * 15.7)} 80V146`;
    for (let i = 0; i <= 6; i += 1) lines += `M10 ${80 + i * 11}H120`;
    let rings = "";
    for (let i = 0; i < 10; i += 1) {
      const cx = 8 + i * 12.4;
      rings += `<path d="M${r2(cx - 1.5)} 4C${r2(cx - 1.5)} -9 ${r2(cx + 3.5)} -9 ${r2(cx + 3.5)} 4" fill="none" stroke="#7d848b" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M${r2(cx - 1.5)} 4C${r2(cx - 1.5)} -9 ${r2(cx + 3.5)} -9 ${r2(cx + 3.5)} 4" fill="none" stroke="#e6eaee" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    return (
      `<defs><linearGradient id="${uid}-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.head2}"/><stop offset="1" stop-color="${k.head1}"/></linearGradient>` +
      `<filter id="${uid}-b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>` +
      `<ellipse cx="118" cy="208" rx="82" ry="7" fill="${k.shadow}" opacity=".3" filter="url(#${uid}-b)"/>` +
      `<g transform="matrix(1.12 .13 .03 1.12 40 34)">` +
      rect(10, 7, 130, 156, 3, k.stack2) +
      rect(6, 5, 130, 156, 3, k.stack, `stroke="${k.paperEdge}" stroke-width=".6"`) +
      rect(3, 2.5, 130, 156, 3, k.stack, `stroke="${k.paperEdge}" stroke-width=".6"`) +
      rect(0, 0, 130, 156, 3, k.paper, `stroke="${k.paperEdge}" stroke-width=".8"`) +
      rect(10, 12, 110, 62, 1.5, `url(#${uid}-h)`) +
      `<path d="M10 12H120V28Q60 44 10 34Z" fill="#fff" opacity=".13"/>` +
      dayText(66, 43 + 1 + (56 * CAP) / 2, p.day, 56, "#000000", 800, { opacity: 0.28 }) +
      part("day", dayText(65, 43 + (56 * CAP) / 2, p.day, 56, k.num, 800)) +
      `<path d="${lines}" stroke="${k.gridLine}" stroke-width=".6" fill="none"/>` +
      cells +
      rings +
      `</g>`
    );
  },
};

/**
 * Draws the `desk` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/desk";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["desk", theme]);
}
