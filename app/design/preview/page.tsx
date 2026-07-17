import '../../../styles/theme.css'

import { GalleryClient } from './gallery-client'

/**
 * Dev gallery — every Instrument Grade kit component in both worlds.
 * Internal surface: noindexed here and redirected away in production by
 * next.config.mjs (same quarantine treatment as component-demo/preview).
 */
export const metadata = {
  title: 'Design preview',
  robots: { index: false, follow: false },
}

export default function DesignPreviewPage() {
  return <GalleryClient />
}
