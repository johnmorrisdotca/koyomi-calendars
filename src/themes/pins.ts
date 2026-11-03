import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { fit, tx, dayText, CAP, stack, part, rect, circle, topRound } from "../kit.ts";
import { renderIcon } from "../render.ts";

const PINS: Rect = [35, 105, 243, 180];

/**
 * The `pins` design's drawing, for the package's own renderer: flat page, red header, two slate pins through white holes.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/pins";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [20, 15, 273, 280],
  numeral: "centre",
  layout: () => ({ page: PINS, yearZone: PINS }),
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { head: "#d4442f", body: "#2c3539", ink: "#e9eff1", muted: "#9aaab0", hole: "#2c3539", pin: "#e9eff1" }
      : { head: "#ee4338", body: "#ffffff", ink: "#3a4a4f", muted: "#7c8c91", hole: "#ffffff", pin: "#3a4a4f" };
    const pin = (cx: number) => circle(cx, 72, 14.5, k.hole) + rect(cx - 9.5, 25, 19, 57, 9.5, k.pin);
    const [x, y, w, h] = l.page;
    const ms = fit(p.monthUp, 37, 160, 0.68);
    const [mb, db, yb] = stack(y, y + h, [[ms * CAP, 0], [111 * CAP, 14], ...(p.year ? [[20 * CAP, 12] as const] : [])]);
    return (
      rect(35, 40, 243, 245, 28, k.body, `stroke="${dark ? "none" : "#e4e9eb"}" stroke-width="1.6"`) +
      topRound(35, 40, 243, 65, 28, k.head) +
      pin(93) + pin(221) +
      part("month", tx(x + w / 2, mb!, p.monthUp, ms, k.ink, 600, { spacing: 1 })) +
      part("day", dayText(x + w / 2, db!, p.day, 111, k.ink, 700)) +
      part("year", tx(x + w / 2, yb!, p.year, 20, k.muted, 600))
    );
  },
};

/**
 * Draws the `pins` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/pins";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["pins", theme]);
}
