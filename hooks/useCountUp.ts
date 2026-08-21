'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Count from 0 to `target` once `start` becomes true (ease-out cubic, rAF).
 * If `target` changes after the first run (live controls
 * sliders driving StatNumeral), the value re-animates from its current
 * reading to the new target over a short 400ms glide instead of restarting
 * from 0. Reduced-motion users always see the final value immediately.
 */
export function useCountUp(target: number, start: boolean, duration = 900): number {
  const [display, setDisplay] = useState(0)
  const displayRef = useRef(0)
  const startedRef = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!start) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startedRef.current = true
      displayRef.current = target
      setDisplay(target)
      return
    }

    const firstRun = !startedRef.current
    startedRef.current = true
    const from = firstRun ? 0 : displayRef.current
    const runDuration = firstRun ? duration : Math.min(duration, 400)
    if (from === target) return

    const startTime = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / runDuration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round((from + (target - from) * eased) * 10) / 10
      displayRef.current = value
      setDisplay(value)
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [start, target, duration])

  return display
}
