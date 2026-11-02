// A whole month as one SVG: a wall poster, a memo board, a spiral-bound wall page or a desk pad. Its own import
// (`@johnmorrisdotca/koyomi-calendars/month`), so the small icon never carries it. Dates are plain arithmetic; the words are Intl's.
// No holiday is known here: a day's note comes from the caller.

import { BLACK, CJK, esc, fit, part, r2, rect, SANS, topRound, tx } from "./kit.ts";
import { ringsMarkup } from "./frame.ts";
import { localeOf } from "./date.ts";
import type { Rect } from "./types.ts";

export const MONTH_DESIGNS = ["poster", "board", "wall", "desk"] as const;
export type MonthDesign = (typeof MONTH_DESIGNS)[number];

export const MONTH_DESIGN_LABELS: Record<MonthDesign, { en: string; ja: string }> = {
  poster: { en: "Poster", ja: "ポスター" },
  board: { en: "Memo board", ja: "メモボード" },
  wall: { en: "Wall page", ja: "壁掛け" },
  desk: { en: "Desk pad", ja: "卓上" },
};

export type WeekStart = "sunday" | "monday";

export interface MonthCalendarOptions {
  /** Four-digit year, 1–9999. */
  year: number;
  /** Month 1–12. */
  month: number;
  design?: MonthDesign;
  /** The first column: `"sunday"` (the default) or `"monday"`. */
  weekStart?: WeekStart;
  /** `en` (the default) or any locale `Intl` accepts. Japanese, Chinese and Korean put the year before the month. */
  locale?: string;
  scheme?: "light" | "dark";
  /** Width in CSS pixels. Height follows the design. Default 480. */
  size?: number;
  /** A short note for a day, by date (`"2026-11-07"`) or by day of every year (`"11-07"`). Two lines fit; more is cut. The library knows no holiday: every note is yours. */
  notes?: Readonly<Record<string, string>>;
  /** Saturday blue and Sunday red. Default: on for Japanese, off for any other language. */
  tint?: boolean;
  /** The days of the months either side, faint, in the first and last row. Default true for `wall` and `desk`, false for the others. */
  outside?: boolean;
  /** A small calendar of the next month (`poster` and `board`). Default true for `poster`. */
  mini?: boolean;
}

export interface MonthDay {
  year: number;
  month: number;
  day: number;
  /** 0 Sunday to 6 Saturday. */
  weekday: number;
  /** False for a day of the month before or after, shown to fill the first and last week. */
  inMonth: boolean;
}

export interface MonthGrid {
  year: number;
  month: number;
  weekStart: WeekStart;
  daysInMonth: number;
  /** Cells before the 1st in the first week. */
  offset: number;
  /** 4, 5 or 6 weeks of seven. */
  weeks: MonthDay[][];
}

/** How many days a month has: leap years by the Gregorian rule (a year divisible by 4, but not by 100 unless by 400). */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function at(year: number, month: number, day: number): Date {
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);
  return date;
}

/** The weeks of a month: whole weeks of seven, from the week of the 1st to the week of the last day. */
export function monthGrid(year: number, month: number, weekStart: WeekStart = "sunday"): MonthGrid {
  if (!Number.isInteger(year) || year < 1 || year > 9999) throw new RangeError("year must be an integer 1–9999");
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError("month must be an integer 1–12");
  if (weekStart !== "sunday" && weekStart !== "monday") throw new RangeError(`unknown week start: ${String(weekStart)}`);
  const count = daysInMonth(year, month);
  const first = at(year, month, 1).getUTCDay();
  const offset = (first - (weekStart === "monday" ? 1 : 0) + 7) % 7;
  const rows = Math.ceil((offset + count) / 7);
  const start = at(year, month, 1).getTime() - offset * 86400000;
  const weeks: MonthDay[][] = [];
  for (let w = 0; w < rows; w += 1) {
    const week: MonthDay[] = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(start + (w * 7 + d) * 86400000);
      const y = date.getUTCFullYear();
      const m = date.getUTCMonth() + 1;
      week.push({ year: y, month: m, day: date.getUTCDate(), weekday: date.getUTCDay(), inMonth: y === year && m === month });
    }
    weeks.push(week);
  }
  return { year, month, weekStart, daysInMonth: count, offset, weeks };
}

