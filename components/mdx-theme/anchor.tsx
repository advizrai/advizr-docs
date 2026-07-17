'use client'

import * as React from 'react'
import Link from 'next/link'

import { useDocsOptional } from '@/components/shell/docs-provider'
import { cn } from '@/lib/cn'

/**
 * Anchor — prose links (adoption-map §3.2: links are --text-1 ink).
 *
 * 1px underline at 30% opacity resting → 100% on hover (instant-in /
 * 150ms-out). External links open in a new tab with a 10px ↗ glyph.
 * Inside the shell, canonical /docs hrefs are remapped through hrefFor so
 * content links stay inside the current mount (the preview route);
 * without a provider the href passes through untouched.
 */

const anchorClass = cn(
  'text-[hsl(var(--text-1))] underline decoration-[hsl(var(--text-1)/0.3)] decoration-1 underline-offset-[3px]',
  'transition-[text-decoration-color] duration-150 ease-out hover:duration-0 hover:decoration-[hsl(var(--text-1))] motion-reduce:transition-none'
)

function ExternalGlyph() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="ml-0.5 inline-block size-2.5 align-baseline"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3.5 3.5h5v5" />
      <path d="M8.5 3.5L3 9" />
    </svg>
  )
}

function Anchor({ href = '', className, children, ...props }: React.ComponentProps<'a'>) {
  const docs = useDocsOptional()
  const external = /^https?:\/\//.test(href)

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(anchorClass, className)}
        {...props}
      >
        {children}
        <ExternalGlyph />
      </a>
    )
  }

  const mapped =
    docs && href.startsWith(docs.docsBase) ? docs.hrefFor(href) : href

  // Hash-only anchors and other non-route hrefs stay plain <a>.
  if (!mapped.startsWith('/')) {
    return (
      <a href={mapped} className={cn(anchorClass, className)} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={mapped} className={cn(anchorClass, className)} {...props}>
      {children}
    </Link>
  )
}

export { Anchor }
