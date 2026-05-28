interface JsonLdProps {
  title: string
  description?: string
  url: string
  dateModified?: string
}

export function JsonLd({ title, description, url, dateModified }: JsonLdProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description || 'Advizr documentation',
    url,
    author: {
      '@type': 'Organization',
      name: 'Advizr AI',
      url: 'https://advizr.ca'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Advizr AI Inc.',
      url: 'https://advizr.ca'
    },
    ...(dateModified && { dateModified })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
