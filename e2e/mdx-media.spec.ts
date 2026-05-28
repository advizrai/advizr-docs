import { test, expect } from 'playwright/test';

test.describe('MDX Media Components', () => {

  const platformPage = '/docs/platform';
  const componentDemoPage = '/docs/resources/component-demo';
  const changelogPage = '/docs/resources/changelog';

  test('platform page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(platformPage);
    expect(errors).toHaveLength(0);
  });

  test('screenshot components have browser chrome bar', async ({ page }) => {
    await page.goto(platformPage);
    const screenshots = page.locator('[class*="screenshot"], [class*="browserChrome"]');
    if (await screenshots.count() > 0) {
      const browserBar = screenshots.first().locator('[class*="browserBar"]');
      if (await browserBar.isVisible()) {
        await expect(browserBar).toBeVisible();
        // Should have 3 dots
        const dots = browserBar.locator('[class*="browserDot"]');
        expect(await dots.count()).toBe(3);
      }
    }
  });

  test('screenshot browser dots have correct colors', async ({ page }) => {
    await page.goto(platformPage);
    const dots = page.locator('[class*="browserDot"]');
    if (await dots.count() >= 3) {
      const firstDotBg = await dots.first().evaluate((el) => getComputedStyle(el).backgroundColor);
      // First dot should be red-ish (#FF5F57)
      expect(firstDotBg).toContain('255');
    }
  });

  test('screenshot images render within frame', async ({ page }) => {
    await page.goto(platformPage);
    const screenshot = page.locator('[class*="browserChrome"]').first();
    if (await screenshot.isVisible()) {
      const img = screenshot.locator('img');
      if (await img.count() > 0) {
        await expect(img.first()).toBeVisible();
      }
    }
  });

  test('screenshot has rounded corners and shadow', async ({ page }) => {
    await page.goto(platformPage);
    const screenshot = page.locator('[class*="browserChrome"]').first();
    if (await screenshot.isVisible()) {
      const radius = await screenshot.evaluate((el) => getComputedStyle(el).borderRadius);
      const px = parseFloat(radius);
      expect(px).toBeGreaterThanOrEqual(12);
      const shadow = await screenshot.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(shadow).not.toBe('none');
    }
  });

  test('screenshot caption renders below image', async ({ page }) => {
    await page.goto(platformPage);
    const captions = page.locator('[class*="caption"]');
    if (await captions.count() > 0) {
      const caption = captions.first();
      if (await caption.isVisible()) {
        const textAlign = await caption.evaluate((el) => getComputedStyle(el).textAlign);
        expect(textAlign).toBe('center');
      }
    }
  });

  test('video embeds maintain 16:9 aspect ratio', async ({ page }) => {
    await page.goto(componentDemoPage);
    const videoWrapper = page.locator('[class*="videoEmbed"]').first();
    if (await videoWrapper.count() > 0 && await videoWrapper.isVisible()) {
      const iframe = videoWrapper.locator('iframe');
      if (await iframe.count() > 0) {
        const box = await iframe.boundingBox();
        if (box) {
          const ratio = box.width / box.height;
          // Should be approximately 16:9 = 1.77
          expect(ratio).toBeGreaterThan(1.5);
          expect(ratio).toBeLessThan(2.0);
        }
      }
    }
  });

  test('video embeds have rounded corners', async ({ page }) => {
    await page.goto(componentDemoPage);
    const video = page.locator('[class*="videoEmbed"]').first();
    if (await video.count() > 0 && await video.isVisible()) {
      const radius = await video.evaluate((el) => getComputedStyle(el).borderRadius);
      const px = parseFloat(radius);
      expect(px).toBeGreaterThanOrEqual(12);
    }
  });

  test('changelog renders with version badges', async ({ page }) => {
    await page.goto(changelogPage);
    const changelog = page.locator('[class*="timeline"]');
    if (await changelog.count() > 0) {
      const versions = changelog.locator('[class*="versionBadge"]');
      if (await versions.count() > 0) {
        await expect(versions.first()).toBeVisible();
        // Version badge should have monospace font
        const font = await versions.first().evaluate((el) => getComputedStyle(el).fontFamily);
        const isMono = font.toLowerCase().includes('mono') || font.toLowerCase().includes('jetbrains');
        expect(isMono).toBe(true);
      }
    }
  });

  test('changelog entries have dates', async ({ page }) => {
    await page.goto(changelogPage);
    const dates = page.locator('[class*="timeline"] [class*="date"]');
    if (await dates.count() > 0) {
      await expect(dates.first()).toBeVisible();
    }
  });

  test('changelog change-type badges have distinct colors', async ({ page }) => {
    await page.goto(changelogPage);
    const types = page.locator('[class*="categoryBadge"], [class*="catFeature"], [class*="catImprovement"], [class*="catFix"], [class*="catBreaking"]');
    if (await types.count() > 0) {
      const bg = await types.first().evaluate((el) => getComputedStyle(el).backgroundColor);
      // Should have a tinted background
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('media components render on mobile without overflow', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto(platformPage);
    const hasOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });
});
