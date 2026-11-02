import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { fit, tx, dayText, CAP, stack, part, rect, circle } from "../kit.ts";
import { renderIcon } from "../render.ts";

const LOOPS: Rect = [59.5, 158.5, 210, 134];

// grey outline, grey header, three ring pins.
export const theme: Def = {
  box: [29.5, 33, 270, 285],
  numeral: "centre",
  layout: () => ({ page: LOOPS, yearZone: [59.5, 119.5, 210, 32] }),
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { line: "#c3c3c3", head: "#6e6e6e", body: "#262626", ink: "#e6e6e6", hole: "#262626", pin: "#c3c3c3", yr: "#ffffff" }
      : { line: "#5b5b5b", head: "#828282", body: "#ffffff", ink: "#555555", hole: "#ffffff", pin: "#5b5b5b", yr: "#ffffff" };
    const ring = (cx: number) => circle(cx, 100, 16.5, k.hole, `stroke="${k.line}" stroke-width="6"`) + rect(cx - 7, 52, 14, 46, 7, k.pin);
    const [x, y, w, h] = l.page;
    const [zx, zy, zw, zh] = l.yearZone!;
    const ms = fit(p.month, 36, 180, 0.6);
    const [mb, db] = stack(y, y + h, [[ms * CAP, 0], [70 * CAP, 14]]);
    return (
      rect(56, 67, 217, 229, 26, k.body) +
      `<path d="M56 155V93a26 26 0 0 1 26-26H247a26 26 0 0 1 26 26V155Z" fill="${k.head}"/>` +
      rect(56, 67, 217, 229, 26, "none", `stroke="${k.line}" stroke-width="7"`) +
      `<path d="M56 155H273" stroke="${k.line}" stroke-width="7"/>` +
      ring(100) + ring(164.5) + ring(229) +
      part("year", tx(zx + zw / 2, zy + zh / 2 + 19 * CAP / 2, p.year, 19, k.yr, 700, { opacity: 0.9 })) +
      part("month", tx(x + w / 2, mb!, p.month, ms, k.ink, 700)) +
      part("day", dayText(x + w / 2, db!, p.day, 70, k.ink, 700))
    );
  },
};

/** The `loops` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["loops", theme]);
}
