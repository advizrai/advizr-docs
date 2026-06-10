import { test, expect } from 'playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility floor (B7): zero critical/serious axe violations on
 * representative pages. Moderate/minor are reported but not gating yet.
 */

const PAGES = [
  '/docs',
  '/docs/platform/getting-started',
  '/docs/services/pricing/whats-included',
  '/docs/academy/foundations/what-is-ai',
  '/docs/architecture',
  '/docs/resources',
];

test.describe('Accessibility floor', () => {
  for (const path of PAGES) {
    test(`no critical/serious violations on ${path}`, async ({ page }, testInfo) => {
      if (testInfo.project.name !== 'chromium') test.skip();
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        // Known upstream issue: nextra-theme-docs theme switcher (headlessui
        // Listbox) has no accessible name; we label it at runtime in
        // MotionEffects but React hydration timing makes the axe check racy.
        .exclude('button[id^="headlessui-listbox-button"]')
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );
      const summary = blocking
        .map((v) => `${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} nodes: ${v.nodes[0]?.target})`)
        .join('\n');
      expect(blocking, `axe violations on ${path}:\n${summary}`).toHaveLength(0);
    });
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
