import assert from "node:assert/strict";
import test from "node:test";
import { daysInMonth, MONTH_DESIGNS, monthCalendar, monthGrid } from "../src/month.ts";
import type { WeekStart } from "../src/month.ts";

const STARTS: WeekStart[] = ["sunday", "monday"];

test("leap years follow the Gregorian rule", () => {
  for (const [year, feb] of [[2024, 29], [2028, 29], [2000, 29], [2400, 29], [2026, 28], [2025, 28], [1900, 28], [2100, 28], [1, 28], [4, 29]] as const) assert.equal(daysInMonth(year, 2), feb, String(year));
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => daysInMonth(2026, m)), [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
});

test("a leap February has 29 days, in both week starts, and every grid is whole weeks of consecutive days", () => {
  for (const weekStart of STARTS) {
    const g = monthGrid(2024, 2, weekStart);
    assert.equal(g.daysInMonth, 29);
    assert.equal(g.weeks.flat().filter((d) => d.inMonth).length, 29);
    assert.deepEqual(g.weeks.flat().filter((d) => d.inMonth).map((d) => d.day), Array.from({ length: 29 }, (_, i) => i + 1));
    assert.equal(monthGrid(2026, 2, weekStart).weeks.flat().filter((d) => d.inMonth).length, 28);
  }
});

test("a month starting on each weekday, in both week starts: the first column, the weeks, the day after day", () => {
  // 2026: 1 Feb Sunday, 1 Jun Monday, 1 Sep Tuesday, 1 Apr Wednesday, 1 Jan Thursday, 1 May Friday, 1 Aug Saturday.
  const first: Array<[number, number]> = [[2, 0], [6, 1], [9, 2], [4, 3], [1, 4], [5, 5], [8, 6]];
  const seen = new Set<number>();
  for (const [month, weekday] of first) {
    for (const weekStart of STARTS) {
      const g = monthGrid(2026, month, weekStart);
      const one = g.weeks.flat().find((d) => d.inMonth && d.day === 1)!;
      assert.equal(one.weekday, weekday, `${month}`);
      seen.add(one.weekday);
      const column = g.weeks[0]!.indexOf(one);
      assert.equal(column, (weekday - (weekStart === "monday" ? 1 : 0) + 7) % 7, `${month} ${weekStart}`);
      assert.equal(g.offset, column);
      assert.equal(g.weeks[0]![0]!.weekday, weekStart === "monday" ? 1 : 0);
      for (const week of g.weeks) assert.equal(week.length, 7);
      assert.equal(g.weeks.length, Math.ceil((g.offset + g.daysInMonth) / 7));
      const flat = g.weeks.flat();
      for (let i = 1; i < flat.length; i += 1) assert.equal(new Date(Date.UTC(flat[i]!.year, flat[i]!.month - 1, flat[i]!.day)).getTime() - new Date(Date.UTC(flat[i - 1]!.year, flat[i - 1]!.month - 1, flat[i - 1]!.day)).getTime(), 86400000);
      assert.equal(flat.filter((d) => d.inMonth).length, g.daysInMonth);
      assert.ok(g.weeks.length >= 4 && g.weeks.length <= 6);
    }
  }
  assert.equal(seen.size, 7);
});

test("February 2026 is four weeks from Sunday and five from Monday; the weeks around a year end cross it", () => {
  assert.equal(monthGrid(2026, 2, "sunday").weeks.length, 4);
  assert.equal(monthGrid(2026, 2, "monday").weeks.length, 5);
  const dec = monthGrid(2026, 12, "sunday");
  assert.ok(dec.weeks.flat().some((d) => !d.inMonth && d.year === 2027 && d.month === 1));
  const jan = monthGrid(2027, 1, "monday");
  assert.ok(jan.weeks.flat().some((d) => !d.inMonth && d.year === 2026 && d.month === 12));
  assert.equal(monthGrid(2026, 8, "sunday").weeks.length, 6);
});

test("bad input is refused", () => {
  assert.throws(() => monthGrid(2026, 0), RangeError);
  assert.throws(() => monthGrid(2026, 13), RangeError);
  assert.throws(() => monthGrid(0, 1), RangeError);
  assert.throws(() => monthGrid(10000, 1), RangeError);
  assert.throws(() => monthGrid(2026, 1, "friday" as never), RangeError);
  assert.throws(() => monthCalendar({ year: 2026, month: 1, design: "nope" as never }), RangeError);
  assert.throws(() => monthCalendar({ year: 2026, month: 1, size: 10 }), RangeError);
});

