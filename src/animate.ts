// Turning the page from one date to the next, forwards or backwards. Its own import (`@johnmorrisdotca/koyomi-calendars/animate`): a drawn icon carries none of this.
// It needs a browser (the Web Animations API) and nothing else: no dependency, and it imports no theme. You hand it a function that draws a date
// (any theme, any option, `calendarIcon` from the whole library or from one theme alone), and it moves the sheet. The whole icon is the sheet.
// `prefers-reduced-motion` is respected: the new date just appears.

/**
 * The four ways a page turns: `tear-down`, `fly-up`, `rip-corner` and `flip-down`.
 * @example
 * ```ts
 * import { CALENDAR_FLIPS } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(CALENDAR_FLIPS.join(", "));
 * ```
 */
export const CALENDAR_FLIPS = ["tear-down", "fly-up", "rip-corner", "flip-down"] as const;
/**
 * One of the names in `CALENDAR_FLIPS`.
 * @example
 * ```ts
 * import { CALENDAR_FLIP_LABELS, type CalendarFlip } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * const flip: CalendarFlip = "rip-corner";
 * console.log(CALENDAR_FLIP_LABELS[flip].en);
 * ```
 */
export type CalendarFlip = (typeof CALENDAR_FLIPS)[number];

/**
 * Each flip's name for a picker, in English and in Japanese.
 * @example
 * ```ts
 * import { CALENDAR_FLIP_LABELS } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(CALENDAR_FLIP_LABELS["tear-down"].ja);
 * ```
 */
export const CALENDAR_FLIP_LABELS: Record<CalendarFlip, { en: string; ja: string }> = {
  "tear-down": { en: "Tear down", ja: "下へちぎる" },
  "fly-up": { en: "Fly up", ja: "上へ飛ばす" },
  "rip-corner": { en: "Rip to a corner", ja: "角から破る" },
  "flip-down": { en: "Flip down", ja: "下へめくる" },
};

/**
 * A day to show or turn to: a year, a month 1 to 12 and a day of the month.
 * @example
 * ```ts
 * import { nextDay, type FlipDate } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * const today: FlipDate = { year: 2026, month: 11, day: 3 };
 * console.log(nextDay(today));
 * ```
 */
export interface FlipDate {
  year: number;
  month: number;
  day: number;
}

function at(date: FlipDate): Date {
  const d = new Date(Date.UTC(2000, date.month - 1, date.day));
  d.setUTCFullYear(date.year);
  return d;
}

/**
 * The date `days` after (or before, when negative) `date`: across months, years and leap days.
 *
 * @param date - The day to start from.
 * @param days - How many days to add; negative goes back.
 * @returns The day reached.
 * @example
 * ```ts
 * import { addDays } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(addDays({ year: 2028, month: 2, day: 28 }, 2));
 * ```
 */
export function addDays(date: FlipDate, days: number): FlipDate {
  const d = at(date);
  d.setUTCDate(d.getUTCDate() + days);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}
/**
 * The day after `date`.
 *
 * @param date - A year, month and day.
 * @returns The next day, across the end of a month or a year.
 * @example
 * ```ts
 * import { nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(nextDay({ year: 2026, month: 12, day: 31 }));
 * ```
 */
export const nextDay = (date: FlipDate): FlipDate => addDays(date, 1);
/**
 * The day before `date`.
 *
 * @param date - A year, month and day.
 * @returns The previous day, across the start of a month or a year.
 * @example
 * ```ts
 * import { previousDay } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(previousDay({ year: 2026, month: 1, day: 1 }));
 * ```
 */
export const previousDay = (date: FlipDate): FlipDate => addDays(date, -1);

/**
 * Which way a turn from one day to another goes.
 *
 * @param from - The day shown now.
 * @param to - The day to turn to.
 * @returns −1 when `to` is before `from`, 1 when after, 0 when the same day.
 * @example
 * ```ts
 * import { compareDays } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(compareDays({ year: 2026, month: 11, day: 3 }, { year: 2026, month: 11, day: 4 }));
 * ```
 */
export function compareDays(from: FlipDate, to: FlipDate): -1 | 0 | 1 {
  const a = at(from).getTime();
  const b = at(to).getTime();
  return b < a ? -1 : b > a ? 1 : 0;
}

type Frame = Record<string, string | number>;

/**
 * What the sheet does as it goes: from lying on the pad (the first frame) to gone (the last).
 * @example
 * ```ts
 * import { FLIP_KEYFRAMES } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(FLIP_KEYFRAMES["fly-up"].frames.length, FLIP_KEYFRAMES["fly-up"].easing);
 * ```
 */
