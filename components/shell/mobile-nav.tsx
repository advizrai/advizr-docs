'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

import { useDocs } from '@/components/shell/docs-provider'
import { getSections, type NavItem } from '@/lib/docs-nav'
import { cn } from '@/lib/cn'

/**
 * MobileNav — off-canvas drawer (<lg) on a native <dialog> (focus trap and
 * esc for free, adoption-map §6.1). 280px panel from the left, plain scrim,
 * 40px touch rows, hairline dividers between sections, 0 radius. Slide-in
 * ≤250ms ease-out, instant close, closes on route change. Unlike the desktop
 * rail this drawer carries the FULL tree — all sections — so nothing is
 * unreachable on touch.
 */

const touchRow =
  'relative flex min-h-10 items-center gap-2 px-4 py-2 text-[13px] leading-tight'
const touchRowIdle = cn(
  touchRow,
  'text-[hsl(var(--text-2))] transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
)
const touchRowActive = cn(
  touchRow,
  'bg-[hsl(var(--secondary))] text-[hsl(var(--text-1))]'
)

function DrawerRow({
  item,
  route,
  hrefFor,
  indent = false,
}: {
  item: NavItem
  route: string
  hrefFor: (route: string) => string
  indent?: boolean
}) {
  const active = route === item.route
  return (
    <Link
      href={hrefFor(item.route)}
      aria-current={active ? 'page' : undefined}
      className={cn(active ? touchRowActive : touchRowIdle, indent && 'pl-8')}
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

function DrawerFolder({
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
    <details open={containsActive || undefined} className="group/drawer-folder">
      <summary
        className={cn(
          touchRowIdle,
          'cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden'
        )}
      >
        <ChevronRight
          size={14}
          aria-hidden="true"
          className="shrink-0 transition-transform duration-150 ease-out group-open/drawer-folder:rotate-90 motion-reduce:transition-none"
        />
        <span className="truncate">{item.title}</span>
      </summary>
      <div>
        {item.hasPage && (
          <DrawerRow
            item={{ ...item, title: 'Overview', children: undefined }}
            route={route}
            hrefFor={hrefFor}
            indent
          />
        )}
        {item.children?.map((child) =>
          child.children?.length ? (
            <DrawerFolder
              key={child.route || child.name}
              item={child}
              route={route}
              hrefFor={hrefFor}
            />
          ) : (
            <DrawerRow
              key={child.route}
              item={child}
              route={route}
              hrefFor={hrefFor}
              indent
            />
          )
        )}
      </div>
    </details>
  )
}

function MobileNav({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { normalized, route, docsBase, hrefFor } = useDocs()
  const pathname = usePathname()
  const dialogRef = React.useRef<HTMLDialogElement>(null)
  const sections = React.useMemo(
    () => getSections(normalized, docsBase),
    [normalized, docsBase]
  )

  // Sync open state with the native dialog.
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // Close on route change.
  React.useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Documentation navigation"
      onClose={onClose}
      onClick={(event) => {
        // Only the backdrop registers the dialog itself as the target.
        if (event.target === dialogRef.current) onClose()
      }}
      className={cn(
        'fixed inset-y-0 left-0 m-0 h-full max-h-none w-[280px] max-w-[85vw] overflow-y-auto',
        'border-r border-border bg-[hsl(var(--sidebar-background))] p-0 text-[hsl(var(--foreground))]',
        'backdrop:bg-black/50',
        // Slide-in ≤250ms ease-out; instant close; reduced motion = none.
        'open:motion-safe:animate-[docs-drawer-in_0.25s_var(--ease-out-quart)]'
      )}
    >
      <nav aria-label="All sections" className="flex flex-col pb-8">
        <div className="hairline-b flex h-[var(--topbar-height)] items-center justify-between px-4">
          <span className="eyebrow">Navigation</span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-[hsl(var(--text-3))]"
          >
            ✕
          </button>
        </div>
        <DrawerRow
          item={{ name: 'index', route: docsBase, title: 'Home', hasPage: true }}
          route={route}
          hrefFor={hrefFor}
        />
        {sections.map((section) => (
          <div key={section.route} className="hairline-t">
            <span className="eyebrow block px-4 pt-4 pb-1">{section.title}</span>
            {section.hasPage && (
              <DrawerRow
                item={{ ...section, title: 'Overview', children: undefined }}
                route={route}
                hrefFor={hrefFor}
              />
            )}
            {section.children?.map((child) =>
              child.children?.length ? (
                <DrawerFolder
                  key={child.route || child.name}
                  item={child}
                  route={route}
                  hrefFor={hrefFor}
                />
              ) : (
                <DrawerRow
                  key={child.route}
                  item={child}
                  route={route}
                  hrefFor={hrefFor}
                />
              )
            )}
          </div>
        ))}
      </nav>
    </dialog>
  )
}

export { MobileNav }
