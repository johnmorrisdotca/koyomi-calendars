// The calendar, not the drawing: a date's weekend, the phase of the moon, the words of a date in a locale.

import type { Parts } from "./types.ts";

/**
 * A day on the calendar: a four-digit year, a month 1 to 12 and a day of the month.
 * @example
 * ```ts
 * import { calendarWeekend, type CalendarDate } from "@johnmorrisdotca/koyomi-calendars";
 *
 * const saturday: CalendarDate | undefined = calendarWeekend(2026, 11, 7)?.saturday;
 * console.log(saturday);
 * ```
 */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/**
 * The Saturday and the Sunday of the weekend a date is in.
 *
 * The Sunday may be in the next month or year.
 *
 * @param year - Four-digit year.
 * @param month - Month 1 to 12.
 * @param day - Day of the month.
 * @returns The two days, or `null` for a weekday, a day the month does not have, or a weekend that runs outside years 1 to 9999.
 * @example
 * ```ts
 * import { calendarWeekend } from "@johnmorrisdotca/koyomi-calendars";
 *
 * console.log(calendarWeekend(2026, 11, 7));
 * console.log(calendarWeekend(2026, 11, 4));
 * ```
 */
export function calendarWeekend(year: number, month: number, day: number): { saturday: CalendarDate; sunday: CalendarDate } | null {
  const at = utc(year, month, day);
  if (at.getUTCMonth() !== month - 1 || at.getUTCDate() !== day) return null;
  const weekday = at.getUTCDay();
  if (weekday !== 6 && weekday !== 0) return null;
  const other = new Date(at.getTime() + (weekday === 6 ? 1 : -1) * 86400000);
  const [saturday, sunday] = weekday === 6 ? [at, other] : [other, at];
  const out = { saturday: dateOf(saturday), sunday: dateOf(sunday) };
  return out.saturday.year < 1 || out.sunday.year > 9999 ? null : out;
}

export function utc(year: number, month: number, day: number): Date {
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCFullYear(year);
  return date;
}

export function dateOf(date: Date): CalendarDate {
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

const MOON_MONTH = 29.530588853;
const NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

/**
 * The phase of the moon at noon UTC on a date, in eighths of a lunation: 0 new, 2 first quarter, 4 full, 6 last quarter.
 *
 * A mean lunation from a known new moon, so it can be a day out near the turn of a phase.
 *
 * @param year - Four-digit year.
 * @param month - Month 1 to 12.
 * @param day - Day of the month.
 * @returns A whole number 0 to 7.
 * @example
 * ```ts
 * import { calendarMoon } from "@johnmorrisdotca/koyomi-calendars";
 *
 * console.log(calendarMoon(2026, 11, 3));
 * ```
 */
export function calendarMoon(year: number, month: number, day: number): number {
  const age = (((utc(year, month, day).getTime() + 12 * 3600000 - NEW_MOON) / 86400000) % MOON_MONTH + MOON_MONTH) % MOON_MONTH;
  return Math.round((age / MOON_MONTH) * 8) % 8;
}

export function localeOf(value: string | undefined): string {
  const wanted = value?.trim() || "en";
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(wanted).length ? wanted : "en";
  } catch {
    return "en";
  }
}

export function dateParts(month: number, day: number, year: number | undefined, locale: string): Parts {
  const first = new Date(Date.UTC(year ?? 2000, month - 1, 1));
  const date = new Date(Date.UTC(year ?? 2000, month - 1, day));
  if (year !== undefined && year < 100) {
    first.setUTCFullYear(year);
    date.setUTCFullYear(year);
  }
  const fmt = (when: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...o, timeZone: "UTC" }).format(when);
  const monthLong = fmt(first, { month: "long" });
  const monthShort = fmt(first, { month: "short" });
  // A day the month does not have (30 February) has no weekday.
  const weekday = year === undefined || date.getUTCMonth() !== month - 1 ? "" : fmt(date, { weekday: "long" });
  const yearText = year === undefined ? "" : String(year);
  const up = (s: string) => s.toLocaleUpperCase(locale);
  const label = new Intl.Locale(locale).language === "ja"
    ? `${year === undefined ? "" : `${year}年`}${month}月${day}日${weekday ? `（${weekday}）` : ""}`
    : [weekday, monthShort, String(day), yearText].filter(Boolean).join(" ");
  return { month: monthLong, monthUp: up(monthLong), monthShort, monthShortUp: up(monthShort), weekday, day: String(day), year: yearText, label };
}

// ---------- helpers ----------
