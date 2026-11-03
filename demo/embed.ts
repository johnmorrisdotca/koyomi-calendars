// The frame a page puts in an iframe. The address says what it shows, and the frame fetches nothing but its own files:
//   ?date=2026-11-03                   the day (today by default)
//   &theme=squircle                    one of the 18 designs (pins by default)
//   &scheme=light|dark                 light by default
//   &preset=disc-ringed                a named look: flat, disc, ringed, tilted, disc-ringed
//   &housing=circle &rings=1 &turn=-8  the three options of a look, which win over a preset
//   &locale=ja &japanese=1             the words in a language, and the Japanese holidays, old date and six-day cycle on the designs that have side columns (sun, roll)
//   &month=1                           a whole month instead of a day: &design=poster|board|wall|desk and &week=monday
// It draws once, and nothing else on the page moves.
import { calendarIcon, calendarPresetOf, calendarThemeOf, CALENDAR_HOUSINGS, type CalendarIconOptions } from "../src/index.ts";
import { monthCalendar, MONTH_DESIGNS, type MonthDesign } from "../src/month.ts";

const query = new URLSearchParams(location.search);
const frame = document.getElementById("frame")!;

const today = new Date();
const given = /^(\d{4})-(\d{2})-(\d{2})$/.exec(query.get("date") ?? "");
const year = given ? Number(given[1]) : today.getFullYear();
const month = given ? Number(given[2]) : today.getMonth() + 1;
const day = given ? Number(given[3]) : today.getDate();
const scheme = query.get("scheme") === "dark" ? "dark" : "light";
const locale = query.get("locale") ?? undefined;
const size = 480;

try {
  if (query.get("month") === "1") {
    const design = (MONTH_DESIGNS as readonly string[]).includes(query.get("design") ?? "") ? (query.get("design") as MonthDesign) : "poster";
    frame.innerHTML = monthCalendar({ year, month, design, scheme, size, ...(locale ? { locale } : {}), ...(query.get("week") === "monday" ? { weekStart: "monday" as const } : {}) });
  } else {
    const options: CalendarIconOptions = { year, month, day, scheme, size };
    const theme = calendarThemeOf(query.get("theme"));
    if (theme) options.theme = theme;
    const preset = calendarPresetOf(query.get("preset"));
    if (preset) options.preset = preset;
    const housing = query.get("housing");
    if (housing && (CALENDAR_HOUSINGS as readonly string[]).includes(housing)) options.housing = housing as (typeof CALENDAR_HOUSINGS)[number];
    if (query.get("rings") === "1") options.rings = true;
    const turn = Number(query.get("turn"));
    if (query.has("turn") && Number.isFinite(turn)) options.turn = turn;
    if (locale) options.locale = locale;
    if (query.get("japanese") === "1") options.japanese = true;
    frame.innerHTML = calendarIcon(options);
  }
} catch {
  frame.textContent = "";
}
