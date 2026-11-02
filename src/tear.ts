// What the tear-off pages (sun, roll, plain) share: their colours, side columns, weekend numerals, and the day's holiday and old-calendar data.

import type { CalendarIconOptions, CalendarLayout, Ctx, DayInfo, Extras, ExtrasInput, Rect } from "./types.ts";
import { dateParts, utc } from "./date.ts";
import { japaneseHoliday, oldCalendarDate, ROKUYO } from "./japanese.ts";
import { CAP, CJK, digits, fit, part, r1, r2, stack, tx } from "./kit.ts";

export const tearColours = (dark: boolean) =>
  dark
    ? { paper: "#1f2023", back: "#2c2e33", edge: "#44464c", ink: "#f2f1ec", muted: "#8f9198", red: "#ff6f55", blue: "#7ba7ff", disc: "#c4301d", strip: "#4b4e57", stripHi: "#5d616b", dot: "#4d5057", kraft: "#7d6445", kraftEdge: "#68533a", hole: "#2a2a2c" }
    : { paper: "#fdfdfa", back: "#e9e9e4", edge: "#d3d4cf", ink: "#111111", muted: "#85868c", red: "#d8321c", blue: "#1f4ea6", disc: "#e2371f", strip: "#cdd1da", stripHi: "#e3e6ec", dot: "#c9cac6", kraft: "#c9a574", kraftEdge: "#b48e5d", hole: "#efe9de" };
export type TearColours = ReturnType<typeof tearColours>;
export const inkOf = (k: TearColours, ink: DayInfo["ink"]): string => (ink === "red" ? k.red : ink === "blue" ? k.blue : k.ink);

/** The condensed, very heavy numerals of the sun and roll pages. */
export const BIG = { condense: 0.62, cap: "butt", base: true, inked: true, gap: 1 } as const;
export const bigInk = (h: number, sw: number): number => (h * 15) / 16 + sw;

/** Characters one under another, centred on `cx`: the end is where the next thing may start. */
export function stacked(cx: number, top: number, chars: readonly string[], size: number, fill: string, weight: number): { markup: string; end: number } {
  const pitch = size * 1.1;
  const markup = chars.map((ch, i) => tx(cx, top + i * pitch + size * 0.86, ch, size, fill, weight)).join("");
  return { markup, end: top + chars.length * pitch };
}

/** A word turned a quarter turn, reading downwards, centred across `cx` and starting at `top`: its length (the next start) is what it occupies. */
export function spine(cx: number, top: number, value: string, size: number, fill: string, weight: number, spacing = 0): { markup: string; end: number } {
  if (!value) return { markup: "", end: top };
  const length = [...value].reduce((a, ch) => a + (CJK.test(ch) ? 1 : 0.7), 0) * size + spacing * value.length;
  return { markup: `<g transform="translate(${r2(cx - (size * CAP) / 2)} ${r2(top)}) rotate(90)">${tx(0, 0, value, size, fill, weight, { anchor: "start", spacing })}</g>`, end: top + length };
}

/** The weekday of a side column: the kanji one under another in Japanese, a word reading downwards in any other language. */
export function weekdayCell(box: Rect, d: DayInfo, ja: boolean, k: TearColours, size: number, top = box[1]): { markup: string; end: number } {
  if (!d.weekday) return { markup: "", end: top };
  const fill = inkOf(k, d.ink);
  const cx = box[0] + box[2] / 2;
  if (ja) return stacked(cx, top, [...d.weekday], Math.min(size, box[2] * 0.84), fill, 900);
  const word = d.weekday.toLocaleUpperCase();
  return spine(cx, top, word, fit(word, Math.min(size, box[2] * 0.62), Math.max(20, box[3] - (top - box[1]) - 4), 0.72), fill, 900);
}

