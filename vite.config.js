import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://172.45.1.200:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});