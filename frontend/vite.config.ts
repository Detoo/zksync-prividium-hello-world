import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PRIVIDIUM_API = 'https://api.zksync-os-sandbox-10.zksync.dev';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: PRIVIDIUM_API, changeOrigin: true },
      '/rpc': { target: PRIVIDIUM_API, changeOrigin: true },
    },
  },
});
