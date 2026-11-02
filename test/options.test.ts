import assert from "node:assert/strict";
import test from "node:test";
import { CALENDAR_PRESETS, CALENDAR_THEMES, calendarIcon, calendarPresetOf } from "../src/index.ts";
import type { CalendarTheme } from "../src/index.ts";

const base = { month: 11, day: 2, year: 2026 } as const;
const RINGED: CalendarTheme[] = ["badge", "frame", "sun", "roll", "plain", "squircle"];
const viewBox = (svg: string) => /viewBox="([^"]+)"/.exec(svg)![1]!.split(" ").map(Number) as [number, number, number, number];

test("an option that is not given, or is given as its default, changes nothing", () => {
  for (const theme of CALENDAR_THEMES) {
    const plain = calendarIcon({ theme, ...base });
    assert.equal(calendarIcon({ theme, ...base, housing: "square", rings: false, turn: 0 }), plain, theme);
    assert.equal(calendarIcon({ theme, ...base, preset: "flat" }), plain, theme);
    assert.equal(calendarIcon({ theme, ...base, rings: 0 }), plain, theme);
  }
});

test("rings are drawn on the designs without a binding of their own, and ignored by the others", () => {
  for (const theme of CALENDAR_THEMES) {
    const ringed = calendarIcon({ theme, ...base, rings: true });
    const plain = calendarIcon({ theme, ...base });
    if (RINGED.includes(theme)) {
      assert.notEqual(ringed, plain, theme);
      assert.ok((ringed.match(/<ellipse /g) ?? []).length >= 4, `${theme} has rings`);
      const [, y0] = viewBox(plain);
      const [, y1, , h1] = viewBox(ringed);
      assert.ok(y1 <= y0 && h1 >= viewBox(plain)[3], `${theme}: the box grows upward to hold the rings`);
    } else assert.equal(ringed, plain, `${theme} ignores rings`);
  }
  assert.equal((calendarIcon({ theme: "squircle", ...base, rings: 5 }).match(/<ellipse /g) ?? []).length, 5);
  assert.equal((calendarIcon({ theme: "squircle", ...base, rings: 24 }).match(/<ellipse /g) ?? []).length, 24);
  assert.ok(!calendarIcon({ theme: "squircle", ...base, rings: true }).includes('rx="9.5"'), "the squircle's own tabs make way for the rings");
});

test("a circle housing is a disc round the icon, in any colour asked for, light and dark", () => {
  for (const theme of CALENDAR_THEMES) for (const scheme of ["light", "dark"] as const) {
    const svg = calendarIcon({ theme, ...base, scheme, housing: "circle" });
    const [, , w, h] = viewBox(svg);
    assert.ok(Math.abs(w - h) < 0.02, `${theme} is square: ${w} x ${h}`);
    assert.ok(svg.includes("<circle "), theme);
    assert.match(svg, /height="96"/);
  }
  assert.ok(calendarIcon({ theme: "pins", ...base, housing: "circle", housingColour: "#123456" }).includes('fill="#123456"'));
  assert.ok(calendarIcon({ theme: "pins", ...base, housing: "circle", scheme: "dark" }).includes("#2e4b5d"));
});

test("a turn rotates the whole icon and the box holds every corner of it", () => {
  const svg = calendarIcon({ theme: "pins", ...base, turn: -8 });
  assert.ok(svg.includes("rotate(-8 "));
  const [x0, y0, w0, h0] = viewBox(calendarIcon({ theme: "pins", ...base }));
  const [x, y, w, h] = viewBox(svg);
  assert.ok(w > w0 && h > h0);
  assert.ok(Math.abs(x + w / 2 - (x0 + w0 / 2)) < 0.02 && Math.abs(y + h / 2 - (y0 + h0 / 2)) < 0.02, "the centre stays");
  const rad = (8 * Math.PI) / 180;
  assert.ok(Math.abs(w - (w0 * Math.cos(rad) + h0 * Math.sin(rad))) < 0.02);
  assert.ok(calendarIcon({ theme: "pins", ...base, turn: 12 }).includes("rotate(12 "));
});

test("presets are sets of the three options, and what you give yourself wins", () => {
  assert.deepEqual(Object.keys(CALENDAR_PRESETS), ["flat", "disc", "ringed", "tilted", "disc-ringed"]);
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "disc" }), calendarIcon({ theme: "badge", ...base, housing: "circle" }));
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "ringed" }), calendarIcon({ theme: "badge", ...base, rings: true }));
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "tilted" }), calendarIcon({ theme: "badge", ...base, turn: -8 }));
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "disc-ringed" }), calendarIcon({ theme: "badge", ...base, housing: "circle", rings: true }));
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "tilted", turn: 3 }), calendarIcon({ theme: "badge", ...base, turn: 3 }));
  assert.equal(calendarIcon({ theme: "badge", ...base, preset: "disc", housing: "square" }), calendarIcon({ theme: "badge", ...base }));
  assert.equal(calendarPresetOf(" Disc "), "disc");
  assert.equal(calendarPresetOf("toString"), null);
});

test("bad options are refused", () => {
  const bad = (o: Record<string, unknown>) => assert.throws(() => calendarIcon({ ...base, ...o } as never), RangeError, JSON.stringify(o));
  bad({ housing: "hexagon" });
  bad({ rings: 25 });
  bad({ rings: -2 });
  bad({ rings: 2.5 });
  bad({ turn: 46 });
  bad({ turn: Number.NaN });
  bad({ housing: "circle", housingColour: 'red" onload="x' });
  bad({ housing: "circle", housingColour: "<script>" });
  bad({ preset: "nope" });
});
