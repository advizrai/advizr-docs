import { Layout, Navbar } from 'nextra-theme-docs'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import NavbarExtra from '../components/NavbarExtra'
import CustomFooter from '../components/CustomFooter'
import BackToTop from '../components/BackToTop'
import { Analytics } from '../components/Analytics'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { CookieConsent } from '../components/CookieConsent'
import { EventTracking } from '../components/EventTracking'

export const metadata = {
  title: {
    default: 'Advizr Docs',
    template: '%s - Advizr Docs'
  },
  description: 'Documentation for the Advizr AI transformation platform. Guides, courses, and technical reference for business owners.',
  metadataBase: new URL('https://docs.advizr.ca'),
  applicationName: 'Advizr Docs',
  authors: [{ name: 'Advizr AI', url: 'https://advizr.ca' }],
  creator: 'Advizr AI Inc.',
  publisher: 'Advizr AI Inc.',
  keywords: [
    'AI transformation',
    'business automation',
    'AI for business',
    'workflow automation',
    'AI consulting',
    'Advizr',
    'AI documentation',
    'business AI platform'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://docs.advizr.ca',
    siteName: 'Advizr Docs',
    title: 'Advizr Docs',
    description: 'Documentation for the Advizr AI transformation platform. Guides, courses, and technical reference for business owners.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advizr Docs',
    description: 'Documentation for the Advizr AI transformation platform.'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://docs.advizr.ca'
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png'
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          Advizr
        </span>
      }
      projectLink="https://github.com/advizrai/advizr-docs"
    >
      <NavbarExtra />
    </Navbar>
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <Head />
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        <Layout
          darkMode={true}
          nextThemes={{ defaultTheme: 'dark' }}
          navbar={navbar}
          footer={<CustomFooter />}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/advizrai/advizr-docs/blob/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
          search={
            <Search
              placeholder="Search docs..."
              emptyResult="No results found. Try different keywords."
              errorText="Failed to load search index."
              loading="Searching..."
            />
          }
        >
          {children}
        </Layout>
        <BackToTop />
        <Analytics />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <CookieConsent />
        <EventTracking />
      </body>
    </html>
  )
}
