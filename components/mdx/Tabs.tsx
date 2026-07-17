'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
  Children,
  isValidElement,
} from 'react'
import clsx from 'clsx'
import { Tab } from './Tab'

/* Instrument Grade tab grammar (PR-D): 28px tabs over a hairline-b track;
   active = 500 weight + the 2px signal underline (the JS-measured sliding
   indicator IS the underline). */
const styles = {
  tabs: 'my-4',
  tabList: clsx(
    'relative flex gap-1 overflow-x-auto border-b border-border',
    '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
  ),
  tab: clsx(
    'relative h-7 cursor-pointer whitespace-nowrap border-none bg-transparent px-2.5 text-[0.8125rem] leading-none text-[hsl(var(--text-3))]',
    'transition-[color] duration-150 ease-out hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
  ),
  tabActive: 'font-medium text-[hsl(var(--text-1))]',
  indicator: clsx(
    'pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-[hsl(var(--signal))] opacity-0',
    'transition-[transform,width] duration-150 ease-out motion-reduce:transition-none'
  ),
  panel:
    'pt-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
}

interface TabsProps {
  defaultIndex?: number
  children: React.ReactNode
  className?: string
}

interface TabEntry {
  label: string
  content: React.ReactNode
}

/* Stable child check: reference equality against the Tab component itself,
   with a displayName fallback for duplicated module instances (e.g. HMR). */
function isTabElement(
  child: React.ReactNode
): child is React.ReactElement<{ label?: string; children?: React.ReactNode }> {
  if (!isValidElement(child)) return false
  return child.type === Tab || (child.type as any)?.displayName === 'Tab'
}

export function Tabs({ defaultIndex = 0, children, className }: TabsProps) {
  const baseId = useId()

  const tabs: TabEntry[] = []
  Children.toArray(children).forEach((child) => {
    if (isTabElement(child)) {
      tabs.push({
        label: child.props.label || 'Tab',
        content: child.props.children,
      })
    }
  })

  const [active, setActive] = useState(defaultIndex)
  const safeActive = tabs.length > 0 ? Math.min(Math.max(active, 0), tabs.length - 1) : 0

  const tabListRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hasMeasured = useRef(false)

  /* Position the sliding indicator under the active tab. Motion comes from
     the CSS transition on the indicator (flattened by the global
     prefers-reduced-motion kill-switch); JS only sets the end values. */
  const updateIndicator = useCallback(() => {
    const tabEl = tabRefs.current[safeActive]
    const indicator = indicatorRef.current
    if (!tabEl || !indicator) return

    if (!hasMeasured.current) {
      /* First measurement: snap into place without animating. */
      indicator.style.transition = 'none'
    }
    indicator.style.width = `${tabEl.offsetWidth}px`
    indicator.style.transform = `translateX(${tabEl.offsetLeft}px)`
    indicator.style.opacity = '1'
    if (!hasMeasured.current) {
      void indicator.offsetWidth // flush styles before re-enabling transitions
      indicator.style.transition = ''
      hasMeasured.current = true
    }
  }, [safeActive])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator, tabs.length])

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const list = tabListRef.current
    if (!list) return
    const observer = new ResizeObserver(() => updateIndicator())
    observer.observe(list)
    for (const el of tabRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [updateIndicator, tabs.length])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (tabs.length === 0) return
    let next: number
    switch (event.key) {
      case 'ArrowRight':
        next = (safeActive + 1) % tabs.length
        break
      case 'ArrowLeft':
        next = (safeActive - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = tabs.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  if (tabs.length === 0) return null

  return (
    <div className={clsx(styles.tabs, className)}>
      <div
        ref={tabListRef}
        className={styles.tabList}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={`${tab.label}-${i}`}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={safeActive === i}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={safeActive === i ? 0 : -1}
            className={clsx(styles.tab, safeActive === i && styles.tabActive)}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
        <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${safeActive}`}
        aria-labelledby={`${baseId}-tab-${safeActive}`}
        tabIndex={0}
        className={styles.panel}
      >
        {tabs[safeActive]?.content}
      </div>
    </div>
  )
}
