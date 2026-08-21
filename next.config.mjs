import nextra from 'nextra'

// Search: Nextra 4 uses Pagefind for client-side full-text search.
// - Pagefind runs as a postbuild step (see package.json "postbuild")
// - Index generated from built HTML into public/_pagefind/
// - UI is the shell's ⌘K palette (components/shell/search-dialog.tsx)
//
// Future options:
// - Algolia DocSearch (free for docs sites, apply at docsearch.algolia.com)
//   Requires: ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME env vars
// - AI-powered search using Advizr's own infrastructure

const withNextra = nextra({
  contentDirBasePath: '/docs'
})

export default withNextra({
  // Keep the dev indicator out of Playwright visual-baseline screenshots
  devIndicators: false,
  experimental: {
    // Native React/Next View Transitions for ~180ms cross-fade page nav
    // (CSS in globals.css; disabled by the reduced-motion kill-switch)
    viewTransition: true
  },
  turbopack: {
    root: import.meta.dirname
  },
  async redirects() {
    return [
      // ---------------------------------------------------------------
      // Platform IA rebuild (2026-08). The docs described an eight-tab
      // sidebar (Home / Chat / Goals / Documents / Proposals / Learn /
      // Book / Help) that the product replaced with five rail sections.
      // These map every old URL onto the surface that now does that job.
      // Specific rules first; the section fallback last.
      // ---------------------------------------------------------------
      { source: '/docs/platform/dashboard/home', destination: '/docs/platform/today/dashboard', permanent: true },
      { source: '/docs/platform/dashboard/chat', destination: '/docs/platform/your-team/interact', permanent: true },
      { source: '/docs/platform/dashboard/goals', destination: '/docs/platform/engagement/objectives', permanent: true },
      { source: '/docs/platform/dashboard/documents', destination: '/docs/platform/learn/brain', permanent: true },
      { source: '/docs/platform/dashboard/learn', destination: '/docs/platform/learn/brain', permanent: true },
      { source: '/docs/platform/dashboard/book', destination: '/docs/platform/features/booking-and-scheduling', permanent: true },
      { source: '/docs/platform/dashboard/help', destination: '/docs/platform/features/getting-help', permanent: true },
      // Proposals has no successor: the vocabulary is retired and /proposals
      // is a redirect shell in the product. Sent to the section overview, and
      // deliberately not permanent in case it earns a page again.
      { source: '/docs/platform/dashboard/proposals', destination: '/docs/platform', permanent: false },
      { source: '/docs/platform/dashboard', destination: '/docs/platform/today/dashboard', permanent: true },
      // features/ splits: one page became two, one moved section.
      { source: '/docs/platform/features/runs-and-workflows', destination: '/docs/platform/engagement/runs', permanent: true },
      { source: '/docs/platform/features/analytics', destination: '/docs/platform/value/analytics', permanent: true },
      { source: '/docs/platform/features/team-management', destination: '/docs/platform/your-team/team', permanent: true },
      // Onboarding slugs renamed to the words the product uses.
      { source: '/docs/platform/onboarding/uploading-documents', destination: '/docs/platform/onboarding/adding-sources', permanent: true },
      { source: '/docs/platform/onboarding/using-chat', destination: '/docs/platform/onboarding/talking-to-your-team', permanent: true },
      // Section folders have no index page, so a bare folder URL 404s. The
      // footer has linked at /docs/platform/features since before the IA
      // rebuild and it has 404'd the whole time. Each folder now lands on its
      // first page. Not permanent: an index page may earn these URLs later.
      { source: '/docs/platform/today', destination: '/docs/platform/today/dashboard', permanent: false },
      { source: '/docs/platform/engagement', destination: '/docs/platform/engagement/objectives', permanent: false },
      { source: '/docs/platform/your-team', destination: '/docs/platform/your-team/tasks', permanent: false },
      { source: '/docs/platform/value', destination: '/docs/platform/value/analytics', permanent: false },
      { source: '/docs/platform/learn', destination: '/docs/platform/learn/brain', permanent: false },
      { source: '/docs/platform/features', destination: '/docs/platform/features/command-palette', permanent: false },
      { source: '/docs/platform/faq', destination: '/docs/platform/faq/general', permanent: false },
      { source: '/docs/platform/onboarding', destination: '/docs/platform/onboarding/welcome', permanent: false },
      { source: '/docs/platform/account', destination: '/docs/platform/account/login-and-security', permanent: false },
      // Internal component reference pages quarantined out of public content (2026-06)
      { source: '/docs/resources/component-demo', destination: '/docs/resources', permanent: true },
      { source: '/docs/resources/component-preview', destination: '/docs/resources', permanent: true },
      // Instrument Grade dev gallery (PR-B) quarantined the same way in production;
      // stays reachable locally (next start) for visual verification
      ...(process.env.VERCEL ? [{ source: '/design/preview', destination: '/docs', permanent: false }] : []),
      // /design/preview-docs (PR-C's shell preview) retired in PR-D — the
      // shell is live on every route now
      { source: '/design/preview-docs/:path*', destination: '/docs', permanent: false },
      // Placeholder status page removed until a real status provider ships
      { source: '/docs/resources/status', destination: '/docs/resources', permanent: false },
      // _drafts briefly built as live pages (Nextra's underscore exclusion
      // covers meta files only, not directories — drafts now live outside
      // content/ in /drafts)
      { source: '/docs/architecture/_drafts/:path*', destination: '/docs/architecture', permanent: false },
      // Architecture subsections collapsed while pages are rebuilt with verified content;
      // remove each entry as its subsection returns to the sidebar
      { source: '/docs/architecture/client-platform/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/database/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/automation-pipeline/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/engineering/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/api-reference/:path*', destination: '/docs/architecture', permanent: false }
    ]
  }
})
