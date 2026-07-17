import type { NormalizedPages } from '@/components/shell/docs-provider'

/**
 * Navigation derivations shared by the topbar, sidebar, mobile drawer and
 * breadcrumbs. Pure functions over normalizePages() output.
 */

/** Section RefCodes (adoption-map §4.4) — wayfinding without section hues. */
export const SECTION_REF_CODES: Record<string, string> = {
  platform: 'PLT',
  services: 'SVC',
  academy: 'ACD',
  architecture: 'ARC',
  resources: 'RES',
  legal: 'LGL',
}

/** One entry in a nav tree — the useful subset of nextra's DocsItem. */
export interface NavItem {
  name: string
  route: string
  title: React.ReactNode
  children?: NavItem[]
  /** True when the item resolves to a real page (folders may not). */
  hasPage: boolean
}

type DocsDirectory = NormalizedPages['docsDirectories'][number]

function toNavItem(item: DocsDirectory): NavItem {
  const children = item.children?.length
    ? item.children.filter(visible).map(toNavItem)
    : undefined
  return {
    name: item.name,
    route: item.route ?? '',
    title: item.title,
    children,
    // normalizePages folds a folder's index page into the folder item and
    // sets frontMatter; a folder without an index has none.
    hasPage: Boolean((item as { frontMatter?: unknown }).frontMatter),
  }
}

function visible(item: DocsDirectory): boolean {
  return (item as { display?: string }).display !== 'hidden'
}

/**
 * The content tree under docsBase. getPageMap() nests everything below
 * contentDirBasePath inside a single `/docs` folder (verified against the
 * live page map: top level = [/, /design, /docs]) — unwrap it so callers see
 * the sections directly.
 */
export function getDocsTree(
  normalized: NormalizedPages,
  docsBase: string
): NavItem[] {
  const top = normalized.docsDirectories.filter(visible)
  const docsRoot = top.find(
    (item) => item.route === docsBase && item.children?.length
  )
  const list = docsRoot ? docsRoot.children.filter(visible) : top
  return list.map(toNavItem)
}

/**
 * Top-level sections (Platform … Legal) for the topbar. Prefers
 * topLevelNavbarItems (`type: 'page'` entries); this site's sections are
 * plain doc folders, so fall back to the docs tree minus the homepage index.
 */
export function getSections(
  normalized: NormalizedPages,
  docsBase: string
): NavItem[] {
  const fromNavbar = normalized.topLevelNavbarItems
    .filter((item) => 'route' in item && typeof item.route === 'string')
    .map((item) => ({
      name: item.name,
      route: (item as { route: string }).route,
      title: item.title,
      hasPage: true,
    }))
  if (fromNavbar.length > 0) return fromNavbar

  return getDocsTree(normalized, docsBase).filter(
    (item) =>
      item.name !== 'index' && item.route.startsWith(`${docsBase}/`)
  )
}

/**
 * flatDocsDirectories scoped to the docs subtree (the page map also carries
 * app routes like /design/*), with the active index recomputed from the
 * canonical route.
 */
export function getDocsSequence(
  normalized: NormalizedPages,
  docsBase: string,
  route: string
): { sequence: NavItem[]; index: number } {
  const sequence = normalized.flatDocsDirectories
    .filter(
      (item) =>
        typeof item.route === 'string' &&
        (item.route === docsBase || item.route.startsWith(`${docsBase}/`))
    )
    .filter(visible)
    .map(toNavItem)
  return { sequence, index: sequence.findIndex((item) => item.route === route) }
}

/** The section owning the current canonical route, if any. */
export function getActiveSection(
  sections: NavItem[],
  route: string
): NavItem | undefined {
  return sections.find(
    (section) => route === section.route || route.startsWith(`${section.route}/`)
  )
}

/** RefCode for a canonical /docs route's top-level segment (PLT, SVC …). */
export function sectionRefCode(route: string, docsBase: string): string | null {
  const segment = route.slice(docsBase.length).split('/').filter(Boolean)[0]
  return (segment && SECTION_REF_CODES[segment]) || null
}
