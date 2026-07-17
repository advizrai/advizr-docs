import { Info, Lightbulb, OctagonAlert, PenLine, TriangleAlert } from 'lucide-react'
import clsx from 'clsx'

import { Callout as ThemeCallout } from '@/components/mdx-theme/callout'

type CalloutType = 'info' | 'warning' | 'danger' | 'tip' | 'note'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

/**
 * Callout — kit wrapper over the mdx-theme callout (PR-D): ONE neutral
 * card-surface variant; semantics are a 2px left rule + a 16px lucide glyph
 * in the semantic color — never a tinted background. The legacy `type` API
 * is kept so 60+ content usages render unchanged.
 */

const EDGE: Record<CalloutType, string> = {
  note: '',
  info: 'border-l-2 border-l-[hsl(var(--info))]',
  tip: 'border-l-2 border-l-[hsl(var(--success))]',
  warning: 'border-l-2 border-l-[hsl(var(--signal))]',
  danger: 'border-l-2 border-l-[hsl(var(--destructive))]',
}

const ICON_COLOR: Record<CalloutType, string> = {
  note: 'text-[hsl(var(--text-3))]',
  info: 'text-[hsl(var(--info))]',
  tip: 'text-[hsl(var(--success))]',
  warning: 'text-[hsl(var(--signal-text))]',
  danger: 'text-[hsl(var(--destructive))]',
}

const ICONS: Record<CalloutType, React.ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean }>> = {
  note: PenLine,
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  danger: OctagonAlert,
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  const Glyph = ICONS[type]
  return (
    <ThemeCallout
      variant="note"
      role="note"
      className={clsx(EDGE[type], className)}
    >
      <div className="flex gap-3">
        <Glyph
          size={16}
          aria-hidden
          className={clsx('mt-0.5 shrink-0', ICON_COLOR[type])}
        />
        <div className="min-w-0 flex-1 [&>p+p]:mt-2 [&>p]:my-0">
          {title && (
            <div className="mb-1 text-[0.8125rem] font-medium text-[hsl(var(--text-1))]">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </ThemeCallout>
  )
}
