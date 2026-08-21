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

## Writing about the client platform

The Platform section documents **the client view** of advizrclients.com, which
is a different and smaller product than the operator view. Anyone writing from
the staff surface describes a product clients never see. This happened once:
the whole section documented an eight-tab sidebar (Home / Chat / Goals /
Documents / Proposals / Learn / Book / Help) for weeks after the product
replaced it with five rail sections.

The client rail, and the only vocabulary these docs use:

| Section | Items |
|---|---|
| Today | Dashboard, Inbox, Digest |
| Engagement | Goals (route `/objectives`), Workflows, Runs |
| Your team | Tasks, Interact, Team (Roster, Hire) |
| Value | Analytics, Reports |
| Learn | Brain, Documentation |

Dead words: Chat (it is Interact), Missions or Objectives as a client-facing
label (it is Goals), Agents (it is Team or coworkers), Proposals (folded into
Inbox > Approvals), Home (it is Dashboard), Simple/Advanced mode (gone).

**Never document:**

- Model slugs, model names, or model selection of any kind. Clients never
  choose a model; work is routed by capability tier. A model upgrade must
  reach a workspace without anyone re-reading a docs page.
- Settings > Model access, Custom models, or Developer & testing. These render
  for CLIENT_ADMIN but are staff-shaped and off-limits here.
- `/workflows/flows`, `/workflows/jobs`, `/workflows/recordings`, `/setup`,
  `/analytics/costs`, `/analytics/usage`, `/analytics/workspace`.
- Staff surfaces: evaluations, forge, marketplace, ontology, prompt-blocks,
  skills admin, campaigns, leads, accounts, contacts, integrations admin,
  memory, vector-db, workforces, admin/*.

Verify a label against `lib/nav/config.ts` on `advizr-client-template@master`
before you write it down. `getConsumerNav()` is the client rail; anything it
strips is staff.

## Claims and prices

`scripts/check-claims.mjs` is the gate. It runs in CI along with
`--self-test`, which proves every rule still matches its own fixture.

**No literal prices anywhere on this site.** No build fees, no retainer bands,
no "starting at", and no dollar figures in illustrative examples either -
worked examples count hours, headcount, or things. Engagements are fixed
scope, quoted in writing after the audit call.

Retired claims are retired everywhere or nowhere: if a claim changes here it
changes in `advizr-website` `src/data/claims.ts` in the same change, and the
do-not-name list is shared with that repo's `scripts/do-not-name.txt`.

A number about a client engagement may only be published when that client
signed off on the measurement behind it. Where they have not, describe the
work instead.
