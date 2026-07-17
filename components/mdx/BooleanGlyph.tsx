/**
 * Boolean cell glyph for ledger tables (PricingTable / ComparisonTable) —
 * StatusGlyph vocabulary: state is a machined SHAPE, never a colored pill.
 * Included = solid ink square; not included = empty hairline square. Shape
 * (filled vs outline) carries the meaning, so the legend survives grayscale.
 */
export function BooleanGlyph({ value }: { value: boolean }) {
  return value ? (
    <span
      role="img"
      aria-label="Included"
      className="inline-block size-2.5 bg-[hsl(var(--foreground))]"
    />
  ) : (
    <span
      role="img"
      aria-label="Not included"
      className="inline-block size-2.5 border border-border bg-transparent"
    />
  )
}
