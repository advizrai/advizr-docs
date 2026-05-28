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
  }
})
