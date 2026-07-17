import { Children } from 'react'
import clsx from 'clsx'

interface StepProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface StepsProps {
  children: React.ReactNode
  className?: string
}

/**
 * Steps — vertical stepper (PR-D): mono numerals in 1px hairline squares on
 * a 1px hairline spine. CSS counters number the steps; the square carries a
 * background fill so it masks the spine behind it.
 */
export function Step({ title, children, className }: StepProps) {
  return (
    <div
      className={clsx(
        'relative pb-8 [counter-increment:step] last:pb-0',
        'before:absolute before:-left-12 before:top-0 before:flex before:size-8 before:items-center before:justify-center before:border before:border-border before:bg-[hsl(var(--card))] before:font-mono before:text-[0.8125rem] before:tabular-nums before:text-[hsl(var(--text-2))] before:content-[counter(step)]',
        className
      )}
    >
      <div className="text-[0.9375rem] font-medium leading-8 text-[hsl(var(--text-1))]">
        {title}
      </div>
      <div className="mt-1.5 text-[0.875rem] leading-relaxed text-[hsl(var(--text-2))] [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Steps({ children, className }: StepsProps) {
  return (
    <div
      className={clsx(
        'relative my-8 pl-12 [counter-reset:step]',
        // hairline spine, centered under the 32px number squares
        'before:absolute before:bottom-0 before:left-4 before:top-0 before:w-px before:bg-border before:content-[""]',
        className
      )}
    >
      {Children.toArray(children)}
    </div>
  )
}
