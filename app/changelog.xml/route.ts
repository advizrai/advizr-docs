import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const dynamic = 'force-static'

const SITE_URL = 'https://docs.advizr.ca'
const CHANGELOG_URL = `${SITE_URL}/docs/resources/changelog`

interface ChangelogEntry {
  date: string
  version?: string
  title: string
  description: string
  category: string
}

// Keep in sync with slugify() in components/mdx/Changelog.tsx —
// guids must match the rendered permalink ids.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toPubDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString()
}

export async function GET() {
  const raw = await readFile(join(process.cwd(), 'public', 'changelog.json'), 'utf8')
  const entries = (JSON.parse(raw) as ChangelogEntry[])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))

  const items = entries
    .map((entry) => {
      const permalink = `${CHANGELOG_URL}#${slugify(`${entry.title}-${entry.date}`)}`
      const title = entry.version ? `${entry.title} (v${entry.version})` : entry.title
      return [
        '    <item>',
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(permalink)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(permalink)}</guid>`,
        `      <description>${escapeXml(entry.description)}</description>`,
        `      <category>${escapeXml(entry.category)}</category>`,
        `      <pubDate>${toPubDate(entry.date)}</pubDate>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  const lastBuildDate = entries.length > 0 ? toPubDate(entries[0].date) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Advizr Changelog</title>
    <link>${CHANGELOG_URL}</link>
    <description>Updates to the Advizr platform, documentation, and services.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/changelog.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
