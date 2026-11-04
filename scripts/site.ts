// Builds the demo for GitHub Pages into ./site: the English page at the top, the Japanese one in ja/, the docs of each, and the scripts. Every address is relative,
// so it works at the Pages address (https://johnmorrisdotca.github.io/koyomi-calendars/) and anywhere else. `pnpm site` builds the package first.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { build } from "esbuild";
import { costs } from "./check-bytes.ts";
import { publishThumbnails, thumbnailHead } from "./family-thumbnail.mjs";
import { renderBuilder, renderDemo } from "./page.ts";

/** What the family's card shows (scripts/images.ts makes it): the words of og:image:alt and of the README's top picture. */
const ALT = "Koyomi Calendars: five designs of a calendar-page icon for 17 July 2026 in a row, the squircle design largest in the middle.";

rmSync("site", { recursive: true, force: true });
mkdirSync("site/ja", { recursive: true });
const table = await costs();
const rowsOf = (lang: "en" | "ja") => table.map((c) => `<tr><td><code>${c.import.replace(/^src\//, "").replace(/\.ts$/, "")}</code> ${lang === "ja" ? c.ja : c.name}</td><td data-number="true">${(c.bytes / 1000).toFixed(1)} kB</td><td data-number="true">${(c.gzip / 1000).toFixed(1)} kB</td></tr>`).join("");
// Both demo pages carry the family's card in their <head> (og:image, twitter:image, the icon); the three pictures are published beside the English one.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const withCard = (html: string) => html.replace("</head>", `${thumbnailHead(pkg, { alt: ALT })}</head>`);
writeFileSync("site/index.html", withCard(renderDemo("en", rowsOf("en"))));
writeFileSync("site/ja/index.html", withCard(renderDemo("ja", rowsOf("ja"))));
writeFileSync("site/builder.html", withCard(renderBuilder("en")));
writeFileSync("site/ja/builder.html", withCard(renderBuilder("ja")));
publishThumbnails(".", "site");
for (const file of ["family.css", "koyomi.css", "embed.html"]) cpSync(`demo/${file}`, `site/${file}`);
// The shared parts (a dev dependency, used only by the header): served beside the pages.
cpSync("node_modules/@johnmorrisdotca/kazoku-ui/dist", "site/kazoku-ui", { recursive: true, dereference: true, filter: (from) => !/\.d\.ts$/.test(from) });
// The header's language picker and theme switch for the documentation site's pages, which load them as one module.
writeFileSync("site/kazoku-parts.src.js", `import "@johnmorrisdotca/kazoku-ui/language-picker/define";\nimport "@johnmorrisdotca/kazoku-ui/theme-switch/define";\n`);
await build({ entryPoints: ["site/kazoku-parts.src.js"], outfile: "site/kazoku-parts.js", bundle: true, format: "esm", minify: true, logLevel: "silent", absWorkingDir: process.cwd() });
rmSync("site/kazoku-parts.src.js");
await build({ entryPoints: { demo: "demo/demo.ts", builder: "demo/builder.ts", embed: "demo/embed.ts", animate: "src/animate.ts", koyomi: "src/index.ts", month: "src/month.ts" }, outdir: "site", bundle: true, format: "esm", target: "es2022", minify: true, legalComments: "none", logLevel: "warning", define: { __KOYOMI_VERSION__: JSON.stringify(pkg.version) } });
writeFileSync("site/.nojekyll", "");
console.log("site/ is ready");
