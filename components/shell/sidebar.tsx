'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { useDocs } from '@/components/shell/docs-provider'
import { getActiveSection, getSections, type NavItem } from '@/lib/docs-nav'
import { cn } from '@/lib/cn'

/**
 * Sidebar — 244px rail, active-section tree (Linear pattern: the topbar owns
 * sections, this rail owns the active section's tree; every section stays
 * reachable from the topbar and the mobile drawer, so no link vanishes).
 *
 * Rows 28px/13px. Top-level folders render as mono uppercase eyebrow group
 * headers instead of chevron noise; only nested collapsibles get a chevron
 * (native <details> per adoption-map §3.3). Active page = 2px signal left
 * edge + --text-1 + secondary fill — the same selection grammar as the TOC
 * needle. On the homepage (no active section) the rail lists the sections.
 * No visible collapse control (§2.1); the `[` hotkey still collapses.
 */

const rowBase =
  'relative flex min-h-7 items-center gap-2 px-3 py-1 text-[13px] leading-tight'
const rowIdle = cn(
  rowBase,
  'text-[hsl(var(--text-3))] transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
)
const rowActive = cn(rowBase, 'bg-[hsl(var(--secondary))] text-[hsl(var(--text-1))]')

function PageRow({
  item,
  route,
  hrefFor,
  className,
}: {
  item: NavItem
  route: string
  hrefFor: (route: string) => string
  className?: string
}) {
  const active = route === item.route

  // An item carrying an absolute href points off this site. It is never the
  // active row, it opens in a new tab, and it uses a plain anchor because a
  // Next <Link> would try to client-navigate to another origin.
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(rowIdle, className)}
      >
        <span className="truncate">{item.title}</span>
        <span aria-hidden="true" className="ml-1 font-mono text-[0.6875rem] opacity-60">
          &#8599;
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <Link
      href={hrefFor(item.route)}
      aria-current={active ? 'page' : undefined}
      className={cn(active ? rowActive : rowIdle, className)}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-0.5 bg-[hsl(var(--signal))]"
        />
      )}
      <span className="truncate">{item.title}</span>
    </Link>
  )
}

/** Nested folder inside a group — the one place a chevron is earned. */
function NestedFolder({
  item,
  route,
  hrefFor,
}: {
  item: NavItem
  route: string
  hrefFor: (route: string) => string
}) {
  const containsActive = route === item.route || route.startsWith(`${item.route}/`)
  return (
    <details open={containsActive || undefined} className="group/folder">
      <summary
        className={cn(
          rowIdle,
          'cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden'
        )}
      >
        <ChevronRight
          size={12}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-150 ease-out group-open/folder:rotate-90 motion-reduce:transition-none"
        />
        <span className="truncate">{item.title}</span>
      </summary>
      <div className="ml-3 border-l border-border">
        {item.hasPage && (
          <PageRow
            item={{ ...item, title: 'Overview', children: undefined }}
            route={route}
            hrefFor={hrefFor}
          />
        )}
        {item.children?.map((child) =>
          child.children?.length ? (
            <NestedFolder key={child.route || child.name} item={child} route={route} hrefFor={hrefFor} />
          ) : (
            <PageRow key={child.route} item={child} route={route} hrefFor={hrefFor} />
          )
        )}
      </div>
    </details>
  )
}

/** Top-level folder group — eyebrow header, no chevron. */
function Group({
  item,
  route,
  hrefFor,
}: {
  item: NavItem
  route: string
  hrefFor: (route: string) => string
}) {
  const heading = (
    <span className="eyebrow block truncate px-3 pt-5 pb-1.5">{item.title}</span>
  )
  return (
    <div>
      {item.hasPage ? (
        <Link
          href={hrefFor(item.route)}
          className="block transition-[color] duration-150 ease-out hover:duration-0 hover:[&>span]:text-[hsl(var(--text-1))] motion-reduce:transition-none"
        >
          {heading}
        </Link>
      ) : (
        heading
      )}
      {item.children?.map((child) =>
        child.children?.length ? (
          <NestedFolder key={child.route || child.name} item={child} route={route} hrefFor={hrefFor} />
        ) : (
          <PageRow key={child.route} item={child} route={route} hrefFor={hrefFor} />
        )
      )}
    </div>
  )
}

function Sidebar() {
  const { normalized, route, docsBase, hrefFor } = useDocs()
  const sections = React.useMemo(
    () => getSections(normalized, docsBase),
    [normalized, docsBase]
  )
  const activeSection = getActiveSection(sections, route)

  return (
    <aside
      data-slot="docs-sidebar"
      className="sticky top-[var(--topbar-height)] hidden h-[calc(100dvh-var(--topbar-height))] overflow-y-auto border-r border-border bg-[hsl(var(--sidebar-background))] pb-8 lg:block"
    >
      <nav aria-label="Section pages" className="flex flex-col pt-3">
        {activeSection ? (
          <>
            {/* Section root — the rail's first row. */}
            {activeSection.hasPage && (
              <PageRow
                item={{ ...activeSection, title: 'Overview', children: undefined }}
                route={route}
                hrefFor={hrefFor}
              />
            )}
            {activeSection.children?.map((child) =>
              child.children?.length ? (
                <Group
                  key={child.route || child.name}
                  item={child}
                  route={route}
                  hrefFor={hrefFor}
                />
              ) : (
                <PageRow key={child.route} item={child} route={route} hrefFor={hrefFor} />
              )
            )}
          </>
        ) : (
          <>
            <span className="eyebrow block px-3 pt-2 pb-1.5">Sections</span>
            {sections.map((section) => (
              <PageRow key={section.route} item={{ ...section, children: undefined }} route={route} hrefFor={hrefFor} />
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}

export { Sidebar }
