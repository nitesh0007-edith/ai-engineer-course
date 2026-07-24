import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES } from './routes';

// axe-core accessibility scan — zero violations (CLAUDE.md §13). Runs in both
// themes, since colour-contrast differs between them.
for (const route of ROUTES) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe: /${route} [${theme}]`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route, { waitUntil: 'load' });
      // Let the no-flash inline script settle the theme.
      await page.waitForFunction(() => document.documentElement.hasAttribute('data-theme'));

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
}
