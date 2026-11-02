// What each import costs a page: the entry bundled and minified with esbuild (ES2022, no dependency to add), then gzipped. Fails when one grows past its budget.
// `node scripts/check-bytes.ts` prints the table; `--json` prints it as JSON.
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

export interface Cost {
  name: string;
  ja: string;
  import: string;
  bytes: number;
  gzip: number;
  budget: number;
}

// Budgets are the measured size rounded up a little: a change that adds more has to say so here.
const ENTRIES: Array<{ name: string; ja: string; entry: string; budget: number }> = [
  { name: "one theme alone (pins)", ja: "デザイン1つだけ（pins）", entry: "src/themes/pins.ts", budget: 10_000 },
  { name: "one theme alone (squircle, the 18th)", ja: "デザイン1つだけ（squircle、18番目）", entry: "src/themes/squircle.ts", budget: 10_500 },
  { name: "one tear-off theme alone (sun)", ja: "日めくりのデザイン1つだけ（sun）", entry: "src/themes/sun.ts", budget: 27_000 },
  { name: "all 18 themes (the main import)", ja: "18種類すべて（メインのインポート）", entry: "src/index.ts", budget: 52_000 },
  { name: "the month pages (/month)", ja: "月間カレンダー（/month）", entry: "src/month.ts", budget: 12_500 },
  { name: "the page turning (/animate)", ja: "ページめくり（/animate）", entry: "src/animate.ts", budget: 3_500 },
];

export async function costs(): Promise<Cost[]> {
  const out: Cost[] = [];
  for (const { name, ja, entry, budget } of ENTRIES) {
    const result = await build({ entryPoints: [entry], bundle: true, minify: true, format: "esm", target: "es2022", write: false, legalComments: "none", logLevel: "silent" });
    const code = result.outputFiles[0]!.contents;
    out.push({ name, ja, import: entry, bytes: code.byteLength, gzip: gzipSync(code, { level: 9 }).byteLength, budget });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const table = await costs();
  if (process.argv.includes("--json")) console.log(JSON.stringify(table, null, 2));
  else for (const c of table) console.log(`${c.name.padEnd(42)} ${String(c.bytes).padStart(7)} B minified  ${String(c.gzip).padStart(6)} B gzip   budget ${c.budget}`);
  const over = table.filter((c) => c.bytes > c.budget);
  if (over.length) {
    console.error(`over budget: ${over.map((c) => c.name).join(", ")}`);
    process.exit(1);
  }
}
