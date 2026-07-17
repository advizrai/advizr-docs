'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Site-wide motion orchestrator (mounted once in the root layout):
 * reveals [data-reveal] elements via one shared IntersectionObserver
 * (CSS in styles/compat.css — 350ms ease-out, 50ms stagger).
 *
 * Reduced-motion users get everything visible immediately and no observer.
 * Without JS, CSS keeps [data-reveal] content visible (no hidden state is
 * applied unless scripting is enabled).
 *
 * The nextra-theme-docs patches that used to live here (headlessui
 * theme-switcher labelling, navbar data-scrolled) died with the old chrome
 * in PR-D.
 */
export function MotionEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll('[data-reveal]'))

    if (reduced) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    targets.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [pathname])

  return null
}
