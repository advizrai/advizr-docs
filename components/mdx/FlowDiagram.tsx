'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

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
const PORT_R = 2.5

/**
 * FlowDiagram — hairline schematic (PR-E): 0-radius card nodes with mono
 * uppercase labels, 1px hairline connectors with signal port-dots at each
 * junction, and a signal beam tracing the pipeline. Connectors draw in when
 * scrolled into view. Reduced-motion renders the finished diagram statically
 * (no draw-in, no beam). The stages/caption API is unchanged.
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

  // Reduced motion (or pre-hydration SSR frame) paints the finished state.
  const settled = visible || reduced

  const drawIn = (delay: number): React.CSSProperties =>
    reduced ? {} : { transitionDelay: `${delay}ms` }

  return (
    <div ref={ref} className={cn('my-8', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Pipeline: ${shown.map((s) => s.label).join(', then ')}`}
        className="block h-auto w-full"
      >
        {shown.map((stage, i) => {
          const x = PAD + i * (NODE_W + GAP)
          const lineX1 = x + NODE_W
          const lineX2 = lineX1 + GAP
          const fade = cn(
            'transition-opacity duration-300 ease-out motion-reduce:transition-none',
            settled ? 'opacity-100' : 'opacity-0'
          )
          return (
            <g key={i}>
              {/* Node — 0-radius hairline card */}
              <rect
                x={x + 0.5}
                y={PAD + 0.5}
                width={NODE_W - 1}
                height={NODE_H - 1}
                className={cn('fill-[hsl(var(--card))] stroke-[hsl(var(--border))]', fade)}
                strokeWidth={1}
                style={drawIn(i * 120)}
              />
              <text
                x={x + NODE_W / 2}
                y={stage.sublabel ? midY - 3 : midY + 4}
                textAnchor="middle"
                className={cn('fill-[hsl(var(--text-1))] font-mono text-[11px] uppercase', fade)}
                style={{ letterSpacing: '0.08em', ...drawIn(i * 120) }}
              >
                {stage.label}
              </text>
              {stage.sublabel && (
                <text
                  x={x + NODE_W / 2}
                  y={midY + 15}
                  textAnchor="middle"
                  className={cn('fill-[hsl(var(--text-3))] font-mono text-[9px] uppercase', fade)}
                  style={{ letterSpacing: '0.06em', ...drawIn(i * 120) }}
                >
                  {stage.sublabel}
                </text>
              )}
              {i < n - 1 && (
                <>
                  {/* 1px connector, drawn in left-to-right */}
                  <line
                    x1={lineX1 + PORT_R + 2}
                    y1={midY}
                    x2={lineX2 - PORT_R - 2}
                    y2={midY}
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={settled ? 0 : 1}
                    className="stroke-[hsl(var(--border))] transition-[stroke-dashoffset] duration-300 ease-out motion-reduce:transition-none"
                    strokeWidth={1}
                    style={drawIn(i * 120 + 80)}
                  />
                  {/* Port dots at each junction — the sanctioned signal circles */}
                  <circle
                    cx={lineX1 + PORT_R}
                    cy={midY}
                    r={PORT_R}
                    className={cn('fill-[hsl(var(--signal))]', fade)}
                    style={drawIn(i * 120 + 80)}
                  />
                  <circle
                    cx={lineX2 - PORT_R}
                    cy={midY}
                    r={PORT_R}
                    className={cn('fill-[hsl(var(--signal))]', fade)}
                    style={drawIn(i * 120 + 160)}
                  />
                </>
              )}
            </g>
          )
        })}
        {!reduced && (
          <circle r={2} className="fill-[hsl(var(--signal))]">
            <animateMotion
              dur="8s"
              repeatCount="indefinite"
              path={`M ${PAD + NODE_W / 2} ${midY} L ${width - PAD - NODE_W / 2} ${midY}`}
            />
          </circle>
        )}
      </svg>
      {caption && (
        <p className="mt-2 text-center font-mono text-[11px] tracking-[0.04em] text-[hsl(var(--text-3))]">
          {caption}
        </p>
      )}
    </div>
  )
}
