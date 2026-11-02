// The one function that turns a theme's drawing into a whole SVG: it checks the options, works out the date's words, and wraps the drawing.
// It knows no theme by name: the caller hands it the one to draw, so a page that imports one theme carries only that theme.

import type { CalendarIconOptions, Def, Extras } from "./types.ts";
import type { CalendarTheme } from "./names.ts";
import { calendarWeekend, dateParts, localeOf } from "./date.ts";
import { esc, r1, r2 } from "./kit.ts";
import { checkFrame, frame, ringsMarkup } from "./frame.ts";
import { CALENDAR_PRESETS, calendarPresetOf } from "./presets.ts";

const UNSAFE_MARK = /<\s*(script|style|foreignObject|iframe|object|embed)|\son[a-z]+\s*=|javascript:/i;

/** `pick` is called after the date is checked and before the size is: it names the theme (and may refuse an unknown one). */
export function renderIcon(given: CalendarIconOptions, pick: (theme: string | undefined) => readonly [CalendarTheme, Def]): string {
  const options = withPreset(given);
  const month = options.month;
  const day = options.day;
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError("month must be an integer 1–12");
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new RangeError("day must be an integer 1–31");
  if (options.year !== undefined && (!Number.isInteger(options.year) || options.year < 1 || options.year > 9999)) {
    throw new RangeError("year must be an integer 1–9999");
  }
  const [theme, def] = pick(options.theme);
  const locale = localeOf(options.locale);
  const dark = options.scheme === "dark";
  const size = options.size ?? 96;
  if (!Number.isFinite(size) || size < 16 || size > 1024) throw new RangeError("size must be 16–1024");
  if (options.weekend !== undefined && options.weekend !== "split") throw new RangeError(`unknown weekend page: ${String(options.weekend)}`);
  if (options.mark !== undefined && UNSAFE_MARK.test(options.mark)) throw new RangeError("mark must be plain SVG shapes: no script, style, event attribute or foreign object");
  const parts = dateParts(month, day, options.year, locale);
  const ja = new Intl.Locale(locale).language === "ja";
  const pair = options.weekend === "split" && def.weekend && options.year !== undefined ? calendarWeekend(options.year, month, day) : null;
  let label = parts.label;
  if (pair) {
    const one = (d: { year: number; month: number; day: number }) => dateParts(d.month, d.day, d.year, locale).label;
    label = `${one(pair.saturday)}${ja ? "と" : " and "}${one(pair.sunday)}`;
  }
  const uid = pair ? `cal-${theme}-${pair.saturday.month}-${pair.saturday.day}-${pair.saturday.year}-${dark ? "d" : "l"}-w` : `cal-${theme}-${month}-${day}-${options.year ?? "x"}-${dark ? "d" : "l"}`;
  const [x, y, w, h] = def.box;
  const extras: Extras = def.extras ? def.extras({ options, month, day, locale, ja, pair }) : { ja, day: NO_DAY, split: null, mark: undefined, columns: true, moon: true };
  const framed = options.housing !== undefined || options.housingColour !== undefined || options.rings !== undefined || options.turn !== undefined ? checkFrame(options) : null;
  const ringsOn = framed !== null && framed.rings !== 0 && def.rings !== undefined;
  const body = def.draw({ p: parts, dark, uid, month, dayNo: day, yearNo: options.year, l: def.layout(parts.year !== "", pair !== null), x: extras, rings: ringsOn });
  if (framed !== null && (ringsOn || framed.housing !== "square" || framed.turn !== 0)) {
    const rings = ringsOn ? ringsMarkup(def.rings!, framed.rings, dark, uid) : null;
    const done = frame(rings ? body + rings.markup : body, def.box, { housing: framed.housing, turn: framed.turn, colour: framed.colour, dark, uid, ringsTop: rings?.top });
    const [fx, fy, fw, fh] = done.box;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r2(fx)} ${r2(fy)} ${r2(fw)} ${r2(fh)}" width="${r1(size)}" height="${Math.round((size * fh) / fw)}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${done.markup}</svg>`;
  }
  const height = Math.round((size * h) / w);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${r1(size)}" height="${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;
}

const NO_DAY = { year: undefined, month: 1, day: 1, weekdayNo: undefined, weekday: "", monthShortUp: "", holiday: "", oldDate: "", rokuyo: "", ink: "black", label: "" } as const;

/** The options with a named preset laid under them: what the caller set wins. */
function withPreset(o: CalendarIconOptions): CalendarIconOptions {
  if (o.preset === undefined) return o;
  const name = calendarPresetOf(o.preset);
  if (!name) throw new RangeError(`unknown calendar preset: ${String(o.preset)}`);
  const look: Record<string, unknown> = { ...CALENDAR_PRESETS[name] };
  for (const [key, value] of Object.entries(o)) if (value !== undefined) look[key] = value;
  return look as unknown as CalendarIconOptions;
}
