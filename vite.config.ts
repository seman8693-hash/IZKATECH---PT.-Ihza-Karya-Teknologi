import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base so the built app works on GitHub Pages sub-paths
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Pisahkan vendor React & DOM dari kode aplikasi
          'vendor-react': ['react', 'react-dom'],
          // Pisahkan lucide-react (icon library) ke chunk terpisah
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});
