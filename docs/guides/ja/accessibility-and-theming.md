---
title: アクセシビリティとテーマ
section: explanation
order: 10
description: 各アイコンと月間カレンダーがスクリーンリーダーに伝えること、ライトとダークの扱い、動きの軽減の働き、絵の中で変えられるものを説明します。
---

[English](../accessibility-and-theming.md)

## アイコンが伝えること

すべてのアイコンと月間カレンダーは、`role="img"`と、そのロケールの言葉で日付を表す`title`と`aria-label`を持つSVGです。英語なら「Monday Nov 2 2026」、`locale: "ja"`なら日本語の書き方、月間カレンダーなら月の名前と年（「November 2026」）です。SVGは1つの`role="img"`なので、スクリーンリーダーは絵の部品ではなく、そのラベルをひとつの画像として読み上げます。部品には、テストやスタイルで使えるように`data-part`属性（`day`、`month`、`year`、`weekday`など）が付いています。

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const icon = calendarIcon({ theme: "pins", month: 11, day: 2, year: 2026 });
console.log(icon.includes('role="img"'), icon.includes("<title>Monday Nov 2 2026</title>"));
console.log(monthCalendar({ year: 2026, month: 11 }).includes('aria-label="November 2026"'));
// true true
// true
```

すでに日付を書いたテキストの隣にアイコンを置くなら、どちらか一方を、外側の要素の`aria-hidden="true"`で支援技術から隠し、日付が二度読まれないようにします。アイコンだけを表示するページなら、ラベルはそのままにします。

## ライトとダーク

`scheme`は`"light"`か`"dark"`で、絵に使う色を変えます。ページ、見出し、影の色は、明るい背景でも暗い背景でも読めるように選ばれています。ライブラリは何も読み取らない作りなので、ユーザーの設定も代わりに読み取りません。自分のコードで選んでください。

```js no-run
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const dark = matchMedia("(prefers-color-scheme: dark)").matches;
const svg = calendarIcon({ month: 11, day: 2, year: 2026, scheme: dark ? "dark" : "light" });
```

ページを開いている間の変化に追従するには、メディアクエリーの変化を監視して、描き直します。

```js no-run
const query = matchMedia("(prefers-color-scheme: dark)");
query.addEventListener("change", () => { host.innerHTML = draw(query.matches ? "dark" : "light"); });
```

独自のテーマ切り替えがあるページでは、同じ場所でその値を使います。ファイルなら、両方を作って`<picture>`で選びます（[フレームワークとサーバー](frameworks.md#静的サイトと画像ファイル)を参照）。

## コントラスト

コントラストは、デザインとその背景によって決まるので、自分のページで、ライトとダークの両方で確かめてください。ページに淡いタイルを置くデザイン（たとえば`badge`や`frame`）は、ほぼ同じ色のページでは見えなくなることがあります。`housing: "circle"`でアイコンをそれ専用の円盤に載せ、`housingColour`で円盤の色を選んでください。

## 動きの軽減

`flipCalendar`は`prefers-reduced-motion`に従います。ユーザーが動きを減らすよう求めているときは、新しい日付がそのまま表示されます。`motion: "never"`は常にそうし、`motion: "always"`は設定を無視します。パッケージで、ほかに動くものはありません。[ページをめくる](turning-the-page.md)を参照してください。

## 変えられるもの

アイコンは文字列なので、大きさ（`size`、幅16から1024ピクセル）、位置、配色は、ページが決めます。絵の内側はデザイン自身のものです。絵の色を変えるには、別のデザインを選ぶか、日付の表（`monthGrid`）とレイアウト（`calendarLayout`）から自分で描いてください。`housingColour`には、円盤の色としてCSSの色を何でも指定できます。

## 言語

ページの`lang`は、自分で設定してください。アイコンの言葉は`locale`に従います。ページの`lang`が合っていれば、フランス語のページで`locale: "fr"`のアイコンを使うと、ページの言語に応じて音声を切り替えるスクリーンリーダーにも、フランス語として読まれます。
