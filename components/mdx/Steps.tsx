import { Children } from 'react'
import clsx from 'clsx'
import styles from './Steps.module.css'

interface StepProps {
  title: string
  children: React.ReactNode
  className?: string
}

interface StepsProps {
  children: React.ReactNode
  className?: string
}

export function Step({ title, children, className }: StepProps) {
  return (
    <div className={clsx(styles.step, className)}>
      <div className={styles.indicator}>
        <div className={styles.number} />
        <div className={styles.line} />
      </div>
      <div className={styles.body}>
        <div className={styles.stepTitle}>{title}</div>
        <div className={styles.stepContent}>{children}</div>
      </div>
    </div>
  )
}

export function Steps({ children, className }: StepsProps) {
  const items = Children.toArray(children)

  return (
    <div className={clsx(styles.steps, className)}>
      {items.map((child, i) => (
        <div key={i} className={clsx(styles.stepWrapper, i === items.length - 1 && styles.lastStep)}>
          {child}
        </div>
      ))}
    </div>
  )
}
