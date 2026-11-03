import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

// A server draws the same SVG a browser does: pure, no DOM, no clock. The date is yours to give.
const files = { "today.svg": calendarIcon({ theme: "squircle", month: 11, day: 3, year: 2026 }), "month.svg": monthCalendar({ year: 2026, month: 11, design: "poster" }) };
for (const [name, svg] of Object.entries(files)) writeFileSync(join(tmpdir(), `koyomi-${name}`), svg);
console.log(Object.keys(files).join(" "));
