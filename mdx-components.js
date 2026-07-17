import { MdxThemeWrapper, mdxThemeComponents } from './components/mdx-theme'
import { Hero, Card, CardGrid, Section, Button, Badge, Feature, Icon, IconBox, Eyebrow, PathwayCard } from './components'
import {
  Callout, Steps, Step, Tabs, Tab,
  CodeBlock, Details, LinkCard, Screenshot,
  ComparisonTable, VideoEmbed,
  RoiCalculator, PricingTable, CopyButton, Changelog, BookCallButton,
  Stat, StatRow, FlowDiagram
} from './components/mdx'

/**
 * MDX component map (PR-D): nextra-theme-docs' element map is gone — the
 * Instrument Grade mdx-theme skins every markdown-generated element
 * (wrapper with breadcrumbs/TOC/pagination/edit-link, headings, pre/code,
 * table, blockquote, lists, hr, anchor, image, kbd), and the custom MDX kit
 * keeps its component APIs so the 115 content pages render unchanged.
 */
export const useMDXComponents = components => ({
  ...mdxThemeComponents,
  wrapper: MdxThemeWrapper,
  Hero,
  Card,
  CardGrid,
  Section,
  Button,
  Badge,
  Feature,
  Icon,
  IconBox,
  Eyebrow,
  PathwayCard,
  Callout,
  Steps,
  Step,
  Tabs,
  Tab,
  CodeBlock,
  Details,
  LinkCard,
  Screenshot,
  ComparisonTable,
  VideoEmbed,
  RoiCalculator,
  PricingTable,
  CopyButton,
  Changelog,
  BookCallButton,
  Stat,
  StatRow,
  FlowDiagram,
  ...components
})
