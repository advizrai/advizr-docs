import clsx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon } from './Icon'

interface CardProps {
  title: string
  description?: string
  href?: string
  /** Registry icon name (see icon-registry.ts) or a custom node. Emoji are banned. */
  icon?: string | ReactNode
  image?: string
  variant?: 'default' | 'action' | 'outline' | 'ghost'
  arrow?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Card — hairline frame, 0 radius, weight-based hierarchy (PR-D). Hover is a
 * surface lighten (instant-in / 150ms-out) — no lift, no spotlight, no
 * shadow. Icons sit in a 1px hairline square tinted by --section-accent.
 */

const variantMap: Record<string, string> = {
  default: 'border border-border bg-[hsl(var(--card))]',
  action:
    'border border-border border-t-2 border-t-[hsl(var(--signal))] bg-[hsl(var(--card))]',
  outline: 'border border-border bg-transparent',
  ghost: 'border border-transparent bg-transparent',
}

export function Card({
  title,
  description,
  href,
  icon,
  image,
  variant = 'default',
  arrow = false,
  children,
  className,
}: CardProps) {
  const content = (
    <>
      {image && <img src={image} alt="" className="mb-4 h-40 w-full object-cover" />}
      {icon && (
        <span
          className="mb-4 flex size-9 items-center justify-center border border-border text-[color:var(--section-accent,hsl(var(--text-2)))]"
          aria-hidden="true"
        >
          {typeof icon === 'string' ? <Icon name={icon} size={16} /> : icon}
        </span>
      )}
      <h3 className="m-0 flex items-center gap-1.5 text-[0.9375rem] font-medium leading-snug text-[hsl(var(--text-1))]">
        {title}
        {arrow && (
          <span className="text-[0.8125rem] text-[hsl(var(--text-3))]" aria-hidden="true">
            &rarr;
          </span>
        )}
      </h3>
      {(description || children) && (
        <div className="mt-1.5 text-[0.8125rem] leading-relaxed text-[hsl(var(--text-3))]">
          {description}
          {children}
        </div>
      )}
    </>
  )

  const cls = clsx(
    'block p-5 text-inherit no-underline',
    'transition-[background-color] duration-150 ease-out motion-reduce:transition-none',
    variantMap[variant],
    href &&
      'hover:bg-[hsl(var(--secondary))] hover:duration-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
    className
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    )
  }

  return <div className={cls}>{content}</div>
}
