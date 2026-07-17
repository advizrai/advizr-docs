import { test, expect } from 'playwright/test';

/**
 * Topbar — the 48px Instrument Grade shell header (PR-C/PR-D):
 * logo, section links (desktop), search chip (⌘K), theme toggle, GitHub
 * link; below lg the sections yield to a hamburger + drawer.
 */

const SECTIONS = ['Platform', 'Services', 'Academy', 'Architecture', 'Resources', 'Legal'];

test.describe('Topbar', () => {

  test('topbar renders as the sticky 48px shell header', async ({ page }) => {
    await page.goto('/docs');
    const topbar = page.locator('header[data-slot="docs-topbar"]');
    await expect(topbar).toBeVisible();
    const { position, height } = await topbar.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { position: cs.position, height: cs.height };
    });
    expect(position).toBe('sticky');
    expect(parseFloat(height)).toBe(48);
  });

  test('all six section links render on desktop', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const nav = page.locator('header[data-slot="docs-topbar"] nav[aria-label="Sections"]');
    await expect(nav).toBeVisible();
    const links = nav.locator('a');
    await expect(links).toHaveCount(SECTIONS.length);
    expect(await links.allTextContents()).toEqual(SECTIONS);
  });

  test('active section carries aria-current and the 2px signal underline', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs/platform');
    const active = page.locator('nav[aria-label="Sections"] a[aria-current="true"]');
    await expect(active).toBeVisible();
    await expect(active).toHaveText('Platform');
    // Signal underline: a 2px-high span painted --signal (coral, never blue).
    const underline = active.locator('span[aria-hidden="true"]');
    await expect(underline).toHaveCount(1);
    const { height, bg } = await underline.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { height: cs.height, bg: cs.backgroundColor };
    });
    expect(parseFloat(height)).toBe(2);
    expect(bg).toBe('rgb(251, 119, 86)'); // hsl(12 95% 66%) — band-world signal
  });

  test('clicking a section link navigates correctly', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    await page.locator('nav[aria-label="Sections"] a', { hasText: 'Services' }).click();
    await page.waitForURL('**/docs/services**');
    expect(page.url()).toContain('/docs/services');
  });

  test('logo links home and shows the wordmark', async ({ page }) => {
    await page.goto('/docs/platform');
    const logo = page.locator('header a[aria-label="Advizr Docs home"]');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/docs');
    await expect(logo).toContainText('Advizr');
  });

  test('search chip shows the ⌘K hint and opens the palette', async ({ page }, testInfo) => {
    if (testInfo.project.name === 'mobile') test.skip();
    await page.goto('/docs');
    const chip = page.locator('header button[aria-label="Search the docs"]', { hasText: 'Search' });
    await expect(chip).toBeVisible();
    await expect(chip.locator('kbd')).toHaveText('⌘K');
    await chip.click();
    const dialog = page.locator('dialog[data-docs-search]');
    await expect(dialog).toBeVisible();
    // The 18px input takes focus on open.
    await expect(dialog.locator('input[aria-label="Search the docs"]')).toBeFocused();
  });

  test('⌘K opens and closes the search palette', async ({ page }) => {
    await page.goto('/docs');
    const dialog = page.locator('dialog[data-docs-search]');
    await page.keyboard.press('Meta+k');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Meta+k');
    await expect(dialog).toBeHidden();
  });

  test('theme toggle switches between band and paper worlds', async ({ page }) => {
    await page.goto('/docs');
    const toggle = page.locator('header button[aria-label*="theme" i]').first();
    await expect(toggle).toBeVisible();
    // Dark-first product decision: band world on first load.
    await expect(page.locator('html')).toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/light/);
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).toBe('rgb(250, 248, 245)'); // paper hsl(36 33.3% 97.1%)
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('GitHub link points at the repo in a new tab', async ({ page }) => {
    await page.goto('/docs');
    const gh = page.locator('header a[aria-label="Advizr on GitHub"]');
    await expect(gh).toBeVisible();
    await expect(gh).toHaveAttribute('href', 'https://github.com/advizrai/advizr-docs');
    await expect(gh).toHaveAttribute('target', '_blank');
    expect(await gh.getAttribute('rel')).toContain('noopener');
  });

  test('topbar controls keep the 2px control radius and hairline border', async ({ page }) => {
    await page.goto('/docs');
    const toggle = page.locator('header button[aria-label*="theme" i]').first();
    const { radius, borderWidth } = await toggle.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { radius: cs.borderRadius, borderWidth: cs.borderTopWidth };
    });
    expect(parseFloat(radius)).toBeLessThanOrEqual(2);
    expect(parseFloat(borderWidth)).toBe(1);
  });

  test('section links are hidden on mobile; hamburger opens the drawer', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    await expect(page.locator('nav[aria-label="Sections"]')).toBeHidden();
    const hamburger = page.locator('header button[aria-label="Open navigation"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    const drawer = page.locator('dialog[aria-label="Documentation navigation"]');
    await expect(drawer).toBeVisible();
    // Full tree: every section is reachable from the drawer.
    for (const section of SECTIONS) {
      await expect(
        drawer.locator('span.eyebrow', { hasText: section }).first()
      ).toBeVisible();
    }
    await drawer.locator('button[aria-label="Close navigation"]').click();
    await expect(drawer).toBeHidden();
  });

  test('mobile keeps an icon-only search trigger', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') test.skip();
    await page.goto('/docs');
    const iconTrigger = page
      .locator('header button[aria-label="Search the docs"]')
      .last();
    await expect(iconTrigger).toBeVisible();
    await iconTrigger.click();
    await expect(page.locator('dialog[data-docs-search]')).toBeVisible();
  });

});