export const FLIP_KEYFRAMES: Record<CalendarFlip, { frames: Frame[]; origin: string; easing: string; perspective?: number }> = {
  "tear-down": {
    origin: "50% 0%",
    easing: "cubic-bezier(.5,0,.9,.6)",
    frames: [
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: "translate(0,3%) rotate(-1.5deg)", opacity: 1, offset: 0.22 },
      { transform: "translate(2%,125%) rotate(7deg)", opacity: 0.9 },
    ],
  },
  "fly-up": {
    origin: "50% 100%",
    easing: "cubic-bezier(.4,0,.8,.5)",
    frames: [
      { transform: "translate(0,0) rotate(0deg) scale(1)", opacity: 1 },
      { transform: "translate(0,4%) rotate(0deg) scale(.98)", opacity: 1, offset: 0.18 },
      { transform: "translate(-4%,-135%) rotate(-9deg) scale(.9)", opacity: 0.9 },
    ],
  },
  "rip-corner": {
    origin: "0% 0%",
    easing: "cubic-bezier(.45,0,.85,.55)",
    frames: [
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: "translate(-1%,1%) rotate(-7deg)", opacity: 1, offset: 0.3 },
      { transform: "translate(-45%,-95%) rotate(-62deg)", opacity: 0.85 },
    ],
  },
  "flip-down": {
    origin: "50% 100%",
    easing: "cubic-bezier(.45,0,.75,.5)",
    perspective: 900,
    frames: [
      { transform: "rotateX(0deg)", opacity: 1 },
      { transform: "rotateX(-70deg)", opacity: 1, offset: 0.6 },
      { transform: "rotateX(-120deg)", opacity: 0 },
    ],
  },
};

/**
 * What `flipCalendar` takes: how to draw a date, the two dates, and how the page turns.
 * @example
 * ```ts
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
 * import type { FlipOptions } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * const options: FlipOptions = {
 *   render: (date) => calendarIcon({ theme: "pins", ...date }),
 *   from: { year: 2026, month: 11, day: 3 },
 *   to: { year: 2026, month: 11, day: 4 },
 *   animation: "fly-up",
 * };
 * console.log(options.animation);
 * ```
 */
export interface FlipOptions {
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

const running = new WeakMap<Element, { finish: () => void }>();

/**
 * Does the reader ask for less motion?
 *
 * @returns `true` when the browser reports `prefers-reduced-motion: reduce`; `false` otherwise, and outside a browser.
 * @example
 * ```ts
 * import { reducedMotion } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * console.log(reducedMotion());
 * ```
 */
export function reducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Turns the icon in `host` from one date to another.
 *
 * It needs a browser (the Web Animations API). The host's content afterwards is the one new icon, as if drawn plainly.
 *
 * @param host - The element that holds the icon now.
 * @param options - How to draw a date, the two dates and the animation: {@link FlipOptions}.
 * @returns The date now shown, once the turn has finished (`options.to`).
 * @example
 * ```ts no-run
 * import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
 * import { flipCalendar } from "@johnmorrisdotca/koyomi-calendars/animate";
 *
 * const host = document.querySelector<HTMLElement>("#today")!;
 * await flipCalendar(host, {
 *   render: (date) => calendarIcon({ theme: "pins", ...date }),
 *   from: { year: 2026, month: 11, day: 3 },
 *   to: { year: 2026, month: 11, day: 4 },
 * });
 * ```
 */
export async function flipCalendar(host: HTMLElement, options: FlipOptions): Promise<FlipDate> {
  const { render, from, to } = options;
  running.get(host)?.finish();
  const direction = compareDays(from, to);
  const motion = options.motion ?? "auto";
  const still = direction === 0 || motion === "never" || (motion === "auto" && reducedMotion()) || typeof host.animate !== "function";
  const name = options.animation ?? "tear-down";
  const look = FLIP_KEYFRAMES[name];
  if (!look) throw new RangeError(`unknown flip: ${String(name)}`);
  if (still) {
    host.innerHTML = render(to);
    return to;
  }
  const doc = host.ownerDocument;
  const layer = (svg: string, top: boolean) => {
    const el = doc.createElement("div");
    el.dataset.koyomi = top ? "sheet" : "base";
    el.style.cssText = top ? "position:absolute;inset:0;pointer-events:none;will-change:transform" : "position:relative";
    el.innerHTML = svg;
    return el;
  };
  const saved = { position: host.style.position, perspective: host.style.perspective, display: host.style.display };
  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  if (look.perspective) host.style.perspective = `${look.perspective}px`;
  // Forwards, the old sheet leaves and the new one lies under it; backwards, the old date lies there and the earlier sheet comes back on top.
  const forward = direction === 1;
  const base = layer(render(forward ? to : from), false);
  const sheet = layer(render(forward ? from : to), true);
  sheet.style.transformOrigin = look.origin;
  host.replaceChildren(base, sheet);
  const duration = options.duration ?? 650;
  const animation = sheet.animate(look.frames as Keyframe[], { duration, easing: look.easing, fill: "both", direction: forward ? "normal" : "reverse" });
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    running.delete(host);
    host.innerHTML = render(to);
    host.style.position = saved.position;
    host.style.perspective = saved.perspective;
    host.style.display = saved.display;
  };
  running.set(host, { finish: () => { animation.cancel(); end(); } });
  try {
    await animation.finished;
  } catch {
    /* cancelled by a newer flip: it has already put its date there */
  }
  end();
  return to;
}
