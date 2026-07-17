import { test, expect, type Page } from 'playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility floor: zero critical/serious axe violations on
 * representative pages, in BOTH worlds (band default + paper light).
 * Moderate/minor are reported but not gating yet.
 */

const PAGES = [
  '/docs',
  '/docs/platform/getting-started',
  '/docs/services/pricing/whats-included',
  '/docs/academy/foundations/what-is-ai',
  '/docs/architecture',
  '/docs/resources/changelog',
];

const THEMES = ['dark', 'light'] as const;

/** Wait for fonts + the [data-reveal] entrance stagger to fully settle —
 * axe sampling mid-transition reads blended foreground colors and reports
 * phantom contrast failures. */
async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const revealed = Array.from(document.querySelectorAll('[data-reveal]'));
    if (revealed.length === 0) return;
    revealed.forEach((el) =>
      el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
    );
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600)); // reveal canon: ≤350ms + stagger
  });
}

async function setTheme(page: Page, theme: (typeof THEMES)[number]) {
  await page.addInitScript((t) => {
    try {
      window.localStorage.setItem('theme', t);
    } catch {}
  }, theme);
}

test.describe('Accessibility floor', () => {
  for (const theme of THEMES) {
    for (const path of PAGES) {
      test(`no critical/serious violations on ${path} (${theme})`, async ({ page }, testInfo) => {
        if (testInfo.project.name !== 'chromium') test.skip();
        await setTheme(page, theme);
        await page.goto(path);
        await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
        await settle(page);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        const blocking = results.violations.filter(
          (v) => v.impact === 'critical' || v.impact === 'serious'
        );
        const summary = blocking
          .map(
            (v) =>
              `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} nodes: ${v.nodes[0]?.target})`
          )
          .join('\n');
        expect(blocking, `axe violations on ${path} (${theme}):\n${summary}`).toHaveLength(0);
      });
    }
  }

  test('CLS stays under 0.1 on the homepage', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'chromium') test.skip();
    await page.goto('/docs');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as PerformanceEntry[]) {
              const shift = entry as unknown as { hadRecentInput: boolean; value: number };
              if (!shift.hadRecentInput) total += shift.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(total), 800);
        })
    );
    expect(cls).toBeLessThan(0.1);
  });
});