/** The month of a side column: the number and 月 in Japanese, the short month name reading downwards in any other language. */
export function monthCell(box: Rect, d: DayInfo, ja: boolean, k: TearColours, size: number, top = box[1]): { markup: string; end: number } {
  const fill = inkOf(k, d.ink);
  const cx = box[0] + box[2] / 2;
  if (!ja) return spine(cx, top, d.monthShortUp, Math.min(size, box[2] * 0.62), fill, 900, 1);
  const num = fit(String(d.month), size, box[2] * 0.9, 0.62);
  const unit = stacked(cx, top + num * 1.05, ["月"], Math.min(size, box[2] * 0.76), fill, 900);
  return { markup: tx(cx, top + num * 0.86, String(d.month), num, fill, 900) + unit.markup, end: unit.end };
}

/** The room the rokuyō and the old calendar date need at the foot of the left column (0 when neither is asked for or sure). */
export function japaneseHeight(d: DayInfo, ja: boolean): number {
  return (d.rokuyo ? (ja ? 56 : 24) : 0) + (d.oldDate ? 42 : 0) + (d.rokuyo || d.oldDate ? 10 : 0);
}

/** The rokuyō and the old calendar date, small and muted, at the foot of the left column: the six-day word, then 旧暦 (or OLD) over the month and day. */
export function japaneseCells(box: Rect, d: DayInfo, ja: boolean, k: TearColours): string {
  const cx = box[0] + box[2] / 2;
  const bottom = box[1] + box[3];
  let y = bottom;
  let markup = "";
  if (d.oldDate) {
    const value = d.oldDate.replace(/^(旧|OLD )/, "");
    const size = fit(value, 20, box[2] - 2, 0.62);
    markup += tx(cx, y - 2, value, size, k.muted, 900);
    markup += tx(cx, y - 2 - size * 1.2, ja ? "旧暦" : "OLD", 11, k.muted, 800);
    y -= 42;
  }
  if (d.rokuyo) {
    y -= 8;
    if (ja) {
      const cell = stacked(cx, y - 52, [...d.rokuyo], Math.min(24, box[2] * 0.5), k.muted, 800);
      markup += cell.markup;
    } else {
      markup += tx(cx, y - 4, d.rokuyo, fit(d.rokuyo, 14, box[2] - 2, 0.68), k.muted, 800);
    }
  }
  return markup;
}

/** The holiday of a side column, in red, in whatever room is left (a day with none leaves it empty). */
export function holidayCell(box: Rect, d: DayInfo, ja: boolean, k: TearColours, size: number, top: number): string {
  if (!d.holiday) return "";
  const room = box[1] + box[3] - top;
  const cx = box[0] + box[2] / 2;
  if (ja) {
    const chars = [...d.holiday];
    const fs = Math.min(size, box[2] * 0.62, room / (chars.length * 1.1));
    return stacked(cx, top, chars, fs, k.red, 900).markup;
  }
  return spine(cx, top, d.holiday, fit(d.holiday, Math.min(size, box[2] * 0.4), room, 0.62), k.red, 800).markup;
}

/** The corners of a polygon that covers one side of the diagonal `line` (far past the page): `up` is the upper left, otherwise the lower right. */
export function halfPlane(line: readonly [number, number, number, number], up: boolean): string {
  const [x1, y1, x2, y2] = line;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const far = 4;
  const nx = (up ? -dy : dy) * far;
  const ny = (up ? dx : -dx) * far;
  const [ax, ay, bx, by] = [x1 - dx * far, y1 - dy * far, x2 + dx * far, y2 + dy * far];
  return [ax, ay, bx, by, bx + nx, by + ny, ax + nx, ay + ny].map(r1).join(" ").replace(/(\S+) (\S+)/g, "$1,$2");
}

