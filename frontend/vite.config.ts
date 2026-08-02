import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const isDisableHmr = process.env.DISABLE_HMR === 'true';
  const apiUrl = process.env.VITE_API_URL || 'http://backend:8080';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: isDisableHmr
        ? false
        : {
            clientPort: 3000,
          },
      watch: isDisableHmr
        ? null
        : {
            usePolling: true,
            interval: 100,
          },
    },
  };
});
