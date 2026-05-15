import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    watch: { ignored: ['**/.mongodb/**', '**/server/**'] },
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react/')) return 'react-vendor';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('i18next')) return 'i18n';
          }
        }
      }
    }
  }
}))
