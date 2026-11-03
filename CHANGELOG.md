# Changelog

## [Unreleased]

- The README opens with the package's thumbnail, and the demo carries it as its link preview (og:image) and publishes the card, a dark card and an icon on Pages at `thumbnail.png`, `thumbnail-dark.png` and `icon.png`.

## [0.1.1] - 2026-11-03

### Fixed

- **`squircle`: the year keeps the family's room.** With a year, the year sat 4.5 of 256 units from the bottom of its page; the family rule asks for 3% of the width (7.7). The day is drawn at 80 instead of 90 when a year is shown (90 without one), so the year ends 8.4 units above the page's bottom. A test holds it.

## [0.1.0] - 2026-11-02

First release. The calendar-page icons of meigen-sports 0.19, moved here to be a package of their own.

### Added

- **`calendarIcon`** and its seventeen designs, moved from meigen-sports 0.19.2 with the same options and byte-identical output for the same inputs (a test compares 2,704 drawings with meigen-sports' own, by hash). The ten names of meigen-sports 0.12 still work.
- **`squircle`, the 18th design**: a soft rounded tile in a teal-to-blue gradient, a white page with a coloured band and two binding tabs, a large bold day; light and dark.
- **One design alone**: each design is its own import (`@johnmorrisdotca/koyomi-calendars/themes/<name>`), about 9 kB minified (4 kB gzipped) with nothing else in it.
- **`housing`** (`circle` sets the icon on a disc), **`rings`** (spiral rings across the top, on the six designs without a binding of their own) and **`turn`** (a slight rotation), with the named presets `flat`, `disc`, `ringed`, `tilted` and `disc-ringed`. With none of them set, the output is unchanged.
- **`@johnmorrisdotca/koyomi-calendars/animate`**: `flipCalendar` turns the page from one day to the next or back, in four ways (`tear-down`, `fly-up`, `rip-corner`, `flip-down`), with `prefers-reduced-motion` respected, plus `nextDay`, `previousDay`, `addDays` and `compareDays`. About 3 kB, no dependency.
- **`@johnmorrisdotca/koyomi-calendars/month`**: `monthCalendar` draws a whole month in four designs (`poster`, `board`, `wall`, `desk`) for any month and year, a Sunday or Monday week start, locale words from `Intl` with the year before the month in Japanese, Saturday and Sunday tinted, per-day notes as data and no holiday data; `monthGrid` and `daysInMonth` give the weeks as data.
- The Japanese holiday, old calendar and six-day-cycle functions, moved from meigen-sports.
- A demo and docs on GitHub Pages, in English and in Japanese on separate pages.
