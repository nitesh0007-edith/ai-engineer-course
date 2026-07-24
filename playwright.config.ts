import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the built, previewed site (not dev) so the gate checks what
 * actually ships — base path and all. `pnpm build` must run first; the
 * webServer below serves dist via `astro preview`.
 */
const PORT = 4321;
const BASE = `http://localhost:${PORT}/ai-engineer-course/`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm preview --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
