// What can be done to a whole icon without touching a theme's drawing: spiral rings across the top of its page, a slight turn, and a housing (the icon on a disc).
// Only called when one of those options is given: an icon drawn with none of them never passes through here, and is the same bytes as before.

import type { CalendarIconOptions, Rect } from "./types.ts";
import { r2 } from "./kit.ts";

export const CALENDAR_HOUSINGS = ["square", "circle"] as const;
export type CalendarHousing = (typeof CALENDAR_HOUSINGS)[number];

/** The most the icon may be turned either way, in degrees. */
export const CALENDAR_TURN_MAX = 45;

const COLOUR = /^[#a-zA-Z0-9(),.%\s-]{1,64}$/;

/** Throws a RangeError for an option that is not one of ours; otherwise says what was asked for. */
export function checkFrame(o: CalendarIconOptions): { housing: CalendarHousing; rings: number; turn: number; colour: string | undefined } {
  const housing = o.housing ?? "square";
  if (!(CALENDAR_HOUSINGS as readonly string[]).includes(housing)) throw new RangeError(`unknown housing: ${String(housing)}`);
  const rings = o.rings === true ? -1 : o.rings === false || o.rings === undefined ? 0 : o.rings;
  if (typeof rings !== "number" || (rings !== -1 && (!Number.isInteger(rings) || rings < 0 || rings > 24))) throw new RangeError("rings must be true, false or a whole number 0–24");
  const turn = o.turn ?? 0;
  if (!Number.isFinite(turn) || Math.abs(turn) > CALENDAR_TURN_MAX) throw new RangeError(`turn must be between -${CALENDAR_TURN_MAX} and ${CALENDAR_TURN_MAX} degrees`);
  if (o.housingColour !== undefined && !COLOUR.test(o.housingColour)) throw new RangeError("housingColour must be a CSS colour such as #7fb7d4 or rgb(20, 40, 60)");
  return { housing, rings, turn, colour: o.housingColour };
}

/** Spiral rings standing across the top edge `at` (x, y, width) of a page: a dark hole in the page and a silver loop rising from it. */
export function ringsMarkup(at: readonly [number, number, number], count: number, dark: boolean, uid: string): { markup: string; top: number } {
  const [x, y, w] = at;
  const n = count > 0 ? count : Math.max(4, Math.min(14, Math.round(w / 22)));
  const pitch = w / n;
  const rise = pitch * 0.78;
  const k = dark ? { hole: "#07080a", a: "#eef1f5", b: "#a3a9b4", c: "#626976" } : { hole: "#26272b", a: "#f6f6f8", b: "#b0b3ba", c: "#737780" };
  let out = `<defs><linearGradient id="${uid}-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${k.a}"/><stop offset=".45" stop-color="${k.b}"/><stop offset="1" stop-color="${k.c}"/></linearGradient></defs>`;
  for (let i = 0; i < n; i += 1) {
    const cx = x + pitch * (i + 0.5);
    out += `<ellipse cx="${r2(cx)}" cy="${r2(y + pitch * 0.12)}" rx="${r2(pitch * 0.3)}" ry="${r2(pitch * 0.2)}" fill="${k.hole}"/>`;
    out += `<rect x="${r2(cx - pitch * 0.17)}" y="${r2(y - rise)}" width="${r2(pitch * 0.34)}" height="${r2(rise + pitch * 0.1)}" rx="${r2(pitch * 0.17)}" fill="url(#${uid}-r)" stroke="${k.hole}" stroke-opacity=".35" stroke-width="${r2(pitch * 0.03)}"/>`;
  }
  return { markup: out, top: y - rise };
}

/** The finished drawing, in the box it needs: the rings added (and the box grown upward to hold them), then turned, then set on a disc. Returns the markup and its viewBox. */
export function frame(inner: string, box: Rect, o: { housing: CalendarHousing; turn: number; colour: string | undefined; dark: boolean; uid: string; ringsTop: number | undefined }): { markup: string; box: Rect } {
  let [x, y, w, h] = box;
  if (o.ringsTop !== undefined && o.ringsTop < y) {
    h += y - o.ringsTop;
    y = o.ringsTop;
  }
  let markup = inner;
  if (o.turn) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rad = (Math.abs(o.turn) * Math.PI) / 180;
    const nw = w * Math.cos(rad) + h * Math.sin(rad);
    const nh = w * Math.sin(rad) + h * Math.cos(rad);
    markup = `<g transform="rotate(${r2(o.turn)} ${r2(cx)} ${r2(cy)})">${markup}</g>`;
    [x, y, w, h] = [cx - nw / 2, cy - nh / 2, nw, nh];
  }
  if (o.housing === "circle") {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = Math.hypot(w, h) / 2 / 0.88;
    const fill = o.colour ?? (o.dark ? "#2e4b5d" : "#80b8d6");
    const disc =
      `<defs><linearGradient id="${o.uid}-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="${o.dark ? ".1" : ".3"}"/><stop offset=".6" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>` +
      `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="${fill}"/><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="url(#${o.uid}-h)"/>`;
    markup = disc + markup;
    [x, y, w, h] = [cx - r, cy - r, 2 * r, 2 * r];
  }
  return { markup, box: [x, y, w, h] };
}
