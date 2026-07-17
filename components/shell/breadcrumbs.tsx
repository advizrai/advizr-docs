'use client'

import * as React from 'react'
import Link from 'next/link'

import { useDocs } from '@/components/shell/docs-provider'
import { sectionRefCode } from '@/lib/docs-nav'
import { cn } from '@/lib/cn'

/**
 * Breadcrumbs — mono 11px uppercase trail (adoption-map §4.4).
 *
 * activePath minus the current page; the first crumb is the section RefCode
 * (PLT / SVC / ACD / ARC / RES / LGL) — wayfinding without section hues.
 * Crumbs that resolve to a real page link to it; bare folders stay text.
 */

function Breadcrumbs() {
  const { normalized, route, docsBase, hrefFor } = useDocs()
  // activePath minus the current page, minus the contentDirBasePath folder
  // ("/docs" itself) — the trail starts at the section.
  const crumbs = normalized.activePath
    .slice(0, -1)
    .filter((item) => item.route && item.route.startsWith(`${docsBase}/`))
  if (crumbs.length === 0) return null

  const refCode = sectionRefCode(route, docsBase)

  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="docs-breadcrumbs"
      className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]"
    >
      {crumbs.map((item, index) => {
        const label =
          index === 0 && refCode ? refCode : (item.title as React.ReactNode)
        const hasPage = Boolean(
          (item as { frontMatter?: unknown }).frontMatter && item.route
        )
        return (
          <React.Fragment key={item.route || item.name}>
            {index > 0 && (
              <span aria-hidden="true" className="text-[hsl(var(--text-4))]">
                /
              </span>
            )}
            {hasPage ? (
              <Link
                href={hrefFor(item.route)}
                className={cn(
                  'transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
                )}
              >
                {label}
              </Link>
            ) : (
              <span>{label}</span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export { Breadcrumbs }
