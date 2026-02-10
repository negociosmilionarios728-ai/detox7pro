import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 🔥 ESSENCIAL para Railway / Express / produção
  base: './',

  plugins: [react()],

  // 🔧 Usado apenas em desenvolvimento local
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
