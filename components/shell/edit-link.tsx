import * as React from 'react'

/**
 * EditLink — "Edit this page" in mono 11px.
 *
 * `filePath` is nextra's metadata.filePath, repo-root-relative and already
 * prefixed with `content/` (verified against a live importPage result:
 * content/platform/quickstart.mdx), so it appends straight onto blob/master.
 */

const REPO_BLOB_BASE = 'https://github.com/advizrai/advizr-docs/blob/master/'

function EditLink({ filePath }: { filePath?: string }) {
  if (!filePath) return null
  return (
    <a
      href={`${REPO_BLOB_BASE}${filePath}`}
      target="_blank"
      rel="noopener noreferrer"
      data-slot="docs-edit-link"
      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))] transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none"
    >
      Edit this page
      <svg
        viewBox="0 0 12 12"
        className="size-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M3.5 3.5h5v5" />
        <path d="M8.5 3.5L3 9" />
      </svg>
    </a>
  )
}

export { EditLink }
