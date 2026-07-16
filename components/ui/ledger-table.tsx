import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * LedgerTable — Instrument Grade composition preset.
 * Ported from advizr-client-template components/ui/ledger-table.tsx; the
 * template's ui/table primitives it composed are inlined here as private
 * elements (the docs repo has no shadcn table).
 *
 * Doctrine: strong 1px foreground open rule under the header, hairline body
 * rows (no vertical rules, no zebra), double-rule totals (the accountant's
 * close), mono uppercase 11px headers, tabular mono numerals on data
 * columns, 40px rows, --text-2 cells. Hover = surface step, instant-in /
 * 150ms-out. No sorting, no pagination — a static ledger. Always wrapped in
 * an overflow-x-auto container (responsive constitution §6.4).
 */

interface LedgerColumn {
  key: string
  header: string
  align?: "left" | "right"
  mono?: boolean
}

interface LedgerTableProps {
  columns: LedgerColumn[]
  rows: Array<Record<string, React.ReactNode>>
  totals?: Record<string, React.ReactNode>
  caption?: string
  className?: string
}

function LedgerTable({
  columns,
  rows,
  totals,
  caption,
  className,
}: LedgerTableProps) {
  return (
    // tabIndex makes the horizontally-scrollable region reachable by keyboard
    // (WCAG 2.1.1 — axe scrollable-region-focusable).
    <div
      data-slot="ledger-table-container"
      className="relative w-full overflow-x-auto"
      tabIndex={0}
    >
      <table
        data-slot="ledger-table"
        className={cn("w-full caption-bottom text-sm", className)}
      >
        {caption && (
          <caption className="mt-4 text-left font-mono text-[11px] text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead
          // Ledger strong open rule — 1px solid foreground under the header row.
          className="[&_tr]:border-b [&_tr]:border-foreground"
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "h-10 px-2 text-left align-middle whitespace-nowrap font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-muted-foreground",
                  column.align === "right" && "text-right"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[hsl(var(--text-2))] [&_tr:last-child]:border-0">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="h-10 border-b border-border transition-[background-color] duration-150 ease-out hover:duration-0 hover:bg-muted/60 motion-reduce:transition-none"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-2 py-2.5 align-middle whitespace-nowrap text-[0.8125rem]",
                    column.align === "right" && "text-right",
                    column.mono && "font-mono font-tabular"
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot
            // Ledger double-rule close.
            className="border-t-[3px] border-double border-foreground bg-transparent font-medium"
          >
            <tr className="h-10">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-2 py-2.5 align-middle whitespace-nowrap text-[0.8125rem]",
                    column.align === "right" && "text-right",
                    column.mono && "font-mono font-tabular"
                  )}
                >
                  {totals[column.key]}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

export { LedgerTable }
export type { LedgerColumn, LedgerTableProps }
