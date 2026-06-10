import { test, expect } from 'playwright/test';

test.describe('Navbar Premium Redesign', () => {

  test('all five section links render', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const nav = page.locator('nav[aria-label="Main sections"]');
    await expect(nav).toBeVisible();
    // Each section has front + back face links (3D flip), so count visible front-face links
    const links = nav.locator('a:not([tabindex="-1"])');
    await expect(links).toHaveCount(5);
    const labels = await links.allTextContents();
    expect(labels).toEqual(['Platform', 'Services', 'Academy', 'Architecture', 'Resources']);
  });

  test('CTA is visible with correct href and target', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://cal.com/team/advizr/ai-strategy-call"]');
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
  });

  test('CTA has gradient background', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://cal.com/team/advizr/ai-strategy-call"]');
    const bgImage = await cta.evaluate((el) => getComputedStyle(el).backgroundImage);
    // Uses brand blue gradient
    expect(bgImage).toContain('linear-gradient');
  });

  test('section links have color transition', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const link = page.locator('nav[aria-label="Main sections"] a:not([tabindex="-1"])').first();
    const transition = await link.evaluate((el) => getComputedStyle(el).transition);
    expect(transition).toContain('color');
  });

  test('CTA has transform and box-shadow transitions', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://cal.com/team/advizr/ai-strategy-call"]');
    const transition = await cta.evaluate((el) => getComputedStyle(el).transition);
    expect(transition).toContain('transform');
    expect(transition).toContain('box-shadow');
  });

  test('CTA has pill shape (large border-radius)', async ({ page }) => {
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://cal.com/team/advizr/ai-strategy-call"]');
    const radius = await cta.evaluate((el) => getComputedStyle(el).borderRadius);
    // radius-full = 9999px
    expect(radius).toBe('9999px');
  });

  test('glow nav hidden on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const nav = page.locator('nav[aria-label="Main sections"]');
    await expect(nav).toBeHidden();
  });

  test('CTA remains visible on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const cta = page.locator('header a[href="https://cal.com/team/advizr/ai-strategy-call"]');
    await expect(cta).toBeVisible();
  });

  test('clicking a section link navigates correctly', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const link = page.locator('nav[aria-label="Main sections"] a:not([tabindex="-1"])', { hasText: 'Services' });
    await link.click();
    await page.waitForURL('**/docs/services**');
    expect(page.url()).toContain('/docs/services');
  });

});
