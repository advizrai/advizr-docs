# Advizr Docs

Documentation site for Advizr AI - Nextra 4 core (MDX pipeline + Pagefind)
under a custom Instrument Grade shell. `nextra-theme-docs` is installed as a
CSS-only artifact (its compiled stylesheet supplies nextra core's `x:`
utilities); never mount its components.

## Stack

- **Framework:** Nextra 4.4.0 core + Next.js 16, custom shell in `components/shell/`
- **Styling:** Tailwind v4 CSS-first — tokens in `styles/theme.css` (dark-first band world, paper light mode; design specs in `docs/design/`)
- **Content:** MDX files in `content/` directory
- **Hosting:** Vercel (target: `docs.advizr.ca`)
- **Doctrine gate:** `npm run audit:legacy` (CI-enforced; no gradients/glow/radius>2px/off-palette hexes)

## Structure

```
content/          # All documentation content (MDX)
  _meta.ts        # Root navigation config
  platform/       # Client portal docs
  services/       # What Advizr builds and delivers
  architecture/   # Technical reference
  academy/        # Education hub
  resources/      # Guides, templates, changelog
  legal/          # Terms, privacy, licensing
app/              # Next.js app router
  layout.tsx      # Root layout: DocsShell + next-themes (dark-first)
  docs/[[...mdxPath]]/page.jsx  # Catch-all content renderer
  page.jsx        # Root redirect to /docs
components/shell/ # Topbar, sidebar, TOC needle, search dialog, footer
components/ui/    # Schematic kit (FigureFrame, LedgerTable, RefCode, …)
components/mdx-theme/ # Markdown element skins (headings, pre, table, …)
mdx-components.js # MDX component config
```

## Commands

```bash
npm run dev    # Start dev server
npm run build  # Production build
```

## Adding content

1. Create an `.mdx` file in the appropriate `content/` subdirectory
2. Add an entry to the parent directory's `_meta.ts` file
3. Content uses standard Markdown + MDX (React components)

## Navigation

Each directory has a `_meta.ts` file that controls sidebar ordering and display names:

```ts
export default {
  index: 'Overview',
  'page-slug': 'Display Name'
}
```

## Known issues

- Nextra 4.6.x has a Layout Zod validation bug - pinned to 4.4.0
- URLs are prefixed with `/docs/` (e.g., `/docs/platform/getting-started`)
