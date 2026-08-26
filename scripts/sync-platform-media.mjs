#!/usr/bin/env node
/**
 * Copy recorded platform clips and posters out of the client-platform repo and
 * into this one.
 *
 * TWO pipelines feed this repo, and this script is the hop for both.
 *
 * The section clips come from docs-clips in advizr-client-template
 * (`npm run docs:media:record` then `docs:media:build`), which writes into ITS
 * OWN public/videos/docs for the in-product docs.
 *
 * The two hero videos on /docs and /docs/platform come from site-media
 * (`npm run site:media:record` then `site:media:build`), which writes into
 * site-media-out/final. This file used to say the 100-second tour "was produced
 * by hand, outside the pipeline, and cannot be reproduced". That was true when
 * it was written and is not true now: site-media grew a master stage that
 * concatenates the six recorded segments, burns the captions and appends the
 * end card. Believing the old comment is how the tour sat on the busiest page
 * in the Platform section for five weeks showing a nav rail the product had
 * retired.
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
import { join, resolve, basename, dirname } from 'node:path'

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

/**
 * The three hero assets, which RULES cannot express: they come from the
 * site-media pipeline rather than docs-clips, they live under
 * site-media-out/final rather than public/, and one is renamed on the way.
 *
 * e2e/mdx-media.spec.ts asserts /videos/platform-tour-master.mp4 and
 * /videos/platform-tour-loop.mp4, and content/platform/index.mdx and
 * content/index.mdx reference them. The CONTENT gets re-recorded; the PATH
 * never moves.
 */
const HEROES = [
  {
    from: 'site-media-out/final/videos/platform-tour-master.mp4',
    to: 'public/videos/platform-tour-master.mp4',
    budget: 'heroBytes',
  },
  {
    // site-media calls the loop platform-tour.mp4. This repo has always called
    // it platform-tour-loop.mp4 and the e2e spec asserts that name, so the
    // rename happens here rather than churning three call sites.
    from: 'site-media-out/final/videos/platform-tour.mp4',
    to: 'public/videos/platform-tour-loop.mp4',
    budget: 'clipBytes',
  },
  {
    from: 'site-media-out/final/images/product/platform-tour-poster.png',
    to: 'public/images/platform/platform-tour-poster.png',
    budget: 'posterBytes',
  },
]

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


/**
 * The heroes, judged on the same evidence as the clips.
 *
 * Their age comes from site-media's own manifest, and the encoder writes
 * `recordedAt` there as the OLDEST segment in the cut rather than the build
 * clock. A master tour is only as fresh as its stalest segment, and stamping a
 * re-encode of old footage with today is precisely the lie this gate exists to
 * catch.
 */
const SITE_MANIFEST_PATH = join(SRC, 'site-media-out', 'final', 'manifest.json')
let siteManifest = null
if (existsSync(SITE_MANIFEST_PATH)) {
  siteManifest = JSON.parse(readFileSync(SITE_MANIFEST_PATH, 'utf8'))
} else if (HEROES.some((h) => existsSync(join(SRC, h.from)))) {
  console.warn(`warning: hero files present but no manifest at ${SITE_MANIFEST_PATH} — cannot judge their age`)
}

const heroAgeDays = siteManifest?.recordedAt
  ? (NOW - Date.parse(siteManifest.recordedAt)) / 86400000
  : null

for (const hero of HEROES) {
  const srcFile = join(SRC, hero.from)
  if (!existsSync(srcFile)) {
    console.log(`skip ${hero.to} (not built in source — run site:media:build)`)
    continue
  }
  const bytes = statSync(srcFile).size
  aggregate += bytes

  if (heroAgeDays !== null && heroAgeDays > MAX_AGE_DAYS) {
    stale += 1
    console.log(`STALE   ${hero.to.padEnd(46)} recorded ${heroAgeDays.toFixed(0)}d ago — not copied`)
    continue
  }

  const limit = BUDGET[hero.budget]
  if (bytes > limit) {
    failures.push(`${hero.to}: ${fmt(bytes)} over the ${fmt(limit)} budget`)
    continue
  }

  const destFile = join(DEST, hero.to)
  if (existsSync(destFile) && statSync(destFile).size === bytes) {
    skipped += 1
    continue
  }
  if (!DRY) {
    mkdirSync(dirname(destFile), { recursive: true })
    copyFileSync(srcFile, destFile)
  }
  copied += 1
  console.log(`${DRY ? 'would copy' : 'copied'}  ${hero.to.padEnd(46)} ${fmt(bytes)}`)
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
