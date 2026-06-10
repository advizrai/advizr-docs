import nextra from 'nextra'

// Search: Nextra 4 uses Pagefind for client-side full-text search.
// - Pagefind runs as a postbuild step (see package.json "postbuild")
// - Index generated from built HTML into public/_pagefind/
// - Search component customized via Layout search prop in app/layout.jsx
//
// Future options:
// - Algolia DocSearch (free for docs sites, apply at docsearch.algolia.com)
//   Requires: ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME env vars
// - AI-powered search using Advizr's own infrastructure

const withNextra = nextra({
  contentDirBasePath: '/docs'
})

export default withNextra({
  turbopack: {
    root: import.meta.dirname
  },
  async redirects() {
    return [
      // Internal component reference pages quarantined out of public content (2026-06)
      { source: '/docs/resources/component-demo', destination: '/docs/resources', permanent: true },
      { source: '/docs/resources/component-preview', destination: '/docs/resources', permanent: true },
      // Placeholder status page removed until a real status provider ships
      { source: '/docs/resources/status', destination: '/docs/resources', permanent: false },
      // Architecture subsections collapsed while pages are rebuilt with verified content;
      // remove each entry as its subsection returns to the sidebar
      { source: '/docs/architecture/infrastructure/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/client-platform/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/database/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/knowledge-base/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/automation-pipeline/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/engineering/:path*', destination: '/docs/architecture', permanent: false },
      { source: '/docs/architecture/api-reference/:path*', destination: '/docs/architecture', permanent: false }
    ]
  }
})
