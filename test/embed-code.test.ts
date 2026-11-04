// The code the demo's panels write for each way a page is made: every one makes the same drawing as the call it shows, and no way is missing a piece.
import assert from "node:assert/strict";
import { test } from "node:test";
import { calendarIcon } from "../src/index.ts";
import { monthCalendar } from "../src/month.ts";
import { embedCode, fileCode, frameCode, iconDraw, iconQuery, monthDraw, monthQuery } from "../demo/embed-code.ts";

const ICON = { theme: "squircle", year: 2026, month: 7, day: 17, scheme: "dark", size: 160, locale: "ja", housing: "circle", rings: true, turn: -8 } as const;
const MONTH = { year: 2026, month: 7, design: "wall", scheme: "light", monday: true, locale: "ja", note: { key: "07-07", text: "Dentist 14:00" } } as const;
const KINDS = ["html", "module", "react", "vue", "angular", "svelte"];

/** The text of the call a snippet shows, run for its drawing. */
const drawn = (code: string, name: string, theme?: string): string => {
  const at = code.indexOf(`${name}({`);
  assert.notEqual(at, -1, `${name} is called`);
  let depth = 0;
  let end = at + name.length;
  for (let i = end; i < code.length; i += 1) {
    if (code[i] === "(") depth += 1;
    if (code[i] === ")" && --depth === 0) {
      end = i;
      break;
    }
  }
  const args = code.slice(at + name.length + 1, end);
  const options = new Function(`return (${args});`)() as Record<string, unknown>;
  return name === "calendarIcon" ? calendarIcon({ theme: theme as never, ...options } as never) : monthCalendar(options as never);
};

test("each way writes the call that draws the icon, with every choice in it", () => {
  const want = calendarIcon({ theme: "squircle", year: 2026, month: 7, day: 17, scheme: "dark", size: 160, locale: "ja", housing: "circle", rings: true, turn: -8 });
  for (const alone of [false, true]) {
    for (const kind of KINDS) {
      const code = embedCode(kind, iconDraw(ICON, alone));
      assert.ok(code, kind);
      assert.equal(drawn(code, "calendarIcon", "squircle"), want, `${kind}, alone ${alone}`);
    }
  }
});

test("each way writes the call that draws the month, with every choice in it", () => {
  const want = monthCalendar({ year: 2026, month: 7, design: "wall", scheme: "light", weekStart: "monday", locale: "ja", notes: { "07-07": "Dentist 14:00" } });
  for (const kind of KINDS) assert.equal(drawn(embedCode(kind, monthDraw(MONTH))!, "monthCalendar"), want, kind);
});

test("the one design alone imports its own file, and the whole package imports the whole package", () => {
  assert.match(embedCode("module", iconDraw(ICON, true))!, /from "@johnmorrisdotca\/koyomi-calendars\/themes\/squircle"/);
  assert.match(embedCode("module", iconDraw(ICON, false))!, /from "@johnmorrisdotca\/koyomi-calendars";/);
  assert.match(embedCode("module", monthDraw(MONTH))!, /from "@johnmorrisdotca\/koyomi-calendars\/month"/);
  assert.match(embedCode("html", iconDraw(ICON, true))!, /cdn\.jsdelivr\.net\/npm\/@johnmorrisdotca\/koyomi-calendars@[^/]+\/themes\/squircle\/\+esm/);
});

test("a size that is the package's own is left out, and a file is written for Node", () => {
  assert.doesNotMatch(embedCode("module", iconDraw({ ...ICON, size: 96 }, false))!, /size:/);
  assert.match(embedCode("module", iconDraw(ICON, false))!, /size: 160/);
  assert.match(fileCode(iconDraw(ICON, false)), /writeFileSync\("today\.svg", calendarIcon\(\{ theme: "squircle"/);
  assert.match(fileCode(monthDraw(MONTH)), /writeFileSync\("month\.svg", monthCalendar/);
});

test("the frame's address says what the embed page reads", () => {
  const q = new URLSearchParams(iconQuery(ICON, true));
  assert.equal(q.get("date"), "2026-07-17");
  assert.equal(q.get("theme"), "squircle");
  assert.equal(q.get("scheme"), "dark");
  assert.equal(q.get("housing"), "circle");
  assert.equal(q.get("rings"), "1");
  assert.equal(q.get("turn"), "-8");
  assert.equal(q.get("locale"), "ja");
  const m = new URLSearchParams(monthQuery(MONTH));
  assert.equal(m.get("month"), "1");
  assert.equal(m.get("design"), "wall");
  assert.equal(m.get("week"), "monday");
  const copied = frameCode(iconQuery(ICON, true), "Koyomi", 256, false, "");
  assert.match(copied, /src="https:\/\/johnmorrisdotca\.github\.io\/koyomi-calendars\/embed\.html\?date=2026-07-17/);
  assert.match(copied, /width="256"/);
  assert.match(frameCode(iconQuery(ICON, true), "Koyomi", 256, true, "../"), /src="\.\.\/embed\.html\?/);
});
