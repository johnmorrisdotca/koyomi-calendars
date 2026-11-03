---
title: TypeScript and Node
section: how-to
order: 13
description: Use the package's types, draw icons and month pages on a server or in a build script, and write them to files.
---

[日本語](ja/typescript-and-node.md)

The package ships its own types and runs on Node 22 or later and in any current browser. It is ES modules; Node 22.12 or later can also `require()` it.

## Types

```ts
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
```

`CalendarIconOptions` and `MonthCalendarOptions` describe every option, `CalendarTheme` is the union of the 18 design names, and a design that does not exist is a type error, not a surprise at run time. The last function shows that: the line before the call is the error TypeScript is told to expect.

## On a server or in a build script

```js
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

// A server draws the same SVG a browser does: pure, no DOM, no clock. The date is yours to give.
const files = { "today.svg": calendarIcon({ theme: "squircle", month: 11, day: 3, year: 2026 }), "month.svg": monthCalendar({ year: 2026, month: 11, design: "poster" }) };
for (const [name, svg] of Object.entries(files)) writeFileSync(join(tmpdir(), `koyomi-${name}`), svg);
console.log(Object.keys(files).join(" "));
```

`calendarIcon` and `monthCalendar` are pure functions of their arguments, with no DOM and no clock, so a server draws the same SVG a browser does, byte for byte. Write the string to a file, put it in an email or a share card, or send it with `Content-Type: image/svg+xml`.

## Check the types of your own code

The package has no runtime dependency. With `"moduleResolution": "bundler"`, `"node16"` or `"nodenext"`, every subpath import (`/month`, `/animate`, `/japanese`, `/names`, and `/themes/<name>`) has its types.
