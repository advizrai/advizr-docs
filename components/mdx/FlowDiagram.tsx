'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import styles from './FlowDiagram.module.css'

interface FlowStage {
  label: string
  sublabel?: string
}

interface FlowDiagramProps {
  /** Pipeline stages, rendered left to right (2-6) */
  stages: FlowStage[]
  /** Optional caption under the diagram */
  caption?: string
  className?: string
}

const NODE_W = 150
const NODE_H = 64
const GAP = 48
const PAD = 8

/**
 * Animated SVG pipeline — one of the three B6 signature set-pieces.
 * Connectors draw in when scrolled into view, then a beam pulses along the
 * pipeline on an 8s loop. Reduced-motion renders the finished diagram
 * statically (no draw-in, no beams).
 */
export function FlowDiagram({ stages, caption, className }: FlowDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n = Math.min(Math.max(stages.length, 2), 6)
  const shown = stages.slice(0, n)
  const width = n * NODE_W + (n - 1) * GAP + PAD * 2
  const height = NODE_H + PAD * 2 + 8
  const midY = PAD + NODE_H / 2

  return (
    <div
      ref={ref}
      className={clsx(styles.wrap, visible && styles.visible, reduced && styles.reduced, className)}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Pipeline: ${shown.map((s) => s.label).join(', then ')}`}
        className={styles.svg}
      >
        {shown.map((stage, i) => {
          const x = PAD + i * (NODE_W + GAP)
          const lineX1 = x + NODE_W
          const lineX2 = lineX1 + GAP
          return (
            <g key={i}>
              <rect
                x={x}
                y={PAD}
                width={NODE_W}
                height={NODE_H}
                rx={10}
                className={styles.node}
                style={{ transitionDelay: `${i * 120}ms` }}
              />
              <text
                x={x + NODE_W / 2}
                y={stage.sublabel ? midY - 4 : midY + 4}
                textAnchor="middle"
                className={styles.label}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {stage.label}
              </text>
              {stage.sublabel && (
                <text
                  x={x + NODE_W / 2}
                  y={midY + 16}
                  textAnchor="middle"
                  className={styles.sublabel}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {stage.sublabel}
                </text>
              )}
              {i < n - 1 && (
                <>
                  <line
                    x1={lineX1 + 4}
                    y1={midY}
                    x2={lineX2 - 4}
                    y2={midY}
                    className={styles.connector}
                    style={{ transitionDelay: `${i * 120 + 80}ms` }}
                  />
                  <path
                    d={`M ${lineX2 - 10} ${midY - 4} L ${lineX2 - 4} ${midY} L ${lineX2 - 10} ${midY + 4}`}
                    className={styles.arrow}
                    style={{ transitionDelay: `${i * 120 + 80}ms` }}
                  />
                </>
              )}
            </g>
          )
        })}
        {!reduced && (
          <circle r={3} className={styles.beam}>
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path={`M ${PAD + NODE_W / 2} ${midY} L ${width - PAD - NODE_W / 2} ${midY}`}
            />
          </circle>
        )}
      </svg>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  )
}
