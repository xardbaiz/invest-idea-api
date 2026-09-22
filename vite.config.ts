import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/views/client.tsx'),
      name: 'ClientBundle',
      fileName: () => 'bundle.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        format: 'iife',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
