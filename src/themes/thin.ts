import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { fit, tx, digits, CAP, stack, part, rect } from "../kit.ts";
import { renderIcon } from "../render.ts";

const THIN: Rect = [0, 0, 412, 385];

// a plain white page, the weekday in red and a very thin number.
export const theme: Def = {
  box: [0, 0, 412, 385],
  numeral: "centre",
  layout: () => ({ page: THIN, yearZone: THIN }),
  draw: ({ p, dark, l }) => {
    const k = dark ? { body: "#1c1c1e", head: "#ff5a48", ink: "#f4f4f6", muted: "#8e8e93" } : { body: "#ffffff", head: "#e8412c", ink: "#0a0a0a", muted: "#9a9a9e" };
    const word = p.weekday || p.month;
    const [x, y, w, h] = l.page;
    const cx = x + w / 2;
    const ws = fit(word, 76, 296, 0.52);
    const ink = (176 * 15) / 16 + 7;
    const [wb, db, yb] = stack(y, y + h, [[ws * CAP, 0], [ink, 24], ...(p.year ? [[29 * CAP, 20] as const] : [])]);
    return (
      rect(0, 0, 412, 385, 88, k.body) +
      part("month", tx(cx, wb!, word, ws, k.head, 300)) +
      part("day", digits(p.day, cx, db! - ink / 2, 176, 7, k.ink, { cap: "butt", gap: 4.5 })) +
      part("year", tx(cx, yb!, p.year, 29, k.muted, 300))
    );
  },
};

/** The `thin` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["thin", theme]);
}
