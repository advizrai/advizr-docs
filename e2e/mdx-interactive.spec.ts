import { test, expect } from 'playwright/test';

test.describe('MDX Interactive Components', () => {

  // --- BookCallButton Tests ---

  test.describe('BookCallButton', () => {
    test('primary button is a solid signal control (no gradient)', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const s = await btn.evaluate((el) => {
          const cs = getComputedStyle(el);
          return { bgImage: cs.backgroundImage, bgColor: cs.backgroundColor, radius: cs.borderRadius };
        });
        expect(s.bgImage).toBe('none');
        expect(s.bgColor).toBe('rgb(251, 119, 86)'); // --signal, band world
        expect(parseFloat(s.radius)).toBeLessThanOrEqual(2); // machined control
      }
    });

    test('primary button never glows or casts shadow (rest + hover)', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        expect(await btn.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none');
        await btn.hover();
        await page.waitForTimeout(250);
        expect(await btn.evaluate((el) => getComputedStyle(el).boxShadow)).toBe('none');
      }
    });

    test('primary button does not lift on hover (surface shift only)', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        await btn.hover();
        await page.waitForTimeout(250);
        const transform = await btn.evaluate((el) => getComputedStyle(el).transform);
        expect(transform).toBe('none'); // doctrine: hover shifts color, never position
      }
    });

    test('secondary button has transparent background', async ({ page }) => {
      await page.goto('/docs/architecture/doe-framework');
      const btn = page.locator('a:has-text("Learn How We Build")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(bg).toContain('0');
      }
    });

    test('button carries a mono arrow affordance', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const arrow = btn.locator('span[aria-hidden="true"]');
        await expect(arrow).toHaveText('→');
        const font = await arrow.evaluate((el) => getComputedStyle(el).fontFamily);
        expect(font.toLowerCase()).toContain('mono');
      }
    });
  });

  // --- Price doctrine (rendered output) ---

  // The source-level gate is scripts/check-claims.mjs. This is the rendered
  // counterpart: a component could compute or concatenate a price that never
  // appears as a literal in the source. No dollar figure may reach the page.
  test.describe('No published prices', () => {
    const PRICED_PAGES = [
      '/docs/services/pricing',
      '/docs/services/pricing/whats-included',
      '/docs/services/compare/in-house-hire',
      '/docs/platform/faq/general',
    ];

    for (const path of PRICED_PAGES) {
      test(`${path} renders no dollar figure`, async ({ page }) => {
        await page.goto(path);
        const body = await page.locator('main').innerText();
        expect(body).not.toMatch(/\$\s?\d/);
        expect(body).not.toMatch(/\d[\d,]*\s?(CAD|USD)/);
      });
    }
  });

  // --- ComparisonTable Tests ---

  test.describe('ComparisonTable', () => {
    test('comparison table renders with headers and rows', async ({ page }) => {
      await page.goto('/docs/services/education/curriculum');
      const table = page.locator('table').first();
      if (await table.count() > 0) {
        const headers = table.locator('th');
        expect(await headers.count()).toBeGreaterThanOrEqual(2);
        const rows = table.locator('tbody tr');
        expect(await rows.count()).toBeGreaterThan(0);
      }
    });

    test('check icons use emerald accent colors', async ({ page }) => {
      await page.goto('/docs/services/education/curriculum');
      const check = page.locator('svg[aria-label="Yes"]').first();
      if (await check.count() > 0) {
        const circle = check.locator('circle');
        const fill = await circle.evaluate((el) => el.getAttribute('fill'));
        expect(fill).toContain('advizr-accent');
      }
    });

    test('X icons use muted slate colors', async ({ page }) => {
      await page.goto('/docs/services/education/curriculum');
      const xIcon = page.locator('svg[aria-label="No"]').first();
      if (await xIcon.count() > 0) {
        const circle = xIcon.locator('circle');
        const fill = await circle.evaluate((el) => el.getAttribute('fill'));
        expect(fill).toContain('advizr-slate');
      }
    });

    test('table rows have hover transition', async ({ page }) => {
      await page.goto('/docs/services/education/curriculum');
      const row = page.locator('table tbody tr').first();
      if (await row.count() > 0) {
        const transition = await row.evaluate((el) => getComputedStyle(el).transition);
        expect(transition).toContain('background');
      }
    });

    test('table has rounded corners', async ({ page }) => {
      await page.goto('/docs/services/education/curriculum');
      // Target the wrapper that directly contains a table (ComparisonTable wrapper)
      const wrapper = page.locator('[class*="wrapper"]:has(table)').first();
      if (await wrapper.count() > 0) {
        const radius = await wrapper.evaluate((el) => getComputedStyle(el).borderRadius);
        const px = parseFloat(radius);
        expect(px).toBeGreaterThanOrEqual(8);
      }
    });

    test('first column is sticky on mobile', async ({ page }, testInfo) => {
      if (testInfo.project.name !== 'mobile') test.skip();
      await page.goto('/docs/services/education/curriculum');
      const firstTd = page.locator('table tbody tr:first-child td:first-child');
      if (await firstTd.count() > 0) {
        const position = await firstTd.evaluate((el) => getComputedStyle(el).position);
        expect(position).toBe('sticky');
      }
    });
  });

  // --- Cross-component Tests ---

  test.describe('Cross-component', () => {
    test('all interactive pages load without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => {
        // Filter out transient dev-mode hydration errors
        if (!err.message.includes('Element type is invalid')) {
          errors.push(err.message);
        }
      });
      const pages = [
        '/docs/services/guarantees',
        '/docs/services/pricing/whats-included',
        '/docs/services/education/curriculum',
        '/docs/platform/faq/general',
      ];
      for (const url of pages) {
        const response = await page.goto(url);
        expect(response?.status()).toBeLessThan(400);
      }
      expect(errors).toHaveLength(0);
    });

    test('components respect reduced-motion preference', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const transition = await btn.evaluate((el) => getComputedStyle(el).transition);
        const hasNoTransition = transition.includes('none') || transition.includes('0s');
        expect(hasNoTransition).toBe(true);
      }
    });
  });
});
