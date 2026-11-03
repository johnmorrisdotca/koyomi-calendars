# @johnmorrisdotca/koyomi-calendars API reference

Every export of @johnmorrisdotca/koyomi-calendars 0.1.1, one section for each entry point, written by `pnpm docs:api` from the built declarations. Do not edit it by hand: `pnpm docs:check` fails when it is out of date. The guides are in [docs/guides](guides/getting-started.md).

## `@johnmorrisdotca/koyomi-calendars`

21 values and 10 types.

```js
import { CALENDAR_HOUSINGS, CALENDAR_PRESETS, CALENDAR_THEME_ALIASES, CALENDAR_THEME_LABELS, CALENDAR_THEMES, CALENDAR_TURN_MAX, CALENDAR_YEAR_CLEAR, CALENDAR_YEAR_MIN, calendarIcon, calendarLayout, calendarMoon, calendarPresetOf, calendarThemeOf, calendarWeekend, JAPANESE_HOLIDAY_YEARS, japaneseHoliday, japaneseHolidaysOf, OLD_CALENDAR_YEARS, oldCalendarDate, ROKUYO, rokuyoOf } from '@johnmorrisdotca/koyomi-calendars';
```

### CALENDAR_HOUSINGS

*constant*

```ts
const CALENDAR_HOUSINGS: readonly ["square", "circle"];
```

### CALENDAR_PRESETS

*constant*

```ts
const CALENDAR_PRESETS: {
    /** The icon alone, upright: what you get with no option. */
    readonly flat: {};
    /** On a round disc. */
    readonly disc: {
        readonly housing: "circle";
    };
    /** Spiral rings across the top. */
    readonly ringed: {
        readonly rings: true;
    };
    /** Turned a little to the left, as the older macOS icons stood. */
    readonly tilted: {
        readonly turn: -8;
    };
    /** Ringed, on a disc. */
    readonly "disc-ringed": {
        readonly housing: "circle";
        readonly rings: true;
    };
};
```

### CALENDAR_THEME_ALIASES

*constant*. The ten names of 0.12 and 0.13, still accepted: each reads as the theme that replaced it.

```ts
const CALENDAR_THEME_ALIASES: Readonly<Record<string, CalendarTheme>>;
```

### CALENDAR_THEME_LABELS

*constant*

```ts
const CALENDAR_THEME_LABELS: Record<CalendarTheme, {
    en: string;
    ja: string;
}>;
```

### CALENDAR_THEMES

*constant*

```ts
const CALENDAR_THEMES: readonly ["pins", "loops", "shadow", "heavy", "cartoon", "flip", "stack", "line", "curl", "soft", "desk", "thin", "frame", "badge", "sun", "roll", "plain", "squircle"];
```

### CALENDAR_TURN_MAX

*constant*. The most the icon may be turned either way, in degrees.

```ts
const CALENDAR_TURN_MAX = 45;
```

### CALENDAR_YEAR_CLEAR

*constant*

```ts
const CALENDAR_YEAR_CLEAR = 0.03;
```

### CALENDAR_YEAR_MIN

*constant*. The year is never smaller than this share of the drawing's width (its font size), and keeps this share clear of the bottom of its zone.

```ts
const CALENDAR_YEAR_MIN = 0.07;
```

### calendarIcon

*function*. An original calendar-page SVG for a month, day and optional year. The library does not read the clock.

```ts
function calendarIcon(options: CalendarIconOptions): string;
```

### calendarLayout

*function*. The box, the page and the year's room of a theme, with and without a year. A weekend page places its numerals on the diagonal, on purpose, the same for every weekend.

```ts
function calendarLayout(theme: CalendarTheme, withYear: boolean, weekend?: boolean): CalendarLayout & {
    box: Rect;
    numeral: "centre" | "diagonal";
};
```

### calendarMoon

*function*. The phase of the moon at noon UTC on a date, in eighths of a lunation: 0 new, 2 first quarter, 4 full, 6 last quarter. A mean lunation from a known new moon, so it can be a day out near the turn of a phase.

```ts
function calendarMoon(year: number, month: number, day: number): number;
```

### calendarPresetOf

*function*. The named preset, or null when the word is not one of ours.