const YEAR_FIRST = new Set(["ja", "zh", "ko"]);

interface Words {
  ja: boolean;
  yearFirst: boolean;
  monthShort: string;
  monthLong: string;
  year: string;
  weekdays: string[];
  narrow: string[];
  /** The month and year as one line, in the order the language writes them. */
  title: string;
  label: string;
}

function words(year: number, month: number, weekStart: WeekStart, locale: string): Words {
  const language = new Intl.Locale(locale).language;
  const ja = language === "ja";
  const yearFirst = YEAR_FIRST.has(language);
  const fmt = (o: Intl.DateTimeFormatOptions, d: Date) => new Intl.DateTimeFormat(locale, { ...o, timeZone: "UTC" }).format(d);
  const m = at(year, month, 1);
  const up = (s: string) => s.toLocaleUpperCase(locale);
  const monthShort = up(fmt({ month: "short" }, m));
  const monthLong = fmt({ month: "long" }, m);
  const yearText = ja ? `${year}年` : String(year);
  const list = (width: "short" | "narrow") => Array.from({ length: 7 }, (_, i) => fmt({ weekday: width }, new Date(Date.UTC(2023, 0, 1 + ((i + (weekStart === "monday" ? 1 : 0)) % 7)))));
  const title = ja ? `${year}年${month}月` : yearFirst ? `${year} ${monthLong}` : `${monthLong} ${year}`;
  return { ja, yearFirst, monthShort, monthLong, year: yearText, weekdays: list("short").map(up), narrow: list("narrow").map(up), title, label: title };
}

// ---------- pieces ----------

interface Colours {
  paper: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  accent: string;
  accentInk: string;
  sat: string;
  sun: string;
  pen: string;
}

const NOTE_FONT = "'Bradley Hand','Segoe Print','Comic Sans MS',ui-rounded,cursive";

/** A note cut into at most `lines` lines that fit `width` at `size`, the last ending in an ellipsis when something is left out. */
function wrap(text: string, size: number, width: number, lines: number): string[] {
  const w = (s: string) => [...s].reduce((a, ch) => a + (CJK.test(ch) ? 1 : 0.56), 0) * size;
  const out: string[] = [];
  let rest = text.trim().replace(/\s+/g, " ");
  while (rest && out.length < lines) {
    let take = 0;
    let used = 0;
    let lastSpace = -1;
    for (const ch of rest) {
      const next = used + (CJK.test(ch) ? 1 : 0.56) * size;
      if (next > width) break;
      used = next;
      take += ch.length;
      if (ch === " ") lastSpace = take;
    }
    if (take >= rest.length) {
      out.push(rest);
      rest = "";
      break;
    }
    if (take === 0) take = 1;
    if (lastSpace > 0 && !CJK.test(rest[take] ?? "")) take = lastSpace;
    out.push(rest.slice(0, take).trim());
    rest = rest.slice(take).trim();
  }
  if (rest && out.length) {
    let last = out[out.length - 1]!;
    while (last && w(`${last}…`) > width) last = [...last].slice(0, -1).join("");
    out[out.length - 1] = `${last.trimEnd()}…`;
  }
  return out;
}

interface GridLook {
  box: Rect;
  headerH: number;
  /** "short" names (MON) or "narrow" initials (M). */
  head: "short" | "narrow";
  vlines: boolean;
  hlines: boolean;
  border: boolean;
  numSize: number;
  numAnchor: "start" | "end";
  headSize: number;
  noteSize: number;
  headFill?: string;
  noteFont?: string;
  lineW: number;
}

function inkOf(c: Colours, weekday: number, tint: boolean): string {
  return tint && weekday === 0 ? c.sun : tint && weekday === 6 ? c.sat : c.ink;
}

