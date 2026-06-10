'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './CopyPageMenu.module.css'

/**
 * AI page actions: copy the page as Markdown, view the raw .md, or open it
 * in Claude/ChatGPT. The .md endpoints are generated postbuild by
 * scripts/generate-llms.mjs. 2026 docs baseline — a prospect pasting our
 * pages into their assistant is a sales-positive event.
 */
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
    <div className={styles.root} ref={rootRef}>
      <button type="button" className={styles.main} onClick={copyMarkdown}>
        {copied ? 'Copied' : 'Copy page'}
      </button>
      <button
        type="button"
        className={styles.chevron}
        aria-label="More page actions"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div role="menu" className={styles.menu}>
          <button role="menuitem" type="button" className={styles.item} onClick={copyMarkdown}>
            Copy as Markdown
          </button>
          <a role="menuitem" className={styles.item} href={mdPath} target="_blank" rel="noopener noreferrer">
            View as Markdown
          </a>
          <a
            role="menuitem"
            className={styles.item}
            href={`https://claude.ai/new?q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Claude
          </a>
          <a
            role="menuitem"
            className={styles.item}
            href={`https://chatgpt.com/?q=${prompt}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in ChatGPT
          </a>
        </div>
      )}
    </div>
  )
}
