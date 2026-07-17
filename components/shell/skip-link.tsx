/**
 * SkipLink — shell variant of components/SkipLink.tsx.
 *
 * First focusable element on every shell page; visually hidden until
 * focused, then a square mono chip pinned top-left (adoption-map §2.2 —
 * Linear ships one; ours is restyled square). Targets the article landmark
 * the mdx-theme wrapper renders as #docs-content.
 */
function SkipLink() {
  return (
    <a
      href="#docs-content"
      data-slot="docs-skip-link"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:inline-flex focus:items-center focus:border focus:border-border focus:bg-[hsl(var(--background))] focus:px-3 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.08em] focus:text-[hsl(var(--text-1))]"
    >
      Skip to content
    </a>
  )
}

export { SkipLink }
