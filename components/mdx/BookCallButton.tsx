'use client'

import { cn } from '@/lib/cn'

interface BookCallButtonProps {
  text?: string
  variant?: 'primary' | 'secondary'
  href?: string
  className?: string
}

/**
 * BookCallButton — signal CTA control (PR-E): the ONE signal fill, ink text
 * for contrast in both worlds, 2px radius, 32px control height. Secondary
 * is a hairline card chip. Hover instant-in / 150ms-out; no glow, no lift.
 */
const variantMap: Record<string, string> = {
  primary:
    'border border-transparent bg-[hsl(var(--signal))] text-[hsl(var(--ink))] hover:bg-[hsl(var(--signal-bright))]',
  secondary:
    'border border-border bg-[hsl(var(--card))] text-[hsl(var(--text-1))] hover:bg-[hsl(var(--secondary))]',
}

export function BookCallButton({
  text = 'Book a Call',
  variant = 'primary',
  href = 'https://cal.com/team/advizr/ai-strategy-call',
  className,
}: BookCallButtonProps) {
  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={cn(
        'inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-[2px] px-4 text-[0.8125rem] font-medium leading-none no-underline',
        'transition-[background-color,border-color,color] duration-150 ease-out hover:duration-0 motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
        variantMap[variant],
        className
      )}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {text}
      <span aria-hidden="true" className="font-mono text-[0.875em] leading-none">
        →
      </span>
    </a>
  )
}
