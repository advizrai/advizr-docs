import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Table — ledger treatment (adoption-map §4.3): mono uppercase 11px header
 * row over a hairline, 1px hairline row dividers only (no vertical rules,
 * no zebra), 13px cells in --text-2, numeric-friendly. Every table ships
 * inside an overflow-x container so the page body never scrolls
 * horizontally (§6.4).
 */

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="my-6 overflow-x-auto">
      <table
        className={cn('w-full border-collapse text-left', className)}
        {...props}
      />
    </div>
  )
}

function Th({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'hairline-b px-3 py-2 text-left font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-[hsl(var(--text-3))]',
        className
      )}
      {...props}
    />
  )
}

function Td({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn('px-3 py-2.5 align-top text-[13px] text-[hsl(var(--text-2))]', className)}
      {...props}
    />
  )
}

function Tr({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'hairline-b transition-[background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary)/0.5)] motion-reduce:transition-none',
        className
      )}
      {...props}
    />
  )
}

export { Table, Th, Td, Tr }
