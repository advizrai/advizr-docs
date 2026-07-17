'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * BackToTop — shell variant of components/BackToTop.tsx.
 *
 * 28px square control (hairline border, 2px radius, no shadow) pinned
 * bottom-right; appears after 400px of scroll, fades 150ms out per the
 * motion canon. Respects reduced motion for the scroll itself.
 */
function BackToTop() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      data-slot="docs-back-to-top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed bottom-6 right-6 z-40 inline-flex h-7 w-7 items-center justify-center rounded-[2px] border border-border bg-[hsl(var(--background))] text-[hsl(var(--text-3))]',
        'transition-opacity duration-150 ease-out motion-reduce:transition-none',
        'hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))]',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 12V4" />
        <path d="M4 8l4-4 4 4" />
      </svg>
    </button>
  )
}

export { BackToTop }
