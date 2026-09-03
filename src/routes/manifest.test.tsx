import { describe, it, expect } from 'vitest';
import { expandRoutes, resolveMeta, routes } from './manifest';
import { caseStudies } from '../content/projects';

describe('route manifest', () => {
  it('expands to every indexable path with trailing slashes', () => {
    const paths = expandRoutes();
    for (const p of ['/', '/about/', '/experience/', '/projects/', '/resume/', '/contact/']) {
      expect(paths).toContain(p);
    }
    for (const c of caseStudies) {
      expect(paths).toContain(`/projects/${c.slug}/`);
    }
    expect(paths).not.toContain('*');
  });

  it('resolves unique metadata per route', () => {
    const titles = new Set(routes.filter((r) => r.path !== '*').map((r) => r.meta.title));
    expect(titles.size).toBe(routes.filter((r) => r.path !== '*').length);
  });

  it('marks the catch-all as noindex', () => {
    expect(resolveMeta('/definitely-not-a-page/').noindex).toBe(true);
  });
});
