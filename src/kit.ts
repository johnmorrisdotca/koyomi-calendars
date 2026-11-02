// What every theme draws with: text, strokes, shapes and the stroke-drawn digits. Pure functions that return SVG markup.

export const SANS = "ui-sans-serif,system-ui,Roboto,Helvetica,Arial,sans-serif";
export const BLACK = "'Arial Black','Helvetica Neue',Arial,sans-serif";
export const SERIF = "Georgia,'Times New Roman',serif";

export const CJK = /[⺀-鿿豈-﫿＀-￯가-힯]/u;

/** The font size that keeps a string inside `maxWidth`, given the average glyph width `f` (in em). */
export function fit(s: string, size: number, maxWidth: number, f: number): number {
  let em = 0;
  for (const ch of s) em += CJK.test(ch) ? 1 : f;
  return em * size > maxWidth ? (maxWidth / em) : size;
}

export interface TextOptions {
  family?: string;
  anchor?: "start" | "middle" | "end";
  spacing?: number;
  italic?: boolean;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

export function tx(x: number, y: number, value: string, size: number, fill: string, weight: number, o: TextOptions = {}): string {
  if (!value) return "";
  const attrs = [
    `x="${r2(x)}"`,
    `y="${r2(y)}"`,
    `text-anchor="${o.anchor ?? "middle"}"`,
    `font-size="${r2(size)}"`,
    `font-family="${o.family ?? SANS}"`,
    `font-weight="${weight}"`,
    `fill="${fill}"`,
  ];
  if (o.italic) attrs.push('font-style="italic"');
  if (o.spacing) attrs.push(`letter-spacing="${r2(o.spacing)}"`);
  if (o.stroke) attrs.push(`stroke="${o.stroke}" stroke-width="${r2(o.strokeWidth ?? 1)}" paint-order="stroke" stroke-linejoin="round"`);
  if (o.opacity !== undefined) attrs.push(`opacity="${o.opacity}"`);
  return `<text ${attrs.join(" ")}>${esc(value)}</text>`;
}

/** The day as text, moved right where its last digit is a 1. */
export function dayText(x: number, y: number, day: string, size: number, fill: string, weight: number, o: TextOptions = {}): string {
  return tx(x + optical(day, size), y, day, size, fill, weight, o);
}

/** A single-line string of text fitted to a width. */
export function fitted(x: number, y: number, value: string, size: number, maxWidth: number, f: number, fill: string, weight: number, o: TextOptions = {}): string {
  return tx(x, y, value, fit(value, size, maxWidth, f), fill, weight, o);
}


const SK: Record<string, string> = {
  "0": "M5 .5C1.8 .5 1 4 1 8s.8 7.5 4 7.5S9 12 9 8 8.2 .5 5 .5Z",
  "1": "M.6 4.2 3.8 .5v15",
  "2": "M1.4 4.4C1.4 2 3 .5 5 .5s3.6 1.5 3.6 3.7C8.6 7.2 5 9.2 1.4 15.5h7.5",
  "3": "M1.3 2.6C2.4 1.1 3.7.5 5 .5c2.2 0 3.4 1.3 3.4 3.3 0 2.3-1.7 3.5-3.9 3.5 2.5.1 4.2 1.5 4.2 4.3 0 2.4-1.7 3.9-3.9 3.9-1.8 0-3-.7-3.6-2.3",
  "4": "M7 15.5V.5L1 11h8.6",
  "5": "M8.3 .5H2.6l-.7 6.6c1-.7 2-1 3-1 2.3 0 3.8 1.6 3.8 4.4 0 3-1.7 5-4 5-1.7 0-3-.7-3.6-2.2",
  "6": "M8 2C7 1 6 .5 5 .5 2.5 .5 1.3 3.5 1.3 9c0 4.5 1.2 6.5 3.7 6.5 2.4 0 3.7-1.8 3.7-4.5 0-2.7-1.5-4.5-3.7-4.5-1.8 0-3.4 1.2-3.7 3",
  "7": "M1.2 .5h7.6L3.8 15.5",
  "8": "M5 7.5C2.8 7.5 1.6 6.2 1.6 4S3 .5 5 .5s3.4 1.3 3.4 3.5S7.2 7.5 5 7.5c-2.6 0-3.9 1.7-3.9 4.2s1.7 3.8 3.9 3.8 3.9-1.3 3.9-3.8S7.6 7.5 5 7.5Z",
  "9": "M8 2C7 1 6 .5 5 .5 2.5 .5 1.3 3.5 1.3 9c0 4.5 1.2 6.5 3.7 6.5 2.4 0 3.7-1.8 3.7-4.5 0-2.7-1.5-4.5-3.7-4.5-1.8 0-3.4 1.2-3.7 3",
};
// Where each digit's ink lies across its 10-unit box (from its path's own outline), so a number is centred by its ink, not by its box.
const INK: Record<string, readonly [number, number]> = {
  "0": [1, 9],
  "1": [0.6, 3.8],
  "2": [1.4, 8.9],
  "3": [1.2, 8.7],
  "4": [1, 9.6],
  "5": [1.1, 8.7],
  "6": [1.3, 8.7],
  "7": [1.2, 8.8],
  "8": [1.1, 8.9],
  "9": [1.3, 8.7],
};

// The same extents once a digit is leaned 12 degrees about its middle (the leaned ink, so a leaned number is centred by what is seen).
const INK_LEAN: Record<string, readonly [number, number]> = {
  "0": [0.5, 9.5],
  "1": [1.4, 5.4],
  "2": [-0.2, 9.6],
  "3": [0, 9.4],
  "4": [0.3, 9],
  "5": [0, 9.9],
  "6": [0.7, 9.3],
  "7": [2.2, 10.5],
  "8": [0.2, 9.4],
  "9": [0.7, 9.4],
  "1b": [-2.4, 5.6],
};

export interface DigitOptions {
  slant?: number;
  /** The space between one digit's ink and the next, in digit units (a digit is 16 tall). */
  gap?: number;
  cap?: "round" | "butt" | "square";
  base?: boolean;
  /** Narrows every digit to this share of its width (a condensed face): the strokes keep their thickness. */
  condense?: number;
  /** Centre the number by the ink it really draws, stroke included, not by the middle of the strokes (for a heavy face). */
  inked?: boolean;
}

const squeezed = new Map<string, string>();
/** A path with every x coordinate multiplied by `xs` (its strokes are drawn afterwards, so they keep their thickness). */
function squeeze(d: string, xs: number): string {
  if (xs === 1) return d;
  const key = `${xs}|${d}`;
  const known = squeezed.get(key);
  if (known) return known;
  const out = d.replace(/([a-zA-Z])([^a-zA-Z]*)/g, (_, cmd: string, args: string) => {
    const n = (args.match(/-?\d*\.?\d+/g) ?? []).map(Number);
    const low = cmd.toLowerCase();
    const moved = n.map((v, i) => (low === "h" || (low !== "v" && i % 2 === 0) ? v * xs : v));
    return `${cmd}${moved.map(r3).join(" ")}`;
  });
  squeezed.set(key, out);
  return out;
}

/** The number drawn as strokes: its ink centred on `cx` and `cy`, `h` tall, `sw` thick. One size for every number. */
export function digits(value: string, cx: number, cy: number, h: number, sw: number, color: string, o: DigitOptions = {}): string {
  const gap = o.gap ?? 5;
  const lean = (o.slant ?? 0) / 12;
  const xs = o.condense ?? 1;
  const k = h / 16;
  const half = o.inked ? sw / (2 * k) : 0;
  const ink = [...value].map((d) => {
    const flat = o.base && d === "1" ? ([-0.8, 7.2] as const) : INK[d]!;
    const leaned = INK_LEAN[o.base && d === "1" ? "1b" : d]!;
    const pad = o.base && d === "1" ? 0 : half;
    return [(flat[0] + (leaned[0] - flat[0]) * lean) * xs - pad, (flat[1] + (leaned[1] - flat[1]) * lean) * xs + pad] as const;
  });
  const top = cy - h / 2;
  const total = ink.reduce((a, [l, r]) => a + r - l, 0) + gap * (ink.length - 1);
  let at = cx - (total * k) / 2;
  let out = "";
  [...value].forEach((d, i) => {
    const [l, r] = ink[i]!;
    const path = d === "9" ? `<path d="${squeeze(SK["6"]!, xs)}" transform="rotate(180 ${r2(5 * xs)} 8)"/>` : `<path d="${squeeze(SK[d]!, xs)}"/>`;
    const serif = o.base && d === "1" ? `<path d="${squeeze("M-.8 15.5h8", xs)}"/>` : "";
    out += `<g transform="translate(${r2(at - l * k)} ${r2(top)}) scale(${r3(k)})" stroke-width="${r3(sw / k)}">${path}${serif}</g>`;
    at += (r - l + gap) * k;
  });
  const cap = o.cap ?? "round";
  const inner = `<g fill="none" stroke="${color}" stroke-linecap="${cap}" stroke-linejoin="${cap === "butt" ? "miter" : "round"}">${out}</g>`;
  if (!o.slant) return inner;
  return `<g transform="translate(${r2(cx)} ${r2(cy)}) skewX(${-o.slant}) translate(${r2(-cx)} ${r2(-cy)})">${inner}</g>`;
}


export const CAP = 0.716;

/** A 1 is drawn narrow and to the left of its box in the fonts a page falls back to, so a day that ends in one is moved right by this share of its size. */
const ONE = 0.035;
export const optical = (day: string, size: number): number => (day.endsWith("1") ? ONE * size : 0);

/** The baselines of lines stacked top to bottom (each with its cap height and the gap above it), centred between `top` and `bottom`. */
export function stack(top: number, bottom: number, rows: ReadonlyArray<readonly [cap: number, gap: number]>): number[] {
  const total = rows.reduce((sum, [cap, gap], i) => sum + cap + (i ? gap : 0), 0);
  let y = top + (bottom - top - total) / 2;
  return rows.map(([cap, gap], i) => {
    y += (i ? gap : 0) + cap;
    return y;
  });
}

/** Marks a part of the drawing (`day`, `month`, `year`) so a test, or a page's own style, can find it. */
export function part(name: "day" | "month" | "year" | "weekday" | "monthno" | "saturday" | "sunday" | "note", markup: string): string {
  return markup ? `<g data-part="${name}">${markup}</g>` : "";
}

export function rect(x: number, y: number, w: number, h: number, r: number, fill: string, extra = ""): string {
  return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}" rx="${r2(r)}" fill="${fill}"${extra ? ` ${extra}` : ""}/>`;
}

export function circle(x: number, y: number, radius: number, fill: string, extra = ""): string {
  return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(radius)}" fill="${fill}"${extra ? ` ${extra}` : ""}/>`;
}

/** A rectangle with only the top corners rounded. */
export function topRound(x: number, y: number, w: number, h: number, r: number, fill: string, extra = ""): string {
  return `<path d="M${r2(x)} ${r2(y + h)}V${r2(y + r)}a${r2(r)} ${r2(r)} 0 0 1 ${r2(r)} ${r2(-r)}h${r2(w - 2 * r)}a${r2(r)} ${r2(r)} 0 0 1 ${r2(r)} ${r2(r)}V${r2(y + h)}Z" fill="${fill}"${extra ? ` ${extra}` : ""}/>`;
}

// ---------- the tear-off pages (sun, roll, plain) ----------


export function esc(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function r3(n: number): number {
  return Math.round(n * 1000) / 1000;
}