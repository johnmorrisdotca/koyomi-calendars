---
title: Frameworks and servers
section: how-to
order: 9
description: Put an icon or a month page in plain HTML, React, Vue, Svelte or Angular, render it on a server or to a file, and turn the page from a component.
---

[日本語](ja/frameworks.md)

The package returns SVG text and has no element, no side effect and no dependency, so it works the same everywhere: in a browser, on a server, in a build script or a worker. The only part that needs a browser is `flipCalendar`.

## On a server or to a file

Because `calendarIcon` and `monthCalendar` are pure functions of their arguments, you can call them where you like and write the string into a page or a file. Nothing reads the clock, so the same call gives the same bytes.

```js
import { writeFileSync } from "node:fs";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const icon = calendarIcon({ theme: "squircle", month: 11, day: 2, year: 2026, size: 128 });
const month = monthCalendar({ year: 2026, month: 11, design: "wall" });
writeFileSync(new URL("./icon-example.svg", import.meta.url), icon);
console.log(icon === calendarIcon({ theme: "squircle", month: 11, day: 2, year: 2026, size: 128 }));
console.log(month.startsWith("<svg"));
// true
// true
```

## Plain HTML

```html
<div id="today"></div>
<script type="module">
  import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/themes/squircle.js";
  const now = new Date();
  document.querySelector("#today").innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
</script>
```

The date is read by your code, once, and passed in. `innerHTML` is safe for what the library draws: note and holiday text is escaped. The one option that is your own markup is `mark`, written as given: the library refuses a `mark` with a script, a style, an event attribute or a `javascript:` address (a `RangeError`), but never build one from user input.

## React

```tsx
import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

export function DayIcon({ date, theme = "squircle" }: { date: Date; theme?: CalendarTheme }) {
  const svg = calendarIcon({ theme, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() });
  return <span role="img" aria-label={date.toDateString()} dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

The SVG already has `role="img"` and an `aria-label`. If the wrapper repeats it, as this one does for the date's long form, hide one from assistive technology rather than reading the date twice. The component draws the same string on a server, so it works with server rendering.

## Vue 3

```vue
<script setup lang="ts">
import { computed } from "vue";
import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

const props = withDefaults(defineProps<{ date: Date; theme?: CalendarTheme }>(), { theme: "squircle" });
const svg = computed(() => calendarIcon({ theme: props.theme, month: props.date.getMonth() + 1, day: props.date.getDate(), year: props.date.getFullYear() }));
</script>

<template><span v-html="svg" /></template>
```

```ts no-check
import { createApp } from "vue";
import DayIcon from "./DayIcon.vue";

createApp(DayIcon, { date: new Date() }).mount("#app");
```

## Svelte

```svelte
<script lang="ts">
  import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

  let { date, theme = "squircle" }: { date: Date; theme?: CalendarTheme } = $props();
  const svg = $derived(calendarIcon({ theme, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }));
</script>

<span>{@html svg}</span>
```

## Angular

```ts no-check
import { Component, Input, inject, type OnChanges } from "@angular/core";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

@Component({ selector: "app-day-icon", standalone: true, template: `<span [innerHTML]="svg"></span>` })
export class DayIconComponent implements OnChanges {
  private readonly sanitizer = inject(DomSanitizer);
  @Input() date = new Date();
  svg: SafeHtml = this.draw();

  ngOnChanges(): void {
    this.svg = this.draw();
  }

  private draw(): SafeHtml {
    const { date } = this;
    // The string holds only what the package drew, so it is trusted. Never build `mark` from user input.
    return this.sanitizer.bypassSecurityTrustHtml(calendarIcon({ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }));
  }
}
```

Angular strips an SVG's styles and attributes unless you mark the string trusted. It is yours, and it holds only what the package drew, so bypassing the sanitizer here is correct as long as you do not build `mark` from user input.

## Turning the page in a component

`flipCalendar` needs the element that holds the icon. In a component, keep a reference to it, hand the function `calendarIcon` with your options, and keep the shown date in state:

```js no-check
import { flipCalendar, nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

async function turn(host, shown, setShown) {
  const to = nextDay(shown);
  setShown(await flipCalendar(host, { render: (date) => calendarIcon({ ...date }), from: shown, to }));
}
```

When the flip is done the element holds one plain icon, so a framework that re-renders the same string sees no difference. If your framework replaces the element's content during a flip, wait for the promise first. The flip is browser-only: call it from an effect or a click, never while rendering on a server.

## Static sites and image files

To make a file for a page that cannot run script, write the string to `icon.svg` and reference it with `<img>`. An SVG used as an image cannot be styled by the page; draw the `scheme` you need, or make both and choose with `<picture>` and `prefers-color-scheme`:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="today-dark.svg">
  <img src="today-light.svg" alt="Monday 2 November 2026">
</picture>
```
