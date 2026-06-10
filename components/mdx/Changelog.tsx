import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import clsx from 'clsx'
import styles from './Changelog.module.css'

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

// Keep in sync with slugify() in app/changelog.xml/route.ts —
// RSS item guids point at these permalink ids.
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

function entryId(entry: ChangelogEntry): string {
  return slugify(`${entry.title}-${entry.date}`)
}

function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Server component: the JSON is read at build/render time so entry data
// never ships in the client bundle.
function loadEntries(): ChangelogEntry[] {
  const raw = readFileSync(join(process.cwd(), 'public', 'changelog.json'), 'utf8')
  const entries = JSON.parse(raw) as ChangelogEntry[]
  return entries.slice().sort((a, b) => b.date.localeCompare(a.date))
}

interface ChangelogProps {
  className?: string
}

export function Changelog({ className }: ChangelogProps) {
  const entries = loadEntries()

  return (
    <div className={clsx(styles.changelog, className)}>
      {entries.map((entry) => {
        const id = entryId(entry)
        return (
          <article key={id} id={id} className={styles.entry}>
            <div className={styles.rail}>
              <time className={styles.date} dateTime={entry.date}>
                {formatDate(entry.date)}
              </time>
              {entry.version && <span className={styles.version}>v{entry.version}</span>}
            </div>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.dot} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.title}>
                  <a href={`#${id}`} className={styles.permalink}>
                    {entry.title}
                    <span className={styles.hash} aria-hidden="true">
                      #
                    </span>
                  </a>
                </h3>
                <span className={clsx(styles.tag, categoryStyles[entry.category])}>
                  {categoryLabels[entry.category] || entry.category}
                </span>
              </div>
              <p className={styles.description}>{entry.description}</p>
            </div>
          </article>
        )
      })}
      <a href="/changelog.xml" className={styles.rssLink}>
        Subscribe via RSS
      </a>
    </div>
  )
}
