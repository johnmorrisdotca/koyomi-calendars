// The page: one language to a page, the choices kept in the address, the designs, the code and the months.
import { expect, test } from "@playwright/test";

test("the English page is English and the Japanese page is Japanese, and the picker goes from one to the other", async ({ page }) => {
  await page.goto("/?date=2026-07-17");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Pick a design, then turn the page" })).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/デザインを選んで/);
  await page.locator('kazoku-language-picker [data-v="ja"]').click();
  await expect(page).toHaveURL(/\/ja\/index\.html\?date=2026-07-17/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { name: "デザインを選んで、ページをめくる" })).toBeVisible();
  expect(await page.locator("#heading, #gallery-heading, #month-heading").allInnerTexts()).not.toContain("Pick a design, then turn the page");
  await page.locator('kazoku-language-picker [data-v="en"]').click();
  await expect(page).toHaveURL(/127\.0\.0\.1:\d+\/index\.html\?date=2026-07-17$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("the theme switch changes the icon's colours with the page", async ({ page }) => {
  await page.goto("/?date=2026-07-17&theme=pins");
  const light = await page.locator("#stage svg").innerHTML();
  await page.locator('kazoku-theme-switch [data-v="dark"]').click();
  await expect.poll(async () => page.locator("#stage svg").innerHTML()).not.toBe(light);
});

test("housing, rings, turn and preset are kept in the address and come back on a reload", async ({ page }) => {
  await page.goto("/?date=2026-07-17&theme=badge");
  await page.locator('#seg-housing [data-value="circle"]').click();
  await page.locator('#seg-rings [data-value="1"]').click();
  await page.locator('#seg-turn [data-value="-8"]').click();
  await expect(page).toHaveURL(/housing=circle/);
  await expect(page).toHaveURL(/rings=1/);
  await expect(page).toHaveURL(/turn=-8/);
  await expect(page.locator("#stage svg circle").first()).toBeAttached();
  await expect(page.locator("#stage svg ellipse").first()).toBeAttached();
  await expect(page.locator("#stage svg g[transform^='rotate(-8']")).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#seg-housing [data-value="circle"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('#seg-turn [data-value="-8"]')).toHaveAttribute("aria-pressed", "true");
  await page.locator('#seg-preset [data-preset="flat"]').click();
  await expect(page.locator("#stage svg ellipse")).toHaveCount(0);
  await expect(page).not.toHaveURL(/housing=/);
});

test("the gallery has all 18 designs, light and dark, and a tap puts one on the stage", async ({ page }) => {
  await page.goto("/?date=2026-07-17");
  await expect(page.locator("#gallery .tile")).toHaveCount(18);
  await expect(page.locator("#gallery .tile svg")).toHaveCount(36);
  await page.locator('#gallery .tile[data-theme="roll"]').click();
  await expect(page).toHaveURL(/theme=roll/);
  await expect(page.locator('#gallery .tile[data-theme="roll"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#code-draw")).toContainText("themes/roll");
});

test("the code to copy matches the choices, and Copy answers", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => undefined);
  await page.goto("/?date=2026-07-17&theme=squircle&housing=circle&turn=-8");
  const code = page.locator("#code-draw");
  await expect(code).toContainText('from "@johnmorrisdotca/koyomi-calendars/themes/squircle"');
  await expect(code).toContainText('housing: "circle"');
  await expect(code).toContainText("turn: -8");
  await expect(code).toContainText("month: 7, day: 17, year: 2026");
  await page.locator('[data-copy="draw"]').click();
  await expect(page.locator('[data-copy="draw"]')).toHaveText("Copied");
});

test("the month pages: four designs, the week start and the notes follow the choices", async ({ page }) => {
  await page.goto("/?date=2026-11-02");
  await expect(page.locator("#months figure")).toHaveCount(4);
  await expect(page.locator("#months figure").first().locator("svg")).toHaveAttribute("aria-label", "November 2026");
  await expect(page.locator("#months").getByText("Dentist 14:00").first()).toBeAttached();
  await page.locator('#seg-notes [data-value="0"]').click();
  await expect(page.locator("#months").getByText("Dentist 14:00")).toHaveCount(0);
  await page.locator('#seg-week [data-value="monday"]').click();
  await expect(page).toHaveURL(/week=monday/);
  const first = await page.locator('#months figure[data-design="wall"] svg text').filter({ hasText: /^(MON|SUN)$/ }).first().textContent();
  expect(first).toBe("MON");
});

test("the Japanese page draws the months in Japanese, the year before the month", async ({ page }) => {
  await page.goto("/ja/?date=2026-11-02");
  await expect(page.locator("#months figure").first().locator("svg")).toHaveAttribute("aria-label", "2026年11月");
  await expect(page.locator("#months").getByText("歯医者 14:00").first()).toBeAttached();
});

test("the docs link leads to the documentation site, in the page's language", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="docs/index.html"]').first().click();
  await expect(page).toHaveURL(/\/docs\/index\.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/ja/");
  await page.locator('a[href="../docs/ja/index.html"]').first().click();
  await expect(page).toHaveURL(/\/docs\/ja\/index\.html$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("no error is logged on either page", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  for (const path of ["/", "/ja/", "/embed.html", "/docs/index.html", "/docs/ja/index.html"]) await page.goto(path);
  expect(errors).toEqual([]);
});

test("the embed page draws what its address says, and nothing else", async ({ page }) => {
  await page.goto("/embed.html?theme=squircle&date=2026-11-03&scheme=dark");
  await expect(page.locator("#frame svg")).toHaveAttribute("aria-label", "Tuesday Nov 3 2026");
  await page.goto("/embed.html?month=1&date=2026-11-03&design=desk&week=monday");
  await expect(page.locator("#frame svg")).toHaveAttribute("aria-label", /November 2026/);
  await page.goto("/embed.html?date=2026-13-03");
  await expect(page.locator("#frame svg")).toHaveCount(0);
});
