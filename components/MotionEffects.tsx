'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Site-wide motion orchestrator (mounted once in the root layout):
 * - reveals [data-reveal] elements via one shared IntersectionObserver
 * - toggles data-scrolled on the navbar for the blur/border treatment
 *
 * Reduced-motion users get everything visible immediately and no observer.
 * Without JS, CSS keeps [data-reveal] content visible (no hidden state is
 * applied unless scripting is enabled — see globals.css).
 */
export function MotionEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = Array.from(document.querySelectorAll('[data-reveal]'))

    let io: IntersectionObserver | undefined
    if (reduced) {
      targets.forEach((el) => el.classList.add('is-visible'))
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io?.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      )
      targets.forEach((el) => io?.observe(el))
    }

    const header = document.querySelector('header')
    const onScroll = () => {
      if (header) header.toggleAttribute('data-scrolled', window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname])

  return null
}
