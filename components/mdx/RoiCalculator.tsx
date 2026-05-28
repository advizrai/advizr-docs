'use client'

import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import styles from './RoiCalculator.module.css'
import { BookCallButton } from './BookCallButton'

/* ------------------------------------------------------------------ */
/*  Animated number hook                                               */
/* ------------------------------------------------------------------ */

function useAnimatedNumber(target: number, duration = 400): number {
  const [display, setDisplay] = useState(target)
  const rafRef = useRef<number>(0)
  const startRef = useRef({ value: target, time: 0 })

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target)
      return
    }

    const start = display
    const startTime = performance.now()
    startRef.current = { value: start, time: startTime }

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (target - start) * eased)
      setDisplay(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return display
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function sliderPercent(value: number, min: number, max: number): string {
  return `${((value - min) / (max - min)) * 100}%`
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ADVIZR_INVESTMENT = 15000

interface RoiCalculatorProps {
  className?: string
}

export function RoiCalculator({ className }: RoiCalculatorProps) {
  const [hours, setHours] = useState(20)
  const [rate, setRate] = useState(75)
  const [employees, setEmployees] = useState(5)

  const monthlyCost = hours * rate * employees * 4.33
  const monthlySavings = monthlyCost * 0.7
  const annualRoi = monthlySavings * 12
  const paybackMonths = monthlySavings > 0 ? ADVIZR_INVESTMENT / monthlySavings : Infinity

  const animMonthlyCost = useAnimatedNumber(Math.round(monthlyCost))
  const animMonthlySavings = useAnimatedNumber(Math.round(monthlySavings))
  const animAnnualRoi = useAnimatedNumber(Math.round(annualRoi))

  const paybackText =
    paybackMonths < 1
      ? '< 1 month'
      : paybackMonths === Infinity
        ? '-'
        : `${paybackMonths.toFixed(1)} months`

  return (
    <div className={clsx(styles.calculator, className)}>
      <div className={styles.inputs}>
        <div className={styles.sliderGroup}>
          <label className={styles.label} htmlFor="roi-hours">
            Hours spent on manual tasks per week
          </label>
          <div className={styles.sliderRow}>
            <input
              id="roi-hours"
              type="range"
              className={styles.slider}
              min={1}
              max={100}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--advizr-blue-500) ${sliderPercent(hours, 1, 100)}, var(--advizr-slate-200) ${sliderPercent(hours, 1, 100)})`,
              }}
            />
            <span className={styles.sliderValue}>{hours}</span>
          </div>
        </div>

        <div className={styles.sliderGroup}>
          <label className={styles.label} htmlFor="roi-rate">
            Average hourly cost
          </label>
          <div className={styles.sliderRow}>
            <input
              id="roi-rate"
              type="range"
              className={styles.slider}
              min={10}
              max={500}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--advizr-blue-500) ${sliderPercent(rate, 10, 500)}, var(--advizr-slate-200) ${sliderPercent(rate, 10, 500)})`,
              }}
            />
            <span className={styles.sliderValue}>${rate}</span>
          </div>
        </div>

        <div className={styles.sliderGroup}>
          <label className={styles.label} htmlFor="roi-employees">
            Number of employees affected
          </label>
          <div className={styles.sliderRow}>
            <input
              id="roi-employees"
              type="range"
              className={styles.slider}
              min={1}
              max={50}
              step={1}
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, var(--advizr-blue-500) ${sliderPercent(employees, 1, 50)}, var(--advizr-slate-200) ${sliderPercent(employees, 1, 50)})`,
              }}
            />
            <span className={styles.sliderValue}>{employees}</span>
          </div>
        </div>
      </div>

      <div className={styles.outputs}>
        <div className={styles.outputCard}>
          <span className={styles.outputLabel}>Monthly cost of manual work</span>
          <span className={styles.outputNumber}>{formatCurrency(animMonthlyCost)}</span>
        </div>
        <div className={styles.outputCard}>
          <span className={styles.outputLabel}>Projected monthly savings</span>
          <span className={clsx(styles.outputNumber, styles.savingsNumber)}>{formatCurrency(animMonthlySavings)}</span>
        </div>
        <div className={styles.outputCard}>
          <span className={styles.outputLabel}>Annual ROI</span>
          <span className={clsx(styles.outputNumber, styles.savingsNumber)}>{formatCurrency(animAnnualRoi)}</span>
        </div>
        <div className={styles.outputCard}>
          <span className={styles.outputLabel}>Payback period</span>
          <span className={styles.outputNumber}>{paybackText}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <BookCallButton text="Book a Call to Learn More" />
        <p className={styles.disclaimer}>
          Estimates based on industry averages. Actual results vary by engagement.
        </p>
      </div>
    </div>
  )
}