```ts
function calendarPresetOf(name: string | null | undefined): CalendarPreset | null;
```

### calendarThemeOf

*function*. The named theme (or an older name for one), or null when the word is not one of ours.

```ts
function calendarThemeOf(name: string | null | undefined): CalendarTheme | null;
```

### calendarWeekend

*function*. The Saturday and the Sunday of the weekend a date is in, or null for a weekday, a day the month does not have, or a weekend that runs outside years 1 to 9999. The Sunday may be in the next month or year.

```ts
function calendarWeekend(year: number, month: number, day: number): {
    saturday: CalendarDate;
    sunday: CalendarDate;
} | null;
```

### JAPANESE_HOLIDAY_YEARS

*constant*. Where holidays are known: the years the rules below describe.

```ts
const JAPANESE_HOLIDAY_YEARS: readonly [number, number];
```

### japaneseHoliday

*function*. The holiday of a day, in both languages, or null (a day with none, or a year the rules do not cover).

```ts
function japaneseHoliday(year: number, month: number, dayOfMonth: number): JapaneseHoliday | null;
```

### japaneseHolidaysOf

*function*. Every holiday of a year, by `YYYY-MM-DD`, for 2000 to 2099; null outside.

```ts
function japaneseHolidaysOf(year: number): ReadonlyMap<string, JapaneseHoliday> | null;
```

### OLD_CALENDAR_YEARS

*constant*. The year range the astronomy is held to.

```ts
const OLD_CALENDAR_YEARS: readonly [number, number];
```

### oldCalendarDate

*function*. The old-calendar date of a Gregorian date, or null when the date is outside 1900 to 2100 or a new moon or principal term falls too near midnight in Japan to be sure.

```ts
function oldCalendarDate(year: number, month: number, dayOfMonth: number): OldDate | null;
```

### ROKUYO

*constant*. The six days in order of (old month + old day) mod 6, with the reading and an English gloss.

```ts
const ROKUYO: readonly Rokuyo[];
```

### rokuyoOf

*function*. The rokuyō of a Gregorian date, or null where the old calendar date is not sure.

```ts
function rokuyoOf(year: number, month: number, dayOfMonth: number): Rokuyo | null;
```

### CalendarDate

*interface*

```ts
interface CalendarDate {
    year: number;
    month: number;
    day: number;
}
```

### CalendarHousing

*type*

```ts
type CalendarHousing = (typeof CALENDAR_HOUSINGS)[number];
```

### CalendarIconOptions

*interface*

```ts
interface CalendarIconOptions {
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
    holidays?: Readonly<Record<string, string | {
        readonly en?: string;
        readonly ja?: string;
    }>>;
    /** SVG shapes that replace the sun's red disc: drawn in a box from -100,-100 to 100,100 centred behind the day. Your own markup, written as given: no scripts, styles, event attributes or foreign objects. */
    mark?: string;
    /** The side columns of `sun` and `roll` (weekday, month, holiday). Default true. */
    columns?: boolean;
    /**
     * What the side columns add from the Japanese calendar, computed (`src/japaneseCalendar.ts`), never looked up: `holidays` the day's public holiday (国民の祝日, 2000 to 2099; a name in
     * `holidays` above wins), `oldDate` the old calendar date (旧暦, 1900 to 2100) and `rokuyo` the day of the six-day cycle (六曜). `true` is all three; a cell the method cannot settle is
     * left empty. Off by default, so a page drawn without it is as before. A weekend page shows the holiday only.
     */
    japanese?: boolean | {
        readonly holidays?: boolean;
        readonly oldDate?: boolean;
        readonly rokuyo?: boolean;
    };
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
```

### CalendarLayout

*interface*. Where a theme puts the day and the year; a theme's `layout` says it once and the drawing and the tests both read it.

```ts
interface CalendarLayout {
    /** The page the day is centred in, across and (as one block with the month word and the year, when the page shares them) down. */
    page: Rect;
    /** The room the year chip sits in: it keeps the minimum size and the margin from the bottom of this. `null` for a look with no year chip. */
    yearZone: Rect | null;
    /** Only on a weekend page: where the two numerals sit (their centres), how tall they are, and the diagonal that cuts the page (from top right to bottom left). */
    split?: {
        saturday: readonly [number, number];
        sunday: readonly [number, number];
        height: number;
        line: readonly [number, number, number, number];
    };
}
```

