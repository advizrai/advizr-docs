/**
 * Playwright script for:
 * 1. Analyzing Apify docs image patterns
 * 2. Capturing real screenshots from the live Advizr platform
 */

import { chromium } from 'playwright'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PLATFORM_DIR = join(ROOT, 'public/images/platform')
const ANALYSIS_DIR = join(ROOT, 'analysis/apify-images')

// Ensure directories exist
;[PLATFORM_DIR, ANALYSIS_DIR].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
})

const PAGES = [
  { path: '/template', filename: 'dashboard-home.png' },
  { path: '/template/chat', filename: 'chat.png' },
  { path: '/template/goals', filename: 'goals.png' },
  { path: '/template/documents', filename: 'documents.png' },
  { path: '/template/proposals', filename: 'proposals.png' },
  { path: '/template/learn', filename: 'learn.png' },
  { path: '/template/book', filename: 'book.png' },
  { path: '/template/help', filename: 'help.png' },
  { path: '/template/runs', filename: 'runs.png' },
  { path: '/template/analytics', filename: 'analytics.png' },
  { path: '/template/team', filename: 'team.png' },
  { path: '/template/settings', filename: 'settings.png' },
]

const manifest = []

async function analyzeApify(browser) {
  console.log('\n--- Part 1: Analyzing Apify docs ---')
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  try {
    // Capture a docs page with images
    await page.goto('https://docs.apify.com/academy/web-scraping-for-beginners', {
      waitUntil: 'networkidle',
      timeout: 15000,
    })
    await page.screenshot({ path: join(ANALYSIS_DIR, 'apify-docs-page.png'), fullPage: false })
    console.log('  Captured Apify docs page')

    // Look for image containers and their styling
    const imageInfo = await page.evaluate(() => {
      const imgs = document.querySelectorAll('article img, .markdown img, main img')
      return Array.from(imgs).slice(0, 5).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.naturalWidth,
        height: img.naturalHeight,
        classes: img.className,
        parentClasses: img.parentElement?.className || '',
        hasBorder: getComputedStyle(img).border,
        borderRadius: getComputedStyle(img).borderRadius,
        boxShadow: getComputedStyle(img).boxShadow,
      }))
    })
    writeFileSync(
      join(ANALYSIS_DIR, 'apify-image-analysis.json'),
      JSON.stringify(imageInfo, null, 2)
    )
    console.log(`  Found ${imageInfo.length} images, analysis saved`)
  } catch (err) {
    console.log(`  Apify analysis failed: ${err.message}`)
  }

  await page.close()
}

async function captureAdvizrScreenshots(browser) {
  console.log('\n--- Part 2: Capturing Advizr platform screenshots ---')
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  // Step 1: Capture login page before logging in
  try {
    console.log('  Navigating to login page...')
    await page.goto('https://advizrclients.com/template/login', {
      waitUntil: 'networkidle',
      timeout: 20000,
    })
    await page.waitForTimeout(2000)
    await page.screenshot({
      path: join(PLATFORM_DIR, 'login.png'),
      fullPage: true,
    })
    const loginSize = page.viewportSize()
    manifest.push({
      filename: 'login.png',
      url: 'https://advizrclients.com/template/login',
      width: loginSize.width,
      height: loginSize.height,
      timestamp: new Date().toISOString(),
      status: 'success',
    })
    console.log('  Captured login page')
  } catch (err) {
    console.log(`  Login page capture failed: ${err.message}`)
    manifest.push({
      filename: 'login.png',
      url: 'https://advizrclients.com/template/login',
      status: 'failed',
      error: err.message,
      timestamp: new Date().toISOString(),
    })
  }

  // Step 2: Log in
  try {
    console.log('  Logging in...')
    await page.goto('https://advizrclients.com', {
      waitUntil: 'networkidle',
      timeout: 20000,
    })
    await page.waitForTimeout(2000)

    // Fill identity field
    const identityInput = await page.$('input[placeholder*="Identity"], input[placeholder*="identity"], input[name="identity"], input[type="email"]')
    if (identityInput) {
      await identityInput.fill('demo@advizrclients.com')
    } else {
      // Try finding any visible text input
      const inputs = await page.$$('input[type="text"], input[type="email"]')
      if (inputs.length > 0) await inputs[0].fill('demo@advizrclients.com')
    }

    // Fill token field
    const tokenInput = await page.$('input[placeholder*="Token"], input[placeholder*="token"], input[name="token"], input[type="password"]')
    if (tokenInput) {
      await tokenInput.fill('Advizr2026!')
    } else {
      const inputs = await page.$$('input[type="password"]')
      if (inputs.length > 0) await inputs[0].fill('Advizr2026!')
    }

    // Click submit
    const submitBtn = await page.$('button[type="submit"]')
    if (submitBtn) {
      await submitBtn.click()
    }

    // Wait for redirect
    console.log('  Waiting for login redirect...')
    await page.waitForTimeout(8000)
    console.log(`  Current URL after login: ${page.url()}`)
  } catch (err) {
    console.log(`  Login failed: ${err.message}`)
  }

  // Step 3: Capture each page
  for (const { path, filename } of PAGES) {
    try {
      const url = `https://advizrclients.com${path}`
      console.log(`  Capturing ${path}...`)
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
      await page.waitForTimeout(3000)

      await page.screenshot({
        path: join(PLATFORM_DIR, filename),
        fullPage: true,
      })

      manifest.push({
        filename,
        url,
        width: 1440,
        height: (await page.evaluate(() => document.documentElement.scrollHeight)),
        timestamp: new Date().toISOString(),
        status: 'success',
      })
      console.log(`  OK: ${filename}`)
    } catch (err) {
      console.log(`  FAILED: ${filename} - ${err.message}`)
      manifest.push({
        filename,
        url: `https://advizrclients.com${path}`,
        status: 'failed',
        error: err.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  await page.close()
}

async function main() {
  console.log('Starting screenshot capture...')
  const browser = await chromium.launch({ headless: true })

  try {
    await analyzeApify(browser)
    await captureAdvizrScreenshots(browser)
  } finally {
    await browser.close()
  }

  // Write manifest
  const manifestPath = join(ROOT, 'analysis/screenshot-manifest.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\nManifest saved to ${manifestPath}`)

  // Summary
  const succeeded = manifest.filter(m => m.status === 'success').length
  const failed = manifest.filter(m => m.status === 'failed').length
  console.log(`\nDone: ${succeeded} captured, ${failed} failed`)

  if (failed > 0) {
    console.log('\nFailed captures:')
    manifest.filter(m => m.status === 'failed').forEach(m => {
      console.log(`  ${m.filename}: ${m.error}`)
    })
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
