// The builder page: choose an icon or a month, see it, and the code to copy says what was chosen. One language to a page, the choices kept in the address.
import { expect, test } from "@playwright/test";

test("a choice changes the drawing and the code, and is kept in the address", async ({ page }) => {
  await page.goto("/builder.html");
  const code = page.locator('#embed-panel [part="code"]');
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Build it, then copy the code" })).toBeVisible();
  await expect(page.locator("#stage svg")).toBeVisible();
  await page.locator('#controls [data-key="theme"] [data-value="sun"]').click();
  await page.locator('#controls [data-key="housing"] [data-value="circle"]').click();
  await expect(code).toContainText('theme: "sun"');
  await expect(code).toContainText('housing: "circle"');
  await expect(page).toHaveURL(/theme=sun/);
  await page.locator('#embed-panel button[data-kind="alone"]').click();
  await expect(code).toContainText("koyomi-calendars/themes/sun");
});

test("a month is built the same way", async ({ page }) => {
  await page.goto("/builder.html");
  const code = page.locator('#embed-panel [part="code"]');
  await page.locator('#seg-what [data-value="month"]').click();
  await page.locator('#controls [data-key="design"] [data-value="wall"]').click();
  await page.locator('#controls [data-key="week"] [data-value="monday"]').click();
  await expect(page.locator("#stage svg")).toBeVisible();
  await expect(code).toContainText('design: "wall"');
  await expect(code).toContainText('weekStart: "monday"');
});

test("the Japanese page is Japanese, and the setup in the address opens on it", async ({ page }) => {
  await page.goto("/ja/builder.html?what=month&design=desk");
  const code = page.locator('#embed-panel [part="code"]');
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { name: "作って、コードをコピー" })).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/Build it, then copy the code/);
  await expect(code).toContainText('design: "desk"');
});

test("nothing the builder's code section had is gone: A page, One design alone, A file on a server, six more ways, four sizes, a picture, Copy, the embed page, the docs and the credit", async ({ page }) => {
  await page.goto("/builder.html?date=2026-07-17");
  const panel = page.locator("#embed-panel");
  await expect(panel.locator('[role="tab"][aria-selected="true"]')).toHaveText("A page");
  await expect(panel.locator('[role="tab"]')).toHaveText(["A page", "One design alone", "A file on a server", "HTML", "React", "Vue", "Angular", "Svelte", "iframe"]);
  await expect(panel.locator('[part="size-button"]')).toHaveText(["64", "96", "160", "256"]);
  await expect(panel.locator('[part="size-button"][aria-pressed="true"]')).toHaveText("160");
  await expect(panel.locator('[part="preview"] svg')).toHaveCount(1);
  await expect(panel.locator('[part="copy"]')).toHaveText("Copy code");
  await expect(panel.locator('[part="open"]')).toHaveAttribute("href", /^embed\.html\?theme=squircle&scheme=light/);
  await expect(panel.locator('[part="docs"]')).toHaveAttribute("href", "docs/index.html");
  await expect(panel.locator('[part="credits"]')).toContainText("Every drawing is our own");
  await panel.locator('button[data-kind="file"]').click();
  await expect(panel.locator('[part="code"]')).toContainText('writeFileSync("today.svg"');
  await panel.locator('button[data-size="64"]').click();
  await expect(panel.locator('[part="code"]')).toContainText("size: 64");
  await expect(page).toHaveURL(/size=64/);
  await expect(page).toHaveURL(/format=file/);
  // a month has no design alone and no size, and keeps the rest
  await page.locator('#seg-what [data-value="month"]').click();
  await expect(panel.locator('[role="tab"]')).toHaveText(["A page", "A file on a server", "HTML", "React", "Vue", "Angular", "Svelte", "iframe"]);
  await expect(panel.locator('[part="size-button"]').first()).toBeHidden();
  await expect(panel.locator('[part="code"]')).toContainText('writeFileSync("month.svg"');
  await panel.locator('button[data-kind="iframe"]').click();
  await expect(panel.locator('[part="code"]')).toContainText("embed.html?month=1");
  await expect(panel.locator('[part="note"]')).toContainText("does not draw the notes");
});

test("the Japanese builder has the same parts, in Japanese", async ({ page }) => {
  await page.goto("/ja/builder.html");
  const panel = page.locator("#embed-panel");
  await expect(panel.locator('[role="tab"]')).toHaveText(["ページ", "デザイン1つだけ", "サーバー上のファイル", "HTML", "React", "Vue", "Angular", "Svelte", "iframe"]);
  await expect(panel.locator('[part="open"]')).toHaveAttribute("href", /^\.\.\/embed\.html\?/);
  await expect(panel.locator('[part="docs"]')).toHaveAttribute("href", "../docs/ja/index.html");
  await expect(panel.locator('[part="credits"]')).toContainText("オリジナル");
});
