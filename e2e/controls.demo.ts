// No control is left in the browser's own style: every visible button, select, checkbox, radio and field has a border, a ground or a shape of its own, in light and in dark.
import { expect, test, type Page } from "@playwright/test";

const PAGES = ["/", "/ja/", "/docs/index.html", "/docs/ja/index.html"] as const;
const SCHEMES = ["light", "dark"] as const;

/** Visible controls that still look as the browser draws them: the same border, ground and corners as a fresh, unstyled control of the same kind. */
async function unstyled(page: Page) {
  return page.evaluate(() => {
    const look = (el: Element) => {
      const s = getComputedStyle(el);
      return [s.borderTopStyle, s.borderTopWidth, s.borderTopColor, s.backgroundColor, s.borderTopLeftRadius, s.backgroundImage].join("|");
    };
    const probes = new Map<string, string>();
    const probe = (kind: string) => {
      const cached = probes.get(kind);
      if (cached !== undefined) return cached;
      const el = document.createElement(kind === "checkbox" || kind === "radio" ? "input" : kind);
      if (el instanceof HTMLInputElement) el.type = kind;
      el.style.cssText = "all: revert; position: absolute; visibility: hidden";
      document.body.append(el);
      const signature = look(el);
      probes.set(kind, signature);
      el.remove();
      return signature;
    };
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const kindOf = (el: Element) => {
      if (el instanceof HTMLInputElement) return el.type === "checkbox" || el.type === "radio" ? el.type : "";
      const tag = el.tagName.toLowerCase();
      return tag === "button" || tag === "select" ? tag : "";
    };
    return [...document.querySelectorAll("button, select, input")].filter((el) => {
      const kind = kindOf(el);
      return kind !== "" && visible(el) && look(el) === probe(kind);
    }).map((el) => `${kindOf(el)}${el.id === "" ? "" : `#${el.id}`}`);
  });
}

for (const scheme of SCHEMES) {
  for (const path of PAGES) {
    test(`${path} has no control in the browser's own style (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(`${path}${path.endsWith("/") ? "?date=2026-07-17" : ""}`);
      await expect(page.locator("header")).toBeVisible();
      expect(await unstyled(page)).toEqual([]);
    });
  }
}

test("every control of the demo is at least 44 px high and nothing scrolls the page sideways", async ({ page }) => {
  await page.goto("/?date=2026-07-17");
  await expect(page.locator("#stage svg")).toBeVisible();
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("button, select, input")]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; })
      .map((el) => `${el.tagName}#${el.id}.${el.className}`));
  expect(small).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
