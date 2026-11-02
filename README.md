<p align="center"><img src="docs/images/hero.png" alt="The squircle calendar icon on a flat tile, on a disc, with rings, tilted, and on a disc with rings, in light and dark" width="720"></p>

# Koyomi Calendars <sub>暦</sub>

**Calendar pages as SVG, in under 10 kB.** One day as an icon, in 18 original designs, light and dark. A whole month as a poster, a memo board, a wall page or a desk pad. And the page turning, from one day to the next and back.

```sh
npm install @johnmorrisdotca/koyomi-calendars
```

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const svg = calendarIcon({ theme: "squircle", month: 11, day: 2, year: 2026, scheme: "dark", housing: "circle", rings: true });
console.log(svg.startsWith("<svg")); // true
```

**[Open the demo](https://johnmorrisdotca.github.io/koyomi-calendars/)** ([日本語のデモ](https://johnmorrisdotca.github.io/koyomi-calendars/ja/)): pick a design, a housing, rings and a turn, turn the page back and forward, and copy the code.

## What you get

- **18 designs, light and dark.** Every one is our own drawing: shapes, gradients and a stroke-drawn digit set. No image, no font file, no logo, no company's name.
- **Small.** One design alone is about 9 kB minified (4 kB gzipped), and imports nothing else. Import a design from `@johnmorrisdotca/koyomi-calendars/themes/squircle` and the other 17 never reach the page. All 18 together are about 49 kB.
- **Housing, rings and a turn.** Set the icon on a disc, bind it with spiral rings, stand it a little askew like older macOS icons, or take a named preset: `flat`, `disc`, `ringed`, `tilted`, `disc-ringed`.
- **Any language.** Month and weekday words come from `Intl`; Japanese, with the Japanese holidays, the old calendar and the six-day cycle, is computed, never looked up.
- **Whole months.** `monthCalendar` draws four month designs for any month and year, with leap years, a Sunday or Monday week start, notes on days that are yours to give, and no holiday data of its own. A separate import (`/month`, about 11 kB).
- **The page turns.** `flipCalendar` tears the page down, flies it up and away, rips it off a corner or flips it down, forwards or backwards, with `prefers-reduced-motion` respected. A separate import (`/animate`, about 3 kB), with no dependency.
- **No dependency**, no side effect (`"sideEffects": false`), typed, ESM. Node 22 or later, or any current browser.

![The 18 designs in light](docs/images/designs-light.png)

## The page turning

```js no-run
import { flipCalendar, nextDay } from "@johnmorrisdotca/koyomi-calendars/animate";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const from = { year: 2026, month: 12, day: 31 };
await flipCalendar(element, { render: (d) => calendarIcon({ ...d }), from, to: nextDay(from), animation: "tear-down" });
```

![The page torn down, forwards and backwards](docs/images/turn-tear-down.png)

The four ways are `tear-down`, `fly-up`, `rip-corner` and `flip-down`; the [docs](docs/animate.md) show each.

## A whole month

```js
import { monthCalendar } from "@johnmorrisdotca/koyomi-calendars/month";

const svg = monthCalendar({ year: 2026, month: 11, design: "poster", weekStart: "monday", notes: { "11-07": "Dentist 14:00" } });
console.log(svg.includes("Dentist")); // true
```

![Four month pages](docs/images/months.png)

## More calendar things will come here

Koyomi is meant to become the family's home for everything calendar: today the icons, the month pages and the page turning; more will arrive in this package.

## The API in a list

Main import: `calendarIcon`, `calendarLayout`, `CALENDAR_THEMES`, `CALENDAR_THEME_LABELS`, `CALENDAR_THEME_ALIASES`, `calendarThemeOf`, `CALENDAR_YEAR_MIN`, `CALENDAR_YEAR_CLEAR`, `calendarWeekend`, `calendarMoon`, `CALENDAR_HOUSINGS`, `CALENDAR_TURN_MAX`, `CALENDAR_PRESETS`, `calendarPresetOf`, and the Japanese calendar functions `japaneseHoliday`, `japaneseHolidaysOf`, `JAPANESE_HOLIDAY_YEARS`, `oldCalendarDate`, `OLD_CALENDAR_YEARS`, `ROKUYO` and `rokuyoOf`. Each design alone: `themes/<name>` exports `calendarIcon`. `/animate`: `flipCalendar`, `nextDay`, `previousDay`, `addDays`, `compareDays`, `CALENDAR_FLIPS`. `/month`: `monthCalendar`, `monthGrid`, `daysInMonth`, `MONTH_DESIGNS`.

## Docs

[Overview](docs/index.md) · [Icons](docs/icons.md) · [Turning the page](docs/animate.md) · [Whole months](docs/month.md) · [日本語](docs/index.ja.md)

## The name

Koyomi (暦) is Japanese for a calendar or an almanac. The packages of this family take a Japanese word for what they do: Dougu (道具, tools), Senshu (選手, players), Meigen (名言, famous sayings).

## The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Koyomi Calendars is one of thirty packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).
- [Kyogijo Stadiums](https://github.com/johnmorrisdotca/kyogijo-stadiums) (競技場): sports fields, rinks, courts and ballparks drawn to scale as SVG, with each team and the score on them. [Demo](https://johnmorrisdotca.github.io/kyogijo-stadiums/).
- [Taisen Brackets](https://github.com/johnmorrisdotca/taisen-brackets) (対戦): a sport-agnostic tournament bracket, drawn as SVG, from a list of ties. [Demo](https://johnmorrisdotca.github.io/taisen-brackets/).
- [Dougu Sports](https://github.com/johnmorrisdotca/dougu-sports) (道具): sports emblems as SVG: trophies, medals, crests, and the ball and gear of every sport, with optional 3D turning. [Demo](https://johnmorrisdotca.github.io/dougu-sports/).
- [Senshu Jerseys](https://github.com/johnmorrisdotca/senshu-jerseys) (選手): sports jerseys, sweaters, kits, caps, helmets and retired-number banners as SVG, front and back, with optional 2.5D turning. [Demo](https://johnmorrisdotca.github.io/senshu-jerseys/).
- [Meigen Sports](https://github.com/johnmorrisdotca/meigen-sports) (名言): sports quotations and on-this-day history. [Demo](https://johnmorrisdotca.github.io/meigen-sports/). Not on npm yet.
- [Koyomi Calendars](https://github.com/johnmorrisdotca/koyomi-calendars) (暦): calendar-page icons and whole months as SVG, in light and dark, with page-turning from one day to the next. [Demo](https://johnmorrisdotca.github.io/koyomi-calendars/).

**This package is Koyomi Calendars.** The demos of all thirty share one header and footer, so each links the rest.
<!-- family:end -->

## Licence

MIT. Every drawing is original; see [NOTICE.md](NOTICE.md).
