'use client'

import * as React from 'react'
import Link from 'next/link'

import { useDocs } from '@/components/shell/docs-provider'
import { getDocsSequence } from '@/lib/docs-nav'
import { cn } from '@/lib/cn'

/**
 * Pagination — prev/next pair at article end (adoption-map §4.5).
 *
 * Two cells over a hairline-top rule: mono eyebrow (← PREV / NEXT →) plus a
 * 13px 500-weight title. Docs are a sequence — flatDocsDirectories order —
 * so section boundaries page straight across; an absent side is simply
 * omitted (first/last page of the corpus).
 */

function PaginationCell({
  direction,
  title,
  href,
}: {
  direction: 'prev' | 'next'
  title: React.ReactNode
  href: string
}) {
  return (
    <Link
      href={href}
      rel={direction}
      className={cn(
        'group/page flex flex-col gap-1.5 px-4 py-4',
        direction === 'next' ? 'items-end text-right' : 'items-start',
        'transition-[background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] motion-reduce:transition-none'
      )}
    >
      <span className="eyebrow">
        {direction === 'prev' ? '← Prev' : 'Next →'}
      </span>
      <span className="text-[13px] font-medium leading-snug text-[hsl(var(--text-1))]">
        {title}
      </span>
    </Link>
  )
}

function Pagination() {
  const { normalized, route, docsBase, hrefFor } = useDocs()
  const { activeThemeContext } = normalized
  const { sequence, index } = React.useMemo(
    () => getDocsSequence(normalized, docsBase, route),
    [normalized, docsBase, route]
  )
  if (activeThemeContext.pagination === false || index === -1) return null

  const prev = sequence[index - 1]
  const next = sequence[index + 1]
  if (!prev && !next) return null

  return (
    <div
      data-slot="docs-pagination"
      className="hairline-t grid grid-cols-2"
      data-pagefind-ignore
    >
      <div className="min-w-0">
        {prev?.route && (
          <PaginationCell direction="prev" title={prev.title} href={hrefFor(prev.route)} />
        )}
      </div>
      <div className="min-w-0 border-l border-border">
        {next?.route && (
          <PaginationCell direction="next" title={next.title} href={hrefFor(next.route)} />
        )}
      </div>
    </div>
  )
}

export { Pagination }
