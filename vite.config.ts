import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    assetsDir: 'static',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      buffer: resolve(__dirname, './node_modules/buffer/index.js'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem')),
    },
  },
});
