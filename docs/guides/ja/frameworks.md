---
title: フレームワークとサーバー
section: how-to
order: 9
description: アイコンや月間カレンダーを、ふつうのHTML、React、Vue、Svelte、Angularに入れ、サーバーやファイルで描き、コンポーネントからめくります。
---

[English](../frameworks.md)

パッケージが返すのはSVGの文字列で、要素も副作用も依存もないので、どこでも同じように動きます。ブラウザー、サーバー、ビルドスクリプト、ワーカーのどれでもです。ブラウザーが必要なのは、`flipCalendar`だけです。

## サーバーで、またはファイルへ

`calendarIcon`と`monthCalendar`は引数だけで決まる関数なので、好きな場所で呼び、文字列をページやファイルに書けます。時計は読まないので、同じ引数なら同じバイト列を返します。

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

## ふつうのHTML

```html
<div id="today"></div>
<script type="module">
  import { calendarIcon } from "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/koyomi-calendars/dist/themes/squircle.js";
  const now = new Date();
  document.querySelector("#today").innerHTML = calendarIcon({ month: now.getMonth() + 1, day: now.getDate(), year: now.getFullYear() });
</script>
```

日付は自分のコードで1回だけ読み取り、渡します。ライブラリが描いた文字列を`innerHTML`に入れても安全です。メモと祝日の文字は、エスケープされます。利用側が書いたマークアップがそのまま出力されるのは`mark`オプションだけです。スクリプト、スタイル、イベント属性、`javascript:`のアドレスを含む`mark`は、ライブラリが`RangeError`で拒否しますが、ユーザーの入力から`mark`を作らないでください。

## React

```jsx
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

export function DayIcon({ date, theme = "squircle" }) {
  const svg = calendarIcon({ theme, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() });
  return <span role="img" aria-label={date.toDateString()} dangerouslySetInnerHTML={{ __html: svg }} />;
}
```

SVGにはすでに`role="img"`と`aria-label`があります。外側の要素にも同じものを付けるなら、どちらかを支援技術から隠し、日付が二度読まれないようにします。

## Vue 3

```vue
<script setup>
import { computed } from "vue";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const props = defineProps({ year: Number, month: Number });
const svg = computed(() => monthCalendar({ year: props.year, month: props.month, design: "board" }));
</script>
<template><div v-html="svg" /></template>
```

## Svelte

```svelte
<script>
  import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
  export let month;
  export let day;
  $: svg = calendarIcon({ theme: "pins", month, day });
</script>
{@html svg}
```

## Angular

```ts no-check
import { Component, Input } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

@Component({ selector: "app-day-icon", standalone: true, template: `<span [innerHTML]="svg"></span>` })
export class DayIconComponent {
  svg: SafeHtml;
  @Input() set date(value: Date) {
    this.svg = this.sanitizer.bypassSecurityTrustHtml(calendarIcon({ month: value.getMonth() + 1, day: value.getDate(), year: value.getFullYear() }));
  }
  constructor(private sanitizer: DomSanitizer) {}
}
```

Angularは、信頼済みと指定しない限り、SVGのスタイルと属性を取り除きます。この文字列は自分のコードが作ったもので、パッケージが描いたものだけが入っているので、`mark`をユーザーの入力から作らない限り、サニタイザーを迂回しても問題ありません。

## コンポーネントの中でめくる

`flipCalendar`には、アイコンを持つ要素が必要です。コンポーネントでは、その要素への参照を持ち、オプション付きの`calendarIcon`を渡し、表示中の日付を状態として持ちます。

```js no-check
import { flipCalendar, nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

async function turn(host, shown, setShown) {
  const to = nextDay(shown);
  setShown(await flipCalendar(host, { render: (date) => calendarIcon({ ...date }), from: shown, to }));
}
```

めくりが終わると、要素の中身はふつうの1つのアイコンになっているので、同じ文字列で再描画するフレームワークでも違いは見えません。めくっている間にフレームワークが要素の中身を置き換えるなら、先にPromiseの完了を待ってください。めくりはブラウザー専用です。エフェクト（`useEffect`など）やクリックから呼び、サーバーでの描画中には呼ばないでください。

## 静的サイトと画像ファイル

スクリプトを実行できないページ向けには、文字列を`icon.svg`に書き、`<img>`で参照します。画像として使ったSVGは、ページからスタイルを変えられません。必要な`scheme`で描くか、両方を作って、`<picture>`と`prefers-color-scheme`で選びます。

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="today-dark.svg">
  <img src="today-light.svg" alt="Monday 2 November 2026">
</picture>
```
