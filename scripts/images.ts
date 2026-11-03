// Makes the pictures of the README and the docs (docs/images/*.png) from the built demo: the hero, the 18 designs light and dark, the four months,
// and a strip of frames for each way of turning the page, forwards and backwards. `pnpm images` (builds the site first). Needs Chromium.
// A server runs on port 8002 for the time it takes and is stopped by its pid.
// It also makes the family's thumbnail, dark thumbnail and icon (docs/images/thumbnail.png, thumbnail-dark.png, icon.png; scripts/family-thumbnail.mjs):
// `node scripts/images.ts --thumbnail` makes only those three, with no server.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import { CALENDAR_FLIPS } from "../src/animate.ts";
import { calendarIcon, CALENDAR_THEMES } from "../src/index.ts";
import { monthCalendar } from "../src/month.ts";
import { captureDrawing, composeThumbnails } from "./family-thumbnail.mjs";

const out = new URL("../docs/images/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const PORT = 8002;
const onlyThumbnail = process.argv.includes("--thumbnail");
const server = onlyThumbnail ? null : spawn(process.execPath, ["scripts/dev.ts"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
const browser = await chromium.launch();
try {
  if (server) await new Promise((r) => setTimeout(r, 800));
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  const sheet = async (html: string, file: string, width: number) => {
    await page.setViewportSize({ width, height: 400 });
    await page.setContent(`<body style="margin:0;font:600 13px system-ui,sans-serif">${html}</body>`);
    await page.screenshot({ path: `${out}${file}`, fullPage: true });
  };
  const D = new Date(Date.UTC(2026, 6, 17));
  const date = { month: D.getUTCMonth() + 1, day: D.getUTCDate(), year: 2026 };
  if (!onlyThumbnail) {
    const tile = (svg: string, label: string, bg: string, fg: string) => `<div style="background:${bg};color:${fg};padding:14px 8px 10px;display:grid;justify-items:center;gap:8px;border-radius:14px">${svg}<span>${label}</span></div>`;
    // The hero: the newest design in each look, then the month pages.
    const looks: Array<[string, Record<string, unknown>]> = [["flat", {}], ["disc", { housing: "circle" }], ["ringed", { rings: true }], ["tilted", { turn: -8 }], ["disc and rings", { housing: "circle", rings: true }]];
    const row = (scheme: "light" | "dark") => {
      const bg = scheme === "light" ? "#f4efe4" : "#1b1d1b";
      const fg = scheme === "light" ? "#1f2320" : "#ece8dc";
      return `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;background:${bg};padding:10px">${looks.map(([name, o]) => tile(calendarIcon({ theme: "squircle", ...date, scheme, size: 150, ...o }), name, scheme === "light" ? "#fbf8f1" : "#232623", fg)).join("")}</div>`;
    };
    await sheet(`<div style="width:900px">${row("light")}${row("dark")}</div>`, "hero.png", 900);
    for (const scheme of ["light", "dark"] as const) {
      const bg = scheme === "light" ? "#f4efe4" : "#1b1d1b";
      const fg = scheme === "light" ? "#1f2320" : "#ece8dc";
      await sheet(`<div style="width:1000px;background:${bg};padding:12px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px">${CALENDAR_THEMES.map((t) => tile(calendarIcon({ theme: t, ...date, scheme, size: 120 }), t, scheme === "light" ? "#fbf8f1" : "#232623", fg)).join("")}</div>`, `designs-${scheme}.png`, 1000);
    }
    const notes = { "11-07": "Dentist 14:00", "11-12": "Groceries and meal prep", "11-19": "Vet 16:00", "11-26": "Birthday" };
    await sheet(`<div style="width:1300px;background:#e8e2d4;padding:14px;display:flex;gap:14px;align-items:flex-start">${(["poster", "board", "wall", "desk"] as const).map((d) => monthCalendar({ year: 2026, month: 11, design: d, size: d === "desk" ? 420 : 280, notes })).join("")}</div>`, "months.png", 1300);
    // The rest of the pictures of the guides: the presets, the months in dark and in Japanese, each month design alone, the tear-off pages, the weekend page and the sizes.
    const light = { bg: "#f4efe4", card: "#fbf8f1", fg: "#1f2320" };
    const dark = { bg: "#1b1d1b", card: "#232623", fg: "#ece8dc" };
    const looksRow = (theme: "badge" | "squircle", scheme: "light" | "dark") => {
      const c = scheme === "light" ? light : dark;
      return `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;background:${c.bg};padding:10px">${looks.map(([name, o]) => tile(calendarIcon({ theme, ...date, scheme, size: 130, ...o }), name, c.card, c.fg)).join("")}</div>`;
    };
    await sheet(`<div style="width:820px">${looksRow("badge", "light")}${looksRow("badge", "dark")}</div>`, "looks.png", 820);
    const designs = ["poster", "board", "wall", "desk"] as const;
    const monthRow = (scheme: "light" | "dark", extra: Record<string, unknown> = {}) => `<div style="width:1300px;background:${scheme === "light" ? "#e8e2d4" : "#171917"};padding:14px;display:flex;gap:14px;align-items:flex-start">${designs.map((d) => monthCalendar({ year: 2026, month: 11, design: d, scheme, size: d === "desk" ? 420 : 280, notes, ...extra })).join("")}</div>`;
    await sheet(monthRow("dark"), "months-dark.png", 1300);
    await sheet(monthRow("light", { locale: "ja" }), "months-ja.png", 1300);
    for (const d of designs) await sheet(`<div style="width:560px;background:#e8e2d4;padding:14px;display:flex;justify-content:center">${monthCalendar({ year: 2026, month: 11, design: d, size: 520, notes })}</div>`, `month-${d}.png`, 560);
    const day = { month: 11, day: 3, year: 2026 };
    const tearOff = (["sun", "roll", "plain"] as const).map((t) => tile(calendarIcon({ theme: t, ...day, scheme: "light", size: 230, locale: "ja", japanese: true }), `${t}, locale ja, japanese: true`, light.card, light.fg)).join("");
    await sheet(`<div style="width:860px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:${light.bg};padding:10px">${tearOff}</div>`, "japanese-pages.png", 860);
    const weekend = (["sun", "roll"] as const).flatMap((t) => [tile(calendarIcon({ theme: t, month: 11, day: 7, year: 2026, scheme: "light", size: 230, weekend: "split" }), `${t}, Saturday 7 November`, light.card, light.fg), tile(calendarIcon({ theme: t, month: 11, day: 9, year: 2026, scheme: "light", size: 230, weekend: "split" }), `${t}, Monday 9 November`, light.card, light.fg)]).join("");
    await sheet(`<div style="width:1000px;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;background:${light.bg};padding:10px">${weekend}</div>`, "weekend-split.png", 1000);
    const sizes = [16, 32, 64, 128, 256].map((size) => tile(calendarIcon({ theme: "squircle", ...date, scheme: "light", size }), `size ${size}`, light.card, light.fg)).join("");
    await sheet(`<div style="width:760px;display:flex;gap:10px;align-items:flex-end;background:${light.bg};padding:10px">${sizes}</div>`, "sizes.png", 760);
    // Each way of turning the page, as frames in time, forwards and then backwards. The animation is paused at each moment and the frame is taken.
    const fractions = [0, 0.2, 0.4, 0.55, 0.75, 1];
    const flipPage = await browser.newPage({ viewport: { width: 1280, height: 700 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });
    await flipPage.goto(`http://127.0.0.1:${PORT}/`);
    for (const name of CALENDAR_FLIPS) {
      await flipPage.evaluate(async ({ name, fractions }) => {
        const koyomi: string = "./koyomi.js";
        const animate: string = "./animate.js";
        const k = (await import(koyomi)) as typeof import("../src/index.ts");
        const a = (await import(animate)) as typeof import("../src/animate.ts");
        document.body.innerHTML = '<div id="grid" style="display:grid;grid-template-columns:repeat(6,200px);gap:8px;padding:12px;background:#f4efe4;width:max-content"></div>';
        const grid = document.getElementById("grid")!;
        const dec = { year: 2026, month: 12, day: 31 };
        const jan = { year: 2027, month: 1, day: 1 };
        for (const [from, to] of [[dec, jan], [jan, dec]] as const) {
          for (const f of fractions) {
            const cell = document.createElement("div");
            cell.style.cssText = "height:250px;overflow:hidden;display:grid;place-items:center;background:#fbf8f1;border-radius:12px";
            const host = document.createElement("div");
            host.style.cssText = "display:inline-block;line-height:0;margin-top:20px";
            cell.append(host);
            grid.append(cell);
            const render = (d: { year: number; month: number; day: number }) => k.calendarIcon({ theme: "squircle", ...d, size: 150 });
            host.innerHTML = render(from);
            void a.flipCalendar(host, { render, from, to, animation: name as never, duration: 1000, motion: "always" });
            const animation = host.querySelector("[data-koyomi=sheet]")!.getAnimations()[0]!;
            animation.pause();
            animation.currentTime = f * 1000;
          }
        }
      }, { name, fractions });
      await flipPage.locator("#grid").screenshot({ path: `${out}turn-${name}.png` });
    }
  }
  // The family's thumbnail: five of the designs of the day's icon in a row, the squircle biggest in the middle, drawn with no tile behind them and laid by
  // scripts/family-thumbnail.mjs on the family's paper (light icons) and its black cloth (dark icons). The icon is the squircle alone.
  const thumbnailDrawing = async (scheme: "light" | "dark", items: Array<[string, number]>) => {
    const icons = items.map(([theme, size]) => calendarIcon({ theme: theme as never, ...date, scheme, size })).join("");
    const one = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: "reduce" });
    await one.setContent(`<body style="margin:0"><div id="thumbnail-stage" style="display:flex;align-items:center;gap:28px;padding:8px;width:max-content">${icons}</div></body>`);
    return { page: one, drawing: await captureDrawing(one, "#thumbnail-stage") };
  };
  const row: Array<[string, number]> = [["pins", 200], ["curl", 200], ["squircle", 280], ["soft", 200], ["desk", 200]];
  const light = await thumbnailDrawing("light", row);
  const dark = await thumbnailDrawing("dark", row);
  const icon = await thumbnailDrawing("light", [["squircle", 460]]);
  for (const picture of await composeThumbnails({ page: icon.page, root: new URL("..", import.meta.url).pathname, light: light.drawing, dark: dark.drawing, icon: icon.drawing, label: "Koyomi Calendars 暦" })) console.log(picture.file, `${Math.round(picture.bytes / 1024)} KB`);
  for (const one of [light, dark, icon]) await one.page.close();
} finally {
  server?.kill();
  await browser.close();
}
