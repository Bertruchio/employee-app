import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  test: {
    name:        'client',
    root:        './client',
    environment: 'jsdom',
    globals:     true,
    include:     ['src/**/__tests__/**/*.test.{ts,tsx}'],
    setupFiles:  ['src/setupTests.ts'],
  },
});
