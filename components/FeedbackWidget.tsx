'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/cn'

type Stage = 'vote' | 'reason' | 'done' | 'hidden'

const REASONS: Array<[key: string, label: string]> = [
  ['unclear', 'Hard to follow'],
  ['outdated', 'Out of date'],
  ['missing', 'Missing information'],
  ['inaccurate', 'Something is wrong'],
]

const glyphButtonClass = cn(
  'inline-flex size-7 cursor-pointer items-center justify-center rounded-[2px] border border-border bg-transparent text-[hsl(var(--text-2))]',
  'transition-[color,background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
)

/**
 * "Was this page helpful?" — the only direct comprehension signal we get
 * from readers. One-tap; a down-vote asks for a one-tap reason. Hides
 * itself if the storage endpoint isn't configured (503).
 *
 * PR-E reskin per adoption-map §4.6: mono eyebrow, two square glyph
 * controls (lucide 16px — emoji are banned) separated by Notion's drawn
 * vertical hairline divider, down-vote reason as a 28px select control.
 */
export function FeedbackWidget() {
  const pathname = usePathname()
  const [stage, setStage] = useState<Stage>('vote')

  useEffect(() => {
    setStage('vote')
  }, [pathname])

  if (!pathname?.startsWith('/docs') || stage === 'hidden') return null

  const send = async (vote: 'up' | 'down', reason = '') => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, vote, reason }),
      })
      if (res.status === 503) {
        setStage('hidden')
        return
      }
    } catch {
      /* network failure — don't block the reader */
    }
    setStage(vote === 'down' && !reason ? 'reason' : 'done')
  }

  return (
    <aside
      aria-label="Page feedback"
      className="mt-12 flex flex-wrap items-center gap-4 border border-border bg-[hsl(var(--card))] px-5 py-4"
    >
      {stage === 'vote' && (
        <>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
            Was this helpful
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Yes, this page was helpful"
              className={glyphButtonClass}
              onClick={() => send('up')}
            >
              <ThumbsUp size={16} strokeWidth={1.5} aria-hidden />
            </button>
            {/* Drawn vertical hairline divider between the two controls */}
            <span aria-hidden="true" className="h-4 w-px bg-[hsl(var(--border))]" />
            <button
              type="button"
              aria-label="No, this page was not helpful"
              className={glyphButtonClass}
              onClick={() => send('down')}
            >
              <ThumbsDown size={16} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
        </>
      )}
      {stage === 'reason' && (
        <>
          <label
            htmlFor="feedback-reason"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]"
          >
            What was the problem
          </label>
          <select
            id="feedback-reason"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) send('down', e.target.value)
            }}
            className={cn(
              'h-7 cursor-pointer rounded-[2px] border border-border bg-[hsl(var(--background))] px-2 text-[0.8125rem] text-[hsl(var(--text-2))]',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
            )}
          >
            <option value="" disabled>
              Choose a reason…
            </option>
            {REASONS.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </>
      )}
      {stage === 'done' && (
        <span className="text-[0.8125rem] text-[hsl(var(--text-2))]" role="status">
          Thanks — your feedback improves these docs.
        </span>
      )}
    </aside>
  )
}
