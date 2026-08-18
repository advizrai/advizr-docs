#!/usr/bin/env node
/**
 * Claims gate for docs.advizr.ca.
 *
 * This site published a superseded guarantee and three retired performance
 * claims for weeks after advizr.ca dropped them, because the enforcement lived
 * in the other repo. `advizr-website` has `scripts/preflight.sh` gate 7 and a
 * `src/data/claims.ts` registry; this file is the docs-side equivalent.
 *
 * Two properties owned by the same company stating the core commercial promise
 * differently is a trust problem in search and a substantiation problem under
 * the Competition Act, which requires adequate and proper testing BEFORE a
 * performance claim is made. Retired claims are retired everywhere or nowhere.
 *
 * Run: node scripts/check-claims.mjs
 */

import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['content', 'app', 'components', 'data', 'lib']
const SCAN_EXT = /\.(mdx|md|ts|tsx|js|jsx|json)$/

/**
 * Each rule is a retired claim and the reason it was retired. The `why` is the
 * useful half: without it the next person reads the gate as pedantry and
 * disables it.
 */
const BANNED = [
  {
    id: 'guarantee-2x',
    re: /\b2\s*[x×]\s*ROI\b|\bat least 2\s*[x×]\s*what you pay\b/i,
    why: 'The guarantee is 5x ROI within 30 days of deployment (founder decision 2026-07-16). "2x ROI in 90 days" is superseded and still contradicts advizr.ca wherever it survives.',
  },
  {
    id: 'avg-roi-4.1x',
    re: /\b4\.1\s*[x×]\b/i,
    why: 'Retired 2026-07-16. An internal figure, not a signed client outcome, with no defensible sample. Banned from every public asset for Competition Act exposure.',
  },
  {
    id: 'expand-scope-92',
    re: /\b92\s*%/,
    why: 'Retired 2026-08-08. "92% of clients expand scope" is an internal figure with no measured sample, and carries the same exposure that retired 4.1x.',
  },
  {
    id: 'time-savings-100',
    re: /\b100\s*%\s*(of\s+(our\s+)?clients|report)/i,
    why: 'Retired. No defensible sample size, and nobody believes 100%.',
  },
  {
    // Deliberately NOT matching a bare "$1.4M": the retired claim was the pair
    // "11.7x ROI / $1.4M annualized", and 11.7x already catches it. A bare
    // dollar figure appears legitimately in Academy prompt examples, e.g.
    // "My revenue is $1.4M CAD". This gate caught that on its first run.
    id: 'framer-era-stats',
    re: /\b300\+\s*projects\b|\$10M\+|\b98%\s*client|\b11\.7\s*[x×]|\$1\.4M\s*annualized|\b3\.2\s*[x×]\s*ROI/i,
    why: 'Framer-era claims, banned in advizr-website scripts/preflight.sh. Do not reintroduce here.',
  },
]

async function walk(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else if (SCAN_EXT.test(e.name)) out.push(full)
  }
  return out
}

const files = (await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))).flat()
const failures = []

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  lines.forEach((line, i) => {
    for (const rule of BANNED) {
      if (rule.re.test(line)) {
        failures.push({
          file: relative(ROOT, file),
          line: i + 1,
          id: rule.id,
          why: rule.why,
          text: line.trim().slice(0, 120),
        })
      }
    }
  })
}

if (failures.length > 0) {
  console.error(`\nclaims gate FAILED: ${failures.length} banned claim(s) in ${files.length} files\n`)
  const byRule = new Map()
  for (const f of failures) {
    if (!byRule.has(f.id)) byRule.set(f.id, [])
    byRule.get(f.id).push(f)
  }
  for (const [id, hits] of byRule) {
    console.error(`  [${id}] ${hits[0].why}`)
    for (const h of hits) console.error(`      ${h.file}:${h.line}  ${h.text}`)
    console.error('')
  }
  console.error('If a claim has been re-approved, update BANNED in this file and')
  console.error('src/data/claims.ts in advizr-website in the same change. Never one alone.\n')
  process.exit(1)
}

console.log(`claims gate OK (${files.length} files scanned, ${BANNED.length} rules)`)
