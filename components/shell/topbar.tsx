'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, Search } from 'lucide-react'

import { useDocs } from '@/components/shell/docs-provider'
import { ThemeToggle } from '@/components/shell/theme-toggle'
import { getSections } from '@/lib/docs-nav'
import { cn } from '@/lib/cn'

/**
 * Topbar — 48px sticky shell header (adoption-map §2.2).
 *
 * Left: logo + section links (Linear pattern: the topbar owns sections, the
 * sidebar owns the active section's tree). Active section = --text-1 with a
 * 2px signal underline flush with the bottom hairline. Right: search chip
 * ("Search" + ⌘K), theme toggle, GitHub link. Below lg the section links
 * yield to a hamburger that opens the mobile drawer.
 */

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

const iconButtonClass = cn(
  'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-border bg-transparent text-[hsl(var(--text-3))]',
  'transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
)

function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { normalized, route, docsBase, hrefFor, setSearchOpen } = useDocs()
  const sections = React.useMemo(
    () => getSections(normalized, docsBase),
    [normalized, docsBase]
  )

  return (
    <header
      data-slot="docs-topbar"
      className="hairline-b sticky top-0 z-40 h-[var(--topbar-height)] bg-[hsl(var(--background))]"
    >
      <div className="flex h-full items-center gap-4 px-4 lg:px-5">
        {/* Mobile: hamburger opens the drawer. */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
          className={cn(iconButtonClass, 'lg:hidden')}
        >
          <Menu size={16} aria-hidden="true" />
        </button>

        <Link
          href={hrefFor(docsBase)}
          className="flex shrink-0 items-center gap-2"
          aria-label="Advizr Docs home"
        >
          {/* The mark is a white asset (current site's navbar logo) — invert
              it in the paper world so it reads as ink. */}
          <Image
            src="/advizr-logo.png"
            alt=""
            width={24}
            height={24}
            priority
            className="size-6 light:invert"
          />
          <span className="text-[13px] font-medium leading-none text-[hsl(var(--text-1))]">
            Advizr
            <span className="ml-1.5 font-normal text-[hsl(var(--text-3))]">Docs</span>
          </span>
        </Link>

        {/* Section links — desktop only; active = text-1 + 2px signal
            underline flush with the bottom hairline. */}
        <nav
          aria-label="Sections"
          className="hidden h-full min-w-0 items-stretch gap-1 overflow-x-auto lg:flex"
        >
          {sections.map((section) => {
            const active =
              route === section.route || route.startsWith(`${section.route}/`)
            return (
              <Link
                key={section.route}
                href={hrefFor(section.route)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'relative flex items-center px-2.5 text-[13px] leading-none',
                  active
                    ? 'text-[hsl(var(--text-1))]'
                    : 'text-[hsl(var(--text-3))] transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
                )}
              >
                {section.title}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2.5 bottom-0 h-0.5 bg-[hsl(var(--signal))]"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Search chip ≥sm; icon-only below. */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the docs"
            className={cn(
              'hidden h-7 items-center gap-2 rounded-[2px] border border-border px-2 text-[13px] text-[hsl(var(--text-3))] sm:inline-flex',
              'transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
            )}
          >
            <Search size={13} aria-hidden="true" />
            Search
            <kbd className="rounded-[2px] border border-border px-1 font-mono text-[10px] leading-4">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the docs"
            className={cn(iconButtonClass, 'sm:hidden')}
          >
            <Search size={15} aria-hidden="true" />
          </button>

          <ThemeToggle />

          <a
            href="https://github.com/advizrai/advizr-docs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Advizr on GitHub"
            className={iconButtonClass}
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}

export { Topbar }