### CalendarLook

*interface*

```ts
interface CalendarLook {
    housing?: CalendarHousing;
    rings?: boolean;
    turn?: number;
}
```

### CalendarPreset

*type*

```ts
type CalendarPreset = keyof typeof CALENDAR_PRESETS;
```

### CalendarTheme

*type*

```ts
type CalendarTheme = (typeof CALENDAR_THEMES)[number];
```

### JapaneseHoliday

*interface*. The Japanese calendar facts a date page can show, computed and never looked up: the public holidays (`国民の祝日`, kokumin no shukujitsu), the old calendar date

```ts
interface JapaneseHoliday {
    readonly ja: string;
    readonly en: string;
}
```

### OldDate

*interface*

```ts
interface OldDate {
    /** 1 to 12. */
    readonly month: number;
    readonly day: number;
    /** The month is a leap month (閏月) of the number before it. */
    readonly leap: boolean;
}
```

### Rokuyo

*interface*

```ts
interface Rokuyo {
    readonly ja: string;
    readonly reading: string;
    readonly en: string;
}
```

## `@johnmorrisdotca/koyomi-calendars/japanese`

7 values and 3 types.

```js
import { JAPANESE_HOLIDAY_YEARS, japaneseHoliday, japaneseHolidaysOf, OLD_CALENDAR_YEARS, oldCalendarDate, ROKUYO, rokuyoOf } from '@johnmorrisdotca/koyomi-calendars/japanese';
```

### JAPANESE_HOLIDAY_YEARS

*constant*. Where holidays are known: the years the rules below describe.

```ts
const JAPANESE_HOLIDAY_YEARS: readonly [number, number];
```

### japaneseHoliday

*function*. The holiday of a day, in both languages, or null (a day with none, or a year the rules do not cover).

```ts
function japaneseHoliday(year: number, month: number, dayOfMonth: number): JapaneseHoliday | null;
```

### japaneseHolidaysOf

*function*. Every holiday of a year, by `YYYY-MM-DD`, for 2000 to 2099; null outside.

```ts
function japaneseHolidaysOf(year: number): ReadonlyMap<string, JapaneseHoliday> | null;
```

### OLD_CALENDAR_YEARS

*constant*. The year range the astronomy is held to.

```ts
const OLD_CALENDAR_YEARS: readonly [number, number];
```

### oldCalendarDate

*function*. The old-calendar date of a Gregorian date, or null when the date is outside 1900 to 2100 or a new moon or principal term falls too near midnight in Japan to be sure.

```ts
function oldCalendarDate(year: number, month: number, dayOfMonth: number): OldDate | null;
```

### ROKUYO

*constant*. The six days in order of (old month + old day) mod 6, with the reading and an English gloss.

```ts
const ROKUYO: readonly Rokuyo[];
```

### rokuyoOf

*function*. The rokuyō of a Gregorian date, or null where the old calendar date is not sure.

```ts
function rokuyoOf(year: number, month: number, dayOfMonth: number): Rokuyo | null;
```

### JapaneseHoliday

*interface*. The Japanese calendar facts a date page can show, computed and never looked up: the public holidays (`国民の祝日`, kokumin no shukujitsu), the old calendar date

```ts
interface JapaneseHoliday {
    readonly ja: string;
    readonly en: string;
}
```

### OldDate

*interface*

```ts
interface OldDate {
    /** 1 to 12. */
    readonly month: number;
    readonly day: number;
    /** The month is a leap month (閏月) of the number before it. */
    readonly leap: boolean;
}
```

### Rokuyo

*interface*

```ts
interface Rokuyo {
    readonly ja: string;
    readonly reading: string;
    readonly en: string;
}
```

## `@johnmorrisdotca/koyomi-calendars/names`

6 values and 1 type.

```js
import { CALENDAR_THEME_ALIASES, CALENDAR_THEME_LABELS, CALENDAR_THEMES, CALENDAR_YEAR_CLEAR, CALENDAR_YEAR_MIN, calendarThemeOf } from '@johnmorrisdotca/koyomi-calendars/names';
```

