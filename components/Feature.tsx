import clsx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icon } from './Icon'

interface FeatureProps {
  /** Registry icon name (see icon-registry.ts) or a custom node. Emoji are banned. */
  icon: string | ReactNode
  title: string
  description: string
  href?: string
  className?: string
}

/**
 * Feature — icon-led row (PR-D): 1px hairline square icon, weight-based
 * hierarchy, hover is a surface lighten (linked rows only).
 */
export function Feature({ icon, title, description, href, className }: FeatureProps) {
  const content = (
    <>
      <span
        className="flex size-10 shrink-0 items-center justify-center border border-border text-[hsl(var(--text-2))]"
        aria-hidden="true"
      >
        {typeof icon === 'string' ? <Icon name={icon} size={16} /> : icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="m-0 text-[0.9375rem] font-medium leading-snug text-[hsl(var(--text-1))]">
          {title}
        </h3>
        <p className="m-0 mt-1 text-[0.8125rem] leading-relaxed text-[hsl(var(--text-3))]">
          {description}
        </p>
      </div>
    </>
  )

  const cls = clsx(
    'flex items-start gap-4 p-4 text-inherit no-underline max-[480px]:flex-col max-[480px]:gap-2',
    href &&
      'transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:duration-0 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
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
