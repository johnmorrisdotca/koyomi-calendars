---
title: サイズとバンドル
section: explanation
order: 8
description: 各インポートがページに与える重さ、デザイン1つだけをインポートする方法、ほかが付いてこない理由、CIが守るバイトの予算を説明します。
---

[English](../sizes-and-bundles.md)

パッケージの各部分は、それぞれ単独のインポートなので、ページは使うものの分だけを負担します。メインのインポートには18種類のデザインがすべて入っています。1つのデザインだけを描くページは、そのデザインを単独でインポートし、残りの17は読み込みません。

| インポート | 最小化後 | gzip後 |
|---|---|---|
| デザイン1つだけ、`themes/pins` | 8.8 kB | 4.0 kB |
| デザイン1つだけ、`themes/squircle` | 9.3 kB | 4.1 kB |
| 日めくりのデザイン1つだけ、`themes/sun` | 24.7 kB | 10.9 kB |
| 18種類すべて、メインのインポート | 48.3 kB | 19.1 kB |
| 月間カレンダー、`/month` | 11.0 kB | 4.7 kB |
| ページめくり、`/animate` | 3.1 kB | 1.4 kB |

サイズは、各エントリーをesbuildでバンドルして最小化し、ほかには何も加えずに測ったものです。日めくりのデザインには、描ける日本の暦のコードが含まれます。デモの表には、現在のビルドの数字が出ています。

## デザイン1つだけ

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const svg = calendarIcon({ month: 11, day: 2, year: 2026, scheme: "dark" });
console.log(svg.startsWith("<svg"));
// true
```

デザイン自身の`calendarIcon`は、メインのものと同じオプションを`theme`なしで受け取ります。デザインを選べるページはメインの`calendarIcon`を、デザインが決まっているページはそのデザインをインポートします。

## 副作用なし

パッケージは`"sideEffects": false`なので、バンドラーは使わないものを捨てられ、インポートしてもページには何も起きません。依存も、ネットワークへのリクエストも、保存されるデータもありません。

## 予算

`scripts/check-bytes.ts`は、上の各エントリーをバンドルして、予算を超えると失敗します（`pins`は10,000バイト、`squircle`は10,500、`sun`は27,000、メインのインポートは52,000、`/month`は12,500、`/animate`は3,500）。`pnpm check`がこれを実行するので、インポートが大きくなる変更は、予算ファイルを意図的に更新して、そのことを明示する必要があります。

## メインのインポートの中身

メインのインポートには、アイコン、補助関数（`calendarLayout`、`calendarThemeOf`、`calendarWeekend`、`calendarMoon`）、プリセット、枠、日本の暦の関数が入っています。月間カレンダーとページめくりは、わざと別にしてあります。月間カレンダーは多くのアイコンより大きく、ページめくりはブラウザーが必要で、サーバー上のアイコンには要らないからです。

| 使いたいもの | インポート |
|---|---|
| 名前で選ぶ18種類のデザインのどれでも | `@johnmorrisdotca/koyomi-calendars` |
| デザイン1つ | `@johnmorrisdotca/koyomi-calendars/themes/<name>` |
| 1か月分 | `@johnmorrisdotca/koyomi-calendars/month` |
| ページめくり | `@johnmorrisdotca/koyomi-calendars/animate` |
| デザインの名前とラベルだけ | `@johnmorrisdotca/koyomi-calendars/names` |
| 日本の暦だけ | `@johnmorrisdotca/koyomi-calendars/japanese` |

```js
import { CALENDAR_THEMES } from "@johnmorrisdotca/koyomi-calendars/names";
import { japaneseHoliday } from "@johnmorrisdotca/koyomi-calendars/japanese";

console.log(CALENDAR_THEMES.length, japaneseHoliday(2026, 11, 3)?.ja !== undefined);
// 18 true
```
