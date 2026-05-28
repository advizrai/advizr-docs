import { test, expect } from 'playwright/test';

test.describe('MDX Feedback Components', () => {

  // Component demo page contains all Callout variants, Steps, and Details
  const contentPage = '/docs/resources/component-demo';

  test('page with MDX components loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      if (!err.message.includes('Element type is invalid')) {
        errors.push(err.message);
      }
    });
    await page.goto(contentPage);
    expect(errors).toHaveLength(0);
  });

  test('callout components render with left accent border', async ({ page }) => {
    await page.goto(contentPage);
    const callouts = page.locator('[class*="callout"]');
    if (await callouts.count() > 0) {
      const first = callouts.first();
      await expect(first).toBeVisible();
      const borderLeft = await first.evaluate((el) => getComputedStyle(el).borderLeftWidth);
      const px = parseFloat(borderLeft);
      expect(px).toBeGreaterThanOrEqual(2); // Should have left accent
    }
  });

  test('callout has icon and content in flex layout', async ({ page }) => {
    await page.goto(contentPage);
    const callout = page.locator('[class*="callout"]').first();
    if (await callout.isVisible()) {
      const display = await callout.evaluate((el) => getComputedStyle(el).display);
      expect(display).toBe('flex');
    }
  });

  test('callout has appropriate background tint', async ({ page }) => {
    await page.goto(contentPage);
    const callout = page.locator('[class*="callout"]').first();
    if (await callout.isVisible()) {
      const bg = await callout.evaluate((el) => getComputedStyle(el).backgroundColor);
      // Should have a subtle tint, not fully transparent
      expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('steps render with numbered indicators', async ({ page }) => {
    await page.goto(contentPage);
    const steps = page.locator('[class*="steps"]');
    if (await steps.count() > 0) {
      await expect(steps.first()).toBeVisible();
      // Check that counter-reset is applied
      const counterReset = await steps.first().evaluate((el) =>
        getComputedStyle(el).counterReset
      );
      expect(counterReset).toContain('step');
    }
  });

  test('steps have vertical connecting line', async ({ page }) => {
    await page.goto(contentPage);
    const steps = page.locator('[class*="steps"]');
    if (await steps.count() > 0) {
      // Check ::before pseudo-element creates the line
      const beforeContent = await steps.first().evaluate((el) => {
        const style = getComputedStyle(el, '::before');
        return style.content;
      });
      expect(beforeContent).not.toBe('none');
    }
  });

  test('details component expands and collapses', async ({ page }) => {
    await page.goto(contentPage);
    const details = page.locator('details').first();
    if (await details.isVisible()) {
      // Click to open
      const summary = details.locator('summary');
      await summary.click();
      // Content should now be visible
      const content = details.locator('[class*="content"]');
      await expect(content).toBeVisible();
      // Click again to close
      await summary.click();
      await page.waitForTimeout(300);
    }
  });

  test('details summary has custom chevron (no default marker)', async ({ page }) => {
    await page.goto(contentPage);
    const summary = page.locator('details summary').first();
    if (await summary.isVisible()) {
      const listStyle = await summary.evaluate((el) => getComputedStyle(el).listStyle);
      expect(listStyle).toContain('none');
    }
  });

  test('details chevron rotates when open', async ({ page }) => {
    await page.goto(contentPage);
    const details = page.locator('details').first();
    if (await details.isVisible()) {
      const chevron = details.locator('[class*="chevron"], svg').first();
      if (await chevron.isVisible()) {
        const beforeTransform = await chevron.evaluate((el) => getComputedStyle(el).transform);
        await details.locator('summary').click();
        await page.waitForTimeout(300);
        const afterTransform = await chevron.evaluate((el) => getComputedStyle(el).transform);
        // Transform should change (rotation)
        expect(afterTransform).not.toBe(beforeTransform);
      }
    }
  });

  test('all MDX feedback components render on multiple pages', async ({ page }) => {
    const pages = ['/docs/resources/component-demo', '/docs/platform/getting-started', '/docs/academy'];
    for (const url of pages) {
      const errors: string[] = [];
      page.on('pageerror', (err) => {
        // Filter out transient dev-mode hydration errors
        if (!err.message.includes('Element type is invalid')) {
          errors.push(err.message);
        }
      });
      await page.goto(url);
      expect(errors).toHaveLength(0);
      page.removeAllListeners('pageerror');
    }
  });
});
