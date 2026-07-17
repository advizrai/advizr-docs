import { cn } from '@/lib/cn'

interface DetailsProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Details — native <details> styled (PR-E, adoption-map §3.3.3: collapsibles
 * are native elements — keyboard and ARIA semantics for free). Hairline
 * frame, mono square summary marker (+ closed / − open), 150ms content fade
 * (keyframe in styles/prose.css). The title/defaultOpen API is unchanged;
 * no more client-side state — the platform owns the toggle.
 */
export function Details({ title, defaultOpen = false, children, className }: DetailsProps) {
  return (
    <details
      className={cn('group my-4 border border-border bg-[hsl(var(--card))]', className)}
      open={defaultOpen || undefined}
    >
      <summary
        className={cn(
          'flex min-h-10 cursor-pointer select-none list-none items-center gap-2.5 px-4 py-2 [&::-webkit-details-marker]:hidden',
          'transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:duration-0 motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center border border-border font-mono text-[11px] leading-none text-[hsl(var(--text-3))]"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
        <span className="text-[0.875rem] font-medium text-[hsl(var(--text-1))]">{title}</span>
      </summary>
      <div className="border-t border-border px-4 py-3 text-[0.875rem] group-open:animate-[docs-details-fade_150ms_ease-out]">
        {children}
      </div>
    </details>
  )
}
