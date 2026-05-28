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
      <div className={styles.stepTitle}>{title}</div>
      <div className={styles.stepContent}>{children}</div>
    </div>
  )
}

export function Steps({ children, className }: StepsProps) {
  return (
    <div className={clsx(styles.steps, className)}>
      {Children.toArray(children)}
    </div>
  )
}
