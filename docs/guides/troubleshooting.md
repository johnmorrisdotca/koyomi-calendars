---
title: Troubleshooting and FAQ
section: troubleshooting
order: 12
description: Fixes for a RangeError, a wrong weekday or an empty column, rings that do not show, a flip that does nothing, a locale that comes out in English, and other questions.
---

[日本語](ja/troubleshooting.md)

## `RangeError: month must be an integer 1–12`

Each option is checked. The message names the one that is wrong: a month that is not a whole number from 1 to 12, a day not from 1 to 31, a `year` not from 1 to 9999, a `size` outside 16 to 1024, a `turn` beyond 45 degrees either way, an unknown `theme` or `weekend` value, or a `mark` with a script, style, event attribute or `javascript:` address. A month from `Date#getMonth()` is 0 to 11: add 1.

## The weekday or the year is missing

The weekday and the small year appear only when you pass `year`. Without it the icon leaves both off, on purpose, because a month and a day name no weekday.

## The rings do not show

`rings` works on the designs that have no binding of their own: `badge`, `frame`, `sun`, `roll`, `plain` and `squircle`. The other twelve draw their own binding and ignore it. A number from 0 to 24 sets how many.

## `housing` or `turn` seem to do nothing

Check that they are in the options of the call that draws the icon. A `preset` gives defaults, and an option you give wins over it, so `preset: "disc", housing: "square"` is a square. `turn: 0` is no turn.

## The side columns are empty

The Japanese columns of `sun` and `roll` need `japanese: true` (they are off by default), a `year`, and a year inside the covered years: 2000 to 2099 for holidays, 1900 to 2100 for the old calendar. A cell the method cannot settle is left empty rather than guessed; a new moon or a solar principal term (`中気`) within 30 minutes of midnight in Japan is one such case. Names you give with `holidays` fill a cell the computation does not. See [The Japanese calendar](japanese-calendar.md).

## A holiday I expected is not there

The library knows the holidays of Japan only, and only by computing them. For any other country, pass your own names: `holidays` on an icon, `notes` on a month page.

## The month page has no holidays

By design: it knows no holiday, and takes every note from you. `japaneseHolidaysOf(year)` gives Japan's, which you can pass as notes.

## The icon is in English

An unknown `locale` falls back to English instead of throwing. Check it with `Intl.DateTimeFormat.supportedLocalesOf(locale)`. A runtime with limited `Intl` data (a small ICU build of Node, for example) knows fewer locales; use a full build or a browser. See [Languages and locales](languages-and-locales.md).

## `flipCalendar` does nothing

It needs a browser (the Web Animations API) and an element. If the reader's device asks for less motion, the new date simply appears: pass `motion: "always"` to test it, or `motion: "never"` to make it the rule. On a server it cannot run: call it from an effect or an event handler.

## The flip shows the wrong date

`flipCalendar` draws `from` as the old sheet and `to` as the new, with `render` for each, and resolves with `to`. It does not read the element's current date, so pass the date the element really shows as `from`, and keep what it resolves with.

## Two icons on a page look wrong

Icons made from the same theme, date, year and scheme share their internal ids, so the same icon twice on a page is fine. If a page's own CSS targets `svg` or `path` it can restyle the drawing: scope your rules to your own class.

## Size and bundles

If a page loads more than it needs, check the import: the main import carries all 18 designs (about 48 kB), `themes/<name>` carries one (about 9 kB). See [Sizes and bundles](sizes-and-bundles.md).

## Questions

**Does it read the date or the time zone?** No: the date is always your argument. **Does it fetch anything or store anything?** No. **Can I use the SVG in an `<img>`?** Yes; it cannot be restyled by the page then, so draw the scheme you need. **Is it accessible?** Each icon is a `role="img"` with a label naming the date; see [Accessibility and theming](accessibility-and-theming.md). **Can I add a design?** A design is one file, and the repository's rules in [Architecture](architecture.md) say what it must hold to.
