import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const now = new Date();
const today = document.createElement("div");
today.id = "today";
today.innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
document.body.append(today);
