/**
 * Playwright script to analyze Apify's docs search UX.
 * Captures screenshots and structural data for reference.
 *
 * Usage: node scripts/analyze-apify-search.mjs
 */

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'analysis')
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()

  console.log('1. Navigating to docs.apify.com...')
  await page.goto('https://docs.apify.com', { waitUntil: 'networkidle', timeout: 30000 })
  await sleep(2000)

  // 1. Screenshot the search trigger in navbar
  console.log('2. Capturing search trigger...')
  await page.screenshot({ path: join(OUT, 'search-trigger.png'), fullPage: false })

  // 2. Open the search modal via Ctrl+K
  console.log('3. Opening search modal with Ctrl+K...')
  await page.keyboard.press('Control+k')
  await sleep(1500)
  await page.screenshot({ path: join(OUT, 'search-modal-empty.png'), fullPage: false })

  // 3. Type "actors" and capture results
  console.log('4. Searching for "actors"...')
  // Find the search input in the modal
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"], [role="searchbox"], .DocSearch-Input')
  try {
    await searchInput.first().waitFor({ timeout: 5000 })
    await searchInput.first().fill('actors')
    await sleep(2000)
    await page.screenshot({ path: join(OUT, 'search-results-actors.png'), fullPage: false })
  } catch {
    // Try typing directly if no input found
    await page.keyboard.type('actors', { delay: 100 })
    await sleep(2000)
    await page.screenshot({ path: join(OUT, 'search-results-actors.png'), fullPage: false })
  }

  // 4. Analyze result structure
  console.log('5. Analyzing result structure...')
  const structure = await page.evaluate(() => {
    const findings = {
      modalSelector: null,
      resultItems: [],
      hasGrouping: false,
      hasBreadcrumbs: false,
      hasHighlighting: false,
      hasSnippets: false,
      resultCount: 0
    }

    // Check for DocSearch modal
    const docSearch = document.querySelector('.DocSearch-Modal, [role="listbox"], .algolia-autocomplete')
    if (docSearch) {
      findings.modalSelector = docSearch.className

      // Check for grouped results
      const groups = docSearch.querySelectorAll('[class*="group"], [class*="category"], [class*="section"]')
      findings.hasGrouping = groups.length > 0

      // Check result items
      const results = docSearch.querySelectorAll('[class*="Hit"], [role="option"], [class*="result"]')
      findings.resultCount = results.length
      findings.resultItems = Array.from(results).slice(0, 3).map(r => ({
        html: r.innerHTML.substring(0, 500),
        classes: r.className
      }))

      // Check for breadcrumbs
      findings.hasBreadcrumbs = !!docSearch.querySelector('[class*="path"], [class*="breadcrumb"], [class*="hierarchy"]')

      // Check for highlighting
      findings.hasHighlighting = !!docSearch.querySelector('mark, [class*="highlight"], em')

      // Check for snippets
      findings.hasSnippets = !!docSearch.querySelector('[class*="snippet"], [class*="content"], [class*="excerpt"]')
    }

    return findings
  })
  writeFileSync(join(OUT, 'search-structure.json'), JSON.stringify(structure, null, 2))
  console.log('   Structure:', JSON.stringify(structure, null, 2).substring(0, 300))

  // 5. Clear and search "proxy"
  console.log('6. Searching for "proxy"...')
  try {
    await searchInput.first().fill('')
    await searchInput.first().fill('proxy')
  } catch {
    await page.keyboard.press('Control+a')
    await page.keyboard.type('proxy', { delay: 100 })
  }
  await sleep(2000)
  await page.screenshot({ path: join(OUT, 'search-results-proxy.png'), fullPage: false })

  // 6. Keyboard navigation
  console.log('7. Testing keyboard navigation...')
  await page.keyboard.press('ArrowDown')
  await sleep(300)
  await page.keyboard.press('ArrowDown')
  await sleep(300)
  await page.keyboard.press('ArrowDown')
  await sleep(500)
  await page.screenshot({ path: join(OUT, 'search-keyboard-nav.png'), fullPage: false })

  // 7. No results state
  console.log('8. Testing no-results state...')
  try {
    await searchInput.first().fill('')
    await searchInput.first().fill('xyzzynotfound123')
  } catch {
    await page.keyboard.press('Control+a')
    await page.keyboard.type('xyzzynotfound123', { delay: 50 })
  }
  await sleep(2000)
  await page.screenshot({ path: join(OUT, 'search-no-results.png'), fullPage: false })

  // 8. Click a result to navigate
  console.log('9. Testing result navigation...')
  try {
    await searchInput.first().fill('')
    await searchInput.first().fill('proxy')
    await sleep(2000)
    await page.keyboard.press('ArrowDown')
    await sleep(300)
    await page.keyboard.press('Enter')
    await sleep(2000)
    await page.screenshot({ path: join(OUT, 'search-result-destination.png'), fullPage: false })
  } catch (e) {
    console.log('   Could not test navigation:', e.message)
  }

  await browser.close()
  console.log('\nDone! Screenshots saved to analysis/')
}

run().catch((err) => {
  console.error('Script failed:', err.message)
  process.exit(1)
})
