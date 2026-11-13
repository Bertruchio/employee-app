import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  test: {
    name: 'server',
    root: './server',
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
    fileParallelism: false,
  },
});
