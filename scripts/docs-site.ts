// The docs as pages of the demo site: each docs/*.md through a small Markdown reader of ours (headings, paragraphs, lists, tables, code, links, bold, code spans).
// Enough for these files and no more. Each page is one language: `name.md` is English, `name.ja.md` is Japanese.
import { readdirSync, readFileSync } from "node:fs";

const esc = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(text: string): string {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
      const local = /^(?!https?:)[\w./-]+\.md(#.*)?$/.test(href);
      return `<a href="${local ? href.replace(/(\.ja)?\.md/, ".html") : href}">${label}</a>`;
    });
}

export function markdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i]!.startsWith("```")) code.push(lines[i++]!);
      i += 1;
      out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
    } else if (/^<!--/.test(line)) {
      while (i < lines.length && !lines[i]!.includes("-->")) i += 1;
      i += 1;
    } else if (/^#{1,4} /.test(line)) {
      const level = /^#+/.exec(line)![0].length;
      out.push(`<h${level}>${inline(line.slice(level + 1))}</h${level}>`);
      i += 1;
    } else if (/^\s*[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*] /.test(lines[i]!)) {
        let item = lines[i++]!.replace(/^\s*[-*] /, "");
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]!) && !/^\s*[-*] /.test(lines[i]!)) item += ` ${lines[i++]!.trim()}`;
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ul>${items.join("")}</ul>`);
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i]!.startsWith("|")) rows.push(lines[i++]!.split("|").slice(1, -1).map((cell) => cell.trim()));
      const [head, , ...body] = rows as [string[], string[], ...string[][]];
      out.push(`<div class="fam-table-box"><table><thead><tr>${head.map((cell) => `<th>${inline(cell)}</th>`).join("")}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
    } else if (line.trim() === "") i += 1;
    else {
      const text: string[] = [];
      while (i < lines.length && lines[i]!.trim() !== "" && !/^(#{1,4} |```|\||\s*[-*] |<!--)/.test(lines[i]!)) text.push(lines[i++]!);
      out.push(`<p>${inline(text.join(" "))}</p>`);
    }
  }
  return out.join("\n");
}

/** The docs that become pages: `[name, language, text]`. */
export function docPages(directory: string): Array<[string, "en" | "ja", string]> {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file): [string, "en" | "ja", string] => [file.replace(/(\.ja)?\.md$/, ""), file.endsWith(".ja.md") ? "ja" : "en", readFileSync(`${directory}/${file}`, "utf8")]);
}
