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

  test('intermediate widths keep the lesson canvas readable', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('chapters/other-core-algorithms/', { waitUntil: 'load' });

    const proseWidth = await page.locator('.prose').evaluate((el) => el.getBoundingClientRect().width);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );

    expect(proseWidth).toBeGreaterThan(480);
    expect(overflows).toBeFalsy();
  });

  test('new deep-learning diagrams fit tablet and mobile canvases', async ({ page }) => {
    for (const route of ['chapters/from-neurons-to-networks/', 'chapters/backpropagation-from-scratch/', 'chapters/pytorch/']) {
      for (const width of [768, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route, { waitUntil: 'load' });
        const overflows = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        const diagramsFit = await page.locator('.diagram-svg').evaluateAll((diagrams) =>
          diagrams.every((diagram) => diagram.getBoundingClientRect().width <= document.documentElement.clientWidth + 1),
        );
        const overflowItems = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          return [...document.querySelectorAll('body *')]
            .filter((element) => element.getBoundingClientRect().right > viewport + 1)
            .slice(0, 8)
            .map((element) => ({
              tag: element.tagName,
              className: element.className?.toString(),
              text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 70),
              right: Math.round(element.getBoundingClientRect().right),
            }));
        });

        expect(overflows, `${route} at ${width}px: ${JSON.stringify(overflowItems)}`).toBeFalsy();
        expect(diagramsFit).toBeTruthy();
      }
    }
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

test.describe('sidebar and topic controls', () => {
  test('desktop sidebars can be hidden, restored, and remembered during the visit', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(CHAPTER, { waitUntil: 'load' });

    const left = page.locator('[data-left-sidebar-toggle]');
    const right = page.locator('[data-right-sidebar-toggle]');
    await expect(page.locator('.nav-col')).toBeVisible();
    await expect(page.locator('.rail-col')).toBeVisible();

    await left.focus();
    await page.keyboard.press('Enter');
    await expect(left).toHaveAccessibleName('Show chapter navigation');
    await expect(page.locator('.nav-col')).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('ai-engineer-course:left-sidebar-hidden'))).toBe('true');

    await left.click();
    await expect(page.locator('.nav-col')).toBeVisible();

    await right.click();
    await expect(right).toHaveAccessibleName('Show lesson outline');
    await expect(page.locator('.rail-col')).toBeHidden();
    expect(await page.evaluate(() => localStorage.getItem('ai-engineer-course:right-sidebar-hidden'))).toBe('true');

    await right.click();
    await expect(page.locator('.rail-col')).toBeVisible();
  });

  test('main topics collapse their subtopics with pointer and keyboard controls', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(CHAPTER, { waitUntil: 'load' });

    const activeLayer = page.locator('.nav-layer:has(.nav-chapter[aria-current="page"])');
    const layerSummary = activeLayer.locator('summary');
    await layerSummary.focus();
    await page.keyboard.press('Enter');
    await expect(activeLayer).not.toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(activeLayer).toHaveAttribute('open', '');

    const firstGroup = page.locator('.toc-group').first();
    const groupSummary = firstGroup.locator('summary');
    await groupSummary.click();
    await expect(firstGroup).not.toHaveAttribute('open', '');
    await groupSummary.focus();
    await page.keyboard.press('Enter');
    await expect(firstGroup).toHaveAttribute('open', '');
  });
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
