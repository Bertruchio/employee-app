import { describe, it, expect } from 'vitest';
describe('shared smoke', () => {
  it('vitest runs in shared package', () => {
    expect(1 + 1).toBe(2);
  });
});
