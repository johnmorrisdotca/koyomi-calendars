import type { CalendarIconOptions, Def } from "../types.ts";
import { BLACK, SERIF, tx, dayText, fitted, CAP, part, rect, circle, topRound, r2 } from "../kit.ts";
import { renderIcon } from "../render.ts";

const SHADOW_YEAR = 24;
const shadowTop = (year: boolean): number => 10 + (326 - 175 - (year ? 14 + SHADOW_YEAR * CAP : 0)) / 2;

// blue header with black coils, a circled day, a long shadow on a lavender tile.
export const theme: Def = {
  box: [8, 6, 334, 336],
  numeral: "centre",
  layout: (year) => {
    const top = shadowTop(year);
    return { page: [86, top + 51, 178, 124], yearZone: [12, top + 175, 326, 336 - top - 175] };
  },
  draw: ({ p, dark, uid, l }) => {
    const k = dark
      ? { tile: "#2c2e4f", shade: "#202241", head: "#3a78b8", body: "#20222b", ink: "#f5f6fb", ring: "#7fb2e8", coil: "#0b0b10", monthStroke: "#13304f" }
      : { tile: "#d8d9fa", shade: "#b3b5e6", head: "#2b5f95", body: "#ffffff", ink: "#000000", ring: "#2b5f95", coil: "#0a0a0a", monthStroke: "#173a5e" };
    const top = shadowTop(p.year !== "");
    const cx = 175;
    const cy = l.page[1] + l.page[3] / 2;
    const coil = (x: number) => rect(x - 4.5, top - 11, 9, 30, 4.5, k.coil) + circle(x, top + 19, 3, k.body, `stroke="${k.coil}" stroke-width="2"`);
    return (
      `<defs><clipPath id="${uid}-t"><rect x="12" y="10" width="326" height="326" rx="22"/></clipPath></defs>` +
      rect(12, 10, 326, 326, 22, k.tile) +
      `<g clip-path="url(#${uid}-t)"><polygon points="86,${r2(top)} 264,${r2(top)} 586,${r2(top + 322)} 408,${r2(top + 322)} 86,${r2(top + 175)}" fill="${k.shade}"/></g>` +
      rect(86, top, 178, 175, 7, k.body) +
      topRound(86, top, 178, 51, 7, k.head) +
      coil(107) + coil(141) + coil(175) + coil(209) + coil(243) +
      fitted(cx, top + 44, p.monthUp, 30, 146, 0.76, "#ffffff", 700, { family: SERIF, spacing: 1, stroke: k.monthStroke, strokeWidth: 1.4 }) +
      circle(cx, cy, 48, "none", `stroke="${k.ring}" stroke-width="2.2"`) +
      circle(cx, cy, 42.5, "none", `stroke="${k.ring}" stroke-width="3.6"`) +
      part("day", dayText(cx, cy + (54 * CAP) / 2, p.day, 54, k.ink, 900, { family: BLACK })) +
      part("year", tx(cx, top + 175 + 14 + SHADOW_YEAR * CAP, p.year, SHADOW_YEAR, k.ring, 700))
    );
  },
};

/** The `shadow` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["shadow", theme]);
}
