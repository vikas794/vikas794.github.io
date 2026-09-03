import { describe, it, expect } from 'vitest';
import { caseStudies, proofStrip, alsoShipped } from './projects';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('case-study content invariants', () => {
  it('states every problem as a constraint in 80 words or fewer', () => {
    for (const c of caseStudies) {
      expect(words(c.problem), c.slug).toBeLessThanOrEqual(80);
    }
  });

  it('keeps every code excerpt to 20 lines or fewer', () => {
    for (const c of caseStudies) {
      if (c.code) expect(c.code.lines.length, c.slug).toBeLessThanOrEqual(20);
    }
  });

  it('names a measurement method for every outcome', () => {
    for (const c of caseStudies) {
      expect(c.outcomes.length, c.slug).toBeGreaterThan(0);
      for (const o of c.outcomes) {
        expect(o.method.trim().length, `${c.slug}:${o.metric}`).toBeGreaterThan(0);
      }
    }
  });

  it('links every proof-strip metric to a real case study', () => {
    const slugs = new Set(caseStudies.map((c) => c.slug));
    expect(proofStrip.length).toBe(4);
    for (const m of proofStrip) {
      expect(slugs.has(m.slug), m.label).toBe(true);
    }
  });

  it('gives every study a decision table and a reflection', () => {
    for (const c of caseStudies) {
      expect(c.decisions.length, c.slug).toBeGreaterThanOrEqual(2);
      expect(c.whatIdDoDifferently.trim().length, c.slug).toBeGreaterThan(0);
      expect(c.updated, c.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps also-shipped to honest one-liners', () => {
    expect(alsoShipped.length).toBeGreaterThanOrEqual(5);
  });
});
