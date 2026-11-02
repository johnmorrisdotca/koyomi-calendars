import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, fit, tx, dayText, CAP, stack, part, rect } from "../kit.ts";
import { renderIcon } from "../render.ts";

const HEAVY: Rect = [66, 183.5, 296, 167.5];

// heavy black outline, ring slots over the top edge, black header rule.
export const theme: Def = {
  box: [38, 60, 352, 320],
  numeral: "centre",
  layout: () => ({ page: HEAVY, yearZone: HEAVY }),
  draw: ({ p, dark, l }) => {
    const k = dark ? { line: "#f2f2f2", body: "#161616", ink: "#f2f2f2" } : { line: "#000000", body: "#ffffff", ink: "#000000" };
    const ring = (cx: number) => rect(cx - 23.5, 69, 47, 63, 23.5, k.line) + rect(cx - 10.5, 82, 21, 40, 10.5, k.body);
    const [x, y, w, h] = l.page;
    const ms = fit(p.monthUp, 44, 220, 0.84);
    const [mb, db, yb] = stack(y, y + h, [[ms * CAP, 0], [90 * CAP, 12], ...(p.year ? [[25 * CAP, 12] as const] : [])]);
    return (
      rect(55.5, 104.5, 317, 257, 14, k.body, `stroke="${k.line}" stroke-width="21"`) +
      `<path d="M46 174h336" stroke="${k.line}" stroke-width="19"/>` +
      ring(106.75) + ring(178.25) + ring(249.75) + ring(321.25) +
      part("month", tx(x + w / 2, mb!, p.monthUp, ms, k.ink, 900, { family: BLACK })) +
      part("day", dayText(x + w / 2, db!, p.day, 90, k.ink, 900, { family: BLACK })) +
      part("year", tx(x + w / 2, yb!, p.year, 25, k.ink, 900, { family: BLACK, opacity: 0.55 }))
    );
  },
};

/** The `heavy` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["heavy", theme]);
}
