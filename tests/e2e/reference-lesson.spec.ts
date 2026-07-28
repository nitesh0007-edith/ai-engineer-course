import { test, expect } from "@playwright/test";

const LESSON = "chapters/python-for-ai-engineering/";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`reference lesson has no horizontal overflow at ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto(LESSON, { waitUntil: "load" });
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(sizes.scroll).toBeLessThanOrEqual(sizes.client + 1);
  });
}

test("quiz gives explained feedback and works from the keyboard", async ({
  page,
}) => {
  await page.goto(LESSON, { waitUntil: "load" });
  const firstQuestion = page.locator(".quiz-card").first();
  await expect(
    firstQuestion.locator("xpath=ancestor::astro-island"),
  ).not.toHaveAttribute("ssr", "");
  const correctChoice = firstQuestion.getByLabel(
    "A name that points to a value",
  );
  await expect(correctChoice).toBeVisible();
  await correctChoice.press("Space");
  await expect(firstQuestion.getByRole("status")).toContainText("Correct.");
  await expect(firstQuestion.getByRole("status")).toContainText(
    "gives a value a name",
  );
});

test("flashcards reveal and move with keyboard-operable buttons", async ({
  page,
}) => {
  await page.goto(LESSON, { waitUntil: "load" });
  const card = page.locator(".flashcard");
  // The server-rendered button is visible before its React island can handle
  // keyboard input. Wait for Astro to remove the `ssr` hydration marker so the
  // test exercises the interactive control rather than racing hydration.
  await expect(card.locator("xpath=ancestor::astro-island")).not.toHaveAttribute(
    "ssr",
    "",
  );
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(card).toHaveAttribute("aria-expanded", "true");
  await expect(card).toContainText("A name that points to a value.");

  await page.getByRole("button", { name: "Next →" }).click();
  await expect(card).toContainText("What brackets create a Python list?");
  await expect(card).toHaveAttribute("aria-expanded", "false");
});

test("lesson checklist persists locally after reload", async ({ page }) => {
  await page.goto(LESSON, { waitUntil: "load" });
  const first = page.locator(".lesson-checklist input").first();
  await first.check();
  await expect(page.locator(".checklist-head")).toContainText(
    /1 of \d+ complete/,
  );
  await page.reload();
  await expect(first).toBeChecked();
  await expect(page.locator(".checklist-head")).toContainText(
    /1 of \d+ complete/,
  );
});

test("print mode shows the one-page summary and hides interactive controls", async ({
  page,
}) => {
  await page.goto(LESSON, { waitUntil: "load" });
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".sketchnote-summary")).toBeVisible();
  await expect(page.locator(".quiz-deck")).toBeHidden();
  await expect(page.locator(".topbar")).toBeHidden();
});

test("reference lesson keeps root-domain paths in internal links", async ({
  page,
}) => {
  await page.goto(LESSON, { waitUntil: "load" });
  const nextHref = await page.locator(".nextup").getAttribute("href");
  const homeHref = await page.locator(".wordmark").getAttribute("href");
  expect(nextHref).toBe("/chapters/async-python/");
  expect(homeHref).toBe("/");
});