function drawGrid(g: MonthGrid, w: Words, c: Colours, look: GridLook, o: { tint: boolean; outside: boolean; notes: MonthCalendarOptions["notes"] }): string {
  const [x, y, bw, bh] = look.box;
  const rows = g.weeks.length;
  const cw = bw / 7;
  const top = y + look.headerH;
  const ch = (bh - look.headerH) / rows;
  let out = "";
  const names = look.head === "narrow" ? w.narrow : w.weekdays;
  const monday = g.weekStart === "monday";
  names.forEach((name, i) => {
    const weekday = (i + (monday ? 1 : 0)) % 7;
    out += tx(x + cw * (i + 0.5), y + look.headerH * 0.68, name, look.headSize, look.headFill ?? inkOf(c, weekday, o.tint), 700, { spacing: look.head === "narrow" ? 0 : 1 });
  });
  const stroke = `stroke="${c.line}" stroke-width="${look.lineW}"`;
  if (look.border) out += `<rect x="${r2(x)}" y="${r2(top)}" width="${r2(bw)}" height="${r2(bh - look.headerH)}" fill="none" ${stroke}/>`;
  let lines = "";
  if (look.vlines) for (let i = look.border ? 1 : 0; i < (look.border ? 7 : 8); i += 1) lines += `M${r2(x + cw * i)} ${r2(top)}V${r2(y + bh)}`;
  if (look.hlines) for (let i = look.border ? 1 : 0; i < (look.border ? rows : rows + 1); i += 1) lines += `M${r2(x)} ${r2(top + ch * i)}H${r2(x + bw)}`;
  if (lines) out += `<path d="${lines}" fill="none" ${stroke}/>`;
  const named = (d: MonthDay) => {
    const n = o.notes;
    if (!n) return undefined;
    const mm = String(d.month).padStart(2, "0");
    const dd = String(d.day).padStart(2, "0");
    const key = `${String(d.year).padStart(4, "0")}-${mm}-${dd}`;
    return (Object.hasOwn(n, key) ? n[key] : undefined) ?? (Object.hasOwn(n, `${mm}-${dd}`) ? n[`${mm}-${dd}`] : undefined);
  };
  g.weeks.forEach((week, r) => {
    week.forEach((d, i) => {
      if (!d.inMonth && !o.outside) return;
      const cx = x + cw * i;
      const cy = top + ch * r;
      const pad = Math.min(cw, ch) * 0.1;
      const ax = look.numAnchor === "start" ? cx + pad : cx + cw - pad;
      const colour = d.inMonth ? inkOf(c, d.weekday, o.tint) : c.faint;
      out += part("day", tx(ax, cy + pad + look.numSize * 0.72, String(d.day), look.numSize, colour, 600, { anchor: look.numAnchor }));
      const note = d.inMonth ? named(d) : undefined;
      if (note) {
        const lines2 = wrap(note, look.noteSize, cw - pad * 2, 2);
        out += part("note", lines2.map((line, k) => tx(cx + pad, cy + pad + look.numSize * 1.2 + look.noteSize * (1.15 + k * 1.2), line, look.noteSize, c.pen, 500, { anchor: "start", family: look.noteFont ?? SANS, italic: look.noteFont !== undefined })).join(""));
      }
    });
  });
  return out;
}

/** A small calendar of a month: its name, the weekday initials and the dates, in `width` units. */
function mini(g: MonthGrid, w: Words, c: Colours, x: number, y: number, width: number, tint: boolean): string {
  const cw = width / 7;
  const size = cw * 0.4;
  let out = tx(x, y + size * 0.8, w.monthShort, size * 1.3, c.accent, 800, { anchor: "start", spacing: 1 });
  const monday = g.weekStart === "monday";
  w.narrow.forEach((name, i) => (out += tx(x + cw * (i + 0.5), y + size * 3.1, name, size * 0.9, c.muted, 700)));
  g.weeks.forEach((week, r) => {
    week.forEach((d, i) => {
      if (d.inMonth) out += tx(x + cw * (i + 0.5), y + size * 4.9 + r * size * 1.8, String(d.day), size, inkOf(c, (i + (monday ? 1 : 0)) % 7, tint), 500);
    });
  });
  return `<g data-part="mini">${out}</g>`;
}

function nextMonth(year: number, month: number): [number, number] {
  return month === 12 ? [year + 1, 1] : [year, month + 1];
}

