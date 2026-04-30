import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OtherProjects from './OtherProjects';

describe('OtherProjects', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());

    // Mock IntersectionObserver using a class
    class IntersectionObserverMock {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    window.IntersectionObserver = IntersectionObserverMock as any;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null initially when there are no projects', () => {
    // Mock an unresolved/delayed promise so the initial render state is tested
    const mockFetch = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal('fetch', mockFetch);

    const { container } = render(<OtherProjects />);
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches and displays projects with has_pages enabled', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'project-with-pages',
        description: 'A project with pages',
        html_url: 'https://github.com/test/project-with-pages',
        has_pages: true,
        language: 'TypeScript'
      },
      {
        id: 2,
        name: 'project-without-pages',
        description: 'A project without pages',
        html_url: 'https://github.com/test/project-without-pages',
        has_pages: false,
        language: 'JavaScript'
      }
    ];

    const mockFetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockRepos)
    }));
    vi.stubGlobal('fetch', mockFetch);

    render(<OtherProjects />);

    await waitFor(() => {
      // The name logic replaces hyphens with spaces
      expect(screen.getByText('project with pages')).toBeInTheDocument();
    });

    // Verify the project without pages is NOT displayed
    expect(screen.queryByText('project without pages')).not.toBeInTheDocument();
  });

  it('excludes the portfolio repository', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'vikas794.github.io',
        description: 'Portfolio site',
        html_url: 'https://github.com/vikas794/vikas794.github.io',
        has_pages: true,
        language: 'TypeScript'
      },
      {
        id: 2,
        name: 'valid-project',
        description: 'Valid project',
        html_url: 'https://github.com/vikas794/valid-project',
        has_pages: true,
        language: 'JavaScript'
      }
    ];

    const mockFetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockRepos)
    }));
    vi.stubGlobal('fetch', mockFetch);

    render(<OtherProjects />);

    await waitFor(() => {
      expect(screen.getByText('valid project')).toBeInTheDocument();
    });

    // The portfolio repo should be excluded
    expect(screen.queryByText('vikas794.github.io')).not.toBeInTheDocument();
    expect(screen.queryByText('vikas794.github io')).not.toBeInTheDocument(); // after hyphen replace
  });

  it('replaces hyphens with spaces in the repository name', async () => {
    const mockRepos = [
      {
        id: 1,
        name: 'my-awesome-project',
        description: 'Awesome project',
        html_url: 'https://github.com/test/my-awesome-project',
        has_pages: true,
        language: 'TypeScript'
      }
    ];

    const mockFetch = vi.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockRepos)
    }));
    vi.stubGlobal('fetch', mockFetch);

    render(<OtherProjects />);

    await waitFor(() => {
      expect(screen.getByText('my awesome project')).toBeInTheDocument();
    });

    // Verify the original string with hyphens is NOT displayed (the replacing works)
    expect(screen.queryByText('my-awesome-project')).not.toBeInTheDocument();
  });
});
