'use client'

import { useState, Children, isValidElement } from 'react'
import clsx from 'clsx'
import styles from './Tabs.module.css'

interface TabsProps {
  defaultIndex?: number
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultIndex = 0, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultIndex)

  const tabs: { label: string; content: React.ReactNode }[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child.type as any).displayName === 'Tab') {
      tabs.push({
        label: (child.props as any).label || 'Tab',
        content: (child.props as any).children,
      })
    }
  })

  if (tabs.length === 0) return null

  return (
    <div className={clsx(styles.tabs, className)}>
      <div className={styles.tabList} role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`tabpanel-${i}`}
            className={clsx(styles.tab, active === i && styles.tabActive)}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${active}`}
        className={styles.panel}
      >
        {tabs[active]?.content}
      </div>
    </div>
  )
}
