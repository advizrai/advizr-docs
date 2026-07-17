'use client'

import * as React from 'react'

import { BackToTop } from '@/components/shell/back-to-top'
import { useDocs } from '@/components/shell/docs-provider'
import { Footer } from '@/components/shell/footer'
import { MobileNav } from '@/components/shell/mobile-nav'
import { ReadingProgress } from '@/components/shell/reading-progress'
import { SearchDialog } from '@/components/shell/search-dialog'
import { Sidebar } from '@/components/shell/sidebar'
import { SkipLink } from '@/components/shell/skip-link'
import { Topbar } from '@/components/shell/topbar'
import { cn } from '@/lib/cn'

/**
 * DocsShell — the shell root (adoption-map §2.1).
 *
 * Layout decision (consistent throughout): the 48px topbar is STICKY and
 * spans the full width; beneath it a grid of
 * `lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]` holds the sidebar rail
 * and the content column (per-page wrapper + footer). The sidebar is sticky
 * below the topbar with its own scroll. Collapsing the sidebar (the `[`
 * hotkey) removes the rail column; layout:'full' pages keep the rail — full
 * governs the article region, not the shell.
 *
 * next-themes' ThemeProvider is NOT mounted here — the root layout owns it
 * (PR-D); the preview route wraps itself locally.
 */
function DocsShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, searchOpen, setSearchOpen } = useDocs()
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <div
      data-slot="docs-shell"
      className="min-h-dvh bg-[hsl(var(--background))] font-sans text-[hsl(var(--text-2))] antialiased"
    >
      <SkipLink />
      <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
      <ReadingProgress />
      <div
        className={cn(
          'grid grid-cols-1',
          !sidebarCollapsed && 'lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]'
        )}
      >
        {!sidebarCollapsed && <Sidebar />}
        <div className="flex min-w-0 flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </div>
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <BackToTop />
    </div>
  )
}

export { DocsShell }
