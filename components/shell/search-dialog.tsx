'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/cn'
import {
  loadPagefind,
  PagefindUnavailableError,
  search,
  type PagefindResultData,
} from '@/lib/pagefind'

/**
 * SearchDialog — the ⌘K palette (adoption-map §5, Pagefind-powered).
 *
 * Native <dialog> (focus trap + esc for free), 640px / 0 radius /
 * --shadow-dropdown — the ONE sanctioned shadow, on the one floating layer.
 * 18px input over a single hairline-b; 48px result rows (13px title + 12px
 * Pagefind excerpt, sanitized <mark> HTML per Nextra precedent); selected =
 * secondary fill + 2px signal left bar (drawn, not shadowed); section
 * eyebrow group headings; kbd-hint footer. List height animates ≤100ms; NO
 * entrance animation (high-frequency surface). Full-screen sheet below sm.
 * Trigger-agnostic: controlled via open/onOpenChange or self-managed;
 * ⌘K / ctrl-K always bound, plus `/` outside inputs.
 */

const INPUT_TAGS = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'])

/** Section RefCodes (adoption-map §4.4) — group headings as eyebrows. */
const SECTION_EYEBROWS: Record<string, string> = {
  platform: 'PLT — PLATFORM',
  services: 'SVC — SERVICES',
  academy: 'ACD — ACADEMY',
  architecture: 'ARC — ARCHITECTURE',
  resources: 'RES — RESOURCES',
  legal: 'LGL — LEGAL',
}

interface ResultRow {
  title: string
  url: string
  excerpt: string
}

interface ResultGroup {
  heading: string
  rows: ResultRow[]
}

const MAX_PAGES = 10
const MAX_ROWS_PER_PAGE = 3

