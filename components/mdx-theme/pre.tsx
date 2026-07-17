import * as React from 'react'

import { CopyCodeButton } from '@/components/mdx-theme/copy-code-button'
import { cn } from '@/lib/cn'

/**
 * Pre — the fenced-code frame (adoption-map §4.3 vocabulary on code).
 *
 * A band-card strip in BOTH worlds — dark product surfaces never float raw
 * on paper, so the frame re-scopes the full band ramp locally (§3.2.5:
 * cross-world ink leakage is a hard error) and prose.css pins shiki to the
 * dark palette inside it. Header row: mono 10px uppercase language +
 * optional filename + copy button. Hairline border, 0 radius, no shadow.
 *
 * Prop contract mirrors nextra's Pre (data-language / data-filename /
 * data-copy / data-word-wrap / icon), so existing fences render unchanged.
 */
interface PreProps extends React.ComponentProps<'pre'> {
  'data-language'?: string
  'data-filename'?: string
  'data-copy'?: ''
  'data-word-wrap'?: ''
  icon?: React.ReactNode
}

function Pre({
  children,
  className,
  'data-language': language,
  'data-filename': filename,
  'data-copy': _copy,
  'data-word-wrap': _wordWrap,
  icon: _icon,
  ...props
}: PreProps) {
  return (
    <figure
      data-docs-pre
      className={cn(
        'my-6 border border-[hsl(var(--border))] bg-[hsl(var(--band-card))] text-[13px]',
        // Local band re-scope: every token a child reads resolves to the
        // band world regardless of the page world.
        '[--border:var(--band-hairline)] [--secondary:40_12%_11%]',
        '[--text-1:40_71.8%_97.1%] [--text-2:40_8%_75.3%] [--text-3:40_3.8%_51.2%]'
      )}
    >
      <figcaption className="flex h-8 items-center gap-2 border-b border-[hsl(var(--border))] px-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
          {language || 'code'}
        </span>
        {filename && (
          <span className="truncate font-mono text-[10px] text-[hsl(var(--text-3))]">
            {filename}
          </span>
        )}
        <CopyCodeButton className="ms-auto" />
      </figcaption>
      <pre
        className={cn(
          'm-0 overflow-x-auto bg-transparent p-4 leading-relaxed text-[hsl(var(--text-2))]',
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </figure>
  )
}

export { Pre }