### CALENDAR_THEME_ALIASES

*constant*. The ten names of 0.12 and 0.13, still accepted: each reads as the theme that replaced it.

```ts
const CALENDAR_THEME_ALIASES: Readonly<Record<string, CalendarTheme>>;
```

### CALENDAR_THEME_LABELS

*constant*

```ts
const CALENDAR_THEME_LABELS: Record<CalendarTheme, {
    en: string;
    ja: string;
}>;
```

### CALENDAR_THEMES

*constant*

```ts
const CALENDAR_THEMES: readonly ["pins", "loops", "shadow", "heavy", "cartoon", "flip", "stack", "line", "curl", "soft", "desk", "thin", "frame", "badge", "sun", "roll", "plain", "squircle"];
```

### CALENDAR_YEAR_CLEAR

*constant*

```ts
const CALENDAR_YEAR_CLEAR = 0.03;
```

### CALENDAR_YEAR_MIN

*constant*. The year is never smaller than this share of the drawing's width (its font size), and keeps this share clear of the bottom of its zone.

```ts
const CALENDAR_YEAR_MIN = 0.07;
```

### calendarThemeOf

*function*. The named theme (or an older name for one), or null when the word is not one of ours.

```ts
function calendarThemeOf(name: string | null | undefined): CalendarTheme | null;
```

### CalendarTheme

*type*

```ts
type CalendarTheme = (typeof CALENDAR_THEMES)[number];
```

## `@johnmorrisdotca/koyomi-calendars/month`

5 values and 5 types.

```js
import { daysInMonth, MONTH_DESIGN_LABELS, MONTH_DESIGNS, monthCalendar, monthGrid } from '@johnmorrisdotca/koyomi-calendars/month';
```

### daysInMonth

*function*. How many days a month has: leap years by the Gregorian rule (a year divisible by 4, but not by 100 unless by 400).

```ts
function daysInMonth(year: number, month: number): number;
```

### MONTH_DESIGN_LABELS

*constant*

```ts
const MONTH_DESIGN_LABELS: Record<MonthDesign, {
    en: string;
    ja: string;
}>;
```

### MONTH_DESIGNS

*constant*

```ts
const MONTH_DESIGNS: readonly ["poster", "board", "wall", "desk"];
```

### monthCalendar

*function*. A whole month as an SVG.

```ts
function monthCalendar(options: MonthCalendarOptions): string;
```

### monthGrid

*function*. The weeks of a month: whole weeks of seven, from the week of the 1st to the week of the last day.

```ts
function monthGrid(year: number, month: number, weekStart?: WeekStart): MonthGrid;
```

### MonthCalendarOptions

*interface*

```ts
interface MonthCalendarOptions {
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
```

### MonthDay

*interface*

```ts
interface MonthDay {
    year: number;
    month: number;
    day: number;
    /** 0 Sunday to 6 Saturday. */
    weekday: number;
    /** False for a day of the month before or after, shown to fill the first and last week. */
    inMonth: boolean;
}
```

### MonthDesign

*type*

```ts
type MonthDesign = (typeof MONTH_DESIGNS)[number];
```

### MonthGrid

*interface*

```ts
interface MonthGrid {
    year: number;
    month: number;
    weekStart: WeekStart;
    daysInMonth: number;
    /** Cells before the 1st in the first week. */
    offset: number;
    /** 4, 5 or 6 weeks of seven. */
    weeks: MonthDay[][];
}
```

### WeekStart

*type*

```ts
type WeekStart = "sunday" | "monday";
```

## `@johnmorrisdotca/koyomi-calendars/animate`

9 values and 3 types.

```js
import { addDays, CALENDAR_FLIP_LABELS, CALENDAR_FLIPS, compareDays, FLIP_KEYFRAMES, flipCalendar, nextDay, previousDay, reducedMotion } from '@johnmorrisdotca/koyomi-calendars/animate';
```

### addDays

*function*. The date `days` after (or before, when negative) `date`: across months, years and leap days.

```ts
function addDays(date: FlipDate, days: number): FlipDate;
```

### CALENDAR_FLIP_LABELS

*constant*

```ts
const CALENDAR_FLIP_LABELS: Record<CalendarFlip, {
    en: string;
    ja: string;
}>;
```

