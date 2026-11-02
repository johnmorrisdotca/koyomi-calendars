import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { tx, fitted, digits, CAP, stack, part, rect } from "../kit.ts";
import { renderIcon } from "../render.ts";

const CURL: Rect = [48.5, 157.5, 287, 208.5];

// line art with an orange header, two hooks, thin rounded digits and a curled lower corner.
export const theme: Def = {
  box: [28, 46, 330, 360],
  numeral: "centre",
  layout: () => ({ page: CURL, yearZone: CURL }),
  draw: ({ p, dark, l }) => {
    const k = dark
      ? { line: "#f1ede8", body: "#2a2623", head: "#c98a2c", dhead: "#a56a16", foot: "#443d38", fold: "#5a5049", ink: "#f4efe9" }
      : { line: "#0b0b0b", body: "#f6f0ed", head: "#f7c978", dhead: "#f1a94c", foot: "#cdc1ba", fold: "#cdc1ba", ink: "#0d0d0d" };
    const hook = (cx: number) =>
      rect(cx - 12, 82, 24, 46, 8, k.dhead) +
      `<path d="M${cx - 11} 132V76a11.5 11.5 0 0 1 23 0V132" fill="none" stroke="${k.line}" stroke-width="9" stroke-linecap="round"/>`;
    const [x, y, w, h] = l.page;
    const cx = x + w / 2;
    const ink = (88 * 15) / 16 + 9;
    const [db, yb] = stack(y, y + h, [[ink, 0], ...(p.year ? [[24 * CAP, 20] as const] : [])]);
    return (
      `<path d="M340.5 300V116a30 30 0 0 0-30-30.5H74a30 30 0 0 0-30.5 30.5V356a30 30 0 0 0 30 31.5H252Z" fill="${k.body}"/>` +
      `<path d="M43.5 150V116a30 30 0 0 1 30-30.5h237a30 30 0 0 1 30 30.5v34Z" fill="${k.head}"/>` +
      `<path d="M43.5 366h208l-13 21.5H73a30 30 0 0 1-29.5-30Z" fill="${k.foot}"/>` +
      `<path d="M340.5 300V116a30 30 0 0 0-30-30.5H74a30 30 0 0 0-30.5 30.5V356a30 30 0 0 0 30 31.5H252" fill="none" stroke="${k.line}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M44 153H340" stroke="${k.line}" stroke-width="9"/>` +
      `<path d="M276 310Q268 306 262 316L254 384 338 300Q340 296 332 298Z" fill="${k.fold}" stroke="${k.line}" stroke-width="9" stroke-linejoin="round"/>` +
      hook(101) + hook(283) +
      fitted(cx, 134, p.month, 40, 120, 0.55, k.ink, 700) +
      part("day", digits(p.day, cx, db! - ink / 2, 88, 9, k.ink)) +
      part("year", tx(cx, yb!, p.year, 24, k.ink, 700, { opacity: 0.55 }))
    );
  },
};

/** The `curl` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["curl", theme]);
}
