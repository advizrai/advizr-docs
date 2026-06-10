import { test, expect } from 'playwright/test';
import { execSync } from 'node:child_process';

/**
 * Permanent design-system gates (added in B1).
 *
 * These encode the brand rules as CI assertions so the failure modes the
 * 2026-06 audit found can never silently return:
 *  - Tailwind-indigo (and other off-palette hues) wearing the Advizr logo
 *  - render-blocking remote font imports
 *  - hardcoded code-surface colors bypassing tokens
 */

const FORBIDDEN_CSS_VALUES = [
  '99, 102, 241', // Tailwind indigo-500 — the template color the audit caught
  '99,102,241',
  '#6366F1',
  '#818CF8', // indigo-400 (was a fallback in Steps.module.css)
  '139, 92, 246', // purple — off-palette
  '236, 72, 153', // pink — off-palette
  '19, 28, 46', // abandoned navy surface
  '#0D1117', // hardcoded GitHub code bg — use --advizr-bg-code
  '#1E1E2E', // old light-mode code bg — use --advizr-bg-code
  'fonts.googleapis', // fonts are self-hosted via next/font
];

test.describe('Design gates', () => {
  test('forbidden values absent from source CSS and components', () => {
    for (const value of FORBIDDEN_CSS_VALUES) {
      let out = '';
      try {
        out = execSync(
          `grep -rn --include='*.css' --include='*.tsx' --include='*.jsx' -F -- ${JSON.stringify(value)} styles/ components/ app/`,
          { encoding: 'utf-8' }
        );
      } catch {
        // grep exits 1 on no matches — that's the pass case
      }
      expect(out, `forbidden value "${value}" found:\n${out}`).toBe('');
    }
  });

  test('no requests to Google Fonts at runtime', async ({ page }) => {
    const fontRequests: string[] = [];
    page.on('request', (req) => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) fontRequests.push(req.url());
    });
    await page.goto('/docs');
    await page.evaluate(() => document.fonts.ready);
    expect(fontRequests).toHaveLength(0);
  });

  test('Inter is the rendered body font', async ({ page }) => {
    await page.goto('/docs');
    const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(family.toLowerCase()).toContain('inter');
  });

  test('reduced-motion kill-switch flattens animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/docs');
    const longAnimations = await page.evaluate(() =>
      document
        .getAnimations()
        .map((a) => {
          const timing = a.effect?.getComputedTiming();
          return (timing?.duration as number) || 0;
        })
        .filter((d) => d > 1)
    );
    expect(longAnimations).toHaveLength(0);
  });
});
