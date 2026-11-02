# ページめくり

[English](animate.md)

`flipCalendar`は、要素の中のアイコンを次の日へ、または前の日へめくります。独立したインポートなので、描いただけのアイコンにこのコードは含まれません。必要なのはブラウザ（Web Animations APIを使います）だけです。

日付を描く関数を渡します。ライブラリ全体の`calendarIcon`でも、デザイン1つだけの`calendarIcon`でもよく、枠・リング・傾き・プリセットなどのオプションも自由に付けられます。

```js no-run
import { flipCalendar, nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const element = document.querySelector("#today");
const from = { year: 2026, month: 12, day: 31 };
element.innerHTML = calendarIcon({ ...from });
const shown = await flipCalendar(element, {
  render: (date) => calendarIcon({ ...date }),
  from,
  to: nextDay(from), // 2027-01-01: 年をまたぎます
  animation: "tear-down",
});
```

Promiseは、表示された日付で完了します。終わると、要素の中には、自分で描いたときと同じ普通のアイコンが1つだけ残ります。

## 4つのめくり方

| `animation` | 動き |
|---|---|
| `tear-down` | 軽く引っぱってから、下へちぎれていく |
| `fly-up` | 少し沈んでから、上へ飛んでいく |
| `rip-corner` | 左上の角から破れて、左上へ消える |
| `flip-down` | 下の辺を軸に、手前へ倒れて下へめくれる（遠近つき） |

前の日へ戻る場合（`to`が`from`より前）は、同じ動きを逆に再生します。出ていったページが台紙に戻ってきます。アイコン全体が1枚の紙なので、円盤やタイルのあるデザインでは、円盤やタイルごとめくれます。

## 日付

`nextDay`、`previousDay`、`addDays`は、月・年・うるう日をまたいで日付を進めます。`compareDays`は、2つの日付のどちらが先かを返します。

```js
import { addDays, nextDay, previousDay } from "@johnmorrisdotca/koyomi-calendars/animate";

console.log(JSON.stringify(nextDay({ year: 2024, month: 2, day: 28 }))); // {"year":2024,"month":2,"day":29}
console.log(JSON.stringify(nextDay({ year: 2026, month: 12, day: 31 }))); // {"year":2027,"month":1,"day":1}
console.log(JSON.stringify(previousDay({ year: 2027, month: 3, day: 1 }))); // {"year":2027,"month":2,"day":28}
console.log(JSON.stringify(addDays({ year: 2026, month: 1, day: 31 }, 30))); // {"year":2026,"month":3,"day":2}
```

## 動きを減らす設定

端末が動きを減らす設定（`prefers-reduced-motion`）になっている場合は、新しい日付がそのまま表示されます。`motion: "never"`なら常にそうなり、`motion: "always"`なら設定を無視します。めくっている途中でもう一度めくると、最初のめくりはすぐに終わります。

## オプション

| オプション | 説明 |
|---|---|
| `render` | 日付を描いてSVGを返す関数 |
| `from`、`to` | `{ year, month, day }`。今の日付と、めくる先の日付 |
| `animation` | `CALENDAR_FLIPS`のどれか。初期値は`tear-down` |
| `duration` | ミリ秒。初期値は650 |
| `motion` | `"auto"`、`"never"`、`"always"` |
