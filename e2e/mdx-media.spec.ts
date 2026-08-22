import { test, expect } from 'playwright/test';

/**
 * MDX media components — post-Instrument-Grade contract.
 * Screenshot = FigureFrame (hairline, corner ticks, FIG label, full-res
 * link, lazy img). VideoEmbed local modes: 'tour' click-to-play (no <video>
 * element before the click), 'loop' muted autoplay (reduced-motion gated).
 */

const platformOverview = '/docs/platform';       // master tour (mode=tour)
const homepage = '/docs';                        // 30s loop (mode=loop)
// A page that uses <Screenshot> and is NOT a candidate for a recorded clip.
//
// This anchor has now broken twice, both times because the page it pointed at
// got a video: first today/dashboard, then engagement/objectives. Every surface
// with interesting motion will eventually be filmed, so an anchor on one of
// those is a slow leak. Login and security is a still-life by nature — a form,
// a session list — so it keeps its screenshot.
const screenshotPage = '/docs/platform/account/login-and-security';

test.describe('MDX Media Components', () => {
  test('platform overview loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto(platformOverview);
    expect(errors).toHaveLength(0);
  });

  test('Screenshot renders as a FigureFrame with full-res link', async ({ page }) => {
    await page.goto(screenshotPage);
    const frame = page.locator('figure').filter({ hasText: 'FIG.' }).first();
    await expect(frame).toBeVisible();
    const link = frame.locator('a[target="_blank"]').first();
    await expect(link).toHaveAttribute('href', /\/images\/platform\/.+\.png/);
    await expect(link.locator('img')).toHaveAttribute('loading', 'lazy');
  });

  test('Screenshot frame is square with hairline (no radius, no shadow)', async ({ page }) => {
    await page.goto(screenshotPage);
    const frame = page.locator('figure').filter({ hasText: 'FIG.' }).first();
    const s = await frame.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { radius: cs.borderRadius, shadow: cs.boxShadow };
    });
    expect(parseFloat(s.radius)).toBe(0);
    expect(s.shadow).toBe('none');
  });

  test('tour video: poster facade, no <video> element before click', async ({ page }) => {
    await page.goto(platformOverview);
    const mount = page.locator('[data-video-mode="tour"]').first();
    await expect(mount).toBeVisible();
    expect(await mount.locator('video').count()).toBe(0);
    await expect(mount.locator('button[aria-label^="Play video"]')).toBeVisible();
    await expect(mount.locator('img')).toHaveAttribute('src', /platform-tour-poster/);
  });

  test('tour video: click swaps in a native <video controls>', async ({ page }) => {
    await page.goto(platformOverview);
    const mount = page.locator('[data-video-mode="tour"]').first();
    await mount.locator('button[aria-label^="Play video"]').click();
    const video = mount.locator('video');
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('src', /\/videos\/platform-tour-master\.mp4/);
  });

  test('loop video: muted looping <video> with preload=none', async ({ page }) => {
    await page.goto(homepage);
    const mount = page.locator('[data-video-mode="loop"]').first();
    await mount.scrollIntoViewIfNeeded();
    const video = mount.locator('video');
    await expect(video).toBeAttached();
    await expect(video).toHaveAttribute('loop', '');
    await expect(video).toHaveAttribute('playsinline', '');
    await expect(video).toHaveAttribute('preload', 'none');
    expect(await video.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
  });

  test('loop video: reduced motion gets controls instead of autoplay', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(homepage);
    const video = page.locator('[data-video-mode="loop"] video').first();
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute('controls', '');
    expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  });

  test('changelog page still renders without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/docs/resources/changelog');
    await expect(page.locator('main').first()).toBeVisible();
    expect(errors).toHaveLength(0);
  });
});