/** The numerals of a weekend page: the Saturday upper left, the Sunday lower right, each over a faint ghost of the other, cut by the diagonal. */
export function weekendNumerals(c: Ctx, k: TearColours, uid: string, inks: { saturday: string; sunday: string }, ghostSize: number): string {
  const s = c.l.split!;
  const days = c.x.split!;
  const [h, sw] = [s.height, s.height * 0.125];
  const big = (value: number, at: readonly [number, number], color: string, size = h, weight = sw) =>
    digits(String(value), at[0], at[1], size, weight, color, BIG);
  const ghost = (value: number, at: readonly [number, number]) => `<g opacity=".06">${big(value, at, k.ink, ghostSize, ghostSize * 0.125)}</g>`;
  const [cx, cy] = [(s.saturday[0] + s.sunday[0]) / 2, (s.saturday[1] + s.sunday[1]) / 2];
  return (
    `<defs><clipPath id="${uid}-u"><polygon points="${halfPlane(s.line, true)}"/></clipPath><clipPath id="${uid}-d"><polygon points="${halfPlane(s.line, false)}"/></clipPath>` +
    `<clipPath id="${uid}-p"><rect x="${c.l.page[0]}" y="${c.l.page[1]}" width="${c.l.page[2]}" height="${c.l.page[3]}"/></clipPath></defs>` +
    `<g clip-path="url(#${uid}-p)"><g clip-path="url(#${uid}-u)">${ghost(days.sunday.day, [cx - 14, cy - ghostSize * 0.16])}</g>` +
    `<g clip-path="url(#${uid}-d)">${ghost(days.saturday.day, [cx + 14, cy + ghostSize * 0.16])}</g></g>` +
    `<path d="M${s.line.slice(0, 2).map(r2).join(" ")}L${s.line.slice(2).map(r2).join(" ")}" stroke="${k.muted}" stroke-width="1.6"/>` +
    part("day", part("saturday", big(days.saturday.day, s.saturday, inks.saturday)) + part("sunday", big(days.sunday.day, s.sunday, inks.sunday)))
  );
}

/** The corner pieces both tear-off pages put in a page's two side columns: the weekday and month (and for a weekend page, one column each for the Saturday and the Sunday). */
export function sideColumns(c: Ctx, k: TearColours, left: Rect, right: Rect, date: boolean): string {
  if (!c.x.columns) return "";
  const { ja, day } = c.x;
  const size = 38;
  if (c.x.split) {
    const side = (box: Rect, d: DayInfo, ink: DayInfo["ink"]) => {
      const e = { ...d, ink };
      const w = weekdayCell(box, e, ja, k, 32);
      const m = monthCell(box, e, ja, k, 28, w.end + 14);
      return w.markup + m.markup + holidayCell(box, e, ja, k, 20, m.end + 14);
    };
    return `<g data-part="side">${side(left, c.x.split.saturday, "blue")}${side(right, c.x.split.sunday, "red")}</g>`;
  }
  const used = japaneseHeight(day, ja);
  const w = weekdayCell(used ? [left[0], left[1], left[2], left[3] - used] : left, day, ja, k, size);
  const japanese = japaneseCells(left, day, ja, k);
  const m = monthCell(right, day, ja, k, 36);
  let end = m.end;
  let dateText = "";
  if (date) {
    const text = [day.year, String(day.month).padStart(2, "0"), String(day.day).padStart(2, "0")].filter((one) => one !== undefined).join(".");
    const at = spine(right[0] + right[2] / 2, end + 14, text, Math.min(14, right[2] * 0.3), inkOf(k, day.ink), 700);
    dateText = at.markup;
    end = at.end;
  }
  return `<g data-part="side">${w.markup}${japanese}${m.markup}${dateText}${holidayCell(right, day, ja, k, 22, end + 14)}</g>`;
}

// ---------- the themes ----------

// Each theme's layout is data: the `page` its day is centred in (x, y, width, height, in the drawing's own units, at the day's
// height) and the `yearZone` its year sits in. The day is centred in its page, horizontally always, and vertically as one block
// with the month word and the year it shares the page with. A theme that wants its numerals elsewhere says so in `numeral`.

