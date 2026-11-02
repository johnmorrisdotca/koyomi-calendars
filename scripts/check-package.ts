// The package as npm packs it: no demo, docs, tests or tools in it; installed into an empty folder, every entry imports and draws, and one design alone draws the
// same bytes as the whole library. Run after a build (`pnpm test:package`).
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const root = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), "koyomi-package-"));
const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { name: string; version: string; exports: Record<string, string | { import: string }> };

function run(command: string, args: string[], cwd: string): string {
  const r = spawnSync(command, args, { cwd, encoding: "utf8", shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error(`${command} failed: ${r.stdout}\n${r.stderr}`);
  return r.stdout;
}

try {
  const pack = JSON.parse(run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", scratch], root)) as Array<{ filename: string; files: Array<{ path: string }> }>;
  const files = pack[0]!.files.map((f) => f.path);
  if (files.some((f) => /^(demo|docs|scripts|test|e2e|site|src)\//.test(f))) throw new Error("Source, tests or the demo entered the npm package");
  for (const need of ["LICENSE", "NOTICE.md", "README.md", "dist/index.js", "dist/animate.js", "dist/month.js", "dist/themes/squircle.js"]) if (!files.includes(need)) throw new Error(`${need} is missing from the npm package`);
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", join(scratch, pack[0]!.filename)], scratch);
  const imports = Object.keys(pkg.exports).filter((key) => key !== "./package.json").map((key) => (key === "." ? pkg.name : `${pkg.name}/${key.slice(2)}`));
  const themes = imports.filter((name) => name.includes("/themes/")).map((name) => name.split("/").pop()!);
  writeFileSync(
    join(scratch, "check.mjs"),
    `import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
for (const name of ${JSON.stringify(imports)}) {
  const esm = await import(name);
  const cjs = require(name);
  assert.deepEqual(Object.keys(esm).filter((k) => k !== "default").sort(), Object.keys(cjs).filter((k) => k !== "default" && k !== "__esModule").sort(), name);
}
const all = await import(${JSON.stringify(pkg.name)});
assert.equal(all.CALENDAR_THEMES.length, ${themes.length});
for (const theme of ${JSON.stringify(themes)}) {
  const alone = await import(${JSON.stringify(`${pkg.name}/themes/`)} + theme);
  for (const scheme of ["light", "dark"]) assert.equal(alone.calendarIcon({ month: 11, day: 2, year: 2026, scheme }), all.calendarIcon({ theme, month: 11, day: 2, year: 2026, scheme }), theme);
}
const { monthCalendar } = await import(${JSON.stringify(`${pkg.name}/month`)});
assert.match(monthCalendar({ year: 2026, month: 2 }), /^<svg /);
const { nextDay } = await import(${JSON.stringify(`${pkg.name}/animate`)});
assert.deepEqual(nextDay({ year: 2026, month: 12, day: 31 }), { year: 2027, month: 1, day: 1 });
console.log(${imports.length} + " entries import by ESM and require; " + ${themes.length} + " designs draw alone as in the whole");
`,
  );
  console.log(run(process.execPath, [join(scratch, "check.mjs")], scratch).trim());
  console.log(`Packed ${files.length} files (${pkg.name}@${pkg.version}).`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
