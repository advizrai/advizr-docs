# Images Directory

Static assets for the Advizr docs site.

## Directory structure

| Directory | Purpose |
|-----------|---------|
| `platform/` | Screenshots from the live client portal (advizrclients.com/template) |
| `services/` | Service illustrations and marketing diagrams |
| `architecture/` | System architecture diagrams (SVG) |
| `academy/` | Course and learning illustrations |
| `icons/` | 24x24 SVG feature icons for cards, navigation, and callouts |
| `brand/` | Logo files, OG images, social media cards |

## Icons specification

All icons in `icons/` follow these rules:
- viewBox: `0 0 24 24`
- Stroke-based: `stroke="currentColor"`, `stroke-width="2"`
- No fill: `fill="none"`
- Line caps: `stroke-linecap="round"`, `stroke-linejoin="round"`
- Adapts to light/dark mode automatically via `currentColor`

## Platform screenshots

Captured via Playwright from the live platform at `advizrclients.com/template`.

| Filename | Source URL | Status |
|----------|-----------|--------|
| login.png | /template/login | Captured |
| dashboard-home.png | /template | Captured |
| chat.png | /template/chat | Captured |
| goals.png | /template/goals | Captured |
| documents.png | /template/documents | Captured |
| proposals.png | /template/proposals | Captured |
| learn.png | /template/learn | Captured |
| book.png | /template/book | Captured |
| help.png | /template/help | Captured |
| runs.png | /template/runs | Captured |
| team.png | /template/team | Captured |
| settings.png | /template/settings | Captured |
| analytics-placeholder.svg | /template/analytics | Placeholder (page timed out) |

## Recapturing screenshots

To refresh platform screenshots, run:

```bash
node scripts/capture-screenshots.mjs
```

Requirements: Playwright with Chromium installed (`npx playwright install chromium`).

Viewport: 1440x900. Login credentials are in the script.

## Architecture diagrams

SVG diagrams in `architecture/` use mid-tone colors that work on both light and dark backgrounds. Transparent backgrounds with semi-transparent fills.

| Filename | Description |
|----------|-------------|
| doe-framework.svg | Three-layer DOE architecture (Directives, Orchestration, Execution) |
| database-isolation.svg | Multi-tenant Supabase topology with master and client databases |
| client-routing.svg | Request routing from slug to client-specific resources |
| lead-gen-pipeline.svg | Five-stage lead generation pipeline |

## Using images in MDX

Use the `Screenshot` component for click-to-zoom behavior:

```mdx
<Screenshot
  src="/images/architecture/doe-framework.svg"
  alt="DOE Architecture diagram"
  caption="Optional caption text"
/>
```

For simple inline images without lightbox, use standard markdown:

```mdx
![Alt text](/images/icons/dashboard.svg)
```

## Naming conventions

- Use kebab-case for all filenames
- Screenshots: descriptive name matching the page (e.g., `dashboard-home.png`)
- Icons: feature name matching the platform section (e.g., `chat.svg`)
- Diagrams: concept name (e.g., `doe-framework.svg`)
