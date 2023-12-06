import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/v1': { // '/API' is the proxy logo, which is used to tell node. URL is in front of/API.
        target: 'http://localhost:3000', // target address, generally refers to the background server address
        changeOrigin: true, // Whether to cross -domain
      },
    },
  },
});
