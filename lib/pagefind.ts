/**
 * Typed Pagefind loader singleton (client-safe).
 *
 * The load idiom — a webpackIgnore'd dynamic import of the runtime-generated
 * /_pagefind/pagefind.js bundle, followed by pagefind.options() — is copied
 * from nextra/dist/client/components/search.js (importPagefind), which is the
 * proven path in this repo's production build. The index itself is produced
 * by the postbuild step (npx pagefind --site .next/server/app), so in `next
 * dev` the bundle does not exist: every loader failure surfaces as a typed
 * PagefindUnavailableError for the UI to render a dev empty state.
 */
import { addBasePath } from 'next/dist/client/add-base-path'

/** A heading-level hit inside a page result. */
export interface PagefindSubResult {
  title: string
  url: string
  /** Sanitized HTML with <mark> highlights — safe to render per Nextra precedent. */
  excerpt: string
  anchor?: {
    element: string
    id: string
    text: string
    location: number
  }
  locations: number[]
  weighted_locations: Array<{
    weight: number
    balanced_score: number
    location: number
  }>
}

/** The hydrated data for one page result (result.data() resolved). */
export interface PagefindResultData {
  url: string
  content: string
  /** Sanitized HTML with <mark> highlights. */
  excerpt: string
  word_count: number
  meta: { title?: string; image?: string } & Record<string, string>
  filters: Record<string, string[]>
  sub_results: PagefindSubResult[]
}

/** A raw (lazy) search hit before .data() hydration. */
export interface PagefindRawResult {
  id: string
  score: number
  words: number[]
  data: () => Promise<PagefindResultData>
}

export interface PagefindSearchResponse {
  results: PagefindRawResult[]
}

export interface PagefindSearchOptions {
  filters?: Record<string, unknown>
  sort?: Record<string, 'asc' | 'desc'>
}

export interface Pagefind {
  options: (opts: Record<string, unknown>) => Promise<void>
  search: (
    query: string,
    options?: PagefindSearchOptions
  ) => Promise<PagefindSearchResponse>
  /**
   * Built-in debounce: resolves null when a newer call supersedes this one.
   */
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions,
    debounceTimeoutMs?: number
  ) => Promise<PagefindSearchResponse | null>
}

/** Thrown when the Pagefind bundle is missing — i.e. the dev server, where
 *  the index only exists after `npm run build`. */
export class PagefindUnavailableError extends Error {
  constructor(message = 'Pagefind index unavailable — it builds with npm run build.') {
    super(message)
    this.name = 'PagefindUnavailableError'
  }
}

let loadPromise: Promise<Pagefind> | null = null

/** Load (once) and return the Pagefind instance. Browser-only. */
export function loadPagefind(): Promise<Pagefind> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new PagefindUnavailableError('Pagefind only loads in the browser.')
    )
  }
  loadPromise ??= (async () => {
    try {
      const pagefind: Pagefind = await import(
        /* webpackIgnore: true */
        addBasePath('/_pagefind/pagefind.js')
      )
      await pagefind.options({
        baseUrl: '/',
      })
      return pagefind
    } catch (error) {
      // Reset so a later navigation (e.g. after a rebuild) can retry.
      loadPromise = null
      throw new PagefindUnavailableError(
        error instanceof Error && !error.message.includes('Failed to fetch')
          ? `Pagefind failed to load: ${error.message}`
          : undefined
      )
    }
  })()
  return loadPromise
}

function stripHtmlSuffix(url: string): string {
  return url.replace(/\.html$/, '').replace(/\.html#/, '#')
}

/**
 * Debounced search returning hydrated page results with cleaned URLs.
 * Resolves null when a newer keystroke superseded this call (per Pagefind's
 * debouncedSearch contract) — callers should ignore null.
 */
export async function search(
  query: string,
  options?: PagefindSearchOptions
): Promise<PagefindResultData[] | null> {
  const pagefind = await loadPagefind()
  const response = await pagefind.debouncedSearch(query, options)
  if (!response) return null
  const data = await Promise.all(response.results.map((result) => result.data()))
  return data.map((page) => ({
    ...page,
    url: stripHtmlSuffix(page.url),
    sub_results: page.sub_results.map((sub) => ({
      ...sub,
      url: stripHtmlSuffix(sub.url),
    })),
  }))
}
