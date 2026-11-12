import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'shared/vitest.config.ts',
  'server/vitest.config.ts',
  'client/vitest.config.ts',
]);
