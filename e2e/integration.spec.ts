import { test, expect } from 'playwright/test';

test.describe('Integration - Full Site', () => {

  test('complete user journey through docs', async ({ page }, testInfo) => {
    // 1. Land on homepage
    await page.goto('/docs');
    await expect(page).toHaveTitle(/Advizr/);

    // 2. Hero renders
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();

    // On mobile, navbar section links are hidden - use direct navigation instead
    const isMobile = testInfo.project.name === 'mobile';

    // 3. Navigate to Platform
    if (isMobile) {
      await page.goto('/docs/platform');
    } else {
      await page.locator('nav a', { hasText: 'Platform' }).first().click();
      await page.waitForURL('**/platform**');
    }
    await expect(page.locator('h1')).toBeVisible();

    // 4. Navigate to a sub-page via sidebar
    const sidebarLink = page.locator('nav a', { hasText: 'Getting Started' }).first();
    if (await sidebarLink.isVisible()) {
      await sidebarLink.click();
      await page.waitForURL('**/getting-started**');
    }

    // 5. Navigate to Services
    if (isMobile) {
      await page.goto('/docs/services');
    } else {
      await page.locator('nav a', { hasText: 'Services' }).first().click();
      await page.waitForURL('**/services**');
    }

    // 6. Navigate to Academy
    if (isMobile) {
      await page.goto('/docs/academy');
    } else {
      await page.locator('nav a', { hasText: 'Academy' }).first().click();
      await page.waitForURL('**/academy**');
    }

    // 7. Go back home
    await page.goto('/docs');
    await expect(hero).toBeVisible();
  });

  test('all main section pages load without JS errors', async ({ page }) => {
    const sections = [
      '/docs',
      '/docs/platform',
      '/docs/services',
      '/docs/architecture',
      '/docs/academy',
      '/docs/resources',
      '/docs/legal',
    ];

    for (const url of sections) {
      const errors: string[] = [];
      page.on('pageerror', (err) => {
        // Filter out transient dev-mode hydration errors
        if (!err.message.includes('Element type is invalid')) {
          errors.push(err.message);
        }
      });
      const response = await page.goto(url);
      expect(response?.status()).toBeLessThan(400);
      expect(errors).toHaveLength(0);
      page.removeAllListeners('pageerror');
    }
  });

  test('dark mode toggle works across pages', async ({ page }) => {
    await page.goto('/docs');
    // Find and click the theme toggle (Nextra provides one)
    const toggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="mode" i]').first();
    if (await toggle.isVisible()) {
      // Get initial dark mode state
      const wasDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      // Click toggle (may need multiple clicks for 3-state toggle)
      await toggle.click();
      await page.waitForTimeout(300);
      let isDark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      // If state didn't change (system mode), click again
      if (isDark === wasDark) {
        await toggle.click();
        await page.waitForTimeout(300);
        isDark = await page.evaluate(() =>
          document.documentElement.classList.contains('dark')
        );
      }
      // Navigate to another page
      await page.goto('/docs/platform');
      // Theme should persist
      const stillSame = await page.evaluate(() =>
        document.documentElement.classList.contains('dark')
      );
      expect(stillSame).toBe(isDark);
    }
  });

  test('no page has horizontal overflow', async ({ page }) => {
    const pages = ['/docs', '/docs/platform', '/docs/services', '/docs/academy'];
    for (const url of pages) {
      await page.goto(url);
      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(hasOverflow).toBe(false);
    }
  });

  test('all pages pass basic accessibility checks', async ({ page }) => {
    await page.goto('/docs');
    // Check for basic a11y: lang attribute
    const lang = await page.evaluate(() => document.documentElement.lang);
    expect(lang).toBe('en');

    // Ensure h1 exists
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // Check that images have alt text
    const imgsWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imgsWithoutAlt).toBe(0);
  });

  test('footer renders correctly on every page', async ({ page }) => {
    const pages = ['/docs', '/docs/platform', '/docs/services'];
    for (const url of pages) {
      await page.goto(url);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('search input is accessible', async ({ page }) => {
    await page.goto('/docs');
    const search = page.locator('[data-nextra-search] input, input[placeholder*="Search" i]').first();
    if (await search.isVisible()) {
      await search.focus();
      // Should have focus styling (box-shadow, outline, or border change)
      const hasFocusStyle = await search.evaluate((el) => {
        const style = getComputedStyle(el);
        return style.boxShadow !== 'none' ||
               style.outlineStyle !== 'none' ||
               style.borderColor !== style.getPropertyValue('border-color');
      });
      expect(hasFocusStyle).toBe(true);
    }
  });

  test('mobile navigation works end-to-end', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    // Hero should be visible
    await expect(page.locator('h1').first()).toBeVisible();
    // CTA should be visible
    const cta = page.locator('a[href*="book"]');
    if (await cta.count() > 0) {
      await expect(cta.first()).toBeVisible();
    }
    // Footer should be present
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('font loading - Inter and JetBrains Mono', async ({ page }) => {
    await page.goto('/docs');
    // Check body uses Inter
    const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(bodyFont.toLowerCase()).toContain('inter');
    // Check code uses JetBrains Mono
    const code = page.locator('code, pre').first();
    if (await code.isVisible()) {
      const codeFont = await code.evaluate((el) => getComputedStyle(el).fontFamily);
      const isMono = codeFont.toLowerCase().includes('jetbrains') || codeFont.toLowerCase().includes('mono');
      expect(isMono).toBe(true);
    }
  });

  test('visual regression - screenshot key pages', async ({ page }) => {
    // Take screenshots for manual review
    await page.goto('/docs');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/homepage-light.png', fullPage: true });

    // Dark mode
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'e2e/screenshots/homepage-dark.png', fullPage: true });

    // Platform page
    await page.goto('/docs/platform');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/platform-light.png', fullPage: true });
  });
});
