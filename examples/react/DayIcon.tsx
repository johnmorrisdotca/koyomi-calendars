import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

export function DayIcon({ date, theme = "squircle" }: { date: Date; theme?: CalendarTheme }) {
  const svg = calendarIcon({ theme, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() });
  return <span role="img" aria-label={date.toDateString()} dangerouslySetInnerHTML={{ __html: svg }} />;
}
