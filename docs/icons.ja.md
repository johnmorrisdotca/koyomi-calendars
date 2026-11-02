# アイコン

[English](icons.md)

`calendarIcon`は、1日分のカレンダーをSVG文字列として描きます。月と日を渡します。年は省略でき、渡すと、曜日や小さな年を表示するデザインでそれが描かれます。

```js
import { calendarIcon, CALENDAR_THEMES } from "@johnmorrisdotca/koyomi-calendars";

console.log(CALENDAR_THEMES.length); // 18
const svg = calendarIcon({ theme: "pins", month: 7, day: 17, year: 2026, size: 120 });
console.log(svg.includes('viewBox="20 15 273 280"')); // true
```

## 18種類のデザイン

| 名前 | ラベル | 見た目 |
|---|---|---|
| `pins` | ピン留め | 平らなページ、赤い見出し、2本のスレートグレーのピン |
| `loops` | リング綴じ | グレーの線、3つのリングピン |
| `shadow` | 長い影 | ラベンダー色のタイルに青い見出しと長い影 |
| `heavy` | 極太 | 太い黒の輪郭、リングの穴 |
| `cartoon` | マンガ風 | 黒い輪郭、ピンクの見出し、つやのある数字 |
| `flip` | フリップ | 遠近のついた卓上カレンダー |
| `stack` | 重ね | 黒く塗った形、傾いたページ、下に重なる1枚 |
| `line` | 線画 | 黒い線画と青い数字 |
| `curl` | 角めくれ | オレンジの見出し、2つのフック、めくれた角 |
| `soft` | やわらか | 赤橙の見出し、琥珀色のリング、珊瑚色の数字 |
| `desk` | 月間パッド | 小さな日付が並ぶ卓上パッド |
| `thin` | 細字 | 白いページ、赤い曜日、とても細い数字 |
| `frame` | 四色枠 | 淡い四角を囲む4色の辺 |
| `badge` | バッジ | 白いタイルと、やわらかな青いページ |
| `sun` | 日の丸 | 赤い円の上に大きな日付が載った日めくり |
| `roll` | 壁掛け日めくり | 縦長の壁掛け日めくり |
| `plain` | 無地 | 台紙つきの飾りのない日めくり。月の満ち欠け付き |
| `squircle` | 角丸タイル | 青緑から青へのグラデーションの角丸タイルに、2つの綴じ具が付いた白いページと、大きく太い日付 |

どのデザインにも、ライトとダークがあります（`scheme: "light"`または`"dark"`）。初期バージョンの10個の名前（`classic`、`outline`など）も使えます。それぞれ、置き換わったデザインとして読み替えられます。

## 枠・リング・傾き

3つのオプションは、デザインの絵には手を加えず、アイコン全体を変えます。どれも指定しなければ、出力はこれまでとバイト単位で完全に同じです。

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const round = calendarIcon({ theme: "badge", month: 3, day: 9, housing: "circle", rings: true, turn: -8 });
console.log(round.includes("<circle")); // true
console.log(round.includes("rotate(-8")); // true
```

- `housing: "circle"`は、アイコンを色付きの円盤の上に載せます。`housingColour`には、CSSの色を何でも指定できます。初期値の`"square"`は、アイコンだけです。
- `rings: true`は、ページの上辺にスパイラルリングを描きます。もともと綴じ具のないデザイン（`badge`、`frame`、`sun`、`roll`、`plain`、`squircle`）が対象で、数（0〜24）で本数を決められます。ほかのデザインでは無視されます。
- `turn`は、アイコン全体を少し傾けます。単位は度で（−45〜45、マイナスは左）、昔のmacOSのアイコンのような傾きです。

## プリセット

プリセットは、これらのオプションの組み合わせに付けた名前です。`flat`、`disc`、`ringed`、`tilted`、`disc-ringed`があります。自分で指定したオプションは、プリセットより優先されます。

```js
import { calendarIcon, CALENDAR_PRESETS } from "@johnmorrisdotca/koyomi-calendars";

console.log(Object.keys(CALENDAR_PRESETS).join(" ")); // flat disc ringed tilted disc-ringed
const svg = calendarIcon({ theme: "squircle", month: 1, day: 1, preset: "disc-ringed", turn: 0 });
console.log(svg.includes("rotate")); // false
```

## デザイン1つだけ

どのデザインも単独でインポートでき、ほかのデザインは含まれません。

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const svg = calendarIcon({ month: 11, day: 2 });
console.log(svg.startsWith("<svg")); // true
```

## 言語

`locale`には`en`か、`Intl`が受け付けるロケールを指定します。`ja`なら、年・月・曜日を日本語の書き方で描きます。日めくりの`sun`、`roll`、`plain`では、土曜と日曜を1枚に並べる（`weekend: "split"`）ことや、祝日・旧暦・六曜（`japanese: true`）も描けます。これらは表から引かず、すべて計算で求めます。

```js
import { calendarIcon, japaneseHoliday } from "@johnmorrisdotca/koyomi-calendars";

console.log(japaneseHoliday(2027, 1, 1)?.en); // New Year's Day
const svg = calendarIcon({ theme: "sun", month: 1, day: 1, year: 2027, locale: "ja", japanese: true });
console.log(svg.includes('data-part="side"')); // true
```

暦の計算の関数は、メインのインポートと`@johnmorrisdotca/koyomi-calendars/japanese`にあります。
