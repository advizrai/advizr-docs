'use client'

import clsx from 'clsx'
import styles from './Changelog.module.css'
import changelogData from '../../public/changelog.json'

interface ChangelogEntry {
  date: string
  version?: string
  title: string
  description: string
  category: 'feature' | 'improvement' | 'fix' | 'breaking'
}

const categoryLabels: Record<string, string> = {
  feature: 'Feature',
  improvement: 'Improvement',
  fix: 'Fix',
  breaking: 'Breaking',
}

const categoryStyles: Record<string, string> = {
  feature: styles.catFeature,
  improvement: styles.catImprovement,
  fix: styles.catFix,
  breaking: styles.catBreaking,
}

function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface ChangelogProps {
  className?: string
}

export function Changelog({ className }: ChangelogProps) {
  const entries = (changelogData as ChangelogEntry[]).slice(0, 5)

  return (
    <div className={clsx(styles.timeline, className)}>
      {entries.map((entry) => (
        <div key={entry.date + entry.title} className={styles.entry}>
          <div className={styles.dot} />
          <div className={styles.content}>
            <div className={styles.meta}>
              {entry.version && (
                <span className={styles.versionBadge}>v{entry.version}</span>
              )}
              <time className={styles.date} dateTime={entry.date}>
                {formatDate(entry.date)}
              </time>
              <span className={clsx(styles.categoryBadge, categoryStyles[entry.category])}>
                {categoryLabels[entry.category] || entry.category}
              </span>
            </div>
            <h3 className={styles.title}>{entry.title}</h3>
            <p className={styles.description}>{entry.description}</p>
          </div>
        </div>
      ))}
      <a href="#" className={styles.viewAll}>
        View all updates
      </a>
    </div>
  )
}
