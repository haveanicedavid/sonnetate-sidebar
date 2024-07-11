import { type ManifestV3Export, crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

import manifest from './manifest.json'

export default defineConfig({
  plugins: [
    react(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
    crx({ manifest: manifest as ManifestV3Export }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
