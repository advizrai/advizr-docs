import { Geist, Geist_Mono } from 'next/font/google'
import { getPageMap } from 'nextra/page-map'
import { generateStaticParamsFor, importPage } from 'nextra/pages'

import { MdxThemeWrapper, mdxThemeComponents } from '@/components/mdx-theme'
import { PreviewShell } from '../preview-shell'

import '../../../../styles/theme.css'
import '../../../../styles/prose.css'
import '../preview.css'

/**
 * Preview-docs — a parallel catch-all that renders REAL content through the
 * NEW Instrument Grade shell without touching the live /docs routes (those
 * flip in PR-D). Same importPage seam as app/docs/[[...mdxPath]]/page.jsx;
 * the segment key differs (`slug`) so params never collide.
 *
 * Quarantine: noindexed here, redirected in production by next.config.mjs
 * (same treatment as /design/preview), and NOT pagefind-indexed in
 * production builds (searchable is forced off under VERCEL so the deploy's
 * postbuild index never picks up /design/preview-docs duplicates; local
 * builds keep data-pagefind-body for acceptance checks).
 *
 * Doctrine fonts: Geist + Geist Mono load HERE (next/font, self-hosted at
 * build) and scope to the preview subtree; PR-D moves them to the root
 * layout.
 */

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const generateStaticParams = generateStaticParamsFor('slug')

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.slug)
  return {
    title: metadata.title,
    robots: { index: false, follow: false },
  }
}

export default async function PreviewDocsPage(props: PageProps) {
  const params = await props.params
  const [pageMap, page] = await Promise.all([
    getPageMap(),
    importPage(params.slug),
  ])
  const { default: MDXContent, toc, metadata } = page

  const pageSearchable =
    (metadata as { searchable?: boolean }).searchable !== false
  const meta = {
    ...metadata,
    searchable: pageSearchable && !process.env.VERCEL,
  }

  return (
    <div
      data-docs-preview-root
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <PreviewShell pageMap={pageMap}>
        <MdxThemeWrapper toc={toc} metadata={meta}>
          <MDXContent
            {...props}
            params={params}
            components={mdxThemeComponents}
          />
        </MdxThemeWrapper>
      </PreviewShell>
    </div>
  )
}
