// Named sets of the housing, rings and turn options: a word instead of three settings.

import type { CalendarHousing } from "./frame.ts";

/**
 * The three options a preset sets: a housing, rings and a turn.
 * @example
 * ```ts
 * import { CALENDAR_PRESETS, type CalendarLook } from "@johnmorrisdotca/koyomi-calendars";
 *
 * const look: CalendarLook = CALENDAR_PRESETS.disc;
 * console.log(look);
 * ```
 */
export interface CalendarLook {
  housing?: CalendarHousing;
  rings?: boolean;
  turn?: number;
}

/**
 * The named looks: `flat`, `disc`, `ringed`, `tilted` and `disc-ringed`.
 *
 * An option you give yourself wins over the preset's.
 * @example
 * ```ts
 * import { CALENDAR_PRESETS } from "@johnmorrisdotca/koyomi-calendars";
 *
 * console.log(Object.keys(CALENDAR_PRESETS).join(", "));
 * ```
 */
export const CALENDAR_PRESETS = {
  /** The icon alone, upright: what you get with no option. */
  flat: {},
  /** On a round disc. */
  disc: { housing: "circle" },
  /** Spiral rings across the top. */
  ringed: { rings: true },
  /** Turned a little to the left, as the older macOS icons stood. */
  tilted: { turn: -8 },
  /** Ringed, on a disc. */
  "disc-ringed": { housing: "circle", rings: true },
} as const satisfies Record<string, CalendarLook>;

/**
 * One of the names in `CALENDAR_PRESETS`.
 * @example
 * ```ts
 * import { calendarIcon, type CalendarPreset } from "@johnmorrisdotca/koyomi-calendars";
 *
 * const preset: CalendarPreset = "disc-ringed";
 * console.log(calendarIcon({ month: 11, day: 3, preset }).startsWith("<svg"));
 * ```
 */
export type CalendarPreset = keyof typeof CALENDAR_PRESETS;

/**
 * Reads a preset's name.
 *
 * @param name - A preset word, in any case.
 * @returns The preset, or `null` when the word is not one of ours.
 * @example
 * ```ts
 * import { calendarPresetOf } from "@johnmorrisdotca/koyomi-calendars";
 *
 * console.log(calendarPresetOf("Disc"), calendarPresetOf("nope"));
 * ```
 */
export function calendarPresetOf(name: string | null | undefined): CalendarPreset | null {
  const id = name?.trim().toLowerCase();
  return id && Object.hasOwn(CALENDAR_PRESETS, id) ? (id as CalendarPreset) : null;
}
