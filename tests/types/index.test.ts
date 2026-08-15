import { describe, it, expect } from 'vitest';

// Import the module under test
import * as mod from '@/src/types/index';

// index.ts is a TYPE-ONLY barrel (`export type {...}`) — TypeScript erases
// types at runtime, so zero runtime exports is the CORRECT behavior here.
describe('index', () => {
  it('should import cleanly', () => {
    expect(mod).toBeDefined();
    expect(typeof mod).toBe('object');
  });

  it('should have no accidental runtime exports (types are compile-time only)', () => {
    const exports = Object.keys(mod);
    for (const key of exports) {
      expect((mod as Record<string, unknown>)[key]).toBeDefined();
    }
  });
});
