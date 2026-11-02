// Builds the demo for GitHub Pages into ./site: the English page at the top, the Japanese one in ja/, the docs of each, and the scripts. Every address is relative,
// so it works at the Pages address (https://johnmorrisdotca.github.io/koyomi-calendars/) and anywhere else. `pnpm site` builds the package first.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { build } from "esbuild";
import { costs } from "./check-bytes.ts";
import { docPages } from "./docs-site.ts";
import { renderDemo, renderDoc } from "./page.ts";

rmSync("site", { recursive: true, force: true });
mkdirSync("site/ja/docs", { recursive: true });
mkdirSync("site/docs", { recursive: true });
const table = await costs();
const rowsOf = (lang: "en" | "ja") => table.map((c) => `<tr><td><code>${c.import.replace(/^src\//, "").replace(/\.ts$/, "")}</code> ${lang === "ja" ? c.ja : c.name}</td><td data-number="true">${(c.bytes / 1000).toFixed(1)} kB</td><td data-number="true">${(c.gzip / 1000).toFixed(1)} kB</td></tr>`).join("");
writeFileSync("site/index.html", renderDemo("en", rowsOf("en")));
writeFileSync("site/ja/index.html", renderDemo("ja", rowsOf("ja")));
for (const [name, lang, text] of docPages("docs")) writeFileSync(lang === "ja" ? `site/ja/docs/${name}.html` : `site/docs/${name}.html`, renderDoc(lang, name, text));
for (const file of ["family.css", "koyomi.css"]) cpSync(`demo/${file}`, `site/${file}`);
cpSync("docs/images", "site/docs/images", { recursive: true });
cpSync("docs/images", "site/ja/docs/images", { recursive: true });
// The shared parts (a dev dependency, used only by the header): served beside the pages.
cpSync("node_modules/@johnmorrisdotca/kazoku-ui/dist", "site/kazoku-ui", { recursive: true, dereference: true, filter: (from) => !/\.d\.ts$/.test(from) });
await build({ entryPoints: { demo: "demo/demo.ts", animate: "src/animate.ts", koyomi: "src/index.ts", month: "src/month.ts" }, outdir: "site", bundle: true, format: "esm", target: "es2022", minify: true, legalComments: "none", logLevel: "warning" });
writeFileSync("site/.nojekyll", "");
console.log("site/ is ready");
