import { test, expect } from 'playwright/test';

test.describe('Homepage & Hero', () => {

  test('homepage loads and displays hero', async ({ page }) => {
    await page.goto('/docs');
    await expect(page).toHaveTitle(/Advizr/);
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Build with Advizr');
  });

  test('hero has gradient background elements', async ({ page }) => {
    await page.goto('/docs');
    const glow = page.locator('[aria-hidden="true"]').first();
    await expect(glow).toBeAttached();
  });

  test('hero title uses gradient text (webkit-background-clip)', async ({ page }) => {
    await page.goto('/docs');
    const title = page.locator('h1').first();
    const bgClip = await title.evaluate((el) => getComputedStyle(el).webkitBackgroundClip);
    expect(bgClip).toBe('text');
  });

  test('hero has two action buttons', async ({ page }) => {
    await page.goto('/docs');
    const getStarted = page.locator('a', { hasText: 'Get Started' });
    const explore = page.locator('a', { hasText: 'Explore Platform' });
    await expect(getStarted).toBeVisible();
    await expect(explore).toBeVisible();
  });

  test('Get Started button navigates to getting-started page', async ({ page }) => {
    await page.goto('/docs');
    const btn = page.locator('a', { hasText: 'Get Started' });
    await btn.click();
    await page.waitForURL('**/getting-started**');
    expect(page.url()).toContain('getting-started');
  });

  test('all content sections render on homepage', async ({ page }) => {
    await page.goto('/docs');
    const sections = ['Start building', 'Your command center', 'Built for scale', 'Learn by doing', 'Ready to get started?'];
    for (const heading of sections) {
      const el = page.locator('h2', { hasText: heading });
      await expect(el).toBeVisible();
    }
  });

  test('card grids render with cards', async ({ page }) => {
    await page.goto('/docs');
    const cards = page.locator('a[class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('hero is responsive on mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
    const fontSize = await title.evaluate((el) => getComputedStyle(el).fontSize);
    const px = parseFloat(fontSize);
    expect(px).toBeLessThanOrEqual(40);
  });

  test('sections have proper vertical spacing', async ({ page }) => {
    await page.goto('/docs');
    const section = page.locator('section').first();
    if (await section.isVisible()) {
      const padding = await section.evaluate((el) => getComputedStyle(el).paddingTop);
      const px = parseFloat(padding);
      expect(px).toBeGreaterThanOrEqual(48);
    }
  });

  test('no horizontal overflow on any viewport', async ({ page }) => {
    await page.goto('/docs');
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });
});
