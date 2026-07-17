'use client'

import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * CopyCodeButton — 24px control in the fenced-code header row.
 *
 * Reads the sibling <pre><code> textContent on click (same containment walk
 * as nextra's CopyToClipboard, which resolves relative to the button's
 * frame). Check glyph holds ~2s. The existing components/mdx/CopyButton
 * requires the text as a prop, which the compiled MDX pre doesn't have at
 * render time — hence this minimal variant.
 */
function CopyCodeButton({ className }: { className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const frame = event.currentTarget.closest('[data-docs-pre]')
    const text = frame?.querySelector('pre')?.textContent ?? ''
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : 'Copy code'}
      onClick={handleClick}
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border border-[hsl(var(--border))] text-[hsl(var(--text-3))]',
        'transition-[color,background-color] duration-150 ease-out hover:duration-0 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] motion-reduce:transition-none',
        className
      )}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3.5 3.5 6.5-7" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" />
          <path d="M3 10.5V3a.5.5 0 0 1 .5-.5H11" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

export { CopyCodeButton }
