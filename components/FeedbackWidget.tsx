'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './FeedbackWidget.module.css'

type Stage = 'vote' | 'reason' | 'done' | 'hidden'

const REASONS: Array<[key: string, label: string]> = [
  ['unclear', 'Hard to follow'],
  ['outdated', 'Out of date'],
  ['missing', 'Missing information'],
  ['inaccurate', 'Something is wrong'],
]

/**
 * "Was this page helpful?" — the only direct comprehension signal we get
 * from readers. One-tap; a down-vote asks for a one-tap reason. Hides
 * itself if the storage endpoint isn't configured (503).
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
    <aside className={styles.widget} aria-label="Page feedback">
      {stage === 'vote' && (
        <>
          <span className={styles.question}>Was this page helpful?</span>
          <div className={styles.buttons}>
            <button type="button" className={styles.btn} onClick={() => send('up')}>
              Yes
            </button>
            <button type="button" className={styles.btn} onClick={() => send('down')}>
              No
            </button>
          </div>
        </>
      )}
      {stage === 'reason' && (
        <>
          <span className={styles.question}>What was the problem?</span>
          <div className={styles.buttons}>
            {REASONS.map(([key, label]) => (
              <button key={key} type="button" className={styles.btn} onClick={() => send('down', key)}>
                {label}
              </button>
            ))}
          </div>
        </>
      )}
      {stage === 'done' && (
        <span className={styles.question} role="status">
          Thanks — your feedback improves these docs.
        </span>
      )}
    </aside>
  )
}
