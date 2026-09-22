import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