/** The block of a sun or roll page: the year, then the day, centred in the page; for a weekend page the diagonal and the two numerals' centres. */
export function tearBlock(page: Rect, n: { h: number; sw: number; year: number; gap: number; split: { h: number; dx: number; dy: number } }, withYear: boolean, weekend: boolean): { rows: number[]; centre: number; layout: CalendarLayout } {
  const ink = bigInk(n.h, n.sw);
  const rows = stack(page[1], page[1] + page[3], [...(withYear ? [[n.year * CAP, 0] as const] : []), [ink, withYear ? n.gap : 0]]);
  const day = rows[rows.length - 1]!;
  const centre = day - ink / 2;
  const cx = page[0] + page[2] / 2;
  const zone: Rect | null = withYear ? [page[0], rows[0]! - n.year * CAP - 6, page[2], n.year * CAP + 6 + n.gap] : page;
  const layout: CalendarLayout = { page, yearZone: zone };
  if (weekend) {
    const s = n.split;
    layout.split = {
      saturday: [cx - s.dx, centre - s.dy],
      sunday: [cx + s.dx, centre + s.dy],
      height: s.h,
      line: [page[0] + page[2], centre - ink / 2, page[0], centre + ink / 2],
    };
  }
  return { rows, centre, layout };
}
/** The data a tear-off page draws beside the date: its weekday, holiday, old calendar date and rokuyō, and the Saturday and Sunday of a weekend page. */
export function tearExtras({ options, month, day, locale, ja, pair }: ExtrasInput): Extras {
  const jp = typeof options.japanese === "object" ? options.japanese : { holidays: options.japanese === true, oldDate: options.japanese === true, rokuyo: options.japanese === true };
  const dayInfo = (year: number | undefined, m: number, d: number): DayInfo => dayInfoOf(year, m, d, locale, ja, options.holidays, jp);
  const split = pair ? { saturday: dayInfo(pair.saturday.year, pair.saturday.month, pair.saturday.day), sunday: dayInfo(pair.sunday.year, pair.sunday.month, pair.sunday.day) } : null;
  return { ja, day: dayInfo(options.year, month, day), split, mark: options.mark, columns: options.columns !== false, moon: options.moon !== false };
}

function dayInfoOf(year: number | undefined, month: number, day: number, locale: string, ja: boolean, holidays: CalendarIconOptions["holidays"], jp: { readonly holidays?: boolean; readonly oldDate?: boolean; readonly rokuyo?: boolean }): DayInfo {
  const p = dateParts(month, day, year, locale);
  const real = year !== undefined && p.weekday !== "";
  const weekdayNo = real ? utc(year, month, day).getUTCDay() : undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  const named = (key: string) => (holidays && Object.hasOwn(holidays, key) ? holidays[key] : undefined);
  const found = (year === undefined ? undefined : named(`${String(year).padStart(4, "0")}-${pad(month)}-${pad(day)}`)) ?? named(`${pad(month)}-${pad(day)}`);
  const given = (typeof found === "string" ? found : (ja ? found?.ja : found?.en) ?? found?.en ?? found?.ja ?? "").trim();
  const known = real && jp.holidays && !given ? japaneseHoliday(year, month, day) : null;
  const holiday = given || (known ? (ja ? known.ja : known.en) : "");
  const ink = holiday || weekdayNo === 0 ? "red" : weekdayNo === 6 ? "blue" : "black";
  const old = real && (jp.oldDate || jp.rokuyo) ? oldCalendarDate(year, month, day) : null;
  const oldDate = old && jp.oldDate ? (ja ? `旧${old.leap ? "閏" : ""}${old.month}.${old.day}` : `OLD ${old.leap ? "L" : ""}${old.month}.${old.day}`) : "";
  const six = old && jp.rokuyo ? ROKUYO[(old.month + old.day) % 6]! : null;
  const rokuyo = six ? (ja ? six.ja : six.reading.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()) : "";
  return { year, month, day, weekdayNo, weekday: p.weekday, monthShortUp: p.monthShortUp, holiday, oldDate, rokuyo, ink, label: p.label };
}
