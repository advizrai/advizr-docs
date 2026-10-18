import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import { JsonLd } from '@/components/JsonLd'
import { CopyPageMenu } from '@/components/CopyPageMenu'
import { FeedbackWidget } from '@/components/FeedbackWidget'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  const slug = params.mdxPath ? params.mdxPath.join('/') : ''
  const canonical = slug ? `/docs/${slug}` : '/docs'

  const pageTitle = typeof metadata.title === 'string'
    ? metadata.title
    : (metadata.title?.default || 'Advizr Docs')
  const section = params.mdxPath?.[0]
    ? params.mdxPath[0].charAt(0).toUpperCase() + params.mdxPath[0].slice(1)
    : ''
  const ogImageUrl = `/api/og?title=${encodeURIComponent(pageTitle)}${section ? `&section=${encodeURIComponent(section)}` : ''}`

  return {
    ...metadata,
    alternates: {
      canonical
    },
    openGraph: {
      title: pageTitle,
      description: metadata.description,
      url: `https://docs.advizr.ca${canonical}`,
      siteName: 'Advizr Docs',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: metadata.description,
      images: [ogImageUrl]
    }
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata
  } = await importPage(params.mdxPath)

  const slug = params.mdxPath ? params.mdxPath.join('/') : ''
  const url = `https://docs.advizr.ca${slug ? `/docs/${slug}` : '/docs'}`
  const title = typeof metadata.title === 'string'
    ? metadata.title
    : (metadata.title?.default || 'Advizr Docs')

  // display:contents keeps this wrapper out of layout; data-section is
  // wayfinding metadata (RefCodes/OG) — the section-accent hues it once
  // resolved died in PR-E.
  const section = params.mdxPath?.[0]

  return (
    <div data-section={section} style={{ display: 'contents' }}>
      {/* No sourceCode prop. The wrapper is a client component and never
          read it, but every prop is serialized into the page payload, so
          each page shipped another page's raw MDX (the terms of service, or
          the old pricing page) hidden in its HTML. Copy page reads the .md
          mirror instead. */}
      <Wrapper toc={toc} metadata={metadata}>
        <JsonLd
          title={title}
          description={metadata.description}
          url={url}
        />
        <CopyPageMenu />
        <MDXContent {...props} params={params} />
        <FeedbackWidget />
      </Wrapper>
    </div>
  )
}
