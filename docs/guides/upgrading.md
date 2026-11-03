---
title: Upgrading
section: upgrading
order: 13
description: What changed in each version that you must act on, how to move from meigen-sports' calendar icons, and the names that still work.
---

[日本語](ja/upgrading.md)

Koyomi Calendars is in early development (0.x), so a minor version can add to the interface. This page lists only what asks something of you. The complete, dated record is the [changelog](../../CHANGELOG.md).

## To 0.2.0

Nothing asks anything of you: no drawing changed, and no option was added or removed. Every export now has a documentation page on the [documentation site](https://johnmorrisdotca.github.io/koyomi-calendars/docs/) with a runnable example, there is an embed page for an iframe (`embed.html` on the demo site), and four new guides cover Vite and webpack, a plain page with a CDN, the iframe, and TypeScript and Node. If you read the old docs pages on the demo site (`docs/icons.html` and the others), they are now the guides on the documentation site; the Markdown files are still in the repository.

## To 0.1.1

One design changed, for a reason of layout. With a year, the `squircle` icon's year sat 4.5 of 256 units from the bottom of its page; the family rule asks for 3% of the width (7.7). The day is now drawn at 80 instead of 90 when a year is shown (90 without one), so the year ends 8.4 units above the page's bottom. If you compare `squircle` output byte for byte (a snapshot test, say), update the snapshot. No other design changed, and the first seventeen are still held byte-identical to meigen-sports 0.19.2.

## From meigen-sports

The calendar icons moved here from meigen-sports 0.19.2, with the same options and byte-identical output for the same inputs: a test compares 2,704 drawings with meigen-sports' own, by hash. To move:

To move, replace the import of meigen-sports' calendar icons with an import of this package (`import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars"`); nothing else in the call changes.

The Japanese holiday, old calendar and six-day-cycle functions moved with them, with the same names, and are also available alone from `@johnmorrisdotca/koyomi-calendars/japanese`. The ten theme names of meigen-sports 0.12 still work: see below.

## Names that still work

The ten names of the first designs (`classic`, `outline`, `spiral`, `bold`, `tent`, `curl`, `pad`, `minimal`, `fold`, `tile`) each read as the design that replaced it, so no theme string needs to change.

```js
import { CALENDAR_THEME_ALIASES, calendarThemeOf } from "@johnmorrisdotca/koyomi-calendars";

console.log(Object.keys(CALENDAR_THEME_ALIASES).join(" "));
console.log(calendarThemeOf("classic"), calendarThemeOf("tile"));
// classic outline spiral bold tent curl pad minimal fold tile
// pins badge
```

## New in the first release

Everything below arrived in 0.1.0 and asks nothing of you: the 18th design `squircle`, the options `housing`, `rings` and `turn` with the five presets, `/animate` (`flipCalendar` and the date helpers), `/month` (`monthCalendar`, `monthGrid`, `daysInMonth`), and each design as its own import.

## Keeping up

Pin the minor version you test against (`~0.1.1`) until 1.0, and read this page and the changelog on each upgrade. A new option never changes the output of an icon that does not use it; a changed drawing is named in the changelog and, for the first seventeen designs, held by the golden test.
