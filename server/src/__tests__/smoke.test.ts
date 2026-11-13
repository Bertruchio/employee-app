import { describe, it, expect } from 'vitest';
describe('server smoke', () => {
  it('vitest runs in server package', () => {
    expect(1 + 1).toBe(2);
  });
});
