#!/usr/bin/env node
/**
 * Claims gate for docs.advizr.ca.
 *
 * This site published a superseded guarantee and three retired performance
 * claims for weeks after advizr.ca dropped them, because the enforcement lived
 * in the other repo. `advizr-website` has `scripts/preflight.sh` and a
 * `src/data/claims.ts` registry; this file is the docs-side equivalent.
 *
 * Two properties owned by the same company stating the core commercial promise
 * differently is a trust problem in search and a substantiation problem under
 * the Competition Act, which requires adequate and proper testing BEFORE a
 * performance claim is made. Retired claims are retired everywhere or nowhere.
 *
 * Three lessons are built into the rules below, each paid for once already:
 *
 *   1. A line-based regex does not see JSX. The gate passed for weeks while
 *      `<Stat value={4.1} suffix="x" />` rendered "4.1x" on /docs/services,
 *      because the prose pattern `4.1x` never appears in the source. Every
 *      rule now runs twice: once per line, once over the whole file with
 *      whitespace collapsed, so a claim split across lines still matches.
 *   2. A pattern that only matches the canonical phrasing misses the paraphrase.
 *      "2x ROI" was banned; "the 2x guarantee" survived in two files.
 *   3. A number that is retired in prose is retired as a prop, a data field and
 *      a chart label too.
 *
 * Run: node scripts/check-claims.mjs
 *      node scripts/check-claims.mjs --self-test   (proves every rule fires)
 */

import { readFileSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['content', 'app', 'components', 'data', 'lib']
const SCAN_EXT = /\.(mdx|md|ts|tsx|js|jsx|json)$/

/**
 * Each rule is a retired claim and the reason it was retired. The `why` is the
 * useful half: without it the next person reads the gate as pedantry and
 * disables it.
 *
 *   re       - the pattern. Runs per-line AND against the whitespace-collapsed file.
 *   why      - why the claim is retired. Printed on failure.
 *   exclude  - repo-relative paths allowed to contain the pattern. Ship it empty.
 *              This is the emergency valve, not a convenience: a file listed here
 *              is a file the gate no longer protects.
 *   fixture  - a string the rule MUST match, checked by --self-test. A rule that
 *              stops matching its own fixture is a rule that has quietly died.
 */
const BANNED = [
  {
    id: 'guarantee-2x',
    re: /\b2\s*[x×]\s*ROI\b|\bat least 2\s*[x×]\s*what you pay\b|\b2\s*[x×]\s*guarantee\b|\btwice its cost\b/i,
    why: 'Retired twice over. The guarantee is delivery speed: "We deliver your custom strategy and systems in under a month, or we keep working for free until they are done." (canon 2026-10-14, made a speed promise 2026-10-18). "2x ROI in 90 days" contradicts advizr.ca wherever it survives, and the paraphrase "the 2x guarantee" is the same claim.',
    fixture: 'the methodology behind the 2x guarantee is audited',
  },
  {
    id: 'guarantee-90-day',
    re: /\b90[-\s]day\s+guarantee\b|\b90[-\s]day\s+clock\b|\bwithin 90 days of deployment\b/i,
    why: 'Retired with every ROI clock. The guarantee is delivery in under a month, not a return measured over a window after deployment. Deliberately does NOT match "90-day roadmap" or "the first 90 days", which are real deliverables.',
    fixture: 'the methodology behind the 90-day guarantee',
  },
  {
    id: 'guarantee-roi-multiple',
    // Mirrors advizr-website scripts/preflight.sh gate 7, plus the bare "5x"
    // and "ROI guarantee", which is how the multiple read on this site.
    re: /\b\d+(\.\d+)?\s*[x×]\s*ROI\b|\b5\s*[x×](?![\w-])|\bROI guarantee\b|\b(five|5|two|2)\s+times\s+(its|the)\s+cost\b|\b(30|90) days of deployment\b|\b(30|90)-day clock\b/i,
    why: 'Retired 2026-10-15 (canon 2026-10-14). No ROI multiple anywhere. Value is quantified per system in the proposal, in hours or dollars, and the guarantee is delivery in under a month. Mirrors advizr-website preflight gate 7.',
    // content/legal is the founder and counsel's to amend, not this gate's.
    // Remove this exclude once the terms of service stop citing the ROI guarantee.
    exclude: ['content/legal/terms-of-service.mdx'],
    fixture: 'backed by a 5x ROI guarantee',
  },
  {
    id: 'stat-multiple-suffix',
    re: /suffix=["'][x×]["']/,
    why: 'A <Stat> with an "x" suffix renders a multiple, and no multiple may be published (canon 2026-10-14). <Stat value={5} suffix="x" label="ROI guarantee" /> rendered "5x" on /docs/services while no prose pattern could see it.',
    fixture: '<Stat value={5} suffix="x" label="ROI guarantee" />',
  },
  {
    id: 'retired-tiers',
    re: /\bCatalyst\b|\bAcceleration\b|\bTransformation Partnership\b|\bPartnership (tier|plan)s?\b|\bthree engagement tiers\b|\b(higher|engagement|pricing) tiers?\b/,
    why: 'Retired (canon 2026-10-14). There are no tiers. An engagement is one monthly retainer for the Advizr Platform, the custom systems and the forward deployed engineers, priced in the proposal after the mapping calls. The old tier URLs redirect to /docs/services/pricing in next.config.mjs.',
    // Same reason as above: remove once the terms of service drop the tiers.
    exclude: ['content/legal/terms-of-service.mdx'],
    fixture: 'Start with Catalyst',
  },
  {
    id: 'build-and-educate',
    re: /\bBuild\s*(and|\+|&)\s*Educate\b|\btwo pillars\b|\bhalf of every Advizr engagement\b/i,
    why: 'Retired (canon 2026-10-14). Advizr sells three layers as one: the Advizr Platform, custom systems built on top, and forward deployed engineers. Education serves adoption. It is not a second pillar sold beside the build.',
    fixture: 'two pillars: Build and Educate',
  },
  {
    id: 'own-cloud',
    re: /\b(your|its|their|our) own cloud\b/i,
    why: 'Canon: never say "your own cloud". Sign-in is a shared service. Each client gets isolated infrastructure: its own repository, database and deployment.',
    fixture: 'it runs in your own cloud',
  },
  {
    id: 'fractional-digital-engineer',
    re: /\bFractional Digital Engineers?\b/i,
    why: 'Retired name (canon 2026-10-14). The people layer is forward deployed engineers (FDE), the words advizr.ca uses.',
    fixture: 'your Fractional Digital Engineer (FDE)',
  },
  {
    id: 'avg-roi-4.1x',
    re: /\b4\.1\s*[x×]\b/i,
    why: 'Retired 2026-07-16. An internal figure, not a signed client outcome, with no defensible sample. Banned from every public asset for Competition Act exposure.',
    fixture: 'Avg ROI 4.1x in 120 days',
  },
  {
    id: 'expand-scope-92',
    re: /\b92\s*%/,
    why: 'Retired 2026-08-08. "92% of clients expand scope" is an internal figure with no measured sample, and carries the same exposure that retired 4.1x.',
    fixture: '92% of clients expand scope',
  },
  {
    id: 'expand-scope-prose',
    re: /\b(most|the majority of|nearly all)\s+clients\s+expand\s+(their\s+)?scope\b/i,
    why: 'The prose form of the retired 92% claim. Dropping the number does not substantiate the claim; it just hides that it was never measured.',
    fixture: 'Most clients expand scope after the first build',
  },
  {
    id: 'time-savings-100',
    re: /\b100\s*%\s*(of\s+(our\s+)?clients|report)/i,
    why: 'Retired. No defensible sample size, and nobody believes 100%.',
    fixture: '100% of clients report time savings',
  },
  {
    id: 'retired-prospecting-1000x',
    re: /\b1[,.]?000\s*[x×]\b/i,
    why: 'Retired 2026-08-19 with three others. "~1,000x prospecting capacity" has no client-signed before/after measurement behind it.',
    fixture: 'Prospecting capacity increased roughly 1,000x',
  },
  {
    id: 'retired-manual-hours-band',
    re: /\b25\s*[-–]\s*50\s*%/,
    why: 'Retired 2026-08-19. The "25-50% of manual hours reclaimed" band was never measured against a signed baseline.',
    fixture: 'a 25-50% reduction in manual hours',
  },
  {
    id: 'retired-annual-hours-band',
    re: /\b1,?500\s*[-–]\s*5,?000\b/,
    why: 'Retired 2026-08-19. "1,500-5,000 hours reclaimed annually" has no client-signed measurement behind it.',
    fixture: '1,500-5,000 hours reclaimed annually',
  },
  {
    id: 'retired-outbound-roi',
    re: /\b10\s*[-–]\s*20\s*[x×]\b/i,
    why: 'Retired 2026-08-19. The "10-20x ROI" outbound range was never substantiated.',
    fixture: 'delivering 10-20x ROI on outbound',
  },
  {
    id: 'framer-era-stats',
    // Deliberately NOT matching a bare "$1.4M": the retired claim was the pair
    // "11.7x ROI / $1.4M annualized", and 11.7x already catches it. (The price
    // gate below now catches bare dollar figures anyway.)
    re: /\b300\+\s*projects\b|\$10M\+|\b98%\s*client|\b11\.7\s*[x×]|\$1\.4M\s*annualized|\b3\.2\s*[x×]\s*ROI/i,
    why: 'Framer-era claims, banned in advizr-website scripts/preflight.sh gate 3. Do not reintroduce here.',
    fixture: 'Delivered 300+ projects',
  },
  {
    id: 'price-gate',
    re: /\$\s?\d|\b\d[\d,]*\s?(CAD|USD)\b/,
    why: 'No literal prices anywhere on this site (advizr-website preflight gate 6 doctrine, extended here to every dollar figure). An engagement is one monthly retainer, priced in the proposal after the mapping calls. This gate is deliberately stricter than the band-only website rule: docs.advizr.ca published full retainer tables for weeks. Illustrative examples belong in hours, headcount or counts of things, never dollars.',
    fixture: 'Catalyst is $3,000-5,000 to build',
  },
  {
    id: 'stat-prop-values',
    re: /value=\{\s*(4\.1|92|11\.7|3\.2)\s*\}/,
    why: 'The JSX-prop form of a retired figure. <Stat value={4.1} suffix="x" /> renders "4.1x" on the page while every prose pattern misses it. This rule exists because exactly that shipped.',
    fixture: '<Stat value={4.1} suffix="x" label="Avg ROI" />',
  },
  {
    id: 'retired-case-studies',
    re: /pe-deal-desk|legal-document-automation|enterprise-ai-adoption|\$13B|13 billion|6 hours to 20 minutes|23%[^0-9]{1,5}85%|deal intel prep/i,
    why: 'Retired 2026-08-20 (advizr-website preflight gate 8). Three stories were created during the 2026-06-09 site build with no engagement behind them. Their slugs and signature numerals may never reappear on any property.',
    fixture: 'the pe-deal-desk story',
  },
  {
    id: 'provenance-figures',
    re: /\b1,224\b|\b8,712\b|\b42 of 43\b|\b43 of 43\b|\b6 of 6\b|\b80,750\b|\b359,000\b/,
    why: 'Provenance-gated engagement figures (advizr-website preflight gate 10). They render only through PROVENANCE in advizr-website src/data/claims.ts. docs.advizr.ca has no provenance table, so these literals may not appear here at all - link to advizr.ca instead.',
    fixture: 'across 1,224 documents',
  },
  {
    id: 'framer-assets',
    re: /framerusercontent/i,
    why: 'Framer-hosted assets die when Framer is decommissioned (advizr-website preflight gate 2). Self-host in public/.',
    fixture: 'https://framerusercontent.com/images/x.png',
  },
  {
    id: 'wrong-domain-email',
    re: /info@advizr\.com/i,
    why: 'Wrong domain (the old site footer bug). The address is info@advizr.ca.',
    fixture: 'email info@advizr.com',
  },
]

/**
 * Clients barred from public naming by their SOW or by a client-BI rule, plus
 * the people who signed for them and a prior vendor we agreed never to name.
 * Ported from advizr-website scripts/do-not-name.txt (preflight gate 9); keep
 * the two lists in sync. Case-sensitive with word boundaries so ordinary words
 * ("staggered") do not trip the gate.
 */
const DO_NOT_NAME = [
  /\bHoyes\b/,
  /\bMichalos\b/,
  /\bPicton\b/,
  /\bMahoney\b/,
  /\bNurse Next Door\b/,
  /\bNND\b/,
  /\bFranConnect\b/,
  /\bJoe Debtor\b/,
  /\bRECapXChange\b/,
  /\bFullbrook\b/,
  /\bStagg\b/,
  /\bInform Technologies\b/,
  /\bThorsteinssons\b/,
]

for (const re of DO_NOT_NAME) {
  const label = re.source.replace(/\\b/g, '')
  BANNED.push({
    id: `do-not-name:${label}`,
    re,
    why: 'Do-not-name list: this client is barred from public naming by their SOW or by a client-BI rule (advizr-website scripts/do-not-name.txt, preflight gate 9). Anonymise the story or cut it.',
    fixture: label,
  })
}

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

/** A rule opts a path out only if it named that exact path. */
function isExcluded(rule, relPath) {
  if (!rule.exclude) return false
  const normalized = relPath.split(sep).join('/')
  return rule.exclude.includes(normalized)
}

if (process.argv.includes('--self-test')) {
  const dead = BANNED.filter((rule) => !rule.fixture || !rule.re.test(rule.fixture))
  if (dead.length > 0) {
    console.error(`\nclaims gate SELF-TEST FAILED: ${dead.length} rule(s) no longer match their own fixture\n`)
    for (const rule of dead) {
      console.error(`  [${rule.id}] fixture: ${rule.fixture ?? '(none defined)'}`)
    }
    console.error('\nA rule that cannot match its own example is not protecting anything.\n')
    process.exit(1)
  }
  console.log(`claims gate self-test OK (${BANNED.length} rules, every rule matched its fixture)`)
  process.exit(0)
}

const files = (await Promise.all(SCAN_DIRS.map((d) => walk(join(ROOT, d))))).flat()
const failures = []

for (const file of files) {
  const relPath = relative(ROOT, file)
  const raw = readFileSync(file, 'utf8')
  const lines = raw.split(/\r?\n/)
  const seen = new Set()

  // Pass 1: per line, so the report carries a line number you can jump to.
  lines.forEach((line, i) => {
    for (const rule of BANNED) {
      if (isExcluded(rule, relPath)) continue
      if (rule.re.test(line)) {
        seen.add(rule.id)
        failures.push({ file: relPath, line: i + 1, id: rule.id, why: rule.why, text: line.trim().slice(0, 120) })
      }
    }
  })

  // Pass 2: the whole file with whitespace collapsed, which catches a claim
  // split across lines - a multi-line JSX prop, a wrapped sentence, a table
  // cell. Anything pass 1 already reported is skipped so the output stays
  // readable.
  const collapsed = raw.replace(/\s+/g, ' ')
  for (const rule of BANNED) {
    if (seen.has(rule.id) || isExcluded(rule, relPath)) continue
    if (rule.re.test(collapsed)) {
      const hit = collapsed.match(rule.re)
      const at = hit ? collapsed.indexOf(hit[0]) : 0
      failures.push({
        file: relPath,
        line: 1,
        id: rule.id,
        why: rule.why,
        text: `(multiline) ...${collapsed.slice(Math.max(0, at - 40), at + 80).trim()}...`,
      })
    }
  }
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
