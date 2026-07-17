'use client'

import * as React from 'react'
import { ThemeProvider } from 'next-themes'

import { DocsProvider } from '@/components/shell/docs-provider'
import { DocsShell } from '@/components/shell/docs-shell'

/**
 * PreviewShell — client assembly for the preview-docs route.
 *
 * Mounts next-themes LOCALLY (attribute='class', defaultTheme='dark') so the
 * preview is self-sufficient — DocsShell itself never mounts a provider;
 * PR-D's root layout owns that in production. DocsProvider maps the
 * /design/preview-docs mount onto canonical /docs routes so navigation stays
 * inside the preview.
 */
function PreviewShell({
  pageMap,
  children,
}: {
  pageMap: React.ComponentProps<typeof DocsProvider>['pageMap']
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <DocsProvider
        pageMap={pageMap}
        docsBase="/docs"
        mountBase="/design/preview-docs"
      >
        <DocsShell>{children}</DocsShell>
      </DocsProvider>
    </ThemeProvider>
  )
}

export { PreviewShell }
