# Contributing

Thank you for helping. Bug reports and ideas go in the [issues](https://github.com/johnmorrisdotca/koyomi-calendars/issues).

## The rules

- **No runtime dependencies.** The package is plain TypeScript; a dependency is not added for convenience. The shared family parts (`@johnmorrisdotca/kazoku-ui`) are dev dependencies used by the demo only.
- **The core is pure.** Every function returns a new value. Dates are explicit arguments: nothing reads the clock, uses randomness or does I/O. `flipCalendar` is the one function that touches the page, and only the element it is given.
- **A design stays small and alone.** A design imports only `kit.ts`, and `tear.ts` if it is a tear-off page. Nothing a design needs may import another design. `pnpm check` runs `scripts/check-bytes.ts`, which fails when an import grows past its budget.
- **Output does not change by accident.** `test/identical.test.ts` holds the seventeen designs of meigen-sports 0.19.2 to byte-identical output (`test/golden/meigen-0.19.2.json`, made by `scripts/golden-from-meigen.ts`). A new option must leave the output of an icon that does not use it unchanged.
- **Every drawing is our own.** Draw from public facts. No copied, traced or stock artwork, no logo or wordmark, no company's name in a design's name. References are looked at, never traced. No SPX, SPXN or SPXIS mark belongs in this MIT package.
- **A design has a light and a dark version, and a layout** (`page` and `yearZone`) that the tests hold to the same rules as the others.
- **Docs pages are single-language.** One page per language: `<name>.md` is English and `<name>.ja.md` Japanese, each linking to the other in its first lines. `test/docs-language.test.ts` holds it. Whatever Japanese you write, have it read by someone who reads Japanese, and give the English beside it in your report.
- **A README or docs example is run.** `pnpm test:readme` runs every `js` block of the README and the docs against the built package, and checks that the README names every export.
- **Needs Node 22 or later** to use the package and **22.18 or later** to work on it: the tests, the scripts and the demo's server run TypeScript directly.
- **Ports.** This package owns local ports 8000 to 8099 and nothing outside them: the demo's server is on 8000 (`scripts/dev.ts`), the tests' on 8001 (`playwright.config.ts`; `TEST_PORT` names another), the picture script on 8002, and any other server or worktree takes 8003 and up. Check with `lsof -iTCP:<port> -sTCP:LISTEN` first, and stop a server by its process id, never by name.

## Commands

```sh
pnpm check          # lint, types, tests, the build, the packed package and the byte budgets
pnpm test:readme    # the examples of the README and the docs
pnpm test:demo      # builds the demo and plays it in Chromium and WebKit
pnpm dev            # the demo at http://127.0.0.1:8000/
pnpm images         # the pictures of the README (docs/images)
```

Add a line to `CHANGELOG.md` under **Unreleased** for every change.

## Releasing

Make a release commit (bump `package.json`, move the changelog's Unreleased block under the version) and push it. The Release workflow (Actions, Release, Run workflow, from `main`, or a pushed `v<version>` tag) checks the tag, runs `pnpm check`, and publishes by npm trusted publishing, which names `release.yml`. Nobody publishes from a laptop.
