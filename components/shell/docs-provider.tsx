'use client'

import * as React from 'react'
import { useFSRoute } from 'nextra/hooks'
import { normalizePages } from 'nextra/normalize-pages'

/**
 * DocsProvider — the shell's single source of navigation truth.
 *
 * Mirrors nextra-theme-docs' ConfigProvider (stores/config.js): one
 * normalizePages() call per route over the server-provided pageMap, exposed
 * via context to the topbar, sidebar, breadcrumbs, TOC and pagination.
 *
 * Route mapping: the shell can be MOUNTED anywhere (PR-C mounts it at
 * /design/preview-docs, PR-D at /docs) while content routes in the pageMap
 * are canonical /docs/* paths. `route` is the canonical docs route for the
 * current pathname; `hrefFor()` maps a canonical route back into the mount
 * base so in-shell navigation stays inside the mount.
 *
 * Also owns two pieces of shell UI state:
 * - sidebar collapse — `[` hotkey, localStorage-persisted, desktop only
 *   (no visible toggle chrome per adoption-map §2.1)
 * - search dialog open state (the dialog itself binds ⌘K and `/`)
 */

type PageMapList = Parameters<typeof normalizePages>[0]['list']
type NormalizedPages = ReturnType<typeof normalizePages>

interface DocsContextValue {
  normalized: NormalizedPages
  /** Canonical docs route for the current pathname (e.g. /docs/platform). */
  route: string
  /** Canonical content base (routes inside the pageMap). */
  docsBase: string
  /** Where the shell is mounted (preview: /design/preview-docs). */
  mountBase: string
  /** Map a canonical /docs route into the current mount. */
  hrefFor: (route: string) => string
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const DocsContext = React.createContext<DocsContextValue | null>(null)

/** Strict accessor — shell components require the provider. */
function useDocs(): DocsContextValue {
  const value = React.useContext(DocsContext)
  if (!value) {
    throw new Error('Missing DocsProvider — wrap the shell in <DocsProvider>.')
  }
  return value
}

/** Optional accessor — mdx-theme elements degrade gracefully without it. */
function useDocsOptional(): DocsContextValue | null {
  return React.useContext(DocsContext)
}

const SIDEBAR_COLLAPSED_KEY = 'docs-sidebar-collapsed'
const INPUT_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA'])

function DocsProvider({
  pageMap,
  docsBase = '/docs',
  mountBase = '/docs',
  children,
}: {
  pageMap: PageMapList
  docsBase?: string
  mountBase?: string
  children: React.ReactNode
}) {
  const pathname = useFSRoute()

  // Mounted pathname → canonical docs route (identity when mounted at /docs).
  const route = React.useMemo(() => {
    if (mountBase === docsBase) return pathname
    if (pathname === mountBase) return docsBase
    if (pathname.startsWith(`${mountBase}/`)) {
      return docsBase + pathname.slice(mountBase.length)
    }
    return pathname
  }, [pathname, mountBase, docsBase])

  const hrefFor = React.useCallback(
    (canonical: string) => {
      if (mountBase === docsBase) return canonical
      if (canonical === docsBase) return mountBase
      if (canonical.startsWith(`${docsBase}/`)) {
        return mountBase + canonical.slice(docsBase.length)
      }
      return canonical
    },
    [mountBase, docsBase]
  )

  const normalized = React.useMemo(
    () => normalizePages({ list: pageMap, route }),
    [pageMap, route]
  )

  // Sidebar collapse — read persisted state after mount (SSR-safe).
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  React.useEffect(() => {
    setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1')
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((collapsed) => {
      const next = !collapsed
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  // `[` toggles the sidebar (never while typing, never with modifiers).
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '[' || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const el = document.activeElement as HTMLElement | null
      if (el && (INPUT_TAGS.has(el.tagName) || el.isContentEditable)) return
      event.preventDefault()
      toggleSidebar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleSidebar])

  const [searchOpen, setSearchOpen] = React.useState(false)

  const value = React.useMemo(
    () => ({
      normalized,
      route,
      docsBase,
      mountBase,
      hrefFor,
      sidebarCollapsed,
      toggleSidebar,
      searchOpen,
      setSearchOpen,
    }),
    [
      normalized,
      route,
      docsBase,
      mountBase,
      hrefFor,
      sidebarCollapsed,
      toggleSidebar,
      searchOpen,
    ]
  )

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>
}

export { DocsProvider, useDocs, useDocsOptional }
export type { DocsContextValue, NormalizedPages }