/** The ring row: spiral wire along the top edge of a page. */
const wire = (x: number, y: number, width: number, count: number, dark: boolean, uid: string) => ringsMarkup([x, y, width], count, dark, uid).markup;

// ---------- the designs ----------

const COLOURS: Record<MonthDesign, { light: Colours; dark: Colours }> = {
  poster: {
    light: { paper: "#f2e9d9", ink: "#9e2f2a", muted: "#c48b84", faint: "#d9b9b3", line: "#9e2f2a", accent: "#9e2f2a", accentInk: "#f2e9d9", sat: "#2f5a9e", sun: "#b8261f", pen: "#9e2f2a" },
    dark: { paper: "#211a18", ink: "#f0b8ac", muted: "#a47770", faint: "#5b4440", line: "#d9695a", accent: "#e0705f", accentInk: "#211a18", sat: "#8db0ee", sun: "#ff8d7d", pen: "#f0b8ac" },
  },
  board: {
    light: { paper: "#f6f1e6", ink: "#3a3633", muted: "#8f877b", faint: "#c9c1b2", line: "#d4ccbc", accent: "#b23c3c", accentInk: "#f6f1e6", sat: "#2f5a9e", sun: "#b23c3c", pen: "#26397a" },
    dark: { paper: "#26221f", ink: "#ece4d8", muted: "#9d9486", faint: "#5a534b", line: "#4a443d", accent: "#e0706a", accentInk: "#26221f", sat: "#8db0ee", sun: "#ff8d85", pen: "#9bb0f0" },
  },
  wall: {
    light: { paper: "#f7f7f4", ink: "#1d1d1f", muted: "#8e8e90", faint: "#c4c4c2", line: "#cfcfcd", accent: "#c2162f", accentInk: "#ffffff", sat: "#1f4ea6", sun: "#c2162f", pen: "#26397a" },
    dark: { paper: "#1f2023", ink: "#f0f0ec", muted: "#9a9a9c", faint: "#4f5054", line: "#3d3e42", accent: "#a3162b", accentInk: "#ffffff", sat: "#7ba7ff", sun: "#ff6f55", pen: "#9bb0f0" },
  },
  desk: {
    light: { paper: "#ffffff", ink: "#26313a", muted: "#8a96a0", faint: "#c8d0d6", line: "#d3dae0", accent: "#d3402c", accentInk: "#ffffff", sat: "#1f4ea6", sun: "#d3402c", pen: "#26397a" },
    dark: { paper: "#1d2429", ink: "#e8eef2", muted: "#8f9ba4", faint: "#46515a", line: "#38434b", accent: "#b33322", accentInk: "#ffffff", sat: "#7ba7ff", sun: "#ff7a63", pen: "#9bb0f0" },
  },
};

/** The size of each design's drawing: width and height in its own units. */
const SIZE: Record<MonthDesign, readonly [number, number]> = { poster: [600, 780], board: [600, 780], wall: [600, 820], desk: [820, 620] };

