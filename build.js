import { build } from 'esbuild';

async function buildAll() {
  await build({
    entryPoints: ['src/views/client.tsx'],
    bundle: true,
    outfile: 'dist/public/bundle.js',
    format: 'iife',
    minify: false,
    sourcemap: true,
    loader: { '.tsx': 'tsx', '.ts': 'ts', '.json': 'json' },
    external: ['node:fs', 'node:path', 'fs', 'path'],
    define: { 'process.env.NODE_ENV': '"production"' }
  });
  console.log('Client bundle built successfully.');
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
