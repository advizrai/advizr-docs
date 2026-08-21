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

  test('rendered pages contain zero emoji', async ({ page }) => {
    const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    for (const path of ['/docs', '/docs/platform', '/docs/services', '/docs/academy', '/docs/resources']) {
      await page.goto(path);
      const text = await page.evaluate(() => document.body.innerText);
      const match = text.match(emojiPattern);
      expect(match, `emoji "${match?.[0]}" rendered on ${path}`).toBeNull();
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

/**
 * Every icon name used in MDX must exist in components/icon-registry.ts.
 *
 * An unregistered name is not a build error and not a visible crash: the Icon
 * component logs `[Icon] unknown icon name "x"` to the server console and
 * renders nothing, so a card quietly loses its icon and nobody notices. Four
 * names were shipping that way. A console warning nobody reads is not a gate.
 */
test.describe('Icon registry', () => {
  test('every icon name used in content is registered', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');

    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory()
          ? walk(full)
          : full.endsWith('.mdx')
            ? [full]
            : [];
      });

    const registry = readFileSync('components/icon-registry.ts', 'utf8');
    const registered = new Set(
      Array.from(registry.matchAll(/^\s{2}'?([a-z-]+)'?:\s/gm), (m) => m[1]),
    );

    const unknown = new Map<string, string[]>();
    for (const file of walk('content')) {
      const body = readFileSync(file, 'utf8');
      for (const m of body.matchAll(/icon="([a-z-]+)"/g)) {
        if (!registered.has(m[1])) {
          if (!unknown.has(m[1])) unknown.set(m[1], []);
          unknown.get(m[1])!.push(file);
        }
      }
    }

    expect(
      Array.from(unknown, ([name, files]) => `${name} (${files.length} refs, e.g. ${files[0]})`),
      'unregistered icon names render nothing — add them to components/icon-registry.ts',
    ).toEqual([]);
  });
});
