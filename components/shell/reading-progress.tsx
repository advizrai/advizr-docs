'use client'

/**
 * ReadingProgress — shell variant of components/ReadingProgress.tsx.
 *
 * 2px --signal bar directly under the topbar, driven entirely by a CSS
 * scroll-driven animation (@keyframes docs-progress in styles/prose.css).
 * Browsers without animation-timeline never show it (scale stays 0); no JS
 * scroll work. Rendered on every shell page — long-form is the norm here.
 */
function ReadingProgress() {
  return (
    <div
      aria-hidden="true"
      data-slot="docs-reading-progress"
      // Base state hides the bar with a TRANSFORM (not Tailwind scale-x-0:
      // v4's scale-* is the independent `scale` property, which would keep
      // multiplying the animated transform to zero width).
      className="pointer-events-none fixed inset-x-0 top-[var(--topbar-height)] z-40 h-0.5 origin-left [transform:scaleX(0)] bg-[hsl(var(--signal))] supports-[animation-timeline:scroll()]:[animation-name:docs-progress] supports-[animation-timeline:scroll()]:[animation-duration:auto] supports-[animation-timeline:scroll()]:[animation-timing-function:linear] supports-[animation-timeline:scroll()]:[animation-fill-mode:both] supports-[animation-timeline:scroll()]:[animation-timeline:scroll()]"
    />
  )
}

export { ReadingProgress }
