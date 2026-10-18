import { test, expect } from 'playwright/test'

/**
 * The retired offer stays retired in what a reader sees, not only in the
 * source. scripts/check-claims.mjs is the source-level gate. This is its
 * rendered counterpart: no tier names, no ROI multiple and no "Build and
 * Educate" on any page that sells or explains the offer, sidebar and footer
 * included, and the old tier URLs land on the pricing page.
 *
 * content/legal is left out on purpose. Its terms are the founder's and
 * counsel's to amend.
 */

const OFFER_PAGES = [
  '/docs',
  '/docs/services',
  '/docs/services/pricing',
  '/docs/services/pricing/whats-included',
  '/docs/services/guarantees',
  '/docs/services/how-it-works',
  '/docs/services/faq',
  '/docs/services/roi-methodology',
  '/docs/services/case-studies',
  '/docs/services/compare/in-house-hire',
  '/docs/services/compare/traditional-consultants',
  '/docs/services/compare/diy-tools',
  '/docs/services/education',
  '/docs/services/education/curriculum',
  '/docs/services/education/session-formats',
  '/docs/services/education/async-resources',
  '/docs/services/education/ai-literacy',
  '/docs/services/what-we-build/ai-strategy',
  '/docs/resources/guides/first-30-days',
  '/docs/resources/guides/maximizing-your-retainer',
  '/docs/resources/templates/roi-calculator',
  '/docs/platform/account/billing',
  '/docs/platform/faq/general',
]

const RETIRED = /\b5\s*[x×](?![\w-])|Catalyst|Acceleration|Build\s*(and|\+)\s*Educate|ROI guarantee|Fractional Digital Engineer/i
const RETIRED_WORDS = /Catalyst|Acceleration|Build\s*(and|\+)\s*Educate|ROI guarantee|Fractional Digital Engineer/i

test.describe('Retired offer', () => {
  for (const path of OFFER_PAGES) {
    test(`${path} carries none of the retired offer`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      // Collapsed <details> answers are not in innerText until opened.
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true }))
      const visible = await page.locator('body').innerText()
      const meta = await page
        .locator('meta[name="description"], meta[property="og:description"]')
        .evaluateAll((els) => els.map((el) => el.getAttribute('content') ?? '').join(' '))
      expect(`${await page.title()} ${meta} ${visible}`).not.toMatch(RETIRED)
      // The raw HTML too, payload included. Each page once shipped another
      // page's raw MDX in its payload, unseen and still crawlable. "5x" is
      // left out here because base64 can spell it by accident.
      expect(await page.content()).not.toMatch(RETIRED_WORDS)
    })
  }

  const MOVED = [
    ['/docs/services/pricing/catalyst', '/docs/services/pricing'],
    ['/docs/services/pricing/acceleration', '/docs/services/pricing'],
    ['/docs/services/pricing/partnership', '/docs/services/pricing'],
    ['/docs/services/pricing/catalyst.md', '/docs/services/pricing.md'],
    ['/docs/services/pricing/acceleration.md', '/docs/services/pricing.md'],
    ['/docs/services/pricing/partnership.md', '/docs/services/pricing.md'],
  ]

  for (const [from, to] of MOVED) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 })
      expect(res.status()).toBe(308)
      expect(new URL(res.headers()['location'], 'http://x').pathname).toBe(to)
    })
  }
})
