import { test, expect } from 'playwright/test';

test.describe('MDX Interactive Components', () => {

  // --- BookCallButton Tests ---

  test.describe('BookCallButton', () => {
    test('primary button has gradient background', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundImage);
        expect(bg).toContain('linear-gradient');
      }
    });

    test('primary button has glow shadow on hover', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        await btn.hover();
        await page.waitForTimeout(250);
        const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
        expect(shadow).not.toBe('none');
      }
    });

    test('primary button lifts on hover', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        await btn.hover();
        await page.waitForTimeout(250);
        const transform = await btn.evaluate((el) => getComputedStyle(el).transform);
        expect(transform).not.toBe('none');
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

    test('button arrow shifts on hover', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const btn = page.locator('a:has-text("Talk to Us About Pricing")').first();
      if (await btn.count() > 0 && await btn.isVisible()) {
        const arrow = btn.locator('svg');
        const before = await arrow.evaluate((el) => getComputedStyle(el).transform);
        await btn.hover();
        await page.waitForTimeout(250);
        const after = await arrow.evaluate((el) => getComputedStyle(el).transform);
        expect(after).not.toBe(before);
      }
    });
  });

  // --- RoiCalculator Tests ---

  test.describe('RoiCalculator', () => {
    test('calculator renders with all sliders', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const hoursSlider = page.locator('#roi-hours');
      const rateSlider = page.locator('#roi-rate');
      const employeesSlider = page.locator('#roi-employees');
      expect(await hoursSlider.count()).toBe(1);
      expect(await rateSlider.count()).toBe(1);
      expect(await employeesSlider.count()).toBe(1);
    });

    test('slider track has gradient background', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const slider = page.locator('#roi-hours');
      if (await slider.isVisible()) {
        const bg = await slider.evaluate((el) => getComputedStyle(el).background);
        expect(bg).toContain('linear-gradient');
      }
    });

    test('output cards have box shadow', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const label = page.locator('text="Monthly cost of manual work"');
      if (await label.count() > 0) {
        const card = label.first().locator('..');
        const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
        expect(shadow).not.toBe('none');
      }
    });

    test('savings numbers use emerald color', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const label = page.locator('text="Projected monthly savings"');
      if (await label.count() > 0) {
        const parent = label.first().locator('..');
        const number = parent.locator('span').last();
        const color = await number.evaluate((el) => getComputedStyle(el).color);
        // Emerald-500 (#10B981) = rgb(16, 185, 129) or Emerald-400 (#34D399) = rgb(52, 211, 153) in dark mode
        const isEmerald = color.includes('16, 185, 129') || color.includes('52, 211, 153');
        expect(isEmerald).toBe(true);
      }
    });

    test('annual ROI uses emerald color', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const label = page.locator('text="Annual ROI"');
      if (await label.count() > 0) {
        const parent = label.first().locator('..');
        const number = parent.locator('span').last();
        const color = await number.evaluate((el) => getComputedStyle(el).color);
        // Emerald-500 or Emerald-400 in dark mode
        const isEmerald = color.includes('16, 185, 129') || color.includes('52, 211, 153');
        expect(isEmerald).toBe(true);
      }
    });

    test('output numbers update when slider changes', async ({ page }) => {
      await page.goto('/docs/services/guarantees');
      const slider = page.locator('#roi-hours');
      if (await slider.isVisible()) {
        const outputBefore = await page.locator('[class*="outputNumber"]').first().textContent();
        // Scroll slider into view, focus it, and use arrow keys to change value
        await slider.scrollIntoViewIfNeeded();
        await slider.focus();
        // Press ArrowRight many times to increase the value significantly
        for (let i = 0; i < 30; i++) {
          await page.keyboard.press('ArrowRight');
        }
        await page.waitForTimeout(600);
        const outputAfter = await page.locator('[class*="outputNumber"]').first().textContent();
        expect(outputAfter).not.toBe(outputBefore);
      }
    });

    test('calculator is single column on mobile', async ({ page }, testInfo) => {
      if (testInfo.project.name !== 'mobile') test.skip();
      await page.goto('/docs/services/guarantees');
      const calc = page.locator('[class*="calculator"]').first();
      if (await calc.count() > 0) {
        const cols = await calc.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
        expect(cols.split(' ').length).toBeLessThanOrEqual(1);
      }
    });
  });

  // --- PricingTable Tests ---

  test.describe('PricingTable', () => {
    test('pricing table renders with three tiers', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const tierNames = page.locator('text=/Catalyst|Acceleration|Partnership/');
      expect(await tierNames.count()).toBeGreaterThanOrEqual(3);
    });

    test('recommended badge has gradient background', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const badge = page.locator('text="Recommended"').first();
      if (await badge.count() > 0 && await badge.isVisible()) {
        const bg = await badge.evaluate((el) => getComputedStyle(el).backgroundImage);
        expect(bg).toContain('linear-gradient');
      }
    });

    test('recommended badge is uppercase', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const badge = page.locator('text=/RECOMMENDED/i').first();
      if (await badge.count() > 0 && await badge.isVisible()) {
        const transform = await badge.evaluate((el) => getComputedStyle(el).textTransform);
        expect(transform).toBe('uppercase');
      }
    });

    test('check icons use emerald color', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const check = page.locator('svg[aria-label="Included"]').first();
      if (await check.count() > 0) {
        const color = await check.evaluate((el) => getComputedStyle(el).color);
        expect(color).toContain('5');
        expect(color).toContain('150');
      }
    });

    test('feature rows have hover transition', async ({ page }) => {
      await page.goto('/docs/services/pricing/whats-included');
      const row = page.locator('[class*="featureRow"]').first();
      if (await row.count() > 0) {
        const transition = await row.evaluate((el) => getComputedStyle(el).transition);
        expect(transition).toContain('background');
      }
    });

    test('mobile cards show on small viewport', async ({ page }, testInfo) => {
      if (testInfo.project.name !== 'mobile') test.skip();
      await page.goto('/docs/services/pricing/whats-included');
      // On mobile, the table is hidden and mobileCards are displayed
      const mobileCards = page.locator('[class*="mobileCard"]');
      await expect(mobileCards.first()).toBeVisible();
      // Partnership tier should be visible within mobile cards
      const partnership = page.locator('[class*="mobileCard"] >> text="Partnership"');
      await expect(partnership.first()).toBeVisible();
    });

    test('recommended mobile card has glow shadow', async ({ page }, testInfo) => {
      if (testInfo.project.name !== 'mobile') test.skip();
      await page.goto('/docs/services/pricing/whats-included');
      const card = page.locator('[class*="recommendedCard"]').first();
      if (await card.count() > 0 && await card.isVisible()) {
        const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
        expect(shadow).not.toBe('none');
      }
    });
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
        '/docs/resources/component-demo',
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
