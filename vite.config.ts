import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        defaultHandler(warning);
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