/** A whole month as an SVG. */
export function monthCalendar(options: MonthCalendarOptions): string {
  const design = options.design ?? "poster";
  if (!(MONTH_DESIGNS as readonly string[]).includes(design)) throw new RangeError(`unknown month design: ${String(design)}`);
  const g = monthGrid(options.year, options.month, options.weekStart);
  const size = options.size ?? 480;
  if (!Number.isFinite(size) || size < 120 || size > 2048) throw new RangeError("size must be 120–2048");
  const locale = localeOf(options.locale);
  const w = words(g.year, g.month, g.weekStart, locale);
  const dark = options.scheme === "dark";
  const c = COLOURS[design][dark ? "dark" : "light"];
  const tint = options.tint ?? w.ja;
  const outside = options.outside ?? (design === "wall" || design === "desk");
  const uid = `mon-${design}-${g.year}-${g.month}-${dark ? "d" : "l"}`;
  const [vw, vh] = SIZE[design];
  const grid = (look: GridLook) => drawGrid(g, w, c, look, { tint, outside, notes: options.notes });
  let body = "";
  if (design === "poster") {
    const word = w.ja ? `${g.month}月` : w.monthShort;
    const s = fit(word, 200, 360, w.ja ? 0.62 : 0.8);
    const showMini = options.mini ?? true;
    const [ny, nm] = nextMonth(g.year, g.month);
    body =
      rect(0, 0, vw, vh, 0, c.paper) +
      wire(30, 28, 540, 60, dark, uid) +
      part("year", tx(34, 78, w.ja ? `${g.year}年` : String(g.year), 22, c.accent, 700, { anchor: "start", spacing: 2 })) +
      part("month", tx(30, 84 + s * 0.78, word, s, c.accent, 900, { anchor: "start", family: BLACK })) +
      (showMini ? mini(monthGrid(ny, nm, g.weekStart), words(ny, nm, g.weekStart, locale), c, 412, 92, 160, tint) : "") +
      grid({ box: [30, 270, 540, 480], headerH: 36, head: "short", vlines: true, hlines: true, border: true, numSize: 15, numAnchor: "start", headSize: 14, noteSize: 10.5, lineW: 1.3 });
  } else if (design === "board") {
    const word = w.ja ? `${g.month}月` : w.monthShort;
    const s = fit(word, 190, 400, w.ja ? 0.62 : 0.8);
    const showMini = options.mini ?? false;
    const [ny, nm] = nextMonth(g.year, g.month);
    body =
      rect(0, 0, vw, vh, 22, c.paper) +
      part("year", tx(44, 64, w.ja ? `${g.year}年` : String(g.year), 24, c.muted, 700, { anchor: "start", spacing: 2 })) +
      part("month", tx(564, 60 + s * 0.78, word, s, c.accent, 900, { anchor: "end", family: BLACK })) +
      (showMini ? mini(monthGrid(ny, nm, g.weekStart), words(ny, nm, g.weekStart, locale), c, 44, 100, 150, tint) : "") +
      grid({ box: [36, 270, 528, 480], headerH: 28, head: "narrow", vlines: true, hlines: true, border: false, numSize: 13, numAnchor: "start", headSize: 13, noteSize: 11.5, noteFont: NOTE_FONT, lineW: 1 });
  } else if (design === "wall") {
    body =
      rect(24, 62, 552, 740, 22, c.paper, `stroke="${c.line}" stroke-width="1.4"`) +
      topRound(24, 62, 552, 168, 22, c.accent) +
      wire(64, 58, 472, 24, dark, uid) +
      part("year", tx(300, 128, w.ja ? `${g.year}年` : String(g.year), 28, c.accentInk, 700, { spacing: 3, opacity: 0.85 })) +
      part("month", tx(300, 204, w.ja ? `${g.month}月` : w.monthLong.toLocaleUpperCase(locale), fit(w.ja ? `${g.month}月` : w.monthLong, 66, 480, w.ja ? 0.62 : 0.74), c.accentInk, 800, { spacing: w.ja ? 0 : 3 })) +
      grid({ box: [24, 230, 552, 572], headerH: 40, head: "short", vlines: true, hlines: false, border: false, numSize: 22, numAnchor: "end", headSize: 14, noteSize: 10, lineW: 1 });
  } else {
    body =
      rect(10, 46, 800, 564, 18, c.line) +
      rect(30, 78, 760, 512, 6, c.paper) +
      topRound(30, 78, 760, 112, 6, c.accent) +
      wire(70, 52, 680, 30, dark, uid) +
      part("month", tx(62, 154, w.ja ? `${g.month}月` : w.monthLong.toLocaleUpperCase(locale), fit(w.ja ? `${g.month}月` : w.monthLong, 76, 460, w.ja ? 0.62 : 0.74), c.accentInk, 800, { anchor: "start", spacing: w.ja ? 0 : 2 })) +
      part("year", tx(758, 148, w.ja ? `${g.year}年` : String(g.year), 44, c.accentInk, 700, { anchor: "end", opacity: 0.9 })) +
      grid({ box: [30, 196, 760, 394], headerH: 34, head: "short", vlines: true, hlines: true, border: true, numSize: 17, numAnchor: "end", headSize: 13, noteSize: 10, lineW: 1 });
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${r2(size)}" height="${Math.round((size * vh) / vw)}" role="img" aria-label="${esc(w.label)}"><title>${esc(w.label)}</title>${body}</svg>`;
}
