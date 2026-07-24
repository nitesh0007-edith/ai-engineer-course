import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';

const CHAPTER = 'chapters/how-to-use-this-course/';

test.describe('layout integrity', () => {
  for (const route of ROUTES) {
    test(`no horizontal overflow (desktop): /${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(route, { waitUntil: 'load' });
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflows).toBeFalsy();
    });
  }

  test('mobile: rail dissolves and nothing overflows', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(CHAPTER, { waitUntil: 'load' });

    const railDisplay = await page
      .locator('.rail-col')
      .evaluate((el) => getComputedStyle(el).display);
    expect(railDisplay).toBe('none');

    const navPosition = await page
      .locator('.nav-col')
      .evaluate((el) => getComputedStyle(el).position);
    expect(navPosition).toBe('fixed'); // drawer, not sticky column

    const offenders = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      return [...document.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > vw + 1)
        .slice(0, 6)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return `${el.tagName}.${(el.className || '').toString().split(' ')[0]} → right ${Math.round(r.right)} (vw ${vw})`;
        });
    });
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

test('theme toggle is keyboard operable', async ({ page }) => {
  await page.goto(CHAPTER, { waitUntil: 'load' });
  const toggle = page.getByRole('button', { name: /switch to (light|dark) theme/i });
  await toggle.focus();
  await expect(toggle).toBeFocused();

  const before = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme'),
  );
  await page.keyboard.press('Enter');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme')))
    .not.toBe(before);
});

test('exercise solutions are reachable and reveal', async ({ page }) => {
  await page.goto('chapters/python-for-ai-engineering/', { waitUntil: 'load' });
  const firstSolution = page.getByRole('group').filter({ hasText: /reveal solution/i }).first();
  const summary = firstSolution.getByText(/reveal solution/i);
  await summary.click();
  // the solution body (a code block) becomes visible
  await expect(firstSolution.locator('pre').first()).toBeVisible();
});

test.describe('reduced motion', () => {
  test('prefers-reduced-motion is honoured', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(CHAPTER, { waitUntil: 'load' });
    const matches = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    expect(matches).toBe(true);
    // the global reduce rule collapses transition durations to ~0
    const dur = await page
      .locator('.nav-col')
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(parseFloat(dur)).toBeLessThan(0.05);
  });
});
