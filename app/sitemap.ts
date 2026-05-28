import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://docs.advizr.ca'
const CONTENT_DIR = path.join(process.cwd(), 'content')

function getAllMdxPaths(dir: string, basePath: string = ''): { urlPath: string; lastModified: Date }[] {
  const results: { urlPath: string; lastModified: Date }[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue
    if (entry.name === 'node_modules') continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      results.push(...getAllMdxPaths(fullPath, basePath ? `${basePath}/${entry.name}` : entry.name))
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const stat = fs.statSync(fullPath)
      const slug = entry.name.replace(/\.(mdx|md)$/, '')
      const urlPath = slug === 'index'
        ? (basePath || '')
        : (basePath ? `${basePath}/${slug}` : slug)
      results.push({ urlPath, lastModified: stat.mtime })
    }
  }

  return results
}

export default function sitemap(): MetadataRoute.Sitemap {
  const mdxPaths = getAllMdxPaths(CONTENT_DIR)

  return mdxPaths.map(({ urlPath, lastModified }) => {
    const fullUrl = urlPath ? `/docs/${urlPath}` : '/docs'

    // Priority based on depth
    const depth = fullUrl.split('/').length - 2
    let priority: number
    if (fullUrl === '/docs') {
      priority = 1.0
    } else if (depth <= 1) {
      priority = 0.8
    } else if (depth <= 2) {
      priority = 0.6
    } else {
      priority = 0.4
    }

    return {
      url: `${BASE_URL}${fullUrl}`,
      lastModified,
      changeFrequency: fullUrl === '/docs' ? ('weekly' as const) : ('monthly' as const),
      priority
    }
  })
}
