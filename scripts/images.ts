// Makes the pictures of the README and the docs (docs/images/*.png) from the built demo: the hero, the 18 designs light and dark, the four months,
// and a strip of frames for each way of turning the page, forwards and backwards. `pnpm images` (builds the site first). Needs Chromium.
// A server runs on port 8002 for the time it takes and is stopped by its pid.
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import { CALENDAR_FLIPS } from "../src/animate.ts";
import { calendarIcon, CALENDAR_THEMES } from "../src/index.ts";
import { monthCalendar } from "../src/month.ts";

const out = new URL("../docs/images/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const PORT = 8002;
const server = spawn(process.execPath, ["scripts/dev.ts"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
const browser = await chromium.launch();
try {
  await new Promise((r) => setTimeout(r, 800));
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
  const sheet = async (html: string, file: string, width: number) => {
    await page.setViewportSize({ width, height: 400 });
    await page.setContent(`<body style="margin:0;font:600 13px system-ui,sans-serif">${html}</body>`);
    await page.screenshot({ path: `${out}${file}`, fullPage: true });
  };
  const D = new Date(Date.UTC(2026, 6, 17));
  const date = { month: D.getUTCMonth() + 1, day: D.getUTCDate(), year: 2026 };
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
} finally {
  server.kill();
  await browser.close();
}
