import { describe, it, expect } from 'vitest';
import { DEPARTMENTS, VALIDATION_RULES, API_ENDPOINTS, VALIDATION_MESSAGES } from '../constants/index.js';

describe('Shared Constants', () => {
  it('DEPARTMENTS should be an array of 6 frozen departments', () => {
    expect(DEPARTMENTS).toHaveLength(6);
    expect(Object.isFrozen(DEPARTMENTS)).toBe(true);
    expect(DEPARTMENTS).toContain('Разработка');
  });

  it('VALIDATION_RULES should be frozen and contain password and length limits', () => {
    expect(Object.isFrozen(VALIDATION_RULES)).toBe(true);
    expect(VALIDATION_RULES.PASSWORD_MAX_BYTES).toBe(72);
  });

  it('API_ENDPOINTS should be frozen', () => {
    expect(Object.isFrozen(API_ENDPOINTS)).toBe(true);
  });

  it('VALIDATION_MESSAGES should be frozen', () => {
    expect(Object.isFrozen(VALIDATION_MESSAGES)).toBe(true);
  });
});
