import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import OtherProjects from './OtherProjects';

describe('OtherProjects', () => {
  const mockRepos = [
    {
      id: 1,
      name: 'repo1',
      description: 'desc1',
      html_url: 'url1',
      has_pages: true,
      language: 'TypeScript'
    },
    {
      id: 2,
      name: 'vikas794.github.io',
      description: 'desc2',
      html_url: 'url2',
      has_pages: true,
      language: 'CSS'
    },
    {
      id: 3,
      name: 'repo3',
      description: 'desc3',
      html_url: 'url3',
      has_pages: false,
      language: 'Java'
    }
  ];

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockRepos),
      })
    ));
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and displays filtered repos and caches them', async () => {
    const { getByText } = render(<OtherProjects />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(getByText('repo1')).toBeInTheDocument();
    });

    const cachedData = sessionStorage.getItem('github_projects_cache');
    expect(cachedData).not.toBeNull();
    const parsedData = JSON.parse(cachedData!);
    expect(parsedData).toHaveLength(1);
    expect(parsedData[0].name).toBe('repo1');
  });

  it('uses cached data if available and does not fetch', async () => {
    const cachedRepos = [
      {
        id: 10,
        name: 'cached-repo',
        description: 'cached-desc',
        html_url: 'cached-url',
        has_pages: true,
        language: 'JavaScript'
      }
    ];
    sessionStorage.setItem('github_projects_cache', JSON.stringify(cachedRepos));

    const { getByText } = render(<OtherProjects />);

    await waitFor(() => {
      expect(getByText('cached-repo')).toBeInTheDocument();
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('filters out the user portfolio repo and repos without pages', async () => {
    const { getByText, queryByText } = render(<OtherProjects />);

    await waitFor(() => {
      expect(getByText('repo1')).toBeInTheDocument();
    });

    expect(queryByText('vikas794.github.io')).not.toBeInTheDocument();
    expect(queryByText('repo3')).not.toBeInTheDocument();
  });
});
