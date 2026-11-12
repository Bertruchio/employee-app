import { describe, it, expect } from 'vitest';

describe('client smoke', () => {
  it('vitest runs in client package', () => {
    expect(1 + 1).toBe(2);
  });
});
