# Advizr Docs

Documentation site for Advizr AI - built with Nextra 4 (docs theme).

## Stack

- **Framework:** Nextra 4.4.0 + Next.js 16
- **Content:** MDX files in `content/` directory
- **Hosting:** Vercel (target: `docs.advizr.ca`)

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
  layout.jsx      # Root layout with Nextra theme
  docs/[[...mdxPath]]/page.jsx  # Catch-all content renderer
  page.jsx        # Root redirect to /docs
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

## Changelog / patch notes

`public/changelog.json` is **generated** by the advizr-admin patch-notes
publisher — never hand-edit it (the master-DB `patch_notes` table is
canonical; the file is fully rewritten on every publish, so manual edits are
silently reverted). Publish/retract entries via the admin portal at
`/patch-notes`. `entries[].slug` is the public anchor id and RSS guid;
`components/mdx/Changelog.tsx` and `app/changelog.xml/route.ts` consume it
verbatim.

## Known issues

- Nextra 4.6.x has a Layout Zod validation bug - pinned to 4.4.0
- URLs are prefixed with `/docs/` (e.g., `/docs/platform/getting-started`)
