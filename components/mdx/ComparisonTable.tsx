import clsx from 'clsx'
import styles from './ComparisonTable.module.css'

interface ComparisonRow {
  feature: string
  values: (boolean | string)[]
}

interface ComparisonTableProps {
  columns: string[]
  rows: ComparisonRow[]
  className?: string
}

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Yes" role="img">
    <circle cx="9" cy="9" r="8" fill="var(--advizr-accent-100)" />
    <path d="M5.5 9l2.5 2.5 4.5-5" stroke="var(--advizr-accent-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="No" role="img">
    <circle cx="9" cy="9" r="8" fill="var(--advizr-slate-100)" />
    <path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="var(--advizr-slate-400)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function ComparisonTable({ columns, rows, className }: ComparisonTableProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={col} className={clsx(styles.th, i === 0 && styles.stickyCol)}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <td className={clsx(styles.td, styles.featureCell, styles.stickyCol)}>
                {row.feature}
              </td>
              {row.values.map((val, i) => (
                <td key={i} className={clsx(styles.td, styles.valueCell)}>
                  {typeof val === 'boolean' ? (
                    val ? <CheckIcon /> : <XIcon />
                  ) : (
                    <span>{val}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
