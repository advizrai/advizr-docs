'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * TOC — the page's instrument needle (adoption-map §2.3).
 *
 * Rail: 1px hairline the full height of the list. Needle: a 2px --signal
 * segment overlaid at -1px whose translateY/height track the active
 * heading(s), animating ≤250ms ease-out-quart (transform+height only, gated
 * by prefers-reduced-motion). One IntersectionObserver drives activation:
 * the reading zone is the top ~45% of the viewport below the topbar —
 * generous enough that short trailing sections still activate; when nothing
 * intersects, the last heading above the zone wins; before everything, the
 * first heading is the fallback.
 *
 * <xl the rail disappears and TocDisclosure (native <details>) renders above
 * the article instead (§6.2 — collapse, don't drop).
 */

export interface TocEntry {
  depth: number
  value: React.ReactNode
  id: string
}

function useActiveIds(items: TocEntry[]): string[] {
  const [activeIds, setActiveIds] = React.useState<string[]>([])

  React.useEffect(() => {
    if (items.length === 0) return
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (headings.length === 0) return

    const zoneTop = 48 + 16 // topbar + breathing room

    const recompute = () => {
      const zoneBottom = window.innerHeight * 0.45
      const inZone: string[] = []
      let lastAbove: string | null = null
      for (const el of headings) {
        const top = el.getBoundingClientRect().top
        if (top < zoneTop) lastAbove = el.id
        if (top >= zoneTop && top <= zoneBottom) inZone.push(el.id)
      }
      if (inZone.length > 0) setActiveIds(inZone)
      else if (lastAbove) setActiveIds([lastAbove])
      else setActiveIds([headings[0].id])
    }

    const observer = new IntersectionObserver(recompute, {
      // Fire whenever a heading crosses the reading-zone boundaries.
      rootMargin: `-${zoneTop}px 0px -55% 0px`,
    })
    for (const el of headings) observer.observe(el)
    recompute()
    return () => observer.disconnect()
  }, [items])

  return activeIds
}

function Toc({ toc }: { toc: TocEntry[] }) {
  const items = React.useMemo(
    () => toc.filter((item) => item.depth === 2 || item.depth === 3),
    [toc]
  )
  const activeIds = useActiveIds(items)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [needle, setNeedle] = React.useState<{ top: number; height: number } | null>(
    null
  )

  // Needle geometry follows the active link rows.
  React.useEffect(() => {
    const list = listRef.current
    if (!list || activeIds.length === 0) {
      setNeedle(null)
      return
    }
    const rows = activeIds
      .map((id) =>
        list.querySelector<HTMLElement>(`a[data-toc-id="${CSS.escape(id)}"]`)
      )
      .filter((el): el is HTMLElement => Boolean(el))
    if (rows.length === 0) {
      setNeedle(null)
      return
    }
    const top = Math.min(...rows.map((row) => row.offsetTop))
    const bottom = Math.max(...rows.map((row) => row.offsetTop + row.offsetHeight))
    setNeedle({ top, height: bottom - top })
  }, [activeIds])

  if (items.length === 0) return null

  return (
    <nav aria-label="On this page" data-slot="docs-toc">
      <span className="eyebrow">On this page</span>
      <div className="relative mt-3">
        {/* The rail — a dimension line. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px bg-[hsl(var(--border))]"
        />
        {/* The needle — its live reading. */}
        {needle && (
          <span
            aria-hidden="true"
            className="absolute -left-px w-0.5 bg-[hsl(var(--signal))] motion-safe:transition-[transform,height] motion-safe:duration-[0.25s] motion-safe:[transition-timing-function:var(--ease-out-quart)]"
            style={{
              height: needle.height,
              transform: `translateY(${needle.top}px)`,
              top: 0,
            }}
          />
        )}
        <ul ref={listRef} className="flex flex-col">
          {items.map((item) => {
            const active = activeIds.includes(item.id)
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-toc-id={item.id}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'block py-1 pr-2 text-[13px] leading-snug',
                    item.depth === 3 ? 'pl-7' : 'pl-4',
                    active
                      ? 'text-[hsl(var(--text-1))]'
                      : 'text-[hsl(var(--text-3))] transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
                  )}
                >
                  {item.value}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

/** <xl replacement — "ON THIS PAGE" native disclosure above the article. */
function TocDisclosure({ toc }: { toc: TocEntry[] }) {
  const items = toc.filter((item) => item.depth === 2 || item.depth === 3)
  if (items.length === 0) return null

  return (
    <details data-slot="docs-toc-disclosure" className="hairline-frame group/toc">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 px-4 select-none [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="font-mono text-[11px] text-[hsl(var(--text-3))] transition-transform duration-150 ease-out group-open/toc:rotate-90 motion-reduce:transition-none"
        >
          ▸
        </span>
        <span className="eyebrow">On this page</span>
      </summary>
      <ul className="hairline-t flex flex-col py-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block min-h-8 py-1.5 pr-4 text-[13px] leading-snug text-[hsl(var(--text-3))]',
                'transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none',
                item.depth === 3 ? 'pl-8' : 'pl-4'
              )}
            >
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </details>
  )
}

export { Toc, TocDisclosure }
