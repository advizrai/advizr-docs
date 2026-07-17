'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import clsx from 'clsx'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

/**
 * CopyButton — mono hairline chip (PR-D), aligned with the mdx-theme
 * copy-code-button grammar: 2px radius control, 10px mono uppercase,
 * success-colored confirmation (no tinted fill).
 */
export function CopyButton({
  text,
  label = 'Copy',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      type="button"
      className={clsx(
        'inline-flex h-6 cursor-pointer items-center gap-1.5 rounded-[2px] border border-border bg-transparent px-1.5 font-mono text-[10px] uppercase tracking-[0.08em]',
        'transition-[color,background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
        copied ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--text-3))]',
        className
      )}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
