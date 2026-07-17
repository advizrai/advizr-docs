import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Shared Instrument Grade OG-image vocabulary (PR-F) — band world pinned:
 * social cards are dark-first regardless of the viewer, so the palette here
 * is the band ladder from styles/theme.css, precomputed to hex (ImageResponse
 * has no CSS variables).
 */

export const OG_COLORS = {
  band: '#0F0E0C', // hsl(40 11.1% 5.3%)
  bandHairline: '#2A2722', // hsl(37.5 10.5% 14.9%)
  text1: '#FCF9F2', // hsl(40 71.8% 97.1%)
  text2: '#C5C1B8', // hsl(40 8% 75.3%)
  text3: '#878379', // hsl(40 3.8% 51.2%)
  signal: '#FB7756', // hsl(12 95% 66%) — 7.26:1 vs band
} as const

/** Section RefCode eyebrows (adoption-map §4.4), keyed by section slug. */
export const OG_SECTION_EYEBROWS: Record<string, string> = {
  platform: 'PLT — PLATFORM',
  services: 'SVC — SERVICES',
  academy: 'ACD — ACADEMY',
  architecture: 'ARC — ARCHITECTURE',
  resources: 'RES — RESOURCES',
  legal: 'LGL — LEGAL',
}

export function ogEyebrowFor(section: string | null | undefined): string {
  if (!section) return 'ADVIZR — DOCUMENTATION'
  return OG_SECTION_EYEBROWS[section.toLowerCase()] ?? section.toUpperCase()
}

/**
 * Geist for ImageResponse: next/font's build-time assets are unreachable
 * from satori, so static TTFs (vercel/geist-font v1.7.2) are bundled under
 * assets/fonts/ and read off disk — the process.cwd() + readFile pattern the
 * Next OG docs prescribe (traced into the deploy bundle). Weights: 400 body,
 * 600 title, mono 400 eyebrow.
 */
export async function loadOgFonts() {
  const dir = join(process.cwd(), 'assets', 'fonts')
  const [sans, sansSemiBold, mono] = await Promise.all([
    readFile(join(dir, 'Geist-Regular.ttf')),
    readFile(join(dir, 'Geist-SemiBold.ttf')),
    readFile(join(dir, 'GeistMono-Regular.ttf')),
  ])
  return [
    { name: 'Geist', data: sans, weight: 400, style: 'normal' },
    { name: 'Geist', data: sansSemiBold, weight: 600, style: 'normal' },
    { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
  ] as const
}
