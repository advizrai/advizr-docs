'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

/**
 * AI page actions: copy the page as Markdown, view the raw .md, or open it
 * in Claude/ChatGPT. The .md endpoints are generated postbuild by
 * scripts/generate-llms.mjs. 2026 docs baseline — a prospect pasting our
 * pages into their assistant is a sales-positive event.
 *
 * PR-E reskin: mono-label split button on 28px square controls (2px outer
 * radius only), popover menu on a hairline surface with the one sanctioned
 * floating-layer shadow — the blur and soft radii died with the module CSS.
 */

const controlClass = cn(
  'cursor-pointer border border-border bg-[hsl(var(--card))] font-mono text-[11px] tracking-[0.02em] text-[hsl(var(--text-2))]',
  'transition-[color,background-color,border-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
  'focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
)

export function CopyPageMenu() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!pathname?.startsWith('/docs')) return null

  const mdPath = pathname === '/docs' ? '/docs/index.md' : `${pathname}.md`
  const mdUrl = `https://docs.advizr.ca${mdPath}`
  const prompt = encodeURIComponent(`Read ${mdUrl} and answer questions about it.`)

  const copyMarkdown = async () => {
    try {
      const res = await fetch(mdPath)
      const text = await res.text()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* endpoint unavailable in dev before postbuild — fail quietly */
    }
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      // z-2: above positioned siblings (the homepage Hero band is
      // position:relative and would otherwise paint over this float).
      className="relative z-2 my-2 ml-4 float-right inline-flex items-stretch"
    >
      <button
        type="button"
        onClick={copyMarkdown}
        className={cn(controlClass, 'h-7 rounded-l-[2px] border-r-0 px-2.5')}
      >
        {copied ? 'Copied' : 'Copy page'}
      </button>
      <button
        type="button"
        aria-label="More page actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(controlClass, 'inline-flex h-7 w-6 items-center justify-center rounded-r-[2px]')}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+4px)] z-30 flex min-w-[200px] flex-col border border-border bg-[hsl(var(--popover))] p-1 [box-shadow:var(--shadow-dropdown)]"
        >
          {[
            { key: 'copy', label: 'Copy as Markdown', onClick: copyMarkdown },
            { key: 'view', label: 'View as Markdown', href: mdPath },
            { key: 'claude', label: 'Open in Claude', href: `https://claude.ai/new?q=${prompt}` },
            { key: 'chatgpt', label: 'Open in ChatGPT', href: `https://chatgpt.com/?q=${prompt}` },
          ].map((item) => {
            const itemClass = cn(
              'block cursor-pointer border-0 bg-transparent px-3 py-2 text-left text-[0.8125rem] text-[hsl(var(--text-2))] no-underline',
              'transition-[color,background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
            )
            return item.href ? (
              <a
                key={item.key}
                role="menuitem"
                className={itemClass}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.key}
                role="menuitem"
                type="button"
                className={itemClass}
                onClick={item.onClick}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
