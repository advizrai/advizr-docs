/**
 * mdx-theme barrel — the Instrument Grade MDX element map.
 *
 * `mdxThemeComponents` is the object PR-D spreads into mdx-components.js
 * (and the preview route passes as MDXContent's `components` prop, which
 * the compiled MDX merges OVER the root mdx-components — existing kit
 * components keep rendering, elements get the new skin).
 *
 * The wrapper is exported separately: pages apply it explicitly (nextra's
 * recma rewrite strips MDX's auto-wrapper for content imports).
 */
import { Anchor } from './anchor'
import { Blockquote } from './blockquote'
import { Callout } from './callout'
import { Code } from './code'
import { H1, H2, H3, H4, H5, H6 } from './headings'
import { Hr } from './hr'
import { Img } from './image'
import { Kbd } from './kbd'
import { Li, Ol, Ul } from './lists'
import { Pre } from './pre'
import { Table, Td, Th, Tr } from './table'

const mdxThemeComponents = {
  a: Anchor,
  blockquote: Blockquote,
  code: Code,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Hr,
  img: Img,
  kbd: Kbd,
  li: Li,
  ol: Ol,
  pre: Pre,
  table: Table,
  td: Td,
  th: Th,
  tr: Tr,
  ul: Ul,
} as const

export { mdxThemeComponents, Callout, Kbd }
export { MdxThemeWrapper } from './wrapper'
