---
title: Accessibility and theming
section: explanation
order: 10
description: What every icon and month page says to a screen reader, how light and dark work, what reduced motion does, and what you can and cannot change in a drawing.
---

[日本語](ja/accessibility-and-theming.md)

## What an icon says

Every icon and month page is an SVG with `role="img"`, a `title` and an `aria-label` that name the date in the icon's own language: "Monday Nov 2 2026" in English, the Japanese form for `locale: "ja"`, the month name and year for a month page ("November 2026"). Because the SVG is one `role="img"`, a screen reader reads that label as one picture rather than the drawing's parts. The parts are marked with `data-part` attributes (`day`, `month`, `year`, `weekday` and so on) for your own tests and styles.

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const icon = calendarIcon({ theme: "pins", month: 11, day: 2, year: 2026 });
console.log(icon.includes('role="img"'), icon.includes("<title>Monday Nov 2 2026</title>"));
console.log(monthCalendar({ year: 2026, month: 11 }).includes('aria-label="November 2026"'));
// true true
// true
```

If you put an icon next to text that already says the date, hide one of the two from assistive technology, with `aria-hidden="true"` on the wrapper, so the date is not read twice. If a page shows only the icon, leave the label as it is.

## Light and dark

`scheme` is `"light"` or `"dark"`, and it changes the colours the drawing uses: a different page, header and shadow, chosen to read on a light or a dark background. The library does not read the reader's setting for you, because it never reads anything. Choose in your own code:

```js no-run
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const dark = matchMedia("(prefers-color-scheme: dark)").matches;
const svg = calendarIcon({ month: 11, day: 2, year: 2026, scheme: dark ? "dark" : "light" });
```

To follow a change while the page is open, listen to the media query and draw again:

```js no-run
const query = matchMedia("(prefers-color-scheme: dark)");
query.addEventListener("change", () => { host.innerHTML = draw(query.matches ? "dark" : "light"); });
```

On a page with a theme switch of its own, use the switch's value in the same place. For files, make both and pick with `<picture>` (see [Frameworks and servers](frameworks.md#static-sites-and-image-files)).

## Contrast

Contrast depends on the design and on what is behind it, so check it on your own page, in both schemes. The designs that put a pale tile on the page (`badge` and `frame`, for example) can disappear into a page of nearly the same colour: set `housing: "circle"` to put the icon on a disc of its own, and `housingColour` to choose the disc's colour.

## Reduced motion

`flipCalendar` respects `prefers-reduced-motion`: when the reader asks for less motion, the new date simply appears. `motion: "never"` always does that, and `motion: "always"` ignores the setting. Nothing else in the package moves. See [Turning the page](turning-the-page.md).

## What you can change

An icon is a string, so the page decides its size (`size`, 16 to 1024 pixels wide), its place and its colour scheme. The inside of a drawing is the design's own. To change a drawing's colours, pick another design or write your own from the month grid (`monthGrid`) and the layout (`calendarLayout`). The `housingColour` option takes any CSS colour for a disc.

## Language

The `lang` of your page is yours to set. The icon's words follow its `locale`, so a page in French with `locale: "fr"` icons reads as French to a screen reader that switches voices by the language of the page, if the page's own `lang` matches.
