import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ include: /src\/.*\.[jt]sx?$/ })],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5002',
        changeOrigin: true,
      },
    },
  },
});
