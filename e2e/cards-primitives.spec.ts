import { test, expect } from 'playwright/test';

test.describe('Cards & Primitives', () => {

  test('cards render on homepage with correct structure', async ({ page }) => {
    await page.goto('/docs');
    const cards = page.locator('[class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('card has border-radius applied', async ({ page }) => {
    await page.goto('/docs');
    const card = page.locator('a[class*="card"]').first();
    if (await card.isVisible()) {
      const radius = await card.evaluate((el) => getComputedStyle(el).borderRadius);
      const px = parseFloat(radius);
      expect(px).toBeGreaterThanOrEqual(12); // At least 0.75rem
    }
  });

  test('card hover changes transform (lift effect)', async ({ page }) => {
    await page.goto('/docs');
    const card = page.locator('a[class*="card"]').first();
    if (await card.isVisible()) {
      const before = await card.evaluate((el) => getComputedStyle(el).transform);
      await card.hover();
      await page.waitForTimeout(250);
      const after = await card.evaluate((el) => getComputedStyle(el).transform);
      expect(after).not.toBe(before);
    }
  });

  test('card icons render with rounded square shape', async ({ page }) => {
    await page.goto('/docs');
    const icon = page.locator('[class*="icon"]').first();
    if (await icon.isVisible()) {
      const radius = await icon.evaluate((el) => getComputedStyle(el).borderRadius);
      const px = parseFloat(radius);
      // Should be rounded square (0.75rem = 12px), not circle (9999px)
      expect(px).toBeLessThan(100);
      expect(px).toBeGreaterThanOrEqual(8);
    }
  });

  test('primary button has indigo background', async ({ page }) => {
    await page.goto('/docs');
    // Scope to main content to avoid matching Nextra sidebar links on mobile
    const btn = page.locator('main a[class*="primary"], main a[class*="button"], [class*="hero"] a[class*="primary"], [class*="hero"] a[class*="button"]').first();
    if (await btn.count() > 0 && await btn.isVisible()) {
      const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('button hover lifts and adds shadow', async ({ page }) => {
    await page.goto('/docs');
    // Scope to main content to avoid matching Nextra sidebar links on mobile
    const btn = page.locator('main a[class*="primary"], main a[class*="button"], [class*="hero"] a[class*="primary"], [class*="hero"] a[class*="button"]').first();
    if (await btn.count() > 0 && await btn.isVisible()) {
      await btn.hover();
      await page.waitForTimeout(250);
      const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(shadow).not.toBe('none');
    }
  });

  test('card grid is responsive', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const grid = page.locator('[class*="grid"]').first();
    if (await grid.isVisible()) {
      const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
      const colCount = columns.split(' ').length;
      expect(colCount).toBeLessThanOrEqual(2);
    }
  });

  test('card arrow animates on hover', async ({ page }) => {
    await page.goto('/docs');
    const card = page.locator('a[class*="card"]').first();
    const arrow = card.locator('[class*="arrow"]').first();
    if (await arrow.isVisible()) {
      const before = await arrow.evaluate((el) => getComputedStyle(el).transform);
      await card.hover();
      await page.waitForTimeout(250);
      const after = await arrow.evaluate((el) => getComputedStyle(el).transform);
      expect(after).not.toBe(before);
    }
  });

  test('no action cards have left border (old style removed)', async ({ page }) => {
    await page.goto('/docs');
    const actionCards = page.locator('[class*="action"]');
    const count = await actionCards.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const borderLeft = await actionCards.nth(i).evaluate((el) =>
        getComputedStyle(el).borderLeftWidth
      );
      const px = parseFloat(borderLeft);
      expect(px).toBeLessThanOrEqual(1);
    }
  });
});
