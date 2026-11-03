import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const now = new Date();
const today = document.querySelector("#today")!;
today.innerHTML = calendarIcon({ theme: "squircle", month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() }) + monthCalendar({ year: now.getFullYear(), month: now.getMonth() + 1, design: "desk", size: 320 });
