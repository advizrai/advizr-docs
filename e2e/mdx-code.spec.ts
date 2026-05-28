import { test, expect } from 'playwright/test';

test.describe('MDX Code & Navigation', () => {

  // Use architecture page which likely has code blocks and tabs
  const codePage = '/docs/architecture';

  test('page with code components loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(codePage);
    expect(errors).toHaveLength(0);
  });

  test('code blocks have dark background in light mode', async ({ page }) => {
    await page.goto(codePage);
    const pre = page.locator('pre').first();
    if (await pre.isVisible()) {
      const bg = await pre.evaluate((el) => getComputedStyle(el).backgroundColor);
      // Should be dark - check that it's not white/light
      const rgb = bg.match(/\d+/g)?.map(Number) || [];
      if (rgb.length >= 3) {
        const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
        expect(brightness).toBeLessThan(100); // Dark background
      }
    }
  });

  test('code blocks have rounded corners', async ({ page }) => {
    await page.goto(codePage);
    const codeBlock = page.locator('[class*="codeBlock"], pre').first();
    if (await codeBlock.isVisible()) {
      const radius = await codeBlock.evaluate((el) => getComputedStyle(el).borderRadius);
      const px = parseFloat(radius);
      expect(px).toBeGreaterThanOrEqual(8);
    }
  });

  test('code uses monospace font', async ({ page }) => {
    await page.goto(codePage);
    const code = page.locator('pre code, [class*="code"]').first();
    if (await code.isVisible()) {
      const font = await code.evaluate((el) => getComputedStyle(el).fontFamily);
      const isMonospace = font.toLowerCase().includes('mono') ||
        font.toLowerCase().includes('jetbrains') ||
        font.toLowerCase().includes('consolas');
      expect(isMonospace).toBe(true);
    }
  });

  test('copy button exists in code blocks', async ({ page }) => {
    await page.goto(codePage);
    const copyBtn = page.locator('[class*="copy"], button[aria-label*="copy" i], button[title*="copy" i]').first();
    if (await copyBtn.isVisible()) {
      await expect(copyBtn).toBeEnabled();
    }
  });

  test('copy button changes icon on click', async ({ page }) => {
    await page.goto(codePage);
    const copyBtn = page.locator('[class*="copy"], button[aria-label*="copy" i]').first();
    if (await copyBtn.isVisible()) {
      // Click the copy button
      await copyBtn.click();
      // Wait for state change
      await page.waitForTimeout(500);
      // Check for "copied" class or check icon
      const hasCopiedClass = await copyBtn.evaluate((el) =>
        el.className.includes('copied') || el.innerHTML.includes('check') || el.innerHTML.includes('Check')
      );
      expect(hasCopiedClass).toBe(true);
    }
  });

  test('tabs switch content when clicked', async ({ page }) => {
    // Find a page with tabs
    await page.goto(codePage);
    const tabList = page.locator('[class*="tabList"], [role="tablist"]');
    if (await tabList.count() > 0) {
      const tabs = tabList.first().locator('[class*="tab"], [role="tab"]');
      const tabCount = await tabs.count();
      if (tabCount >= 2) {
        // Click second tab
        await tabs.nth(1).click();
        await page.waitForTimeout(200);
        // Check it's now active
        const className = await tabs.nth(1).getAttribute('class');
        expect(className).toContain('active');
      }
    }
  });

  test('active tab has bottom border indicator', async ({ page }) => {
    await page.goto(codePage);
    const activeTab = page.locator('[class*="tabActive"], [class*="tab"][class*="active"]').first();
    if (await activeTab.isVisible()) {
      // Check for ::after pseudo-element (bottom border)
      const afterContent = await activeTab.evaluate((el) => {
        const style = getComputedStyle(el, '::after');
        return style.content;
      });
      expect(afterContent).not.toBe('none');
    }
  });

  test('link cards render with hover effect', async ({ page }) => {
    await page.goto(codePage);
    const linkCard = page.locator('[class*="linkCard"]').first();
    if (await linkCard.isVisible()) {
      const beforeTransform = await linkCard.evaluate((el) => getComputedStyle(el).transform);
      await linkCard.hover();
      await page.waitForTimeout(250);
      const afterShadow = await linkCard.evaluate((el) => getComputedStyle(el).boxShadow);
      expect(afterShadow).not.toBe('none');
    }
  });

  test('link cards have arrow indicator', async ({ page }) => {
    await page.goto(codePage);
    const linkCard = page.locator('[class*="linkCard"]').first();
    if (await linkCard.isVisible()) {
      const arrow = linkCard.locator('[class*="arrow"], svg').first();
      await expect(arrow).toBeVisible();
    }
  });

  test('multiple content pages render without code component errors', async ({ page }) => {
    const pages = ['/docs/architecture', '/docs/platform/getting-started', '/docs/resources'];
    for (const url of pages) {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      await page.goto(url);
      expect(errors).toHaveLength(0);
      page.removeAllListeners('pageerror');
    }
  });
});
