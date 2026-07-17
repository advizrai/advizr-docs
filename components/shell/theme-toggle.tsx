'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/cn'

/**
 * ThemeToggle — 28px square world switch (band ↔ paper).
 *
 * Instrument Grade control: hairline border, 2px radius (control class),
 * 16px lucide glyph, hover = surface step instant-in / 150ms-out. No view
 * transitions, no sweep theatre — the world just swaps. Rendered content is
 * gated behind a mounted flag (next-themes resolves the theme client-side
 * only), with suppressHydrationWarning on the button.
 */
function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={
        mounted
          ? isDark
            ? 'Switch to light theme'
            : 'Switch to dark theme'
          : 'Toggle theme'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-border bg-transparent text-[hsl(var(--text-3))]',
        'transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none',
        className
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun size={16} aria-hidden="true" />
        ) : (
          <Moon size={16} aria-hidden="true" />
        )
      ) : (
        // Pre-mount placeholder keeps the 16px footprint without guessing
        // the world (avoids a hydration-mismatched glyph).
        <span aria-hidden="true" className="size-4" />
      )}
    </button>
  )
}

export { ThemeToggle }
