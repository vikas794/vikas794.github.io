import { render, screen, fireEvent } from '@testing-library/react';
import Cursor from './Cursor';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Cursor', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => setTimeout(cb, 0)));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id) => clearTimeout(id)));
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.matchMedia = originalMatchMedia;
  });

  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(pointer: fine)' ? matches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  it('returns null if pointer is not fine', () => {
    mockMatchMedia(false);
    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });

  it('renders cursor elements when fine pointer is matched', () => {
    mockMatchMedia(true);
    const { container } = render(<Cursor />);
    expect(container.querySelector('.cursor')).toBeInTheDocument();
    expect(container.querySelector('.cursor-follower')).toBeInTheDocument();
  });

  it('adds hovered class on mouseover an interactable element and removes it on mouseout', () => {
    mockMatchMedia(true);
    const { container } = render(
      <div>
        <Cursor />
        <a href="#" id="test-link">Link</a>
      </div>
    );

    const cursor = container.querySelector('.cursor');
    const follower = container.querySelector('.cursor-follower');

    expect(cursor).not.toHaveClass('hovered');
    expect(follower).not.toHaveClass('hovered');

    const link = container.querySelector('#test-link');
    if (link) {
      fireEvent.mouseOver(link);
    }

    expect(cursor).toHaveClass('hovered');
    expect(follower).toHaveClass('hovered');

    if (link) {
      fireEvent.mouseOut(link);
    }

    expect(cursor).not.toHaveClass('hovered');
    expect(follower).not.toHaveClass('hovered');
  });

  it('cleans up event listeners on unmount', () => {
    mockMatchMedia(true);
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Cursor />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));
  });
});
