import { Children } from 'react'
import clsx from 'clsx'
import styles from './CardGrid.module.css'

interface CardGridProps {
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  /** Staggered scroll-reveal of grid children (marketing surfaces only) */
  reveal?: boolean
  children: React.ReactNode
  className?: string
}

const colsMap: Record<number, string> = {
  2: styles.cols2,
  3: styles.cols3,
  4: styles.cols4,
}

const gapMap: Record<string, string> = {
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg,
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
    <div className={clsx(styles.grid, colsMap[columns], gapMap[gap], className)}>
      {content}
    </div>
  )
}