function sectionFor(url: string): string {
  const match = url.match(/^\/docs\/([^/#?]+)/)
  return (match && SECTION_EYEBROWS[match[1]]) || 'DOC — DOCS'
}

function buildGroups(pages: PagefindResultData[]): ResultGroup[] {
  const groups: ResultGroup[] = []
  const byHeading = new Map<string, ResultGroup>()
  for (const page of pages.slice(0, MAX_PAGES)) {
    const heading = sectionFor(page.url)
    let group = byHeading.get(heading)
    if (!group) {
      group = { heading, rows: [] }
      byHeading.set(heading, group)
      groups.push(group)
    }
    const subs = page.sub_results.slice(0, MAX_ROWS_PER_PAGE)
    if (subs.length === 0) {
      group.rows.push({
        title: page.meta.title ?? page.url,
        url: page.url,
        excerpt: page.excerpt,
      })
    } else {
      for (const sub of subs) {
        group.rows.push({ title: sub.title, url: sub.url, excerpt: sub.excerpt })
      }
    }
  }
  return groups
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] border border-border px-1 font-mono text-[11px] font-normal text-[hsl(var(--text-2))]">
      {children}
    </kbd>
  )
}

interface SearchDialogProps {
  /** Controlled open state; omit for self-managed. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
}

function SearchDialog({
  open: openProp,
  onOpenChange,
  placeholder = 'Search the docs…',
}: SearchDialogProps) {
  const router = useRouter()
  const isControlled = openProp !== undefined
  const [openState, setOpenState] = React.useState(false)
  const open = isControlled ? openProp : openState

  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listOuterRef = React.useRef<HTMLDivElement>(null)
  const listInnerRef = React.useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState('')
  const [groups, setGroups] = React.useState<ResultGroup[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [error, setError] = React.useState<'unavailable' | 'failed' | null>(null)

  const flatRows = React.useMemo(() => groups.flatMap((g) => g.rows), [groups])

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenState(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange]
  )

  // Global hotkeys: ⌘K / ctrl-K toggles; `/` opens when not typing.
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null
      const typing = Boolean(el && (INPUT_TAGS.has(el.tagName) || el.isContentEditable))
      const modifier = navigator.userAgent.includes('Mac')
        ? event.metaKey
        : event.ctrlKey
      if (event.key.toLowerCase() === 'k' && modifier && !event.shiftKey && !event.altKey) {
        event.preventDefault()
        setOpen(!open)
      } else if (event.key === '/' && !typing && !open) {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setOpen])

  // Sync open state with the native dialog; lock body scroll while open.
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      inputRef.current?.focus()
      inputRef.current?.select()
      document.documentElement.style.overflow = 'hidden'
      // Warm the index; in dev this surfaces the empty state immediately.
      loadPagefind()
        .then(() => setError(null))
        .catch((err: unknown) => {
          setError(err instanceof PagefindUnavailableError ? 'unavailable' : 'failed')
        })
    } else if (!open && dialog.open) {
      dialog.close()
    }
    if (!open) {
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  // Native close (esc) → mirror into state.
  const handleClose = React.useCallback(() => setOpen(false), [setOpen])

  // Query → Pagefind (its debouncedSearch resolves null when superseded).
  React.useEffect(() => {
    if (!open) return
    if (!query) {
      setGroups([])
      setSelectedIndex(0)
      return
    }
    let cancelled = false
    search(query)
      .then((pages) => {
        if (cancelled || pages === null) return
        setGroups(buildGroups(pages))
        setSelectedIndex(0)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof PagefindUnavailableError ? 'unavailable' : 'failed')
      })
    return () => {
      cancelled = true
    }
  }, [query, open])

  // List height animates ≤100ms toward the content's natural height.
  React.useEffect(() => {
    const outer = listOuterRef.current
    const inner = listInnerRef.current
    if (!outer || !inner) return
    const observer = new ResizeObserver(() => {
      outer.style.height = `${Math.min(inner.offsetHeight, 400)}px`
    })
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  // Keep the keyboard selection in view.
  React.useEffect(() => {
    listOuterRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const navigateTo = React.useCallback(
    (row: ResultRow) => {
      setOpen(false)
      router.push(row.url)
    },
    [router, setOpen]
  )

  const handleDialogKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, Math.max(flatRows.length - 1, 0)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      const row = flatRows[selectedIndex]
      if (row) {
        event.preventDefault()
        navigateTo(row)
      }
    }
  }

  // Scrim click: the dialog element itself is the click target only when the
  // click lands on the backdrop.
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === dialogRef.current) setOpen(false)
  }

  let rowIndex = -1

  return (
    <dialog
      ref={dialogRef}
      data-docs-search
      aria-label="Search the docs"
      onClose={handleClose}
      onClick={handleBackdropClick}
      onKeyDown={handleDialogKeyDown}
      className={cn(
        'fixed bg-[hsl(var(--popover))] p-0 text-[hsl(var(--popover-foreground))]',
        'w-full max-w-[640px] rounded-none border-0 shadow-[var(--shadow-dropdown)]',
        'backdrop:bg-black/50',
        // Upper third of the viewport ≥sm; full-screen sheet below sm (§6.5).
        'sm:mx-auto sm:mt-[15vh]',
        'max-sm:inset-0 max-sm:m-0 max-sm:h-full max-sm:max-h-none max-sm:w-full max-sm:max-w-none'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Input row — 18px text, hairline-b only; no box, no ring. */}
        <div className="hairline-b flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            aria-label="Search the docs"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            className="w-full bg-transparent p-5 font-sans text-[18px] leading-none text-[hsl(var(--text-1))] outline-none placeholder:text-[hsl(var(--text-3))]"
          />
          {/* Explicit close for the mobile sheet — no hardware esc. */}
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            className="mr-2 hidden h-10 w-10 shrink-0 items-center justify-center text-[hsl(var(--text-3))] max-sm:flex"
          >
            ✕
          </button>
        </div>

        {/* Results — height animates ≤100ms; max 400px then scrolls. */}
        <div
          ref={listOuterRef}
          className="overflow-y-auto transition-[height] duration-100 ease-out max-sm:flex-1 max-sm:h-auto! motion-reduce:transition-none"
          style={{ height: 0 }}
        >
          <div ref={listInnerRef}>
            {error === 'unavailable' ? (
              <div className="flex min-h-16 items-center justify-center px-5 py-6">
                <span className="eyebrow text-center">
                  Search index builds with npm run build
                </span>
              </div>
            ) : error === 'failed' ? (
              <div className="flex min-h-16 items-center px-5 text-[13px] text-[hsl(var(--text-3))]">
                Search failed to load. Reload the page and try again.
              </div>
            ) : query && flatRows.length === 0 ? (
              <div className="flex min-h-16 items-center px-5 text-[13px] text-[hsl(var(--text-3))]">
                No results for “{query}”.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.heading} className="pb-1">
                  <div className="eyebrow flex px-5 pt-4 pb-1.5">{group.heading}</div>
                  {group.rows.map((row) => {
                    rowIndex += 1
                    const index = rowIndex
                    const selected = index === selectedIndex
                    return (
                      <a
                        key={`${row.url}-${index}`}
                        href={row.url}
                        data-selected={selected || undefined}
                        onClick={(event) => {
                          event.preventDefault()
                          navigateTo(row)
                        }}
                        onMouseMove={() => setSelectedIndex(index)}
                        className={cn(
                          'relative flex h-12 flex-col justify-center gap-0.5 px-5',
                          selected && 'bg-[hsl(var(--secondary))]'
                        )}
                      >
                        {selected && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 w-0.5 bg-[hsl(var(--signal))]"
                          />
                        )}
                        <span className="truncate text-[13px] leading-tight text-[hsl(var(--text-1))]">
                          {row.title}
                        </span>
                        <span
                          className="truncate text-[12px] leading-tight text-[hsl(var(--text-3))] [&_mark]:bg-transparent [&_mark]:font-medium [&_mark]:text-[hsl(var(--signal-text))]"
                          // Pagefind excerpts are sanitized <mark> HTML — safe
                          // to render (Nextra renders them the same way).
                          dangerouslySetInnerHTML={{ __html: row.excerpt }}
                        />
                      </a>
                    )
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer — kbd hints; hidden on the mobile sheet. */}
        <div className="hairline-t flex items-center gap-4 px-5 py-2 text-[12px] text-[hsl(var(--text-3))] max-sm:hidden">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            close
          </span>
        </div>
      </div>
    </dialog>
  )
}

export { SearchDialog }
export type { SearchDialogProps }
