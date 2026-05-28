import { Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles/globals.css'
import NavbarExtra from '../components/NavbarExtra'
import CustomFooter from '../components/CustomFooter'
import BackToTop from '../components/BackToTop'

export const metadata = {
  title: {
    default: 'Advizr Docs',
    template: '%s - Advizr Docs'
  },
  description: 'Documentation for the Advizr AI transformation platform',
  metadataBase: new URL('https://docs.advizr.ca')
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="A" />
      <body>
        <Layout
          navbar={navbar}
          footer={<CustomFooter />}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/advizrai/advizr-docs/blob/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
        <BackToTop />
      </body>
    </html>
  )
}
