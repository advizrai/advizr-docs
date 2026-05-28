'use client'

import { useState, Children } from 'react'
import clsx from 'clsx'
import styles from './Tabs.module.css'

interface TabsProps {
  items: string[]
  children: React.ReactNode
  defaultIndex?: number
  className?: string
}

export function Tabs({ items, children, defaultIndex = 0, className }: TabsProps) {
  const [active, setActive] = useState(defaultIndex)
  const panels = Children.toArray(children)

  return (
    <div className={clsx(styles.tabs, className)}>
      <div className={styles.tabList} role="tablist">
        {items.map((label, i) => (
          <button
            key={label}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`panel-${i}`}
            className={clsx(styles.tab, active === i && styles.tabActive)}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        className={styles.panel}
      >
        {panels[active]}
      </div>
    </div>
  )
}
