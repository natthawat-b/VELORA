import { describe, it, expect } from 'vitest';
import { isEven, formatUser } from './utils';

describe('utils test suite', () => {
  it('should correctly identify even numbers', () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(3)).toBe(false);
  });

  it('should format user info correctly', () => {
    expect(formatUser('Praep', 'Admin')).toBe('Praep (Admin)');
    expect(formatUser('', 'Admin')).toBe('Guest');
  });
});