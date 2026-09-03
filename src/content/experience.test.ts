import { describe, it, expect } from 'vitest';
import { experiences } from './experience';

describe('experience content invariants', () => {
  it('weights bullets by recency: WEQ 7, Medify 5, Wipro 3 max', () => {
    const counts = experiences.map((e) => e.groups.flatMap((g) => g.items).length);
    expect(counts).toEqual([7, 5, 3]);
  });

  it('groups every bullet under a mono sub-label', () => {
    for (const e of experiences) {
      expect(e.groups.length).toBeGreaterThanOrEqual(2);
      for (const g of e.groups) {
        expect(g.label.trim().length).toBeGreaterThan(0);
        expect(g.label).toBe(g.label.toUpperCase());
        expect(g.items.length).toBeGreaterThan(0);
      }
    }
  });

  it('gives every role product context and a current flag', () => {
    for (const e of experiences) {
      expect(e.productContext.trim().length).toBeGreaterThan(0);
    }
    expect(experiences.filter((e) => e.current).length).toBe(1);
  });
});
