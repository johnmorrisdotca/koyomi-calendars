// Makes test/golden/meigen-0.19.2.json: the SHA-256 (first 16 hex digits) of the SVG that meigen-sports' own calendarIcon draws for every case in
// test/cases.ts, and the message of every error. Run once, against a checkout of meigen-sports at the commit named in the file:
//   node scripts/golden-from-meigen.ts <path to meigen-sports>
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { BAD, cases, SEVENTEEN, WORDS } from "../test/cases.ts";

const root = resolve(process.argv[2] ?? "");
const mod = (await import(pathToFileURL(join(root, "src/calendarIcon.ts")).href)) as typeof import("../src/icon.ts") & typeof import("../src/names.ts") & typeof import("../src/date.ts");
const sha = (text: string) => createHash("sha256").update(text).digest("hex").slice(0, 16);
const svg: Record<string, string> = {};
for (const [key, options] of cases(SEVENTEEN)) svg[key] = sha(mod.calendarIcon(options));
const errors: Record<string, string> = {};
for (const [name, input] of BAD) {
  try { mod.calendarIcon(input as never); errors[name] = "no error"; } catch (error) { errors[name] = `${(error as Error).name}: ${(error as Error).message}`; }
}
const words: Array<[string, string | null]> = WORDS.map((word) => [word, mod.calendarThemeOf(word)]);
const commit = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const layouts: Record<string, string> = {};
for (const theme of SEVENTEEN) for (const year of [false, true]) for (const weekend of [false, true]) layouts[`${theme}/${year}/${weekend}`] = JSON.stringify(mod.calendarLayout(theme, year, weekend));
const moon: Record<string, number> = {};
const weekends: Record<string, string> = {};
for (const [y, m, d] of [[2026, 11, 7], [2026, 11, 8], [2026, 11, 9], [2027, 1, 2], [2027, 2, 30], [1, 1, 1], [9999, 12, 31], [2000, 1, 6], [2026, 5, 1]] as const) {
  moon[`${y}-${m}-${d}`] = mod.calendarMoon(y, m, d);
  weekends[`${y}-${m}-${d}`] = JSON.stringify(mod.calendarWeekend(y, m, d));
}
writeFileSync(new URL("../test/golden/meigen-0.19.2.json", import.meta.url), JSON.stringify({ source: "meigen-sports", version: "0.19.2", commit, count: Object.keys(svg).length, svg, errors, words, layouts, moon, weekends }, null, 0) + "\n");
console.log(`${Object.keys(svg).length} drawings, ${BAD.length} errors, ${WORDS.length} words, from meigen-sports ${commit.slice(0, 8)}`);
