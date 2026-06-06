import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdx(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server:{
    host: "0.0.0.0",
  },
  build: {
    sourcemap: true,
  }
})
