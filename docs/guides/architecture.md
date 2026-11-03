---
title: Architecture
section: explanation
order: 11
description: How the package is split into small imports, what a design is, how a drawing is made, and the rules that keep the output, the sizes and the originality fixed.
---

[日本語](ja/architecture.md)

Koyomi Calendars is plain TypeScript compiled to ES modules, with no runtime dependency. Its design rule is that **each thing is its own import**, so the small icon stays small as the package grows.

## The imports

| Import | Source | What it holds |
|---|---|---|
| `@johnmorrisdotca/koyomi-calendars` | `src/index.ts` | `calendarIcon` with all 18 designs, the names, the layout, the frame, the presets and the Japanese calendar |
| `.../themes/<name>` | `src/themes/<name>.ts` | one design, with the shared kit and nothing else |
| `.../month` | `src/month.ts` | `monthCalendar`, `monthGrid`, `daysInMonth` |
| `.../animate` | `src/animate.ts` | `flipCalendar` and the date helpers |
| `.../names` | `src/names.ts` | the design names, labels and aliases |
| `.../japanese` | `src/japanese.ts` | holidays, old calendar, six-day cycle |

## What a design is

A design is one file under `src/themes/` that exports a definition: the box it draws in, a `layout` (where the day sits in its page and where the year's room is, with a year and without), a `draw` function, and optionally where rings stand, a weekend page and the extra data a tear-off page draws. A design imports only the shared kit (`kit.ts`: text, the stroke-drawn digits, shapes) and, for a tear-off page, `tear.ts`. No design imports another, which is what lets one be imported alone.

`src/icon.ts` holds the table of all 18 for the main import. `src/render.ts` is the one function that turns a design's drawing into a whole SVG: it checks the options, works out the date's words with `Intl`, draws, then wraps the result in the frame (`frame.ts`: housing, rings, turn) with the title, label and `role`.

## How an icon is made

1. The options are checked, with a `RangeError` for each that is wrong. A preset is laid under the options you gave, so what you gave wins.
2. The date's words are made from `Intl`, in the locale (an unknown locale falls back to English).
3. The design draws its parts, each marked with a `data-part`, in its own box.
4. The frame sets the drawing on a disc if asked, adds rings if asked, and turns it if asked.
5. The result is wrapped in an SVG with its size, `role="img"`, `title` and `aria-label`.

Every step is a pure function of the options. The library never reads the clock, uses randomness or does I/O, so the same call gives the same bytes. `flipCalendar` is the one function that touches the page, and only the element it is given.

## Rules the repository keeps

- **Output does not change by accident.** `test/identical.test.ts` holds the first seventeen designs, which came from meigen-sports 0.19.2, to byte-identical output against a golden file. A new option leaves the output of an icon that does not use it unchanged.
- **Sizes are budgeted.** `scripts/check-bytes.ts` bundles each import and fails past its budget: see [Sizes and bundles](sizes-and-bundles.md).
- **Every drawing is original.** Drawn from public facts, with no copied, traced or stock artwork, no logo and no company's name in a design's name.
- **Every design has a light and a dark version, and a layout** (`page` and `yearZone`) that the tests hold to the same rules as the others.
- **Docs are one language to a page,** and the examples in them are run by `pnpm test:readme`.

## The month pages

`monthCalendar` does its own layout from `monthGrid`, which is plain arithmetic: the weeks of seven, the offset before the 1st, the leap-year rule of the Gregorian calendar. The four designs are four functions drawing the same grid. The grid is exported so a design of your own can draw it.

## The page turning

`flipCalendar` replaces the icon's content with a sheet, plays the Web Animations API keyframes of the chosen way (`FLIP_KEYFRAMES`), then puts back one plain icon. A second call finishes a running one at once. With reduced motion it only swaps the icon.

## Tests

`pnpm test` runs the unit tests (the golden comparison, every design's layout, the Japanese calendar, the month grid, the docs' language); `pnpm test:demo` builds the demo and plays it in Chromium and WebKit; `pnpm test:readme` runs every example in the README and the guides; `pnpm check` also lints, type-checks, builds, checks the packed package and the byte budgets.
