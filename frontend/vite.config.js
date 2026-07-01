import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  // VITE_API_URL is set in Vercel env vars to point at the deployed backend.
  // Locally it's empty so the dev proxy handles /api/* → localhost:8000.
  envPrefix: 'VITE_'
})