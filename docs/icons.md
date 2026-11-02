# Icons

[日本語](icons.ja.md)

`calendarIcon` draws one day as an SVG string. Pass the month and day; the year is optional and, when given, names the weekday and a small year on the designs that show them.

```js
import { calendarIcon, CALENDAR_THEMES } from "@johnmorrisdotca/koyomi-calendars";

console.log(CALENDAR_THEMES.length); // 18
const svg = calendarIcon({ theme: "pins", month: 7, day: 17, year: 2026, size: 120 });
console.log(svg.includes('viewBox="20 15 273 280"')); // true
```

## The 18 designs

| Name | Label | Look |
|---|---|---|
| `pins` | Pins | flat page, red header, two slate pins |
| `loops` | Loops | grey outline, three ring pins |
| `shadow` | Long shadow | blue header on a lavender tile, long shadow |
| `heavy` | Heavy | heavy black outline, ring slots |
| `cartoon` | Cartoon | black outline, pink header, glossy number |
| `flip` | Flip | a flip calendar in perspective |
| `stack` | Stack | solid black glyph, tilted page, a sheet underneath |
| `line` | Line | black line art with a blue number |
| `curl` | Curl | orange header, two hooks, a curled corner |
| `soft` | Soft | red-orange header, amber rings, a coral number |
| `desk` | Desk | a desk pad with a month of small dates |
| `thin` | Thin | a white page, the weekday in red, a very thin number |
| `frame` | Frame | four coloured sides round a pale square |
| `badge` | Badge | a white tile and a soft blue page |
| `sun` | Sun disc | a tear-off page with a huge day over a red disc |
| `roll` | Wall roll | a tall wall tear-off page |
| `plain` | Plain | a plain tear-off pad on a kraft stand, with the moon |
| `squircle` | Squircle | a soft rounded tile in a teal-to-blue gradient, a white page with two binding tabs, a large bold day |

Every design has a light and a dark version (`scheme: "light"` or `"dark"`). The ten names of the first release (`classic`, `outline` and so on) still work: each reads as the design that replaced it.

## Housing, rings and turn

Three options change the whole icon and leave a design's drawing alone. With none of them set, the output is the same bytes as without them.

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

const round = calendarIcon({ theme: "badge", month: 3, day: 9, housing: "circle", rings: true, turn: -8 });
console.log(round.includes("<circle")); // true
console.log(round.includes("rotate(-8")); // true
```

- `housing: "circle"` sets the icon on a coloured disc; `housingColour` takes any CSS colour. The default is `"square"`: the icon alone.
- `rings: true` draws spiral rings across the top of the page, on the designs that have no binding of their own: `badge`, `frame`, `sun`, `roll`, `plain` and `squircle`. A number (0 to 24) sets how many. The other designs ignore it.
- `turn` turns the whole icon a little, in degrees (−45 to 45; negative is to the left), as older macOS icons stood.

## Presets

A preset is a name for a set of those options: `flat`, `disc`, `ringed`, `tilted` and `disc-ringed`. An option you give yourself wins over the preset.

```js
import { calendarIcon, CALENDAR_PRESETS } from "@johnmorrisdotca/koyomi-calendars";

console.log(Object.keys(CALENDAR_PRESETS).join(" ")); // flat disc ringed tilted disc-ringed
const svg = calendarIcon({ theme: "squircle", month: 1, day: 1, preset: "disc-ringed", turn: 0 });
console.log(svg.includes("rotate")); // false
```

## One design alone

Each design is also its own import, which carries none of the others:

```js
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars/themes/squircle";

const svg = calendarIcon({ month: 11, day: 2 });
console.log(svg.startsWith("<svg")); // true
```

## Languages

`locale` is `en` or any locale `Intl` accepts. A `ja` icon writes the year, month and weekday the Japanese way. The tear-off designs `sun`, `roll` and `plain` can also draw a Saturday and Sunday on one page (`weekend: "split"`), the Japanese holidays, old calendar dates and the six-day cycle (`japanese: true`), computed and never looked up.

```js
import { calendarIcon, japaneseHoliday } from "@johnmorrisdotca/koyomi-calendars";

console.log(japaneseHoliday(2027, 1, 1)?.en); // New Year's Day
const svg = calendarIcon({ theme: "sun", month: 1, day: 1, year: 2027, locale: "ja", japanese: true });
console.log(svg.includes('data-part="side"')); // true
```

The calendar helpers live in the main import and in `@johnmorrisdotca/koyomi-calendars/japanese`.
