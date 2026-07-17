import { Children } from 'react'
import clsx from 'clsx'

interface CardGridProps {
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  /** Staggered scroll-reveal of grid children (marketing surfaces only) */
  reveal?: boolean
  children: React.ReactNode
  className?: string
}

const colsMap: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 md:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

const gapMap: Record<string, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

export function CardGrid({
  columns = 3,
  gap = 'md',
  reveal = false,
  children,
  className,
}: CardGridProps) {
  const content = reveal
    ? Children.map(children, (child, i) => (
        <div data-reveal="" style={{ display: 'grid', '--reveal-i': i } as React.CSSProperties}>
          {child}
        </div>
      ))
    : children

  return (
    <div className={clsx('grid grid-cols-1', colsMap[columns], gapMap[gap], className)}>
      {content}
    </div>
  )
}
