// Types shared by the renderer, the shared drawing kit and every theme. Nothing here exists at run time.

import type { CalendarTheme } from "./names.ts";
import type { CalendarHousing } from "./frame.ts";
import type { CalendarPreset } from "./presets.ts";

export interface CalendarIconOptions {
  /** Month 1–12. */
  month: number;
  /** Day of the month 1–31. */
  day: number;
  /** Four-digit year. Names the weekday (and a small year) where a theme draws them; omit it to leave both off. */
  year?: number;
  theme?: CalendarTheme;
  /** `en` (the default) or any locale `Intl` accepts. */
  locale?: string;
  scheme?: "light" | "dark";
  /** Width in CSS pixels. Height follows the theme's shape. Default 96. */
  size?: number;
  /** `"split"` draws a Saturday and the Sunday after it on one page, cut by a diagonal (themes `sun` and `roll`, and only when a year is given and the day is a Saturday or a Sunday). Any other day keeps its own page. */
  weekend?: "split";
  /** Holiday names for the side columns, by date (`"2027-01-01"`) or by day of every year (`"01-01"`): one string, or one per language. The library knows none itself; a date with no name leaves its cell empty. */
  holidays?: Readonly<Record<string, string | { readonly en?: string; readonly ja?: string }>>;
  /** SVG shapes that replace the sun's red disc: drawn in a box from -100,-100 to 100,100 centred behind the day. Your own markup, written as given: no scripts, styles, event attributes or foreign objects. */
  mark?: string;
  /** The side columns of `sun` and `roll` (weekday, month, holiday). Default true. */
  columns?: boolean;
  /**
   * What the side columns add from the Japanese calendar, computed (`src/japaneseCalendar.ts`), never looked up: `holidays` the day's public holiday (国民の祝日, 2000 to 2099; a name in
   * `holidays` above wins), `oldDate` the old calendar date (旧暦, 1900 to 2100) and `rokuyo` the day of the six-day cycle (六曜). `true` is all three; a cell the method cannot settle is
   * left empty. Off by default, so a page drawn without it is as before. A weekend page shows the holiday only.
   */
  japanese?: boolean | { readonly holidays?: boolean; readonly oldDate?: boolean; readonly rokuyo?: boolean };
  /** The moon phase on `plain`, drawn when a year is given. Default true. */
  moon?: boolean;
  /** `"circle"` sets the icon on a coloured disc. Default `"square"`: the icon alone. */
  housing?: CalendarHousing;
  /** The disc's colour, any CSS colour. A soft blue (a deep one in dark) by default. */
  housingColour?: string;
  /** Spiral rings across the top of the page, on the themes that have no binding of their own (`badge`, `frame`, `sun`, `roll`, `plain`, `squircle`); the others ignore it. `true` fits the page; a number sets how many (0–24). Default off. */
  rings?: boolean | number;
  /** A slight turn of the whole icon, in degrees, clockwise when positive (older macOS icons stood a little askew). −45 to 45. Default 0. */
  turn?: number;
  /** A named set of the three options above (`CALENDAR_PRESETS`). An option you give yourself wins over it. */
  preset?: CalendarPreset;
}

/** The date, month and weekday words of one icon, in the icon's locale. */
export interface Parts {
  month: string;
  monthUp: string;
  monthShort: string;
  monthShortUp: string;
  weekday: string;
  day: string;
  year: string;
  label: string;
}

/** x, y, width, height, in the drawing's own units. */
export type Rect = readonly [x: number, y: number, width: number, height: number];

/** Where a theme puts the day and the year; a theme's `layout` says it once and the drawing and the tests both read it. */
export interface CalendarLayout {
  /** The page the day is centred in, across and (as one block with the month word and the year, when the page shares them) down. */
  page: Rect;
  /** The room the year chip sits in: it keeps the minimum size and the margin from the bottom of this. `null` for a look with no year chip. */
  yearZone: Rect | null;
  /** Only on a weekend page: where the two numerals sit (their centres), how tall they are, and the diagonal that cuts the page (from top right to bottom left). */
  split?: { saturday: readonly [number, number]; sunday: readonly [number, number]; height: number; line: readonly [number, number, number, number] };
}

/** The data a tear-off theme draws beside the date itself. */
export interface Extras {
  ja: boolean;
  day: DayInfo;
  /** The Saturday and the Sunday of a weekend page. */
  split: { saturday: DayInfo; sunday: DayInfo } | null;
  mark: string | undefined;
  columns: boolean;
  moon: boolean;
}

export interface Ctx {
  p: Parts;
  dark: boolean;
  uid: string;
  month: number;
  dayNo: number;
  yearNo: number | undefined;
  l: CalendarLayout;
  x: Extras;
  /** `rings` were asked for: a theme that draws its own binding leaves it out. */
  rings: boolean;
}


/** What a tear-off page says about one day. */
export interface DayInfo {
  year: number | undefined;
  month: number;
  day: number;
  /** 0 Sunday to 6 Saturday; undefined without a year or for a day the month does not have. */
  weekdayNo: number | undefined;
  weekday: string;
  monthShortUp: string;
  holiday: string;
  /** The old calendar date and the rokuyō, as the side column writes them; empty where not asked for or not sure. */
  oldDate: string;
  rokuyo: string;
  /** The ink the day is written in: Saturday blue, Sunday and a holiday red, any other day black. */
  ink: "black" | "blue" | "red";
  label: string;
}

/** What a theme that draws more than the date asks the renderer to work out for it (the tear-off pages: weekday, holiday, old date, weekend). */
export interface ExtrasInput {
  options: CalendarIconOptions;
  month: number;
  day: number;
  locale: string;
  ja: boolean;
  /** The Saturday and Sunday of a weekend page, when one is asked for and the day is a weekend day. */
  pair: { saturday: { year: number; month: number; day: number }; sunday: { year: number; month: number; day: number } } | null;
}

export interface Def {
  /** The drawing's own coordinate box: x, y, width, height. */
  box: Rect;
  /** Where the day sits in its page. Every theme centres it; a look that places it otherwise says so here, for 1, 9, 30 and 31 alike. */
  numeral: "centre";
  /** The layout with a year and without one (the drawing is re-centred when the year is absent), and, for a theme with a weekend page, as that page. */
  layout: (year: boolean, weekend?: boolean) => CalendarLayout;
  draw: (c: Ctx) => string;
  /** Where `rings` stand: x, y and width of the page's top edge, in the drawing's units. A theme without it ignores `rings`. */
  rings?: readonly [x: number, y: number, width: number];
  /** The theme has a weekend page (`weekend: "split"`). */
  weekend?: true;
  /** Works out the extra data a tear-off page draws. A theme without it is given none. */
  extras?: (input: ExtrasInput) => Extras;
}
