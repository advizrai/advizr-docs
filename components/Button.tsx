'use client'

import clsx from 'clsx'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

/**
 * Button — Instrument Grade controls (PR-D). 2px radius, hairline grammar:
 * primary is the ONE signal fill (ink text for contrast in both worlds),
 * secondary a card-surface chip, ghost a hairline outline. Hover states are
 * instant-in / 150ms-out; no glow, no lift, no scale.
 */

const base =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[2px] font-medium leading-none no-underline ' +
  'transition-[background-color,border-color,color] duration-150 ease-out hover:duration-0 motion-reduce:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'

const variantMap: Record<string, string> = {
  primary:
    'border border-transparent bg-[hsl(var(--signal))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--signal-bright))]',
  secondary:
    'border border-border bg-[hsl(var(--card))] text-[hsl(var(--text-1))] hover:bg-[hsl(var(--secondary))]',
  ghost:
    'border border-border bg-transparent text-[hsl(var(--text-2))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))]',
}

const sizeMap: Record<string, string> = {
  sm: 'h-7 px-3 text-[0.75rem]',
  md: 'h-8 px-4 text-[0.8125rem]',
  lg: 'h-10 px-5 text-[0.875rem]',
}

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
}: ButtonProps) {
  const cls = clsx(base, variantMap[variant], sizeMap[size], className)

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
