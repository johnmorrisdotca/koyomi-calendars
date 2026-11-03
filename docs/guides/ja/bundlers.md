---
title: Viteとwebpack
section: how-to
order: 11
description: Viteやwebpackのプロジェクトでこのパッケージを使い、デザインを1つだけ読み込んでバンドルを小さく保ち、バンドルに何が入ったかを確かめます。
---

[English](../bundlers.md)

このパッケージは、型付きのESモジュールで、`"sideEffects": false`、依存はありません。そのため、バンドラーは読み込んだものだけを残します。インストールして、読み込めば、設定は要りません。

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

パッケージのルートの`calendarIcon`は、18のデザインすべてを含みます。`monthCalendar`は別の読み込み（`/month`）なので、アイコンだけを描くページには入りません。

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

この入口は、`themes/squircle`というデザイン1つだけを読み込みます。バンドルを小さくする方法はこれです。残りの17のデザインは入りません。webpack 5では、このパッケージにローダーは要りません。

## バンドルに何が入ったか

デザイン1つは圧縮して約9 kB（gzipで4 kB）、ライブラリ全体は約49 kB、`/month`は約11 kB、`/animate`は約3 kBです。表と、自分のバンドルの調べ方は、[大きさとバンドル](sizes-and-bundles.md)にあります。思ったより大きいときは、デザイン1つで足りるところで、パッケージのルートを読み込んでいないか探してください。
