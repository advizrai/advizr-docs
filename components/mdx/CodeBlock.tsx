import { isValidElement } from 'react'
import clsx from 'clsx'

import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  title?: string
  description?: string
  language?: string
  filename?: string
  /** Explicit text for the copy button; falls back to text derived from children. */
  code?: string
  children: React.ReactNode
  className?: string
}

/** Recursively extract the plain-text content of a React node tree. */
function getNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (isValidElement(node)) {
    const { children } = node.props as { children?: React.ReactNode }
    return getNodeText(children)
  }
  return ''
}

/**
 * CodeBlock — aligned to the mdx-theme pre frame (PR-D): the same band-card
 * strip with a hairline header row (mono uppercase language + label + copy).
 * Fenced code inside already renders through mdx-theme Pre, so its inner
 * frame/header is collapsed here — one frame, one copy button.
 */
export function CodeBlock({
  title,
  description,
  language,
  filename,
  code,
  children,
  className,
}: CodeBlockProps) {
  const label = filename || title
  const codeText = code ?? getNodeText(children)

  return (
    <figure
      className={clsx(
        'my-6 border border-[hsl(var(--border))] bg-[hsl(var(--band-card))] text-[13px]',
        // Band-world re-scope (same recipe as mdx-theme pre.tsx).
        '[--border:var(--band-hairline)] [--secondary:40_12%_11%]',
        '[--text-1:40_71.8%_97.1%] [--text-2:40_8%_75.3%] [--text-3:40_3.8%_51.2%]',
        className
      )}
    >
      <figcaption className="flex h-8 items-center gap-2 border-b border-[hsl(var(--border))] px-3">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
          {language || 'code'}
        </span>
        {label && (
          <span className="truncate font-mono text-[10px] text-[hsl(var(--text-3))]">
            {label}
          </span>
        )}
        {description && (
          <span className="truncate text-[11px] text-[hsl(var(--text-3))]">
            {description}
          </span>
        )}
        <CopyButton text={codeText} className="ms-auto border-transparent" />
      </figcaption>
      <div
        className={clsx(
          // Collapse the inner mdx-theme Pre frame: no double border/header.
          '[&_[data-docs-pre]]:my-0 [&_[data-docs-pre]]:border-0 [&_[data-docs-pre]>figcaption]:hidden',
          '[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:leading-relaxed [&_pre]:text-[hsl(var(--text-2))]'
        )}
      >
        {children}
      </div>
    </figure>
  )
}
