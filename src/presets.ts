// Named sets of the housing, rings and turn options: a word instead of three settings.

import type { CalendarHousing } from "./frame.ts";

export interface CalendarLook {
  housing?: CalendarHousing;
  rings?: boolean;
  turn?: number;
}

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

export type CalendarPreset = keyof typeof CALENDAR_PRESETS;

/** The named preset, or null when the word is not one of ours. */
export function calendarPresetOf(name: string | null | undefined): CalendarPreset | null {
  const id = name?.trim().toLowerCase();
  return id && Object.hasOwn(CALENDAR_PRESETS, id) ? (id as CalendarPreset) : null;
}
