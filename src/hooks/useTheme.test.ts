import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme } from './useTheme';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// SSR-safe contract: first render is always "light" (matches server snapshot
// and the no-JS default). The stored value / pre-paint DOM class syncs via effect.
describe('useTheme', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';

    originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
    vi.restoreAllMocks();
  });

  it('should default to light theme when no localStorage or DOM class', async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should sync dark theme from localStorage via effect', async () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should sync light theme from localStorage via effect', async () => {
    localStorage.setItem('theme', 'light');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should sync dark theme from the pre-paint DOM class', async () => {
    document.documentElement.classList.add('dark');

    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
  });

  it('should toggle theme from light to dark', async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle theme from dark to light', async () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
