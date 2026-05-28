import { test, expect } from 'playwright/test';

test.describe('Navbar Premium Redesign', () => {

  test('all five section links render', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const nav = page.locator('nav[aria-label="Main sections"]');
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    await expect(links).toHaveCount(5);
    const labels = await links.allTextContents();
    expect(labels).toEqual(['Platform', 'Services', 'Architecture', 'Academy', 'Resources']);
  });

  test('CTA is visible with correct href and target', async ({ page }) => {
    await page.goto('/docs');
    // Scope to the header/banner to avoid matching other "Book a Call" links in page content
    const cta = page.locator('header a[href="https://advizr.ca/book"]');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveText('Book a Call');
  });

  test('active link has aria-current and background color', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs/platform');
    const activeLink = page.locator('nav[aria-label="Main sections"] a[aria-current="page"]');
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toHaveText('Platform');
    const bg = await activeLink.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Should have a non-transparent background (blue-50 pill)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('CTA has emerald background', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://advizr.ca/book"]');
    const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    // accent-500 = #10B981 = rgb(16, 185, 129)
    expect(bg).toBe('rgb(16, 185, 129)');
  });

  test('section links have transition properties', async ({ page }) => {
    await page.goto('/docs');
    const link = page.locator('nav[aria-label="Main sections"] a').first();
    const transition = await link.evaluate((el) => getComputedStyle(el).transition);
    expect(transition).toContain('color');
    expect(transition).toContain('background-color');
  });

  test('CTA has transform and box-shadow transitions', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://advizr.ca/book"]');
    const transition = await cta.evaluate((el) => getComputedStyle(el).transition);
    expect(transition).toContain('transform');
    expect(transition).toContain('box-shadow');
  });

  test('CTA has pill shape (large border-radius)', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://advizr.ca/book"]');
    const radius = await cta.evaluate((el) => getComputedStyle(el).borderRadius);
    // radius-full = 9999px
    expect(radius).toBe('9999px');
  });

  test('section links hidden on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const nav = page.locator('nav[aria-label="Main sections"]');
    await expect(nav).toBeHidden();
  });

  test('CTA remains visible on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://advizr.ca/book"]');
    await expect(cta).toBeVisible();
  });

  test('clicking a section link navigates correctly', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const link = page.locator('nav[aria-label="Main sections"] a', { hasText: 'Services' });
    await link.click();
    await page.waitForURL('**/docs/services**');
    expect(page.url()).toContain('/docs/services');
  });

});
