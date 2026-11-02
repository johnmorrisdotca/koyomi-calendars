import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, fit, tx, dayText, CAP, stack, part, rect } from "../kit.ts";
import { renderIcon } from "../render.ts";

const CARTOON: Rect = [77, 147, 196, 148.5];

// black cartoon outline, pink header, white ring loops, bold glossy word and number.
export const theme: Def = {
  box: [56, 56, 238, 262],
  numeral: "centre",
  layout: () => ({ page: CARTOON, yearZone: CARTOON }),
  draw: ({ p, dark, uid, l }) => {
    const k = dark
      ? { line: "#f4f4f4", body: "#1a1a1a", head: "#c45b86", ink: "#f4f4f4", hl: "#ffffff" }
      : { line: "#0a0a0a", body: "#ffffff", head: "#f9a8cb", ink: "#0a0a0a", hl: "#ffffff" };
    const loop = (cx: number) =>
      rect(cx - 9, 74, 18, 56, 9, k.body, `stroke="${k.line}" stroke-width="6"`) +
      rect(cx - 2.5, 84, 5, 30, 2.5, k.line);
    const [x, y, w, h] = l.page;
    const ms = fit(p.monthUp, 40, 160, 0.84);
    const [mb, db, yb] = stack(y, y + h, [[ms * CAP, 0], [82 * CAP, 10], ...(p.year ? [[17 * CAP, 10] as const] : [])]);
    return (
      rect(72.5, 103, 205, 197, 30, k.body, `stroke="${k.line}" stroke-width="9"`) +
      `<clipPath id="${uid}-h"><rect x="72.5" y="103" width="205" height="197" rx="30"/></clipPath>` +
      `<g clip-path="url(#${uid}-h)">${rect(60, 90, 230, 54, 0, k.head)}<path d="M60 144h230" stroke="${k.line}" stroke-width="6"/></g>` +
      loop(108) + loop(175) + loop(242) +
      part("month", tx(x + w / 2, mb!, p.monthUp, ms, k.ink, 900, { family: BLACK, spacing: 1 })) +
      part("day", dayText(x + w / 2, db!, p.day, 82, k.ink, 900, { family: BLACK })) +
      part("year", tx(x + w / 2, yb!, p.year, 17, k.ink, 900, { family: BLACK, opacity: 0.45 }))
    );
  },
};

/** The `cartoon` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["cartoon", theme]);
}
