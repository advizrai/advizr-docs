'use client'

import * as React from 'react'

import { Footer } from '@/components/shell/footer'
import { SearchDialog } from '@/components/shell/search-dialog'
import { ThemeToggle } from '@/components/shell/theme-toggle'
import { DimensionLine } from '@/components/ui/dimension-line'
import { Eyebrow } from '@/components/ui/eyebrow'
import { FigureFrame, FigureProvider } from '@/components/ui/figure-frame'
import { LedgerTable } from '@/components/ui/ledger-table'
import { RefCode } from '@/components/ui/ref-code'
import { StatNumeral } from '@/components/ui/stat-numeral'
import { StatusGlyph, type StatusGlyphStatus } from '@/components/ui/status-glyph'
import { cn } from '@/lib/cn'

/**
 * Instrument Grade dev gallery. Renders the whole PR-B kit twice-toggleable:
 * default = band world (:root tokens), PAPER = a local `.light` scope wrapper
 * (next-themes not required for the world preview; the ThemeToggle exhibit
 * still drives the real global theme).
 */

const GLYPH_STATES: StatusGlyphStatus[] = [
  'delivered',
  'running',
  'review',
  'pending',
  'failed',
  'paused',
]

const LEDGER_COLUMNS = [
  { key: 'ref', header: 'Ref', mono: true },
  { key: 'item', header: 'Item' },
  { key: 'status', header: 'Status' },
  { key: 'amount', header: 'Amount', align: 'right' as const, mono: true },
]

const LEDGER_ROWS = [
  {
    ref: <RefCode kind="rel" id={42} />,
    item: 'Portal action center',
    status: <StatusGlyph status="delivered" label="delivered" />,
    amount: '1,240.00',
  },
  {
    ref: <RefCode kind="rel" id={43} />,
    item: 'Email deliverability pass',
    status: <StatusGlyph status="running" label="running" />,
    amount: '860.00',
  },
  {
    ref: <RefCode kind="rel" id={44} />,
    item: 'Provisioning hardening',
    status: <StatusGlyph status="review" label="review" />,
    amount: '412.50',
  },
]

const LEDGER_TOTALS = {
  ref: '',
  item: 'Total',
  status: '',
  amount: '2,512.50',
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="hairline-b pb-2">
        <Eyebrow withPort>{label}</Eyebrow>
      </div>
      <div className="pt-6">{children}</div>
    </section>
  )
}

function WorldToggle({
  world,
  onChange,
}: {
  world: 'band' | 'paper'
  onChange: (world: 'band' | 'paper') => void
}) {
  return (
    <div className="inline-flex border border-border" role="group" aria-label="World">
      {(['band', 'paper'] as const).map((w) => (
        <button
          key={w}
          type="button"
          aria-pressed={world === w}
          onClick={() => onChange(w)}
          className={cn(
            'eyebrow h-8 px-4',
            world === w
              ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--text-1))]'
              : 'transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'
          )}
        >
          {w}
        </button>
      ))}
    </div>
  )
}

function GalleryClient() {
  const [world, setWorld] = React.useState<'band' | 'paper'>('band')
  const [searchOpen, setSearchOpen] = React.useState(false)

  return (
    <div
      data-pagefind-ignore
      className={cn(
        'min-h-screen bg-[hsl(var(--background))] font-sans text-[hsl(var(--foreground))]',
        world === 'paper' && 'light'
      )}
    >
      <div className="mx-auto w-full max-w-[64rem] px-6 py-12">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Instrument Grade — PR-B kit</Eyebrow>
            <h1 className="mt-2 text-[1.75rem] font-medium leading-tight text-[hsl(var(--text-1))]">
              Design preview
            </h1>
            <p className="mt-1 text-[0.8125rem] text-[hsl(var(--text-3))]">
              Dev gallery — not linked, noindexed, redirected in production.
            </p>
          </div>
          <WorldToggle world={world} onChange={setWorld} />
        </header>

        <Section label="Figure frame">
          <FigureProvider>
            <div className="grid gap-8 md:grid-cols-2">
              <FigureFrame
                title="Portal action center"
                revision="REV C"
                caption="FIG. 01 — Action queue at rest"
              >
                <div className="bg-grid-fade flex h-40 items-center justify-center">
                  <DimensionLine label="content-max 46.5rem" className="max-w-64" />
                </div>
              </FigureFrame>
              <FigureFrame
                title="No corner ticks"
                cornerTicks={false}
                caption="FIG. 02 — Plain hairline frame"
              >
                <div className="flex h-40 items-center justify-center">
                  <Eyebrow>Schematic area</Eyebrow>
                </div>
              </FigureFrame>
            </div>
          </FigureProvider>
        </Section>

        <Section label="Dimension line">
          <div className="flex flex-col gap-6">
            <DimensionLine label="sidebar 244px" />
            <DimensionLine label="topbar 48px" />
          </div>
        </Section>

        <Section label="Ref code">
          <div className="flex items-center gap-6">
            <RefCode kind="plt" id={14} />
            <RefCode kind="svc" id={3} />
            <RefCode kind="rel" id={42} href="#refcode-link" />
            <span className="text-[12px] text-[hsl(var(--text-3))]">
              (third is a link — hover it)
            </span>
          </div>
        </Section>

        <Section label="Status glyph">
          <div className="flex flex-wrap items-center gap-6">
            {GLYPH_STATES.map((status) => (
              <StatusGlyph key={status} status={status} label={status} />
            ))}
          </div>
        </Section>

        <Section label="Eyebrow">
          <div className="flex items-center gap-8">
            <Eyebrow>Section label</Eyebrow>
            <Eyebrow withPort>Active section</Eyebrow>
          </div>
        </Section>

        <Section label="Ledger table">
          <LedgerTable
            columns={LEDGER_COLUMNS}
            rows={LEDGER_ROWS}
            totals={LEDGER_TOTALS}
            caption="LEDGER 07 — Monthly execution receipts"
          />
        </Section>

        <Section label="Stat numeral">
          <div className="flex flex-wrap items-end gap-12">
            <StatNumeral label="Actions shipped" value={1284} />
            <StatNumeral
              label="Hours returned"
              value={312}
              signal
              delta={{ value: '18% vs last month', direction: 'up' }}
            />
            <StatNumeral
              label="Roi multiple"
              value={5}
              size="xl"
              delta={{ value: 'holding', direction: 'flat' }}
            />
          </div>
        </Section>

        <Section label="Theme toggle">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-[12px] text-[hsl(var(--text-3))]">
              28px control — drives the global next-themes class (the world
              toggle above is a local preview scope)
            </span>
          </div>
        </Section>

        <Section label="Search dialog">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-8 items-center gap-2 rounded-[2px] border border-border px-3 text-[0.8125rem] text-[hsl(var(--text-2))] transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none"
            >
              Search
              <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] border border-border px-1 font-mono text-[11px]">
                ⌘K
              </kbd>
            </button>
            <span className="text-[12px] text-[hsl(var(--text-3))]">
              ⌘K / ctrl-K / “/” also open it — results need the built index
              (dev shows the empty state)
            </span>
          </div>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Section>

        <Section label="Footer">
          <div className="hairline-frame">
            <Footer />
          </div>
        </Section>
      </div>
    </div>
  )
}

export { GalleryClient }
