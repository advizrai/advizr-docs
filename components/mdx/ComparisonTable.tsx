import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table'
import { cn } from '@/lib/cn'
import { BooleanGlyph } from './BooleanGlyph'

interface ComparisonRow {
  feature: string
  values: (boolean | string)[]
}

interface ComparisonTableProps {
  columns: string[]
  rows: ComparisonRow[]
  className?: string
}

/**
 * ComparisonTable — a straight LedgerTable composition (PR-E): mono
 * uppercase headers over the strong open rule, hairline rows, boolean cells
 * as square glyphs (filled = yes, hairline outline = no), double-rule close.
 * Keeps the columns/rows MDX API unchanged.
 */
export function ComparisonTable({ columns, rows, className }: ComparisonTableProps) {
  const ledgerColumns: LedgerColumn[] = columns.map((header, i) => ({
    key: `c${i}`,
    header,
  }))

  const ledgerRows = rows.map((row) =>
    Object.fromEntries([
      ['c0', row.feature],
      ...row.values.map((value, i) => [
        `c${i + 1}`,
        typeof value === 'boolean' ? <BooleanGlyph value={value} /> : value,
      ]),
    ])
  )

  return (
    <div className={cn('my-8', className)}>
      <LedgerTable
        columns={ledgerColumns}
        rows={ledgerRows}
        // Ledger double-rule close — LedgerTable only draws it under totals,
        // so a totals-less comparison closes on the table edge instead.
        className="border-b-[3px] border-double border-foreground"
      />
    </div>
  )
}
