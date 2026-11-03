---
title: Sizes and bundles
section: explanation
order: 8
description: What each import costs a page, how to import one design alone, why nothing else comes with it, and the byte budgets that CI holds.
---

[日本語](ja/sizes-and-bundles.md)

Each part of the package is its own import, so a page pays only for what it uses. The main import carries all 18 designs. A page that draws one design imports it alone and never loads the other 17.

| Import | Minified | Gzipped |
|---|---|---|
| one design alone, `themes/pins` | 8.8 kB | 4.0 kB |
| one design alone, `themes/squircle` | 9.3 kB | 4.1 kB |
| one tear-off design alone, `themes/sun` | 24.7 kB | 10.9 kB |
| all 18 designs, the main import | 48.3 kB | 19.1 kB |
| the month pages, `/month` | 11.0 kB | 4.7 kB |
| the page turning, `/animate` | 3.1 kB | 1.4 kB |

The sizes are of the entry bundled with esbuild and minified, with nothing else added; the tear-off designs carry the Japanese calendar they can draw. The demo's table shows the figures of the current build.

## One design alone

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const svg = calendarIcon({ month: 11, day: 2, year: 2026, scheme: "dark" });
console.log(svg.startsWith("<svg"));
// true
```

The design's own `calendarIcon` takes the same options as the main one, without `theme`. A page with a design picker imports the main `calendarIcon`; a page with one fixed design imports that design.

## No side effect

The package is marked `"sideEffects": false`, so a bundler can drop what you do not use, and importing it changes nothing in the page. It has no dependency, no network request and no stored data.

## The budgets

`scripts/check-bytes.ts` bundles each entry above and fails when one grows past its budget (10,000 bytes for `pins`, 10,500 for `squircle`, 27,000 for `sun`, 52,000 for the main import, 12,500 for `/month` and 3,500 for `/animate`). `pnpm check` runs it, so a change that makes an import larger has to say so in the budget file, on purpose.

## What is in the main import

The main import is the icon, the helpers (`calendarLayout`, `calendarThemeOf`, `calendarWeekend`, `calendarMoon`), the presets, the housing and the Japanese calendar functions. The month pages and the page turning are separate on purpose: the month pages are bigger than most icons, and the page turning needs a browser, which an icon on a server does not.

| You want | Import |
|---|---|
| any of the 18 designs by name | `@johnmorrisdotca/koyomi-calendars` |
| one design | `@johnmorrisdotca/koyomi-calendars/themes/<name>` |
| a whole month | `@johnmorrisdotca/koyomi-calendars/month` |
| the page turning | `@johnmorrisdotca/koyomi-calendars/animate` |
| the design names and labels only | `@johnmorrisdotca/koyomi-calendars/names` |
| the Japanese calendar only | `@johnmorrisdotca/koyomi-calendars/japanese` |

```js
import { CALENDAR_THEMES } from "@johnmorrisdotca/koyomi-calendars/names";
import { japaneseHoliday } from "@johnmorrisdotca/koyomi-calendars/japanese";

console.log(CALENDAR_THEMES.length, japaneseHoliday(2026, 11, 3)?.ja !== undefined);
// 18 true
```
