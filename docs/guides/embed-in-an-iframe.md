---
title: Embed it with an iframe
section: how-to
order: 12
description: Put a calendar icon or a month in any page with one iframe and no script, and choose what it shows in the address.
---

[日本語](ja/embed-in-an-iframe.md)

The demo site has a page made to be framed, `embed.html`. It draws what its address says and fetches nothing but its own files, so it needs no script, no build and no package on your side:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Koyomi Calendars in an iframe</title>
  </head>
  <body>
    <iframe
      src="https://johnmorrisdotca.github.io/koyomi-calendars/embed.html?theme=squircle&date=2026-11-03&scheme=light&preset=disc-ringed"
      title="A calendar page for 3 November 2026"
      width="240"
      height="240"
      loading="lazy"
      style="border: 0"
    ></iframe>
  </body>
</html>
```

The drawing sits in the middle of the frame at the largest size that fits, on a transparent background, so it takes your page's colour.

## What the address can say

| Parameter | Values | Default |
|---|---|---|
| `date` | a day, `2026-11-03` | today |
| `theme` | one of the 18 designs, for example `squircle`, `badge`, `sun` | `pins` |
| `scheme` | `light` or `dark` | `light` |
| `preset` | `flat`, `disc`, `ringed`, `tilted` or `disc-ringed` | none |
| `housing`, `rings`, `turn` | `circle`; `1`; a number of degrees, −45 to 45. They win over `preset`. | none |
| `locale` | a language, for example `ja` | `en` |
| `japanese` | `1` adds the Japanese holidays, the old date and the six-day cycle to the designs with side columns (`sun`, `roll`) | off |
| `month` | `1` draws the whole month of `date` instead of the day | off |
| `design`, `week` | with `month=1`: `poster`, `board`, `wall` or `desk`; and `monday` to start the week there | `poster`, Sunday |

A word that is not one of ours is ignored, and the frame falls back to its default. A date with a month outside 1 to 12 or a day outside 1 to 31 draws nothing.

## Choose the size

Give the iframe a `width` and a `height`. The drawing is scaled to fit the smaller of the two, so a square frame shows the icon whole.

## Before you ship

- **Give the frame a `title`.** It tells a screen reader what the frame holds. The drawing inside has its own `aria-label` with the date.
- **Use the address of a release.** The embed page is part of the demo site, which follows the latest release. The address you write is the contract; a parameter that is added later never changes an address that already works.
- **Need more control?** Import the package and draw the SVG yourself: see [Frameworks and servers](frameworks.md).
