import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { Hero, Card, CardGrid, Section, Button, Tabs, Badge, Feature, Screenshot } from './components'

const docsComponents = getDocsMDXComponents()

export const useMDXComponents = components => ({
  ...docsComponents,
  Hero,
  Card,
  CardGrid,
  Section,
  Button,
  Tabs,
  Badge,
  Feature,
  Screenshot,
  ...components
})
