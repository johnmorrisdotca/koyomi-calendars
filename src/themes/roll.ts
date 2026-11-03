import type { CalendarIconOptions, Def, Rect } from "../types.ts";
import { BLACK, tx, digits, part, rect } from "../kit.ts";
import { tearColours, inkOf, BIG, weekendNumerals, sideColumns, tearBlock, tearExtras } from "../tear.ts";
import { renderIcon } from "../render.ts";

const ROLL: Rect = [66, 70, 188, 268];
const ROLL_NUMERAL = { h: 190, sw: 20, year: 23, gap: 14, split: { h: 98, dx: 48, dy: 50 } } as const;
const ROLL_LEFT: Rect = [16, 82, 44, 248];
const ROLL_RIGHT: Rect = [260, 82, 44, 248];

/**
 * The `roll` design's drawing, for the package's own renderer: a tall wall tear-off page: the pages already torn off curl above, a huge condensed day in the ink of its weekday, side columns, a dotted memo area.
 *
 * Most code wants `calendarIcon` from this file instead, which draws with it.
 *
 * @example
 * ```ts
 * import { theme } from "@johnmorrisdotca/koyomi-calendars/themes/roll";
 *
 * console.log(theme.box.length);
 * ```
 */
export const theme: Def = {
  box: [0, 0, 320, 450],
  numeral: "centre",
  rings: [30, 6, 260],
  weekend: true,
  extras: tearExtras,
  layout: (year, weekend) => tearBlock(ROLL, ROLL_NUMERAL, year, weekend === true).layout,
  draw: (c) => {
    const { p, dark, uid, x } = c;
    const k = tearColours(dark);
    const n = ROLL_NUMERAL;
    const cx = ROLL[0] + ROLL[2] / 2;
    const { rows, centre } = tearBlock(ROLL, n, p.year !== "", x.split !== null);
    let dots = "";
    for (let row = 0; row < 5; row += 1) for (let col = 0; col < 17; col += 1) dots += `<circle cx="${28 + col * 16}" cy="${352 + row * 16}" r="1.5"/>`;
    return (
      `<defs><linearGradient id="${uid}-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.paper}"/><stop offset=".45" stop-color="${k.back}"/><stop offset="1" stop-color="${k.edge}"/></linearGradient>` +
      `<linearGradient id="${uid}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${k.ink}" stop-opacity=".22"/><stop offset="1" stop-color="${k.ink}" stop-opacity="0"/></linearGradient></defs>` +
      rect(14, 438, 292, 8, 3, k.edge) +
      rect(10, 432, 300, 8, 3, k.back, `stroke="${k.edge}" stroke-width="1"`) +
      rect(8, 40, 304, 394, 3, k.paper, `stroke="${k.edge}" stroke-width="1.4"`) +
      `<path d="M8 52H312V74H8Z" fill="url(#${uid}-s)"/>` +
      rect(6, 6, 308, 46, 23, `url(#${uid}-r)`, `stroke="${k.edge}" stroke-width="1.4"`) +
      `<path d="M30 20H290M30 33H290" stroke="${k.edge}" stroke-width="1.2" opacity=".8"/>` +
      `<g fill="${k.dot}">${dots}</g>` +
      sideColumns(c, k, ROLL_LEFT, ROLL_RIGHT, true) +
      (c.l.split
        ? weekendNumerals(c, k, uid, { saturday: k.blue, sunday: k.red }, 150)
        : part("day", digits(p.day, cx, centre, n.h, n.sw, inkOf(k, x.day.ink), BIG))) +
      part("year", tx(cx, rows[0]!, p.year, n.year, k.ink, 900, { family: BLACK, spacing: 2 }))
    );
  },
};

/**
 * Draws the `roll` calendar page alone: this theme and what it needs, nothing of the other themes.
 *
 * @param options - What the main `calendarIcon` takes, without `theme`: the date (`month`, `day`, `year`), `scheme`, `housing`, `rings`, `size` and the rest.
 * @returns The icon as SVG text, `<svg …>…</svg>`.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/roll";
 *
 * const svg = calendarIcon({ month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & { theme?: undefined }): string {
  return renderIcon(options, () => ["roll", theme]);
}
