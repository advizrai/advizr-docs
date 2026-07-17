import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { getPageMap } from 'nextra/page-map'

import '../styles/app.css'

import { Analytics } from '@/components/Analytics'
import { CookieConsent } from '@/components/CookieConsent'
import { EventTracking } from '@/components/EventTracking'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { MotionEffects } from '@/components/MotionEffects'
import { DocsProvider } from '@/components/shell/docs-provider'
import { DocsShell } from '@/components/shell/docs-shell'

/**
 * Root layout — the Instrument Grade shell on EVERY route (PR-D: the flip).
 *
 * nextra-theme-docs' Layout/Navbar/Search are gone; DocsShell (topbar,
 * sidebar, TOC needle, ⌘K Pagefind palette, footer, skip link, reading
 * progress, back-to-top) is the only chrome. next-themes owns the html
 * class: dark-first is the product decision (band world default, .light
 * opts into paper), so enableSystem is off.
 *
 * Doctrine fonts: Geist + Geist Mono, self-hosted at build via next/font —
 * ownership moved here from the PR-C preview route.
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

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F0E0C' },
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' }
  ]
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap()
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <DocsProvider pageMap={pageMap}>
            <DocsShell>{children}</DocsShell>
          </DocsProvider>
        </ThemeProvider>
        <MotionEffects />
        <Analytics />
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <CookieConsent />
        <EventTracking />
      </body>
    </html>
  )
}
