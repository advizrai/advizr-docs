'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Count from 0 to `target` once `start` becomes true (ease-out cubic, rAF).
 * Reduced-motion users see the final value immediately.
 * Extracted from RoiCalculator's useAnimatedNumber for reuse in Stat.
 */
export function useCountUp(target: number, start: boolean, duration = 900): number {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!start || doneRef.current) return
    doneRef.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target)
      return
    }

    const startTime = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(target * eased * 10) / 10)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [start, target, duration])

  return display
}
