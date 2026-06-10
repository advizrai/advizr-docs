/**
 * Generates the AI-readable surface (postbuild, beside the Pagefind step):
 *   public/llms.txt        — llmstxt.org index: every page as a .md link
 *   public/llms-full.txt   — full concatenated markdown corpus
 *   public/docs/<slug>.md  — raw markdown per page (served at /docs/<slug>.md)
 *
 * Source of truth is content/ (MDX). JSX component blocks are kept verbatim —
 * they read as structured props to an LLM — but frontmatter becomes a title
 * heading + blockquote description.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CONTENT = path.join(ROOT, 'content')
const PUBLIC = path.join(ROOT, 'public')
const SITE = 'https://docs.advizr.ca'

const SECTION_TITLES = {
  platform: 'Platform (client portal guides)',
  services: 'Services (what Advizr builds, pricing)',
  academy: 'Academy (AI education for business owners)',
  architecture: 'Architecture (technical reference)',
  resources: 'Resources (guides, templates, integrations, changelog)',
  legal: 'Legal',
}

async function walk(dir) {
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function parseFrontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { meta: {}, body: src }
  const meta = {}
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) {
      meta[line.slice(0, i).trim()] = line
        .slice(i + 1)
        .trim()
        .replace(/^["']|["']$/g, '')
    }
  }
  return { meta, body: src.slice(match[0].length) }
}

function firstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : null
}

const files = (await walk(CONTENT)).sort()
const pages = []

for (const file of files) {
  const rel = path.relative(CONTENT, file).replace(/\.mdx$/, '')
  const slug = rel === 'index' ? '' : rel.replace(/\/index$/, '')
  const src = await fs.readFile(file, 'utf-8')
  const { meta, body } = parseFrontmatter(src)
  const title = meta.title || firstHeading(body) || slug || 'Advizr Documentation'
  const description = meta.description || ''
  const md = `# ${title}\n\n${description ? `> ${description}\n\n` : ''}${body.replace(/^#\s+.+\n/m, '')}`

  const outPath = path.join(PUBLIC, 'docs', slug ? `${slug}.md` : 'index.md')
  await fs.mkdir(path.dirname(outPath), { recursive: true })
  await fs.writeFile(outPath, md)

  pages.push({ slug, title, description, md })
}

// llms.txt index
const bySection = new Map()
for (const p of pages) {
  const section = p.slug.split('/')[0] || 'home'
  if (!bySection.has(section)) bySection.set(section, [])
  bySection.get(section).push(p)
}

let index = `# Advizr Documentation

> Advizr is an AI transformation agency for small and mid-sized businesses: we build AI systems (lead generation, workflow automation, dashboards) and educate teams, under transparent monthly partnerships. This site documents the client platform, services and pricing, the Academy education program, and the technical architecture.

Every page is available as raw markdown by appending .md to its URL.

`
for (const [section, sectionPages] of bySection) {
  if (section === 'home') continue
  index += `## ${SECTION_TITLES[section] || section}\n\n`
  for (const p of sectionPages) {
    index += `- [${p.title}](${SITE}/docs/${p.slug}.md)${p.description ? `: ${p.description}` : ''}\n`
  }
  index += '\n'
}
index += `## Optional\n\n- [Changelog RSS](${SITE}/changelog.xml)\n`

await fs.writeFile(path.join(PUBLIC, 'llms.txt'), index)

// llms-full.txt corpus
const full = pages
  .map((p) => `<!-- ${SITE}/docs/${p.slug} -->\n\n${p.md}`)
  .join('\n\n---\n\n')
await fs.writeFile(
  path.join(PUBLIC, 'llms-full.txt'),
  `# Advizr Documentation — full corpus\n\n${full}`
)

console.log(`llms: ${pages.length} pages -> public/docs/*.md + llms.txt + llms-full.txt`)
