// The page turns, in a real browser, to the right date: forwards and backwards, across a month end, a year end and a leap day, in each of the four ways.
// These tests ask for motion; the config's default is reduced motion, so the demo's own animation runs only here.
import { expect, test, type Page } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

const WAYS = ["tear-down", "fly-up", "rip-corner", "flip-down"] as const;
const shown = (page: Page) => page.locator("#stage").getAttribute("data-shown");
const label = (page: Page) => page.locator("#stage svg").first().getAttribute("aria-label");

async function turn(page: Page, button: "next" | "prev", to: string): Promise<void> {
  await page.getByTestId(button).click();
  await expect(page.locator("#stage")).toHaveAttribute("data-shown", to);
  await expect(page.locator("#stage svg")).toHaveCount(1);
  await expect(page.locator("#stage [data-koyomi]")).toHaveCount(0);
  await expect(page.locator("#date")).toHaveValue(to);
}

for (const way of WAYS) {
  test(`${way}: forwards and back across a year end`, async ({ page }) => {
    await page.goto(`/?date=2026-12-31&flip=${way}&theme=squircle`);
    expect(await shown(page)).toBe("2026-12-31");
    await turn(page, "next", "2027-01-01");
    expect(await label(page)).toBe("Friday Jan 1 2027");
    await turn(page, "prev", "2026-12-31");
    expect(await label(page)).toBe("Thursday Dec 31 2026");
    expect(page.url()).toContain("date=2026-12-31");
  });

  test(`${way}: across a month end and a leap day, both ways`, async ({ page }) => {
    await page.goto(`/?date=2024-02-28&flip=${way}&theme=pins`);
    await turn(page, "next", "2024-02-29");
    expect(await label(page)).toBe("Thursday Feb 29 2024");
    await turn(page, "next", "2024-03-01");
    await turn(page, "prev", "2024-02-29");
    await turn(page, "prev", "2024-02-28");
    await page.goto(`/?date=2026-02-28&flip=${way}`);
    await turn(page, "next", "2026-03-01");
    await turn(page, "prev", "2026-02-28");
  });
}

test("the page really is in two layers while it turns, and in one when it has", async ({ page }) => {
  await page.goto("/?date=2026-12-31&flip=tear-down");
  await page.getByTestId("next").click();
  await expect(page.locator("#stage [data-koyomi=sheet]")).toHaveCount(1);
  await expect(page.locator("#stage [data-koyomi=base]")).toHaveCount(1);
  await expect(page.locator("#stage")).toHaveAttribute("data-shown", "2027-01-01");
  await expect(page.locator("#stage [data-koyomi]")).toHaveCount(0);
});

test("two quick taps still end on the right day", async ({ page }) => {
  await page.goto("/?date=2026-12-30&flip=fly-up");
  await page.getByTestId("next").click();
  await page.getByTestId("next").click();
  await expect(page.locator("#stage")).toHaveAttribute("data-shown", "2027-01-01");
  await expect(page.locator("#stage svg")).toHaveCount(1);
  expect(await label(page)).toBe("Friday Jan 1 2027");
});

test("the date field turns the page to a date, back or forward", async ({ page }) => {
  await page.goto("/?date=2026-07-17&flip=rip-corner");
  await page.locator("#date").fill("2026-07-12");
  await expect(page.locator("#stage")).toHaveAttribute("data-shown", "2026-07-12");
  await page.locator("#date").fill("2028-02-29");
  await expect(page.locator("#stage")).toHaveAttribute("data-shown", "2028-02-29");
  expect(await label(page)).toBe("Tuesday Feb 29 2028");
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("the new date simply appears: no second layer is ever made", async ({ page }) => {
    await page.goto("/?date=2026-12-31&flip=tear-down");
    await page.getByTestId("next").click();
    await expect(page.locator("#stage")).toHaveAttribute("data-shown", "2027-01-01");
    await expect(page.locator("#stage [data-koyomi]")).toHaveCount(0);
    expect(await label(page)).toBe("Friday Jan 1 2027");
  });
});
