// Every theme, by name: `calendarIcon` draws any of them. A page that wants one theme imports it from `themes/<name>` instead, and carries none of the others.

import type { CalendarIconOptions, CalendarLayout, Def, Rect } from "./types.ts";
import { calendarThemeOf, type CalendarTheme } from "./names.ts";
import { renderIcon } from "./render.ts";
import { theme as pins } from "./themes/pins.ts";
import { theme as loops } from "./themes/loops.ts";
import { theme as shadow } from "./themes/shadow.ts";
import { theme as heavy } from "./themes/heavy.ts";
import { theme as cartoon } from "./themes/cartoon.ts";
import { theme as flip } from "./themes/flip.ts";
import { theme as stack } from "./themes/stack.ts";
import { theme as line } from "./themes/line.ts";
import { theme as curl } from "./themes/curl.ts";
import { theme as soft } from "./themes/soft.ts";
import { theme as desk } from "./themes/desk.ts";
import { theme as thin } from "./themes/thin.ts";
import { theme as frame } from "./themes/frame.ts";
import { theme as badge } from "./themes/badge.ts";
import { theme as sun } from "./themes/sun.ts";
import { theme as roll } from "./themes/roll.ts";
import { theme as plain } from "./themes/plain.ts";
import { theme as squircle } from "./themes/squircle.ts";

const THEMES: Record<CalendarTheme, Def> = { pins, loops, shadow, heavy, cartoon, flip, stack, line, curl, soft, desk, thin, frame, badge, sun, roll, plain, squircle };

/**
 * An original calendar-page SVG for a month, day and optional year. The library does not read the clock.
 *
 * The design comes from `options.theme` (`pins` when it is left out). Importing this function brings in all 18 designs; to carry one, import its `calendarIcon` from `themes/<name>`.
 *
 * @param options - The date (`month`, `day`, optional `year`) and the look: `theme`, `scheme`, `locale`, `size`, `housing`, `rings`, `turn`, `preset` and the rest of {@link CalendarIconOptions}.
 * @returns The icon as SVG text, `<svg …>…</svg>`. It throws a `RangeError` for a theme, housing, size or turn that is not one of ours.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
 *
 * const svg = calendarIcon({ theme: "squircle", month: 11, day: 3, year: 2026, scheme: "dark" });
 * console.log(svg.startsWith("<svg"));
 * ```
 */
export function calendarIcon(options: CalendarIconOptions): string {
  return renderIcon(options, (name) => {
    const theme = name === undefined ? "pins" : calendarThemeOf(name);
    if (!theme) throw new RangeError(`unknown calendar theme: ${name}`);
    return [theme, THEMES[theme]];
  });
}

/**
 * The box, the page and the year's room of a theme, with and without a year.
 *
 * A weekend page places its numerals on the diagonal, on purpose, the same for every weekend.
 *
 * @param theme - The design to measure.
 * @param withYear - Whether the icon shows a year, which takes room.
 * @param weekend - Whether to lay out a weekend page (only the designs that have one answer differently).
 * @returns The theme's `box` (x, y, width, height), the `page` the day is centred in, the `yearZone`, and whether the numerals sit in the centre or on the diagonal.
 * @example
 * ```ts
 * import { calendarLayout } from "@johnmorrisdotca/koyomi-calendars";
 *
 * const layout = calendarLayout("squircle", true);
 * console.log(layout.box.join(" "), layout.numeral);
 * ```
 */
export function calendarLayout(theme: CalendarTheme, withYear: boolean, weekend = false): CalendarLayout & { box: Rect; numeral: "centre" | "diagonal" } {
  const def = THEMES[theme];
  const layout = def.layout(withYear, weekend && def.weekend === true);
  return { ...layout, box: def.box, numeral: layout.split ? "diagonal" : def.numeral };
}
