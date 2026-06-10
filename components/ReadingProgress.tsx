'use client'

import { usePathname } from 'next/navigation'
import styles from './ReadingProgress.module.css'

/**
 * 2px scroll-progress bar for Academy lessons (long-form reading).
 * Driven entirely by CSS scroll-driven animation inside @supports —
 * browsers without animation-timeline simply never show it. No JS work.
 */
export function ReadingProgress() {
  const pathname = usePathname()
  const isLesson =
    pathname?.startsWith('/docs/academy/') && pathname !== '/docs/academy'

  if (!isLesson) return null
  return <div className={styles.bar} aria-hidden />
}
