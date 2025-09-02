import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      port: 5173,
      clientPort: 5173,
      host: 'localhost'
    },
    watch: {
      usePolling: true
    }
  },
  define: {
    'process.env.VITE_BACKEND_URL': JSON.stringify('http://localhost:3000')
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      }
    }
  }
})
