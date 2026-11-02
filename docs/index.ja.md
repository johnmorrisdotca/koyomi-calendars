# Koyomi Calendars

[English](index.md)

暦（こよみ）は、日本語でカレンダーのことです。日や季節の流れを記した暦書の意味もあります。このパッケージはカレンダーのページを描きます。1日分の小さなアイコン（オリジナルデザイン18種）と、ポスター・メモボード・壁掛け・卓上の4種類の月間カレンダーがあり、ページを次の日へめくることもできます。

デザインはすべてSVGのテキストだけで作っており、画像もフォントファイルも依存パッケージも使っていません。月や曜日の名前は`Intl`から取るので、ブラウザが対応している言語ならどれでも使えます。

## ページ

- [アイコン](icons.ja.md)：18種類のデザイン、枠・リング・傾きのオプション、プリセット。
- [ページめくり](animate.ja.md)：次の日・前の日へめくる4つの方法。
- [月間カレンダー](month.ja.md)：4種類の月間ページ、週の始まり、メモ、日本式のレイアウト。

## インストール

```sh
npm install @johnmorrisdotca/koyomi-calendars
```

## アイコン1つ

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const svg = calendarIcon({ theme: "squircle", month: 11, day: 2, year: 2026, scheme: "dark", locale: "ja" });
console.log(svg.startsWith("<svg")); // true
console.log(svg.includes('aria-label="2026年11月2日（月曜日）"')); // true
```

ライブラリは現在の日時を取得しません。日付は呼び出し側が渡します。結果は`title`と`aria-label`の付いたSVG文字列で、そのままページに置けます。

## 大きさ

インポートごとに別ファイルなので、使うものの分だけが読み込まれます。デザイン1つだけならminify後で約9kB（gzipで約4kB）、18種類すべてで約49kB、月間カレンダーは約11kB、ページめくりは約3kBです。このビルドの数値はデモの表にあり、どれかが予算を超えると`pnpm check`が失敗します。

## 今後の予定

このパッケージには、カレンダーに関する機能を今後も加えていく予定です。今はアイコン、月間カレンダー、ページめくりがあります。
