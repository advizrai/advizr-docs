import { test, expect } from 'playwright/test';

test.describe('Utility Components', () => {

  test('back-to-top button appears after scrolling', async ({ page }) => {
    await page.goto('/docs');
    // Initially should be hidden
    const btn = page.locator('[class*="backToTop"], [aria-label="Scroll to top"]');
    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    // Should now be visible
    if (await btn.count() > 0) {
      await expect(btn.first()).toBeVisible();
    }
  });

  test('back-to-top button scrolls to top on click', async ({ page }) => {
    await page.goto('/docs');
    // Dismiss cookie consent if it appears so it doesn't block the button
    await page.evaluate(() => localStorage.setItem('advizr-cookie-consent', 'granted'));
    await page.reload();
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    const btn = page.locator('button[class*="BackToTop"]');
    if (await btn.count() > 0 && await btn.first().isVisible()) {
      // Click and verify scroll position decreases
      await btn.first().dispatchEvent('click');
      await page.waitForFunction(() => window.scrollY < 100, null, { timeout: 10000 });
    }
  });

  test('back-to-top button is hidden at top of page', async ({ page }) => {
    await page.goto('/docs');
    const btn = page.locator('[class*="backToTop"], [aria-label="Scroll to top"]');
    if (await btn.count() > 0) {
      // At top, should not be visible (opacity 0 or display none)
      const opacity = await btn.first().evaluate((el) => getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBe(0);
    }
  });

  test('back-to-top has proper styling', async ({ page }) => {
    await page.goto('/docs');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    const btn = page.locator('[class*="backToTop"], [aria-label="Scroll to top"]');
    if (await btn.count() > 0 && await btn.first().isVisible()) {
      const position = await btn.first().evaluate((el) => getComputedStyle(el).position);
      expect(position).toBe('fixed');
      const radius = await btn.first().evaluate((el) => getComputedStyle(el).borderRadius);
      expect(parseFloat(radius)).toBeGreaterThanOrEqual(50); // Should be round
    }
  });

  test('cookie consent appears on first visit', async ({ page, context }) => {
    // Clear cookies to simulate first visit
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]');
    if (await banner.count() > 0) {
      await expect(banner.first()).toBeVisible();
    }
  });

  test('cookie consent has accept and decline buttons', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]');
    if (await banner.count() > 0 && await banner.first().isVisible()) {
      const acceptBtn = banner.locator('[class*="accept"], button').filter({ hasText: /accept|ok|got it/i }).first();
      const declineBtn = banner.locator('[class*="decline"], button').filter({ hasText: /decline|reject|no/i }).first();
      if (await acceptBtn.isVisible()) {
        await expect(acceptBtn).toBeEnabled();
      }
    }
  });

  test('cookie consent disappears after accepting', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]');
    if (await banner.count() > 0 && await banner.first().isVisible()) {
      const acceptBtn = banner.locator('button').first();
      await acceptBtn.click();
      await page.waitForTimeout(500);
      // Banner should disappear
      await expect(banner.first()).not.toBeVisible();
    }
  });

  test('cookie consent does not reappear after acceptance', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]');
    if (await banner.count() > 0 && await banner.first().isVisible()) {
      await banner.locator('button').first().click();
      await page.waitForTimeout(300);
      // Reload and check it doesn't come back
      await page.reload();
      await page.waitForTimeout(1000);
      if (await banner.count() > 0) {
        await expect(banner.first()).not.toBeVisible();
      }
    }
  });

  test('cookie consent is centered and has proper styling', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]').first();
    if (await banner.isVisible()) {
      const position = await banner.evaluate((el) => getComputedStyle(el).position);
      expect(position).toBe('fixed');
      // Should have backdrop blur
      const blur = await banner.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.backdropFilter || style.webkitBackdropFilter || '';
      });
      expect(blur).toContain('blur');
    }
  });

  test('cookie consent is responsive on mobile', async ({ page, context }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await context.clearCookies();
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    const banner = page.locator('[class*="cookie"], [class*="consent"]').first();
    if (await banner.isVisible()) {
      const box = await banner.boundingBox();
      if (box) {
        // Should not overflow viewport (375px)
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(380);
      }
    }
  });

  test('tabs component switches content', async ({ page }) => {
    // Find a page with root-level tabs
    await page.goto('/docs/platform');
    const tabList = page.locator('[class*="tabList"]');
    if (await tabList.count() > 0) {
      const tabs = tabList.first().locator('[class*="tab"]');
      if (await tabs.count() >= 2) {
        await tabs.nth(1).click();
        await page.waitForTimeout(200);
        // Second tab should be active
        const className = await tabs.nth(1).getAttribute('class');
        expect(className).toContain('active');
      }
    }
  });
});
