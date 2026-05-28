import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Hero, Card, CardGrid, Section, Button, Badge, Feature } from './components'
import {
  Callout, Steps, Step, Tabs, Tab,
  CodeBlock, Details, LinkCard, Screenshot,
  ComparisonTable, VideoEmbed,
  RoiCalculator, PricingTable, CopyButton, Changelog, BookCallButton
} from './components/mdx'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = components => ({
  ...docsComponents,
  Hero,
  Card,
  CardGrid,
  Section,
  Button,
  Badge,
  Feature,
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
  ...components
})
