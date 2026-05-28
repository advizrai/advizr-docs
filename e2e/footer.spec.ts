import { test, expect } from 'playwright/test';

test.describe('Footer', () => {

  test('footer renders with all column sections', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const titles = ['Platform', 'Services', 'Academy', 'Company'];
    for (const title of titles) {
      await expect(footer.locator('span', { hasText: title }).first()).toBeVisible();
    }
  });

  test('footer has brand name and tagline', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    const brand = footer.locator('span', { hasText: 'Advizr' }).first();
    await expect(brand).toBeVisible();
    const tagline = footer.locator('p');
    await expect(tagline.first()).toBeVisible();
  });

  test('footer gradient top border exists', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    const beforeBg = await footer.evaluate((el) => {
      const style = getComputedStyle(el, '::before');
      return style.backgroundImage || style.background;
    });
    expect(beforeBg).toContain('gradient');
  });

  test('footer links navigate correctly', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    const overviewLink = footer.locator('a', { hasText: 'Overview' }).first();
    if (await overviewLink.isVisible()) {
      const href = await overviewLink.getAttribute('href');
      expect(href).toContain('/docs/platform');
    }
  });

  test('external links open in new tab', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    const externalLink = footer.locator('a[target="_blank"]').first();
    if (await externalLink.isVisible()) {
      const rel = await externalLink.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('copyright year is current', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    const year = new Date().getFullYear().toString();
    await expect(footer.locator('span', { hasText: year })).toBeVisible();
  });

  test('legal links (Terms, Privacy) are present', async ({ page }) => {
    await page.goto('/docs');
    const footer = page.locator('footer');
    await expect(footer.locator('a', { hasText: 'Terms' })).toBeVisible();
    await expect(footer.locator('a', { hasText: 'Privacy' })).toBeVisible();
  });

  test('footer is responsive on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const brand = footer.locator('span', { hasText: 'Advizr' }).first();
    await expect(brand).toBeVisible();
  });

  test('footer background differs from main content', async ({ page }) => {
    await page.goto('/docs');
    const footerBg = await page.locator('footer').evaluate((el) =>
      getComputedStyle(el).backgroundColor
    );
    const bodyBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );
    expect(footerBg).not.toBe(bodyBg);
  });

});
