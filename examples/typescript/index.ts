import { calendarIcon, CALENDAR_THEMES, type CalendarIconOptions, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar, type MonthCalendarOptions } from "@johnmorrisdotca/koyomi-calendars/month";

const options: CalendarIconOptions = { theme: "squircle", month: 11, day: 3, year: 2026, scheme: "dark" };
const svg: string = calendarIcon(options);
const month: MonthCalendarOptions = { year: 2026, month: 11, design: "wall", weekStart: "monday" };
const themes: readonly CalendarTheme[] = CALENDAR_THEMES;
console.log(svg.length > 0, monthCalendar(month).length > 0, themes.length);

export function refused(): void {
  // @ts-expect-error "neon" is not a design
  calendarIcon({ month: 11, day: 3, theme: "neon" });
}
