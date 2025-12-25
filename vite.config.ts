import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './app'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