### CALENDAR_FLIPS

*constant*

```ts
const CALENDAR_FLIPS: readonly ["tear-down", "fly-up", "rip-corner", "flip-down"];
```

### compareDays

*function*. −1 when `to` is before `from`, 1 when after, 0 when the same day.

```ts
function compareDays(from: FlipDate, to: FlipDate): -1 | 0 | 1;
```

### FLIP_KEYFRAMES

*constant*. What the sheet does as it goes: from lying on the pad (the first frame) to gone (the last).

```ts
const FLIP_KEYFRAMES: Record<CalendarFlip, {
    frames: Frame[];
    origin: string;
    easing: string;
    perspective?: number;
}>;
```

### flipCalendar

*function*. Turns the icon in `host` from one date to another and resolves with the date now shown. The host's content afterwards is the one new icon, as if drawn plainly.

```ts
function flipCalendar(host: HTMLElement, options: FlipOptions): Promise<FlipDate>;
```

### nextDay

*constant*

```ts
const nextDay: (date: FlipDate) => FlipDate;
```

### previousDay

*constant*

```ts
const previousDay: (date: FlipDate) => FlipDate;
```

### reducedMotion

*function*. Does the reader ask for less motion?

```ts
function reducedMotion(): boolean;
```

### CalendarFlip

*type*

```ts
type CalendarFlip = (typeof CALENDAR_FLIPS)[number];
```

### FlipDate

*interface*

```ts
interface FlipDate {
    year: number;
    month: number;
    day: number;
}
```

### FlipOptions

*interface*

```ts
interface FlipOptions {
    /** Draws a date: it returns the SVG of an icon. `(d) => calendarIcon({ theme: "pins", ...d })`, or one theme's own `calendarIcon`. */
    render: (date: FlipDate) => string;
    /** The date the host shows now. */
    from: FlipDate;
    /** The date to turn to. Later than `from` turns forwards, earlier turns backwards (the page that left comes back). */
    to: FlipDate;
    animation?: CalendarFlip;
    /** Milliseconds. Default 650. */
    duration?: number;
    /** `"auto"` (the default) respects the reader's reduced-motion setting; `"never"` never animates; `"always"` ignores the setting. */
    motion?: "auto" | "never" | "always";
}
```

## `@johnmorrisdotca/koyomi-calendars/themes/pins`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/pins';
```

### calendarIcon

*function*. The `pins` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/loops`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/loops';
```

### calendarIcon

*function*. The `loops` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/shadow`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/shadow';
```

### calendarIcon

*function*. The `shadow` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/heavy`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/heavy';
```

### calendarIcon

*function*. The `heavy` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/cartoon`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/cartoon';
```

### calendarIcon

*function*. The `cartoon` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/flip`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/flip';
```

### calendarIcon

*function*. The `flip` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/stack`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/stack';
```

### calendarIcon

*function*. The `stack` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/line`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/line';
```

### calendarIcon

*function*. The `line` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/curl`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/curl';
```

### calendarIcon

*function*. The `curl` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/soft`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/soft';
```

### calendarIcon

*function*. The `soft` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/desk`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/desk';
```

### calendarIcon

*function*. The `desk` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/thin`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/thin';
```

### calendarIcon

*function*. The `thin` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/frame`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/frame';
```

### calendarIcon

*function*. The `frame` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/badge`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/badge';
```

### calendarIcon

*function*. The `badge` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/sun`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/sun';
```

### calendarIcon

*function*. The `sun` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/roll`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/roll';
```

### calendarIcon

*function*. The `roll` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/squircle`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/squircle';
```

### calendarIcon

*function*. The `squircle` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```

## `@johnmorrisdotca/koyomi-calendars/themes/plain`

2 values and 0 types.

```js
import { calendarIcon, theme } from '@johnmorrisdotca/koyomi-calendars/themes/plain';
```

### calendarIcon

*function*. The `plain` page alone: this theme and what it needs, nothing of the other themes.

```ts
function calendarIcon(options: Omit<CalendarIconOptions, "theme"> & {
    theme?: undefined;
}): string;
```

### theme

*constant*

```ts
const theme: Def;
```
