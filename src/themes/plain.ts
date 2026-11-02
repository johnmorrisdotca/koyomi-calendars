import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { SANS, fit, tx, digits, CAP, stack, part, rect, circle, esc, r2 } from "../kit.ts";
import { tearColours, inkOf, bigInk, tearExtras } from "../tear.ts";
import { calendarMoon } from "../date.ts";
import { renderIcon } from "../render.ts";

const PLAIN_PAGE: Rect = [60, 108, 180, 184];
const PLAIN_NUMERAL = { h: 100, sw: 12, word: 20, gap: 20 } as const;

/** A moon phase (0 new to 7, see `calendarMoon`) as a small disc: the lit part filled, the rest left as an outline. */
function moonGlyph(cx: number, cy: number, r: number, phase: number, ink: string, paper: string): string {
  const outline = `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="${phase === 4 ? ink : paper}" stroke="${ink}" stroke-width="1.8"/>`;
  if (phase === 0 || phase === 4) return outline;
  const i = phase < 4 ? phase : 8 - phase;
  const rx = r * Math.abs(Math.cos((Math.PI * 2 * i) / 8));
  const lit = `<path d="M${r2(cx)} ${r2(cy - r)}A${r2(r)} ${r2(r)} 0 0 1 ${r2(cx)} ${r2(cy + r)}A${r2(rx)} ${r2(r)} 0 0 ${i < 2 ? 0 : 1} ${r2(cx)} ${r2(cy - r)}Z" fill="${ink}"/>`;
  return outline + (phase < 4 ? lit : `<g transform="translate(${r2(cx)} 0) scale(-1 1) translate(${r2(-cx)} 0)">${lit}</g>`);
}

// a plain, unbranded tear-off pad on a kraft stand: a small month, a big day, the weekday in capitals, the month and year, the moon.
export const theme: Def = {
  box: [0, 0, 300, 380],
  numeral: "centre",
  rings: [52, 70, 196],
  extras: tearExtras,
  layout: () => ({ page: PLAIN_PAGE, yearZone: [60, 300, 190, 46] }),
  draw: ({ p, dark, uid, month, dayNo, yearNo, l, x }) => {
    const k = tearColours(dark);
    const n = PLAIN_NUMERAL;
    const [px, py, pw, ph] = l.page;
    const cx = px + pw / 2;
    const ink = bigInk(n.h, n.sw);
    const word = x.ja ? p.weekday : p.weekday.toLocaleUpperCase();
    const wordSize = fit(word, n.word, pw, x.ja ? 1.3 : 0.74);
    const [db, wb] = stack(py, py + ph, [[ink, 0], ...(word ? [[wordSize * CAP, n.gap] as const] : [])]);
    const colour = inkOf(k, x.day.ink === "blue" ? "black" : x.day.ink);
    const size = x.ja ? 22 : fit([p.monthShort, p.year].filter(Boolean).join(" "), 22, 150, 0.58);
    const label = x.ja
      ? `<text x="60" y="326" font-size="${size}" font-family="${SANS}" font-weight="500" fill="${k.ink}">${p.year ? `<tspan data-part="year">${p.year}</tspan><tspan font-size="${size - 4}">年</tspan>` : ""}<tspan data-part="month" font-size="${p.year ? size - 4 : size}">${month}月</tspan></text>`
      : `<text x="60" y="326" font-size="${r2(size)}" font-family="${SANS}" font-weight="500" fill="${k.ink}"><tspan data-part="month">${esc(p.monthShort)}</tspan>${p.year ? `<tspan data-part="year" dx="${r2(size * 0.3)}">${esc(p.year)}</tspan>` : ""}</text>`;
    const holiday = x.day.holiday ? tx(cx, wb! + 6 + 14 * CAP + 8, x.day.holiday, fit(x.day.holiday, 14, pw, x.ja ? 1 : 0.6), k.red, 600) : "";
    const moon = x.moon && yearNo !== undefined && p.weekday !== "" ? moonGlyph(236, 316, 12, calendarMoon(yearNo, month, dayNo), k.ink, k.paper) : "";
    return (
      `<defs><linearGradient id="${uid}-m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.stripHi}"/><stop offset="1" stop-color="${k.strip}"/></linearGradient></defs>` +
      rect(0, 0, 300, 380, 8, k.kraft) +
      circle(150, 30, 9, k.hole, `stroke="${k.kraftEdge}" stroke-width="1.2"`) +
      rect(48, 356, 204, 6, 2, k.back, `stroke="${k.edge}" stroke-width=".8"`) +
      rect(46, 352, 208, 6, 2, k.paper, `stroke="${k.edge}" stroke-width=".8"`) +
      rect(44, 84, 212, 266, 3, k.paper, `stroke="${k.edge}" stroke-width="1"`) +
      rect(40, 70, 220, 32, 4, `url(#${uid}-m)`, `stroke="${k.edge}" stroke-width="1"`) +
      `<path d="M44 102H256" stroke="${k.ink}" stroke-width="1" opacity=".12"/>` +
      part("monthno", tx(60, 132, String(month), 24, k.ink, 500)) +
      part("day", digits(p.day, cx, db! - ink / 2, n.h, n.sw, colour, { gap: 4.5 })) +
      part("weekday", tx(cx, wb ?? 0, word, wordSize, k.ink, 500, { spacing: x.ja ? 3 : 2.5 })) +
      holiday +
      label +
      moon
    );
  },
};

/** The `plain` page alone: this theme and what it needs, nothing of the other themes. */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["plain", theme]);
}
