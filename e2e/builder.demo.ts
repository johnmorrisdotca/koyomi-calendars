// The builder page: choose an icon or a month, see it, and the code to copy says what was chosen. One language to a page, the choices kept in the address.
import { expect, test } from "@playwright/test";

test("a choice changes the drawing and the code, and is kept in the address", async ({ page }) => {
  await page.goto("/builder.html");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Build it, then copy the code" })).toBeVisible();
  await expect(page.locator("#stage svg")).toBeVisible();
  await page.locator('#controls [data-key="theme"] [data-value="sun"]').click();
  await page.locator('#controls [data-key="housing"] [data-value="circle"]').click();
  await expect(page.locator("#code")).toContainText('theme: "sun"');
  await expect(page.locator("#code")).toContainText('housing: "circle"');
  await expect(page).toHaveURL(/theme=sun/);
  await page.locator('#seg-format [data-value="alone"]').click();
  await expect(page.locator("#code")).toContainText("koyomi-calendars/themes/sun");
});

test("a month is built the same way", async ({ page }) => {
  await page.goto("/builder.html");
  await page.locator('#seg-what [data-value="month"]').click();
  await page.locator('#controls [data-key="design"] [data-value="wall"]').click();
  await page.locator('#controls [data-key="week"] [data-value="monday"]').click();
  await expect(page.locator("#stage svg")).toBeVisible();
  await expect(page.locator("#code")).toContainText('design: "wall"');
  await expect(page.locator("#code")).toContainText('weekStart: "monday"');
});

test("the Japanese page is Japanese, and the setup in the address opens on it", async ({ page }) => {
  await page.goto("/ja/builder.html?what=month&design=desk");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.getByRole("heading", { name: "作って、コードをコピー" })).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/Build it, then copy the code/);
  await expect(page.locator("#code")).toContainText('design: "desk"');
});
