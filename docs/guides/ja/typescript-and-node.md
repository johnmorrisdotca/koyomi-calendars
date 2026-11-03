---
title: TypeScriptとNode
section: how-to
order: 13
description: パッケージの型を使い、サーバーやビルドスクリプトでアイコンと月間カレンダーを描き、ファイルに書き出します。
---

[English](../typescript-and-node.md)

パッケージは自分の型を持ち、Node 22以降と、いまのブラウザーで動きます。ESモジュールで、Node 22.12以降なら`require()`でも読み込めます。

## 型

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

`CalendarIconOptions`と`MonthCalendarOptions`が、すべてのオプションを表します。`CalendarTheme`は18のデザイン名の型で、ないデザインは、実行時の驚きではなく、型のエラーになります。最後の関数がその例で、呼び出しの前の行が、TypeScriptに「ここはエラーになる」と伝えています。

## サーバーやビルドスクリプトで

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

`calendarIcon`と`monthCalendar`は、引数だけで決まる関数で、DOMも時計も使いません。そのため、サーバーはブラウザーとバイト単位で同じSVGを描きます。文字列をファイルに書く、メールやシェアカードに入れる、`Content-Type: image/svg+xml`で返す、のどれでもできます。

## 自分のコードの型を確かめる

パッケージに実行時の依存はありません。`"moduleResolution": "bundler"`、`"node16"`、`"nodenext"`のどれでも、すべてのサブパス（`/month`、`/animate`、`/japanese`、`/names`、`/themes/<名前>`）に型があります。
