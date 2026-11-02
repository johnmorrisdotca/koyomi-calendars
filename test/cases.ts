// The inputs the byte-identical test draws. The same list is run against meigen-sports 0.19.2's own calendarIcon
// (scripts/golden-from-meigen.ts) to make test/golden/meigen-0.19.2.json, and against this package by test/identical.test.ts.

import type { CalendarIconOptions } from "../src/types.ts";

/** The seventeen themes of meigen-sports 0.19.2, in its order. */
export const SEVENTEEN = ["pins", "loops", "shadow", "heavy", "cartoon", "flip", "stack", "line", "curl", "soft", "desk", "thin", "frame", "badge", "sun", "roll", "plain"] as const;
/** The ten names of meigen-sports 0.12 and 0.13, which it still accepts. */
export const OLD_NAMES = ["classic", "outline", "spiral", "bold", "tent", "pad", "minimal", "fold", "tile"] as const;

const DATES: ReadonlyArray<readonly [number, number]> = [[1, 1], [2, 28], [7, 4], [9, 9], [10, 31], [11, 7], [11, 8], [12, 25], [12, 31]];
const YEARS = [undefined, 2026, 2027, 1999] as const;

export function cases(themes: readonly string[]): Array<[string, CalendarIconOptions]> {
  const out: Array<[string, CalendarIconOptions]> = [];
  const add = (options: CalendarIconOptions) => out.push([JSON.stringify(options), options]);
  for (const theme of themes) {
    for (const scheme of ["light", "dark"] as const) {
      for (const year of YEARS) {
        for (const [month, day] of DATES) add({ theme: theme as CalendarIconOptions["theme"], scheme, year, month, day });
      }
      for (const locale of ["ja", "fr", "de", "ar", "zz-nonsense"]) {
        add({ theme: theme as CalendarIconOptions["theme"], scheme, year: 2026, month: 5, day: 5, locale });
        add({ theme: theme as CalendarIconOptions["theme"], scheme, month: 8, day: 14, locale });
      }
      for (const size of [16, 48, 200, 1024]) add({ theme: theme as CalendarIconOptions["theme"], scheme, year: 2026, month: 3, day: 20, size });
    }
    // The tear-off options: weekend pages, the Japanese calendar, holidays, columns, moon, a mark.
    const o = (extra: Partial<CalendarIconOptions>, month = 11, day = 7, year: number | undefined = 2026) => add({ theme: theme as CalendarIconOptions["theme"], month, day, year, ...extra });
    for (const scheme of ["light", "dark"] as const) {
      for (const locale of ["en", "ja"]) {
        o({ scheme, locale, weekend: "split" });
        o({ scheme, locale, weekend: "split" }, 11, 8);
        o({ scheme, locale, weekend: "split" }, 1, 2, 2027);
        o({ scheme, locale, weekend: "split" }, 12, 31, 2023);
        o({ scheme, locale, weekend: "split" }, 11, 5);
        o({ scheme, locale, japanese: true }, 1, 1, 2027);
        o({ scheme, locale, japanese: true }, 5, 3, 2026);
        o({ scheme, locale, japanese: true }, 9, 23, 2026);
        o({ scheme, locale, japanese: { rokuyo: true } }, 2, 11, 2025);
        o({ scheme, locale, japanese: { oldDate: true }, weekend: "split" }, 1, 31, 2026);
        o({ scheme, locale, holidays: { "11-07": "Founders", "2026-11-08": { en: "Day off", ja: "休み" } } });
        o({ scheme, locale, columns: false, weekend: "split" });
        o({ scheme, locale, moon: false });
        o({ scheme, locale, mark: '<circle r="60" fill="#369"/>' });
      }
    }
    o({ month: 2, day: 30, year: 2026 });
    o({ month: 2, day: 29, year: 2028 });
    o({ month: 4, day: 31 });
    o({ theme: undefined, month: 6, day: 6 });
  }
  return out;
}

/** Bad input: the message of each error must stay the same. */
export const BAD: ReadonlyArray<[string, unknown]> = [
  ["month 0", { month: 0, day: 1 }],
  ["month 13", { month: 13, day: 1 }],
  ["month 1.5", { month: 1.5, day: 1 }],
  ["day 0", { month: 1, day: 0 }],
  ["day 32", { month: 1, day: 32 }],
  ["year 0", { month: 1, day: 1, year: 0 }],
  ["year 10000", { month: 1, day: 1, year: 10000 }],
  ["theme", { month: 1, day: 1, theme: "nope" }],
  ["size small", { month: 1, day: 1, size: 8 }],
  ["size big", { month: 1, day: 1, size: 5000 }],
  ["size nan", { month: 1, day: 1, size: Number.NaN }],
  ["weekend", { month: 1, day: 1, weekend: "all" }],
  ["mark script", { month: 1, day: 1, mark: "<script>x</script>" }],
  ["mark on", { month: 1, day: 1, mark: '<circle onclick="x"/>' }],
];

/** The theme names the library accepts, as words: the seventeen, the ten old names, odd spellings. */
export const WORDS: readonly string[] = [...SEVENTEEN, ...OLD_NAMES, "PINS", " loops ", "", "x", "toString", "__proto__", "constructor"];
