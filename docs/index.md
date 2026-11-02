# Koyomi Calendars

[日本語](index.ja.md)

Koyomi (暦) is Japanese for a calendar or an almanac. This package draws calendar pages: a small icon for one day, in 18 original designs, and a whole month as a poster, a memo board, a wall page or a desk pad. It can also turn the page from one day to the next.

Everything is SVG built from text: no image, no font file, no dependency. The names of months and weekdays come from `Intl`, so any language the browser knows works.

## Pages

- [Icons](icons.md): the 18 designs, the housing, rings and turn options, and the presets.
- [Turning the page](animate.md): four ways to turn from one day to the next, forwards and backwards.
- [Whole months](month.md): four month pages, week start, notes, and Japanese-style layouts.

## Install

```sh
npm install @johnmorrisdotca/koyomi-calendars
```

## One icon

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const svg = calendarIcon({ theme: "squircle", month: 11, day: 2, year: 2026, scheme: "dark" });
console.log(svg.startsWith("<svg")); // true
console.log(svg.includes('aria-label="Monday Nov 2 2026"')); // true
```

The library never reads the clock: you say the date. The result is an SVG string with a `title` and an `aria-label`, ready to put in the page.

## What it weighs

Each import is its own file, so a page pays only for what it uses. One design alone is about 9 kB minified (4 kB gzipped). All 18 designs together are about 49 kB; the month pages are about 11 kB; the page turning is about 3 kB. The demo's table gives the figures of this build, and `pnpm check` fails when one grows past its budget.

## More to come

This package is the home of calendar things. Today it holds the icons, the month pages and the page turning; more will come here.
