#!/usr/bin/env node
/**
 * Copy recorded platform clips and posters out of the client-platform repo and
 * into this one.
 *
 * The clips are produced by the docs-clips pipeline in advizr-client-template
 * (`npm run docs:media:record` then `docs:media:build`). That pipeline writes
 * into ITS OWN public/videos/docs for the in-product docs. Nothing existed to
 * carry those files across to docs.advizr.ca, so the 100-second tour currently
 * on this site was produced by hand, outside the pipeline, and cannot be
 * reproduced. This script is that missing hop.
 *
 * It also enforces a size budget, which this repo has never had. The platform
 * side gates every clip at 2.5MB; the docs side happily shipped an 8.7MB mp4 on
 * the busiest page in the Platform section.
 *
 * Usage:
 *   node scripts/sync-platform-media.mjs --from ../advizr-docsmedia
 *   node scripts/sync-platform-media.mjs --from ../advizr-docsmedia --dry-run
 *
 * Exits non-zero when a file breaks its budget, so CI can run it as a check.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync, readFileSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'

const args = process.argv.slice(2)
const fromIdx = args.indexOf('--from')
const DRY = args.includes('--dry-run')

if (fromIdx === -1 || !args[fromIdx + 1]) {
  console.error('usage: node scripts/sync-platform-media.mjs --from <client-template-worktree> [--dry-run]')
  process.exit(2)
}

const SRC = resolve(args[fromIdx + 1])
const DEST = process.cwd()

if (!existsSync(SRC)) {
  console.error(`source worktree not found: ${SRC}`)
  process.exit(2)
}

/**
 * Budgets in bytes. Per-clip matches the platform pipeline so a clip that
 * passed there cannot fail here. The hero is allowed more because it is a
 * click-to-play facade: nothing downloads until a reader asks for it.
 */
const BUDGET = {
  clipBytes: 2.5 * 1024 * 1024,
  heroBytes: 15 * 1024 * 1024,
  posterBytes: 500 * 1024,
  aggregateBytes: 120 * 1024 * 1024,
}

/**
 * Where each kind of asset lands. Layout mirrors the source so the copy is 1:1
 * and a missing file is obvious rather than silently renamed.
 *
 * The two flat hero names are deliberate: e2e/mdx-media.spec.ts asserts
 * /videos/platform-tour-master.mp4 and /videos/platform-tour-loop.mp4, and
 * content/platform/index.mdx and content/index.mdx reference them. Re-recording
 * their CONTENT while keeping their PATH means no call site churns.
 */
const RULES = [
  { from: 'public/videos/docs', to: 'public/videos/docs', ext: '.mp4', budget: 'clipBytes' },
  { from: 'public/images/docs', to: 'public/images/docs', ext: '.png', budget: 'posterBytes' },
  { from: 'public/images/docs', to: 'public/images/docs', ext: '.webp', budget: 'posterBytes' },
]

/**
 * Refuse a clip whose RECORDING is older than this many days.
 *
 * The age has to come from the source pipeline's manifest, not from file mtime.
 * The platform repo commits its clips, so a checkout restores them with the
 * checkout's timestamp and a months-old take looks brand new on disk. That is
 * not hypothetical: a July clip synced across looking fresh and showed a nav
 * rail reading "RESULTS" where the product now says "Value" - precisely the
 * drift this documentation pass existed to remove. A clip is evidence of what
 * the product looked like the day it was recorded, and an old one is a
 * confident lie.
 *
 * lib/docs/docs-media.manifest.json carries recordedAt per slug, written at
 * encode time. That is the honest signal. Pass --max-age-days to widen it.
 */
const maxAgeIdx = args.indexOf('--max-age-days')
const MAX_AGE_DAYS = maxAgeIdx === -1 ? 1 : Number(args[maxAgeIdx + 1])
const NOW = Date.now()

const MANIFEST_PATH = join(SRC, 'lib', 'docs', 'docs-media.manifest.json')
let manifest = {}
if (existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
} else {
  console.warn(`warning: no manifest at ${MANIFEST_PATH} — cannot judge clip age`)
}

/** Slug for an asset filename: "brain-ask.mp4" and "brain-ask-poster.png" both -> "brain-ask". */
function slugFor(name) {
  return name.replace(/\.(mp4|webm|png|webp)$/, '').replace(/-poster$/, '')
}

function recordedAgeDays(name) {
  const entry = manifest[slugFor(name)]
  if (!entry || !entry.recordedAt) return null
  return (NOW - Date.parse(entry.recordedAt)) / 86400000
}

let copied = 0
let skipped = 0
let aggregate = 0
let stale = 0
const failures = []

function fmt(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`
}

for (const rule of RULES) {
  const srcDir = join(SRC, rule.from)
  if (!existsSync(srcDir)) {
    console.log(`skip ${rule.from} (not present in source)`)
    continue
  }
  const destDir = join(DEST, rule.to)
  if (!DRY) mkdirSync(destDir, { recursive: true })

  for (const name of readdirSync(srcDir)) {
    if (!name.endsWith(rule.ext)) continue
    const srcFile = join(srcDir, name)
    const bytes = statSync(srcFile).size
    aggregate += bytes

    const ageDays = recordedAgeDays(name)
    if (ageDays !== null && ageDays > MAX_AGE_DAYS) {
      stale += 1
      console.log(`STALE   ${rule.to}/${name.padEnd(30)} recorded ${ageDays.toFixed(0)}d ago — not copied`)
      continue
    }

    const limit = BUDGET[rule.budget]
    if (bytes > limit) {
      failures.push(`${rule.to}/${name}: ${fmt(bytes)} over the ${fmt(limit)} budget`)
      continue
    }

    const destFile = join(destDir, name)
    if (existsSync(destFile) && statSync(destFile).size === bytes) {
      skipped += 1
      continue
    }
    if (!DRY) copyFileSync(srcFile, destFile)
    copied += 1
    console.log(`${DRY ? 'would copy' : 'copied'}  ${rule.to}/${name.padEnd(30)} ${fmt(bytes)}`)
  }
}

if (aggregate > BUDGET.aggregateBytes) {
  failures.push(`aggregate ${fmt(aggregate)} over the ${fmt(BUDGET.aggregateBytes)} ceiling`)
}

console.log('')
console.log(`${DRY ? 'dry run: ' : ''}${copied} copied, ${skipped} already current, ${stale} skipped as stale, ${fmt(aggregate)} total`)
if (stale > 0) {
  console.log(`(re-record those, or pass --max-age-days N if an older take is genuinely wanted)`)
}

if (failures.length > 0) {
  console.error('')
  console.error('SIZE BUDGET FAILURES:')
  for (const f of failures) console.error(`  ${f}`)
  console.error('')
  console.error('Re-encode on the platform side rather than raising the ceiling here.')
  console.error('A docs page that ships a heavy autoplaying loop is slower for every')
  console.error('reader, including the ones who never watch it.')
  process.exit(1)
}

console.log('media sync OK')
