# Changelog

## [Unreleased]

## [0.2.0] - 2026-11-03

### Added

- **A documentation site**, `scripts/docs-site.mjs` (the family's): a page for every export with its signature, parameters and a runnable example, the guides in English and Japanese, search and `llms.txt`, at https://johnmorrisdotca.github.io/koyomi-calendars/docs/. Every export now has a TSDoc summary, `@param`, `@returns` and an `@example` that runs when the site is built. This replaces the demo's small Markdown reader (`scripts/docs-site.ts`); the old pages `docs/*.md` stay in the repository.
- **An embed page**, `embed.html` on the demo site: a page made for an iframe that draws what its address says (`date`, `theme`, `scheme`, `preset`, `housing`, `rings`, `turn`, `locale`, `japanese`, or a whole month with `month=1`, `design` and `week`).
- **Every way of using the package, written and tested**: `examples/` (a CDN, jsDelivr and unpkg, turning the page, an iframe, Vite, webpack, React, Vue, Svelte, Angular, TypeScript, Node) and `pnpm test:usage`, which builds or runs each against the package as npm packs it, opens the pages in a browser, and checks the guides hold the same text. It runs in CI. Four new guides, each with its Japanese page: Vite and webpack, plain HTML and a CDN, embed it with an iframe, TypeScript and Node.
- **The family's must-have check**, `scripts/check-standard.mjs`, held by `test/standard.test.ts`.

### Changed

- The demo moves to `@johnmorrisdotca/kazoku-ui` ^0.12 (the header's language picker and theme switch).
- `pnpm docs:check` now checks the documentation site (every export's TSDoc and example, every guide's front matter and links, and runs every example); the check of `docs/API.md` and the Japanese twins is `pnpm docs:api:check`. The Docs workflow runs both.
- The demo's Docs link goes to the documentation site, and to its Japanese pages from the Japanese demo.
- The README opens with the package's thumbnail, and the demo carries it as its link preview (og:image) and publishes the card, a dark card and an icon on Pages at `thumbnail.png`, `thumbnail-dark.png` and `icon.png`.

### Documentation

- **Thirteen guides, each with a Japanese page, and a generated API reference.** `docs/guides/` has getting started, icons and designs, housing rings and turn, month pages, turning the page, the Japanese calendar, languages and locales, sizes and bundles, frameworks and servers, accessibility and theming, architecture, troubleshooting and upgrading; each has its Japanese page of the same name in `docs/guides/ja/`. `docs/API.md` is written from the built declarations (`pnpm docs:api`). The README is rewritten into sections around the same material.
- **Every example runs, and the documentation is checked.** `pnpm test:readme` now also runs the examples of the guides; `pnpm docs:check` fails when `docs/API.md` is out of date, a guide has no Japanese page or a different set of code blocks, a link or picture is missing, or an export is named nowhere. Both run in `.github/workflows/docs.yml`. `test/docs-language.test.ts` holds the guides' Japanese pages to the same one-language rule as the older pages.
- **Ten more pictures** in `docs/images/` (the looks, the months in dark and in Japanese, each month design, the tear-off pages, the weekend page and the sizes), made by `pnpm images`.
- New demo page: `demo/builder.html`, to choose an icon or a month and copy the code, in English and in Japanese.

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
