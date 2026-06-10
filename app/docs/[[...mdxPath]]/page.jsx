import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import { JsonLd } from '@/components/JsonLd'

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
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)

  const slug = params.mdxPath ? params.mdxPath.join('/') : ''
  const url = `https://docs.advizr.ca${slug ? `/docs/${slug}` : '/docs'}`
  const title = typeof metadata.title === 'string'
    ? metadata.title
    : (metadata.title?.default || 'Advizr Docs')

  // display:contents keeps this wrapper out of layout while letting
  // [data-section] resolve --section-accent (tokens.css) for everything
  // inside the article tree — eyebrows, icon boxes, TOC tint.
  const section = params.mdxPath?.[0]

  return (
    <div data-section={section} style={{ display: 'contents' }}>
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        <JsonLd
          title={title}
          description={metadata.description}
          url={url}
        />
        <MDXContent {...props} params={params} />
      </Wrapper>
    </div>
  )
}
