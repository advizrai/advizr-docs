'use client'

import * as React from 'react'
import { removeLinks } from 'nextra/remove-links'

import { Breadcrumbs } from '@/components/shell/breadcrumbs'
import { useDocs } from '@/components/shell/docs-provider'
import { EditLink } from '@/components/shell/edit-link'
import { Pagination } from '@/components/shell/pagination'
import { Toc, TocDisclosure, type TocEntry } from '@/components/shell/toc'

/**
 * MdxThemeWrapper — the per-page layout inside DocsShell.
 *
 * Standard pages: breadcrumbs → article grid (§2.1 contract: gutters ·
 * minmax(0, --content-max) prose region · --toc-width rail ≥xl) → article
 * (15px --text-2 body via .docs-prose) → edit-link row → prev/next. <xl the
 * TOC rail folds into an "ON THIS PAGE" disclosure above the article (§6.2).
 *
 * layout:'full' (activeThemeContext — the homepage): full-bleed article,
 * no breadcrumbs, no TOC, no edit link, no pagination.
 *
 * <main data-pagefind-body> marks the searchable article; metadata.searchable
 * === false omits the attribute (nextra-theme-docs contract, verified in its
 * mdx-components wrapper).
 */

interface MdxThemeWrapperProps {
  toc?: TocEntry[]
  metadata?: {
    filePath?: string
    searchable?: boolean
    [key: string]: unknown
  }
  children: React.ReactNode
}

function MdxThemeWrapper({ toc = [], metadata = {}, children }: MdxThemeWrapperProps) {
  const { normalized } = useDocs()
  const { activeThemeContext } = normalized

  const searchable = metadata.searchable !== false
  const cleanToc = React.useMemo(
    () =>
      toc.map((item) => ({
        ...item,
        value: removeLinks(item.value as Parameters<typeof removeLinks>[0]),
      })),
    [toc]
  )

  if (activeThemeContext.layout === 'full') {
    return (
      <main
        id="docs-content"
        data-pagefind-body={searchable || undefined}
        className="docs-prose min-w-0"
      >
        {children}
      </main>
    )
  }

  const showToc = activeThemeContext.toc !== false && cleanToc.length > 0
  const showBreadcrumb = activeThemeContext.breadcrumb !== false

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(2rem,1fr)_minmax(0,var(--content-max))_var(--toc-width)_minmax(2rem,1fr)] xl:gap-x-12">
      <div className="mx-auto w-full min-w-0 max-w-[var(--content-max)] px-6 pt-8 pb-16 md:px-8 xl:col-start-2 xl:mx-0 xl:max-w-none xl:px-0">
        {showBreadcrumb && (
          <div className="mb-5">
            <Breadcrumbs />
          </div>
        )}
        {showToc && (
          <div className="mb-8 xl:hidden">
            <TocDisclosure toc={cleanToc} />
          </div>
        )}
        <main
          id="docs-content"
          data-pagefind-body={searchable || undefined}
          className="docs-prose"
        >
          {children}
        </main>
        <div className="hairline-t mt-14 flex items-center justify-end pt-4 pb-6">
          <EditLink filePath={metadata.filePath} />
        </div>
        <Pagination />
      </div>
      {showToc && (
        <aside
          data-slot="docs-toc-rail"
          className="hidden xl:col-start-3 xl:block"
        >
          <div className="sticky top-[calc(var(--topbar-height)+2rem)] max-h-[calc(100dvh-var(--topbar-height)-4rem)] overflow-y-auto pt-8 pb-8">
            <Toc toc={cleanToc} />
          </div>
        </aside>
      )}
    </div>
  )
}

export { MdxThemeWrapper }