test("every design draws every day of the month once, in both week starts, light and dark", () => {
  for (const design of MONTH_DESIGNS) {
    for (const weekStart of STARTS) {
      for (const [year, month] of [[2024, 2], [2026, 2], [2026, 8], [2026, 11]] as const) {
        for (const scheme of ["light", "dark"] as const) {
          const svg = monthCalendar({ year, month, design, weekStart, scheme });
          assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
          const days = [...svg.matchAll(/<g data-part="day"><text[^>]*>(\d+)<\/text><\/g>/g)].map((m) => Number(m[1]));
          const g = monthGrid(year, month, weekStart);
          const inMonth = days.slice(0, 0);
          void inMonth;
          const shown = design === "wall" || design === "desk" ? g.weeks.flat().length : g.daysInMonth;
          assert.equal(days.length, shown, `${design} ${year}-${month} ${weekStart}`);
        }
      }
    }
  }
});

test("words come from Intl: names in the locale, the year before the month in Japanese", () => {
  const en = monthCalendar({ year: 2026, month: 11, design: "wall" });
  assert.match(en, /aria-label="November 2026"/);
  assert.match(en, />SUN</);
  assert.match(en, />NOVEMBER</);
  const ja = monthCalendar({ year: 2026, month: 11, design: "wall", locale: "ja" });
  assert.match(ja, /aria-label="2026年11月"/);
  assert.match(ja, />日</);
  assert.match(ja, />土</);
  const fr = monthCalendar({ year: 2026, month: 11, design: "desk", locale: "fr", weekStart: "monday" });
  assert.match(fr, /NOVEMBRE/);
  assert.match(fr, />LUN\.</);
  const poster = monthCalendar({ year: 2026, month: 11, design: "poster", locale: "ja" });
  assert.match(poster, />11月</);
});

test("Saturday and Sunday are tinted for Japanese and not for English, unless asked", () => {
  const colours = (svg: string) => new Set([...svg.matchAll(/<text[^>]*fill="(#[0-9a-f]{6})"[^>]*>\d+<\/text>/g)].map((m) => m[1]));
  assert.ok(colours(monthCalendar({ year: 2026, month: 11, design: "wall", locale: "ja" })).has("#1f4ea6"), "Saturday blue in Japanese");
  assert.ok(colours(monthCalendar({ year: 2026, month: 11, design: "wall", locale: "ja" })).has("#c2162f"), "Sunday red in Japanese");
  assert.ok(!colours(monthCalendar({ year: 2026, month: 11, design: "wall" })).has("#1f4ea6"));
  assert.ok(colours(monthCalendar({ year: 2026, month: 11, design: "wall", tint: true })).has("#1f4ea6"));
  assert.ok(!colours(monthCalendar({ year: 2026, month: 11, design: "wall", locale: "ja", tint: false })).has("#1f4ea6"));
});

test("a note shows on its day only: by full date or by day of every year, cut to two lines, never a holiday of ours", () => {
  const notes = { "2026-11-07": "Dentist", "11-12": "Groceries and a very long errand list that cannot fit in two small lines of a cell", "2026-12-25": "Elsewhere" };
  for (const design of MONTH_DESIGNS) {
    const svg = monthCalendar({ year: 2026, month: 11, design, notes });
    assert.match(svg, />Dentist</, design);
    assert.match(svg, />Groceries/, design);
    assert.match(svg, /…</, design);
    assert.ok(!svg.includes("Elsewhere"), design);
    assert.equal((svg.match(/data-part="note"/g) ?? []).length, 2, design);
    const other = monthCalendar({ year: 2027, month: 11, design, notes });
    assert.ok(!other.includes("Dentist"), "a dated note is for its year");
    assert.match(other, />Groceries/, "an undated note is for every year");
  }
  assert.ok(!monthCalendar({ year: 2026, month: 11, notes: { "2026-11-07": "<b>&" } }).includes("<b>"));
});

test("the next month is the mini calendar, across a year end", () => {
  const svg = monthCalendar({ year: 2026, month: 12, design: "poster" });
  assert.match(svg, /data-part="mini"/);
  assert.match(svg, />JAN</);
  assert.ok(!monthCalendar({ year: 2026, month: 12, design: "poster", mini: false }).includes('data-part="mini"'));
  assert.ok(monthCalendar({ year: 2026, month: 12, design: "board", mini: true }).includes('data-part="mini"'));
});
