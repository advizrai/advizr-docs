import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Headings — two-step ink hierarchy (adoption-map §3.2).
 *
 * All headings are --text-1; the body sits at --text-2. h1 1.75rem/600;
 * h2/h3 step down through the type scale at 500 (Geist has no fractional
 * weights — size, space and ink do the work). h2–h4 carry a hover-reveal
 * `#` anchor (ids are compiled in by nextra) and scroll-mt clears the
 * sticky topbar. Anchors stay visible on focus and on coarse pointers
 * (prose.css §media pointer:coarse — hover-reveal has no hover on touch).
 */

function AnchorLink({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this heading"
      data-heading-anchor
      // Keep the glyph out of the Pagefind index — it is text content and
      // would otherwise suffix every indexed heading with "#".
      data-pagefind-ignore
      className={cn(
        'ml-2 font-mono text-[0.75em] font-normal text-[hsl(var(--text-3))] no-underline',
        'opacity-0 transition-opacity duration-150 ease-out',
        'group-hover/heading:duration-0 group-hover/heading:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none'
      )}
    >
      #
    </a>
  )
}

const scrollMargin = 'scroll-mt-[calc(var(--topbar-height)+1.5rem)]'

type HeadingProps = React.ComponentProps<'h2'>

function makeAnchoredHeading(Tag: 'h2' | 'h3' | 'h4', tagClass: string) {
  function Heading({ children, id, className, ...props }: HeadingProps) {
    return (
      <Tag
        id={id}
        className={cn(
          'group/heading text-[hsl(var(--text-1))]',
          scrollMargin,
          tagClass,
          className
        )}
        {...props}
      >
        {children}
        {id && <AnchorLink id={id} />}
      </Tag>
    )
  }
  Heading.displayName = Tag.toUpperCase()
  return Heading
}

function H1({ children, className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn(
        'mb-4 text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-[hsl(var(--text-1))]',
        scrollMargin,
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

const H2 = makeAnchoredHeading(
  'h2',
  'mt-10 mb-3 text-[1.3125rem] font-medium leading-snug'
)
const H3 = makeAnchoredHeading(
  'h3',
  'mt-8 mb-2 text-[1.0625rem] font-medium leading-snug'
)
const H4 = makeAnchoredHeading('h4', 'mt-6 mb-2 text-[0.9375rem] font-medium')

function H5({ children, className, ...props }: HeadingProps) {
  return (
    <h5
      className={cn('mt-6 mb-2 text-[0.875rem] font-medium text-[hsl(var(--text-1))]', className)}
      {...props}
    >
      {children}
    </h5>
  )
}

function H6({ children, className, ...props }: HeadingProps) {
  return (
    <h6 className={cn('eyebrow mt-6 mb-2 block', className)} {...props}>
      {children}
    </h6>
  )
}

export { H1, H2, H3, H4, H5, H6 }
