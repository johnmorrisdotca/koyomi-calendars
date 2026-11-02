# 月間カレンダー

[English](month.md)

`monthCalendar`は、1か月分のカレンダーを1枚のSVGとして描きます。独立したインポートなので、小さなアイコンにこのコードは含まれません。日付は単純な計算で、うるう年はグレゴリオ暦の規則に従います。月や曜日の名前は`Intl`から取ります。このライブラリは祝日を一切持っていないので、日付のメモはすべて自分で渡します。

```js
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const svg = monthCalendar({ year: 2026, month: 11, design: "poster", weekStart: "monday", scheme: "light", locale: "ja" });
console.log(svg.includes('aria-label="2026年11月"')); // true
```

## 4種類のデザイン

| `design` | 説明 |
|---|---|
| `poster` | とても大きな月の文字、控えめな罫線の表、来月の小さなカレンダー、書き込める余白 |
| `board` | メモボード。大きな月、控えめな罫線の表、手書き風のメモ |
| `wall` | 上部がスパイラル綴じで、赤い見出しの壁掛けカレンダー |
| `desk` | コイルとバナーのある、横長の卓上パッド |

## オプション

| オプション | 説明 |
|---|---|
| `year`、`month` | 描く月。年は1〜9999 |
| `weekStart` | `"sunday"`（初期値）または`"monday"` |
| `locale` | `en`か、`Intl`が受け付けるロケール。日本語・中国語・韓国語では、年が月の前に来ます |
| `scheme` | `"light"`または`"dark"` |
| `size` | CSSピクセルでの幅。初期値は480 |
| `notes` | 日付ごとの短いメモ。`"2026-11-07"`のように年月日で、または`"11-07"`のように毎年その日に付けます。2行まで入ります |
| `tint` | 土曜を青、日曜を赤にします。初期値は日本語のときだけオンです |
| `outside` | 前後の月の日付を薄く表示します。`wall`と`desk`ではオンです |
| `mini` | 来月の小さなカレンダー。`poster`ではオン、`board`ではオフです |

## メモ

```js
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const svg = monthCalendar({ year: 2026, month: 11, design: "board", locale: "ja", notes: { "2026-11-07": "歯医者 14:00", "11-23": "休み" } });
console.log(svg.includes("歯医者")); // true
console.log(svg.includes("休み")); // true
```

年月日で渡したメモはその年だけ、`"MM-DD"`で渡したメモは毎年表示されます。マスに収まらない長いメモは、2行で切って末尾に「…」を付けます。

## 表をデータとして使う

`monthGrid`は、描画なしで週の並びだけを返します。自分でデザインを作るときに使えます。7日ずつの週が並び、各日に年・月・日・曜日（0が日曜、6が土曜）と、その月に属するかどうかが付きます。`daysInMonth`はうるう年を知っています。

```js
import { daysInMonth, monthGrid } from "@johnmorrisdotca/koyomi-calendars/month";

console.log(daysInMonth(2024, 2)); // 29
console.log(daysInMonth(2100, 2)); // 28
const february = monthGrid(2026, 2, "monday");
console.log(february.weeks.length); // 5
console.log(february.weeks[0][0].day); // 26
```
