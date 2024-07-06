import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { type ManifestV3Export, crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import path from 'path'

export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as ManifestV3Export })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
