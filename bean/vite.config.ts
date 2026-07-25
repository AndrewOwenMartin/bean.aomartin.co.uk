import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import mdx from '@mdx-js/rollup'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import tsconfigPaths from 'vite-tsconfig-paths';
import remarkGfm from 'remark-gfm';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    mdx(
      {
      // Essential for React 17+: tells MDX to use the modern automatic JSX runtime
      jsxImportSource: 'react', 
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
    }
    ),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tsconfigPaths()
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server:{
    host: "0.0.0.0",
  },
  build: {
    sourcemap: true,
  }
})