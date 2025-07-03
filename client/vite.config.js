import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/visible-satellites': 'http://localhost:3000',
      '/positions': 'http://localhost:3000',
      '/satellites': 'http://localhost:3000',
    },
  },
});
