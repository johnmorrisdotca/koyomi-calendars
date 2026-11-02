// A static server for ./site on this package's ports (8000 to 8099). `PORT=8001 node scripts/dev.ts`; the default is 8000.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import process from "node:process";

const port = Number(process.env.PORT ?? 8000);
if (!Number.isInteger(port) || port < 8000 || port > 8099) throw new Error("Port must be in 8000–8099");
const root = resolve("site");
const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".md": "text/markdown; charset=utf-8" };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    const file = resolve(root, `.${path.endsWith("/") ? `${path}index.html` : path}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Koyomi Calendars: http://127.0.0.1:${port}/`));
