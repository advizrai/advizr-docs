import { cn } from '@/lib/cn'
import { TIERS, FEATURES } from '@/data/pricing'
import { BookCallButton } from './BookCallButton'
import { BooleanGlyph } from './BooleanGlyph'

interface PricingTableProps {
  className?: string
}

/**
 * PricingTable — LedgerTable grammar (PR-E, adoption-map §4.3): mono
 * uppercase headers, strong 1px open rule under the header, hairline body
 * rows, double-rule close before the CTA row.
 * The featured tier carries a 2px signal edge on its column — no glow, no
 * scale, no tinted fill. One responsive table in an overflow-x container
 * (§6.4) replaces the old desktop-grid + mobile-cards fork.
 * Data comes from data/pricing.ts — never inline tiers here.
 */
export function PricingTable({ className }: PricingTableProps) {
  const featuredEdge = (featured?: boolean) =>
    featured && 'border-l-2 border-l-[hsl(var(--signal))]'

  return (
    <div
      className={cn('relative my-8 w-full overflow-x-auto', className)}
      tabIndex={0}
    >
      <table className="w-full min-w-[640px] caption-bottom border-collapse text-left">
        <thead className="[&_tr]:border-b [&_tr]:border-foreground">
          <tr>
            <th scope="col" className="w-1/4 px-2 pb-3 align-bottom" />
            {TIERS.map((tier) => (
              <th
                key={tier.name}
                scope="col"
                className={cn('px-3 pb-3 align-bottom', featuredEdge(tier.recommended))}
              >
                <span className="block min-h-4 font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
                  {tier.recommended ? 'Most popular' : ' '}
                </span>
                <span className="mt-1 block text-[0.9375rem] font-medium text-[hsl(var(--text-1))]">
                  {tier.name}
                </span>
                <span className="mt-0.5 block text-[0.75rem] font-normal text-[hsl(var(--text-2))]">
                  {tier.positioning}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-[hsl(var(--text-2))]">
          {FEATURES.map((feature) => (
            <tr
              key={feature.name}
              className="h-10 border-b border-border transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--muted))/60] hover:duration-0 motion-reduce:transition-none"
            >
              <th
                scope="row"
                className="px-2 py-2.5 text-left align-middle text-[0.8125rem] font-normal text-[hsl(var(--text-2))]"
              >
                {feature.name}
              </th>
              {feature.values.map((value, i) => (
                <td
                  key={TIERS[i].name}
                  className={cn(
                    'px-3 py-2.5 align-middle text-[0.8125rem] tabular-nums',
                    featuredEdge(TIERS[i].recommended)
                  )}
                >
                  {typeof value === 'boolean' ? <BooleanGlyph value={value} /> : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className="border-t-[3px] border-double border-foreground">
          <tr>
            <td className="px-2 py-4" />
            {TIERS.map((tier) => (
              <td
                key={tier.name}
                className={cn('px-3 py-4 align-middle', featuredEdge(tier.recommended))}
              >
                <BookCallButton
                  text={`Choose ${tier.name}`}
                  variant={tier.recommended ? 'primary' : 'secondary'}
                />
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
