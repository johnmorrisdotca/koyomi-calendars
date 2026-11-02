// Byte-identical to meigen-sports 0.19.2: every case of test/cases.ts, for each of its seventeen themes, draws the same SVG here as meigen-sports'
// own calendarIcon did (compared by SHA-256, from test/golden/meigen-0.19.2.json, made by scripts/golden-from-meigen.ts).
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { calendarIcon, calendarLayout, calendarMoon, calendarThemeOf, calendarWeekend } from "../src/index.ts";
import { calendarIcon as alone } from "../src/themes/pins.ts";
import { BAD, cases, SEVENTEEN, WORDS } from "./cases.ts";

const golden = JSON.parse(readFileSync(new URL("./golden/meigen-0.19.2.json", import.meta.url), "utf8")) as {
  count: number; svg: Record<string, string>; errors: Record<string, string>; words: Array<[string, string | null]>; layouts: Record<string, string>; moon: Record<string, number>; weekends: Record<string, string>;
};
const sha = (text: string) => createHash("sha256").update(text).digest("hex").slice(0, 16);

test("every theme of meigen-sports 0.19.2 draws the same bytes, case by case", () => {
  let same = 0;
  const differ: string[] = [];
  const mine = cases(SEVENTEEN);
  for (const [key, options] of mine) {
    if (sha(calendarIcon(options)) === golden.svg[key]) same += 1;
    else differ.push(key);
  }
  assert.deepEqual(differ.slice(0, 5), [], `${differ.length} of ${mine.length} drawings differ`);
  assert.equal(new Set(mine.map(([key]) => key)).size, golden.count, "the same cases as the golden file");
  assert.equal(same, mine.length);
});

for (const theme of SEVENTEEN) {
  test(`${theme}: all of its cases are identical`, () => {
    const these = cases([theme]);
    assert.ok(these.length > 150, `only ${these.length} cases`);
    for (const [key, options] of these) assert.equal(sha(calendarIcon(options)), golden.svg[key], key);
  });
}

test("a theme imported alone draws the same bytes as the whole library", () => {
  for (const [, options] of cases(["pins"])) assert.equal(alone({ ...options, theme: undefined }), calendarIcon({ ...options, theme: "pins" }));
});

test("errors keep their names and messages", () => {
  for (const [name, input] of BAD) {
    let got = "no error";
    try {
      calendarIcon(input as never);
    } catch (error) {
      got = `${(error as Error).name}: ${(error as Error).message}`;
    }
    assert.equal(got, golden.errors[name], name);
  }
});

test("theme names, old names and odd spellings read the same", () => {
  assert.equal(golden.words.length, WORDS.length);
  for (const [word, expected] of golden.words) assert.equal(calendarThemeOf(word), expected, JSON.stringify(word));
});

test("layouts, the moon and the weekend are the same", () => {
  for (const theme of SEVENTEEN) for (const year of [false, true]) for (const weekend of [false, true]) assert.equal(JSON.stringify(calendarLayout(theme, year, weekend)), golden.layouts[`${theme}/${year}/${weekend}`]);
  for (const [key, phase] of Object.entries(golden.moon)) {
    const [y, m, d] = key.split("-").map(Number) as [number, number, number];
    assert.equal(calendarMoon(y, m, d), phase, key);
    assert.equal(JSON.stringify(calendarWeekend(y, m, d)), golden.weekends[key], key);
  }
});
