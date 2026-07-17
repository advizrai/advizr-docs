#!/usr/bin/env node
/**
 * Instrument Grade rebuild (PR-A) — legacy-aesthetic census + regression gate.
 * Ported from advizr-client-template scripts/audit-legacy-utilities.mjs.
 *
 * Counts call sites of the pre-rebuild vocabulary (brand-blue hexes, gradient
 * glow, transition-all, soft radii, remote-font re-introduction) across app/,
 * components/, styles/ and content/. During the rebuild the count must only
 * go down; once a phase declares a pattern dead, any new occurrence fails CI.
 *
 * Usage:
 *   node scripts/audit-legacy-utilities.mjs            # report counts
 *   node scripts/audit-legacy-utilities.mjs --gate     # exit 1 if any DEAD pattern matches
 *   node scripts/audit-legacy-utilities.mjs --baseline # write counts to scripts/.legacy-utility-baseline.json
 *   node scripts/audit-legacy-utilities.mjs --check    # exit 1 if any count grew vs baseline
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIRS = ['app', 'components', 'styles', 'content']
const EXTS = new Set(['.tsx', '.ts', '.jsx', '.js', '.css', '.mdx'])
const BASELINE_FILE = path.join(ROOT, 'scripts', '.legacy-utility-baseline.json')

// rounded-full is sanctioned ONLY for the two allowed circles: port dots and
// avatars. A file whose path matches one of these keeps its rounded-full
// call sites out of the census.
const ROUNDED_FULL_ALLOWLIST = [/port-dot/i, /avatar/i]

// Patterns and their lifecycle. `dead: true` means the pattern is banned by
// the rebuild — any match fails `--gate` (regression). `allowFile` (optional)
// exempts matching file paths for that pattern.
const PATTERNS = [
  { key: '--advizr-gradient', re: /--advizr-gradient\b/g, dead: true },
  { key: '--advizr-shadow-glow', re: /--advizr-shadow-glow\b/g, dead: true },
  { key: 'advizr-gradient-glow', re: /\badvizr-gradient-glow\b/g, dead: true },
  { key: 'variant="gradient"', re: /variant=["']gradient["']/g, dead: true },
  { key: 'box-shadow glow', re: /box-shadow:\s*var\(--advizr-shadow-glow\b/g, dead: true },
  { key: 'transition-all', re: /\btransition-all\b|transition:\s*all\b/g, dead: true },
  { key: 'rounded-(md..3xl)', re: /\brounded-(?:md|lg|xl|2xl|3xl)\b/g, dead: true },
  {
    key: 'rounded-full',
    re: /\brounded-full\b/g,
    dead: true,
    allowFile: (rel) => ROUNDED_FULL_ALLOWLIST.some((a) => a.test(rel)),
  },
  { key: 'hex #0A7AFF', re: /#0A7AFF\b/gi, dead: true },
  { key: 'hex #0066FF', re: /#0066FF\b/gi, dead: true },
  { key: 'hex #10B981', re: /#10B981\b/gi, dead: true },
  // Font re-introduction guards: quoted family names / font-family stacks —
  // bare-word matching would false-positive on prose ("Inter" inside .mdx).
  { key: 'font Inter', re: /['"]Inter['"]|font-family[^;}]*\bInter\b/g, dead: true },
  { key: 'font JetBrains', re: /JetBrains/g, dead: true },
]

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) yield* walk(full)
    else if (EXTS.has(path.extname(entry))) yield full
  }
}

const counts = Object.fromEntries(PATTERNS.map((p) => [p.key, { count: 0, files: new Set() }]))

for (const dir of SCAN_DIRS) {
  for (const file of walk(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, file)
    const text = readFileSync(file, 'utf8')
    for (const p of PATTERNS) {
      if (p.allowFile && p.allowFile(rel)) continue
      const matches = text.match(p.re)
      if (matches) {
        counts[p.key].count += matches.length
        counts[p.key].files.add(rel)
      }
    }
  }
}

const mode = process.argv[2]
const report = Object.fromEntries(
  Object.entries(counts).map(([k, v]) => [k, { count: v.count, files: v.files.size }]),
)

if (mode === '--baseline') {
  writeFileSync(BASELINE_FILE, JSON.stringify(report, null, 2) + '\n')
  console.log(`Baseline written to ${path.relative(ROOT, BASELINE_FILE)}`)
} else if (mode === '--check') {
  let failed = false
  let baseline
  try {
    baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'))
  } catch {
    console.error('No baseline found — run with --baseline first.')
    process.exit(1)
  }
  for (const [key, { count }] of Object.entries(report)) {
    const prev = baseline[key]?.count ?? 0
    if (count > prev) {
      console.error(`REGRESSION ${key}: ${prev} → ${count}`)
      failed = true
    }
  }
  if (failed) process.exit(1)
  console.log('No legacy-utility regressions vs baseline.')
} else if (mode === '--gate') {
  let failed = false
  for (const p of PATTERNS.filter((p) => p.dead)) {
    const { count } = report[p.key]
    if (count > 0) {
      console.error(`DEAD PATTERN PRESENT ${p.key}: ${count} matches in ${[...counts[p.key].files].join(', ')}`)
      failed = true
    }
  }
  process.exit(failed ? 1 : 0)
} else {
  console.log('Legacy-aesthetic census (app/, components/, styles/, content/):\n')
  const total = Object.values(report).reduce((s, v) => s + v.count, 0)
  for (const [key, { count, files }] of Object.entries(report)) {
    console.log(`  ${key.padEnd(24)} ${String(count).padStart(5)} matches in ${files} files`)
  }
  console.log(`\n  TOTAL ${total} (target: 0 by the final phase)`)
}
