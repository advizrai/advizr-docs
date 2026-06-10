'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Animated reading-position thumb overlaid on Nextra's TOC.
 * Pure overlay — never restructures the theme's DOM (Nextra TOC internals
 * are off-limits per the override strategy). Tinted by --section-accent.
 */
export function TocThumb() {
  const pathname = usePathname()
  const thumbRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const toc = document.querySelector<HTMLElement>('.nextra-toc')
    if (!toc) return

    const list = toc.querySelector('ul')
    if (!list) return

    // Host the absolutely-positioned thumb
    const host = list.parentElement ?? toc
    host.style.position = 'relative'

    const thumb = document.createElement('div')
    thumb.setAttribute('data-toc-thumb', '')
    host.appendChild(thumb)
    thumbRef.current = thumb as HTMLDivElement

    const update = () => {
      const active = toc.querySelectorAll<HTMLElement>('a[aria-current="true"], li.active > a')
      if (active.length === 0) {
        thumb.style.opacity = '0'
        return
      }
      const hostRect = host.getBoundingClientRect()
      const first = active[0].getBoundingClientRect()
      const last = active[active.length - 1].getBoundingClientRect()
      thumb.style.opacity = '1'
      thumb.style.top = `${first.top - hostRect.top}px`
      thumb.style.height = `${last.bottom - first.top}px`
    }

    update()
    const mo = new MutationObserver(update)
    mo.observe(toc, { subtree: true, attributes: true, attributeFilter: ['aria-current', 'class'] })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      mo.disconnect()
      window.removeEventListener('resize', update)
      thumb.remove()
    }
  }, [pathname])

  return null
}
