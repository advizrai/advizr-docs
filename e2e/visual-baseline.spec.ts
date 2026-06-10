import { test, expect } from 'playwright/test';

/**
 * Visual regression baselines for the design overhaul.
 *
 * Goldens live in e2e/visual-baseline.spec.ts-snapshots/. Refresh them
 * deliberately after an intentional design change:
 *   npx playwright test e2e/visual-baseline.spec.ts --project=chromium --update-snapshots
 *
 * Phase B0 rule: the cascade-layers refactor must produce a near-zero diff
 * against these goldens. Later phases refresh the goldens per phase.
 */

const PAGES: Array<[name: string, path: string]> = [
  ['home', '/docs'],
  ['services', '/docs/services'],
  ['pricing', '/docs/services/pricing'],
  ['academy-lesson', '/docs/academy/foundations/what-is-ai'],
  ['architecture', '/docs/architecture'],
  ['platform-getting-started', '/docs/platform/getting-started'],
];

const VIEWPORTS: Record<string, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};

test.describe('Visual baselines', () => {
  for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    for (const theme of ['dark', 'light'] as const) {
      for (const [name, path] of PAGES) {
        test(`${name} ${vpName} ${theme}`, async ({ page }) => {
          await page.setViewportSize(vp);
          await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
          await page.goto(path);
          await page.waitForFunction(
            (t) => document.documentElement.classList.contains('dark') === (t === 'dark'),
            theme
          );
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(300);
          await expect(page).toHaveScreenshot(`${name}-${vpName}-${theme}.png`, {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.02,
          });
        });
      }
    }
  }

  test('search-open desktop dark', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await page.goto('/docs');
    const input = page.locator('[data-nextra-search] input').first();
    if ((await input.count()) > 0) {
      await input.click();
      await input.fill('workflow');
      await page.waitForTimeout(800);
    }
    await expect(page).toHaveScreenshot('search-open-desktop-dark.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
});
