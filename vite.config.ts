import { type ManifestV3Export, crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

import manifest from './manifest.json'

export default defineConfig(({ command }) => {
  const isProduction = command === 'build'

  return {
    plugins: [react(), crx({ manifest: manifest as ManifestV3Export })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      hmr: !isProduction,
    },
  }
})
