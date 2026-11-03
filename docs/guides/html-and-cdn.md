---
title: Plain HTML and a CDN
section: how-to
order: 10
description: Draw an icon on a page with no build step, from jsDelivr or unpkg, load one design alone, and turn the page from a button.
---

[日本語](ja/html-and-cdn.md)

A page with no bundler can import the package's ES modules straight from a CDN. jsDelivr and unpkg both serve the files of the npm package as they are, so every address below is a file in the package's `dist` folder.

## The whole library, from jsDelivr

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>A calendar icon from jsDelivr</title>
  </head>
  <body>
    <div id="today"></div>
    <script type="module">
      import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/index.js";

      const now = new Date();
      document.querySelector("#today").innerHTML = calendarIcon({ theme: "squircle", month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
    </script>
  </body>
</html>
```

`calendarIcon` returns text, and `innerHTML` is safe for what the library draws: note and holiday text is escaped. Your code reads the date, once, and passes it in; the library never reads the clock. This page imports all 18 designs, which is about 49 kB minified.

## One design alone, from unpkg

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>One calendar design from unpkg</title>
  </head>
  <body>
    <div id="today"></div>
    <script type="module">
      import { calendarIcon } from "https://unpkg.com/@johnmorrisdotca/koyomi-calendars/dist/themes/badge.js";

      const now = new Date();
      document.querySelector("#today").innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
    </script>
  </body>
</html>
```

Import `dist/themes/<name>.js` and the other 17 designs never reach the page: one design is about 9 kB minified (4 kB gzipped). That file's `calendarIcon` has no `theme` option, because the design is the file.

## Turn the page from a button

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Turning the page, from jsDelivr</title>
  </head>
  <body>
    <div id="today"></div>
    <button type="button" id="next">Next day</button>
    <script type="module">
      import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/themes/squircle.js";
      import { flipCalendar, nextDay } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/animate.js";

      const host = document.querySelector("#today");
      const now = new Date();
      let shown = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
      host.innerHTML = calendarIcon(shown);

      document.querySelector("#next").addEventListener("click", async () => {
        shown = await flipCalendar(host, { render: (date) => calendarIcon(date), from: shown, to: nextDay(shown), animation: "fly-up" });
      });
    </script>
  </body>
</html>
```

`flipCalendar` tears the page down, flies it up, rips it off a corner or flips it down, and resolves with the date now shown. It needs a browser and nothing else. When the reader asks for less motion, the new date just appears.

## Before you ship

- **Pin a version.** Write `@johnmorrisdotca/koyomi-calendars@0.2.0/dist/...` so a new release never changes your page. Without a version, the CDN gives the latest.
- **Allow the CDN.** A page with a content security policy lists the CDN's host in `script-src`.
- **Never build `mark` from user input.** It is the one option written to the page as given.
- **In a build, use a bundler.** [Vite and webpack](bundlers.md) keep only what you import.
