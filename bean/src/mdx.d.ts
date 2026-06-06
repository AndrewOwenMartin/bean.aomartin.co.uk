declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const Component: ComponentType
  export default Component
}

declare module 'react-katex' {
  import type { ComponentType } from 'react'
  export const InlineMath: ComponentType<{ math?: string; children?: string }>
  export const BlockMath: ComponentType<{ math?: string; children?: string }>
}
