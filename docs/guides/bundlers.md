---
title: Vite and webpack
section: how-to
order: 11
description: Use the package in a Vite or webpack project, import one design alone so the bundle stays small, and check what reached the bundle.
---

[日本語](ja/bundlers.md)

The package is ES modules with types, `"sideEffects": false` and no dependency, so a bundler keeps only what you import. Install it, import it, and there is nothing to configure.

```sh
npm install @johnmorrisdotca/koyomi-calendars
```

## Vite

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Koyomi Calendars with Vite</title>
  </head>
  <body>
    <div id="today"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

```ts no-run
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const now = new Date();
const today = document.querySelector("#today")!;
today.innerHTML = calendarIcon({ theme: "squircle", month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() }) + monthCalendar({ year: now.getFullYear(), month: now.getMonth() + 1, design: "desk", size: 320 });
```

`calendarIcon` from the package root carries all 18 designs. `monthCalendar` is its own import (`/month`), so a page that draws only icons never carries it.

## webpack

```js
import { fileURLToPath } from "node:url";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: { path: fileURLToPath(new URL("./dist", import.meta.url)), filename: "main.js" },
};
```

```js no-run
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const now = new Date();
const today = document.createElement("div");
today.id = "today";
today.innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
document.body.append(today);
```

This entry imports one design alone, `themes/squircle`, which is the way to keep a bundle small: the other 17 designs are not in it. webpack 5 needs no loader for the package.

## What reached the bundle

A design alone is about 9 kB minified (4 kB gzipped), the whole library about 49 kB, `/month` about 11 kB and `/animate` about 3 kB. [Sizes and bundles](sizes-and-bundles.md) has the table, and says how to check your own bundle. If a build is bigger than you expect, look for an import of the package root where one design would do.
