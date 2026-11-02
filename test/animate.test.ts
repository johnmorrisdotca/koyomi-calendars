import assert from "node:assert/strict";
import test from "node:test";
import { addDays, CALENDAR_FLIP_LABELS, CALENDAR_FLIPS, compareDays, FLIP_KEYFRAMES, nextDay, previousDay } from "../src/animate.ts";

test("the next day crosses a month, a year, a leap day and a century that is not a leap year", () => {
  assert.deepEqual(nextDay({ year: 2026, month: 1, day: 31 }), { year: 2026, month: 2, day: 1 });
  assert.deepEqual(nextDay({ year: 2026, month: 12, day: 31 }), { year: 2027, month: 1, day: 1 });
  assert.deepEqual(nextDay({ year: 2024, month: 2, day: 28 }), { year: 2024, month: 2, day: 29 });
  assert.deepEqual(nextDay({ year: 2024, month: 2, day: 29 }), { year: 2024, month: 3, day: 1 });
  assert.deepEqual(nextDay({ year: 2026, month: 2, day: 28 }), { year: 2026, month: 3, day: 1 });
  assert.deepEqual(nextDay({ year: 2100, month: 2, day: 28 }), { year: 2100, month: 3, day: 1 });
  assert.deepEqual(nextDay({ year: 2000, month: 2, day: 28 }), { year: 2000, month: 2, day: 29 });
});

test("the day before crosses the same edges backwards", () => {
  assert.deepEqual(previousDay({ year: 2027, month: 1, day: 1 }), { year: 2026, month: 12, day: 31 });
  assert.deepEqual(previousDay({ year: 2026, month: 3, day: 1 }), { year: 2026, month: 2, day: 28 });
  assert.deepEqual(previousDay({ year: 2024, month: 3, day: 1 }), { year: 2024, month: 2, day: 29 });
  assert.deepEqual(previousDay({ year: 2026, month: 5, day: 1 }), { year: 2026, month: 4, day: 30 });
  assert.deepEqual(previousDay({ year: 50, month: 1, day: 1 }), { year: 49, month: 12, day: 31 });
});

test("a step forward then back lands where it began, for every day of a leap year and its neighbours", () => {
  let date = { year: 2023, month: 12, day: 31 };
  for (let i = 0; i < 366 + 365 + 365; i += 1) {
    const next = nextDay(date);
    assert.deepEqual(previousDay(next), date);
    assert.equal(compareDays(date, next), 1);
    assert.equal(compareDays(next, date), -1);
    date = next;
  }
  assert.deepEqual(date, { year: 2026, month: 12, day: 31 });
});

test("addDays and compareDays", () => {
  assert.deepEqual(addDays({ year: 2026, month: 1, day: 31 }, 30), { year: 2026, month: 3, day: 2 });
  assert.deepEqual(addDays({ year: 2026, month: 3, day: 2 }, -30), { year: 2026, month: 1, day: 31 });
  assert.deepEqual(addDays({ year: 2026, month: 3, day: 2 }, 0), { year: 2026, month: 3, day: 2 });
  assert.equal(compareDays({ year: 2026, month: 3, day: 2 }, { year: 2026, month: 3, day: 2 }), 0);
  assert.equal(compareDays({ year: 2026, month: 12, day: 31 }, { year: 2027, month: 1, day: 1 }), 1);
});

test("each of the four ways has keyframes, a name in both languages, and starts and ends where it should", () => {
  assert.deepEqual([...CALENDAR_FLIPS], ["tear-down", "fly-up", "rip-corner", "flip-down"]);
  for (const name of CALENDAR_FLIPS) {
    const look = FLIP_KEYFRAMES[name];
    assert.ok(look.frames.length >= 3, name);
    assert.match(String(look.frames[0]!.transform), /(translate\(0,0\)|rotateX\(0deg\))/, `${name} starts on the pad`);
    assert.ok(Number(look.frames.at(-1)!.opacity) <= 0.9, `${name} ends leaving`);
    assert.match(CALENDAR_FLIP_LABELS[name].en, /\w/);
    assert.match(CALENDAR_FLIP_LABELS[name].ja, /[぀-ヿ一-鿿]/);
  }
});
