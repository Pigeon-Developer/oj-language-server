import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    python: 'lsp/python/direct.ts',
  },
  format: 'esm',
  splitting: false,
  sourcemap: true,
  clean: true,
});
