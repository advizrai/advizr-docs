import { MdxThemeWrapper, mdxThemeComponents } from './components/mdx-theme'
import { Hero, Card, CardGrid, Section, Button, Badge, Feature, Icon, IconBox, Eyebrow, PathwayCard } from './components'
import {
  Callout, Steps, Step, Tabs, Tab,
  CodeBlock, Details, LinkCard, Screenshot,
  ComparisonTable, VideoEmbed,
  PricingTable, CopyButton, Changelog, BookCallButton,
  Stat, StatRow, FlowDiagram
} from './components/mdx'
import { DimensionLine } from './components/ui/dimension-line'
import { FigureFrame } from './components/ui/figure-frame'
import { LedgerTable } from './components/ui/ledger-table'
import { RefCode } from './components/ui/ref-code'
import { StatusGlyph } from './components/ui/status-glyph'

/**
 * MDX component map (PR-D): nextra-theme-docs' element map is gone — the
 * Instrument Grade mdx-theme skins every markdown-generated element
 * (wrapper with breadcrumbs/TOC/pagination/edit-link, headings, pre/code,
 * table, blockquote, lists, hr, anchor, image, kbd), and the custom MDX kit
 * keeps its component APIs so the 115 content pages render unchanged.
 * PR-E adds the schematic kit (FigureFrame, RefCode, StatusGlyph,
 * DimensionLine, LedgerTable) as content-authorable components.
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
  PricingTable,
  CopyButton,
  Changelog,
  BookCallButton,
  Stat,
  StatRow,
  FlowDiagram,
  DimensionLine,
  FigureFrame,
  LedgerTable,
  RefCode,
  StatusGlyph,
  ...components
})
