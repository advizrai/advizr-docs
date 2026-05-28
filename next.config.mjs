import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs'
})

export default withNextra({
  turbopack: {
    root: import.meta.dirname
  }
})
