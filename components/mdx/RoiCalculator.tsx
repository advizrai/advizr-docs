'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { StatNumeral } from '@/components/ui/stat-numeral'
import { BookCallButton } from './BookCallButton'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sliderPercent(value: number, min: number, max: number): string {
  return `${((value - min) / (max - min)) * 100}%`
}

const CURRENCY: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}

/* ------------------------------------------------------------------ */
/*  Controls — 28px rows, 2px-radius thumb, signal fill on the track   */
/* ------------------------------------------------------------------ */

const sliderClass = cn(
  'h-7 w-full min-w-0 cursor-pointer appearance-none bg-transparent',
  // WebKit: 2px hairline track carrying the signal fill (--fill custom prop),
  // 14px square thumb offset to sit centered on the thin track.
  '[&::-webkit-slider-runnable-track]:h-[2px]',
  '[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,hsl(var(--signal))_var(--fill),hsl(var(--border))_var(--fill))]',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5',
  '[&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:rounded-[2px]',
  '[&::-webkit-slider-thumb]:bg-[hsl(var(--foreground))]',
  // Firefox
  '[&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-[hsl(var(--border))]',
  '[&::-moz-range-progress]:h-[2px] [&::-moz-range-progress]:bg-[hsl(var(--signal))]',
  '[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-[2px]',
  '[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[hsl(var(--foreground))]'
)

interface SliderGroupProps {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  display: string
  onChange: (value: number) => void
}

function SliderGroup({ id, label, min, max, step, value, display, onChange }: SliderGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.8125rem] text-[hsl(var(--text-2))]">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          id={id}
          type="range"
          className={sliderClass}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ '--fill': sliderPercent(value, min, max) } as React.CSSProperties}
        />
        <span className="flex h-7 min-w-14 items-center justify-center border border-border px-2 font-mono font-tabular text-[0.8125rem] text-[hsl(var(--text-1))]">
          {display}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const ADVIZR_INVESTMENT = 15000

interface RoiCalculatorProps {
  className?: string
}

/**
 * RoiCalculator — instrument reskin (PR-E): hairline-framed console, 28px
 * controls with 2px-radius thumbs, outputs as StatNumeral cells on a
 * hairline-divided ledger grid. Annual ROI is the ONE signal stat. The
 * estimating logic is unchanged.
 */
export function RoiCalculator({ className }: RoiCalculatorProps) {
  const [hours, setHours] = useState(20)
  const [rate, setRate] = useState(75)
  const [employees, setEmployees] = useState(5)

  const monthlyCost = hours * rate * employees * 4.33
  const monthlySavings = monthlyCost * 0.7
  const annualRoi = monthlySavings * 12
  const paybackMonths = monthlySavings > 0 ? ADVIZR_INVESTMENT / monthlySavings : Infinity

  const paybackText =
    paybackMonths < 1
      ? '< 1 mo'
      : paybackMonths === Infinity
        ? '—'
        : `${paybackMonths.toFixed(1)} mo`

  return (
    <div className={cn('my-8 border border-border bg-[hsl(var(--card))]', className)}>
      <div className="flex flex-col gap-6 p-5 md:p-6">
        <SliderGroup
          id="roi-hours"
          label="Hours spent on manual tasks per week"
          min={1}
          max={100}
          step={1}
          value={hours}
          display={String(hours)}
          onChange={setHours}
        />
        <SliderGroup
          id="roi-rate"
          label="Average hourly cost"
          min={10}
          max={500}
          step={5}
          value={rate}
          display={`$${rate}`}
          onChange={setRate}
        />
        <SliderGroup
          id="roi-employees"
          label="Number of employees affected"
          min={1}
          max={50}
          step={1}
          value={employees}
          display={String(employees)}
          onChange={setEmployees}
        />
      </div>

      {/* --text-kpi caps the StatNumeral size so six-figure currency fits a
          quarter-width cell (screenshot pass caught $272,790 clipping). */}
      <div className="grid grid-cols-2 gap-px border-y border-border bg-[hsl(var(--border))] lg:grid-cols-4 [--text-kpi:clamp(1.25rem,1rem+0.75vw,1.5rem)]">
        <StatNumeral
          className="bg-[hsl(var(--card))] p-4"
          label="Monthly cost of manual work"
          value={Math.round(monthlyCost)}
          format={CURRENCY}
        />
        <StatNumeral
          className="bg-[hsl(var(--card))] p-4"
          label="Projected monthly savings"
          value={Math.round(monthlySavings)}
          format={CURRENCY}
        />
        <StatNumeral
          className="bg-[hsl(var(--card))] p-4"
          label="Annual ROI"
          value={Math.round(annualRoi)}
          format={CURRENCY}
          signal
        />
        <div className="flex flex-col gap-1 bg-[hsl(var(--card))] p-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Payback period
          </span>
          <span className="font-mono font-tabular text-[length:var(--text-kpi,clamp(1.75rem,1.25rem+1.5vw,2.5rem))] font-medium leading-none text-foreground">
            {paybackText}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 p-5 md:p-6">
        <BookCallButton text="Book a Call to Learn More" />
        <p className="m-0 text-[0.75rem] text-[hsl(var(--text-3))]">
          Estimates based on industry averages. Actual results vary by engagement.
        </p>
      </div>
    </div>
  )
}
