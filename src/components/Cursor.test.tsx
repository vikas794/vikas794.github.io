import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Cursor from './Cursor';

describe('Cursor Component', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let requestAnimationFrameMock: any;
  let cancelAnimationFrameMock: any;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;

    // Default mock to fine pointer for most tests
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(pointer: fine)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    requestAnimationFrameMock = vi.fn((cb) => setTimeout(cb, 0));
    cancelAnimationFrameMock = vi.fn((id) => clearTimeout(id));

    vi.stubGlobal('requestAnimationFrame', requestAnimationFrameMock);
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameMock);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders nothing when pointer is not fine', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<Cursor />);
    expect(container.firstChild).toBeNull();
  });

  it('renders cursor and follower when pointer is fine', () => {
    const { container } = render(<Cursor />);

    const cursor = container.querySelector('.cursor');
    const follower = container.querySelector('.cursor-follower');

    expect(cursor).toBeInTheDocument();
    expect(follower).toBeInTheDocument();
  });

  it('adds hovered class on mouseover specific elements', () => {
    const { container } = render(
      <>
        <Cursor />
        <a href="#" id="test-link">Link</a>
      </>
    );

    const cursor = container.querySelector('.cursor');
    const follower = container.querySelector('.cursor-follower');

    expect(cursor).not.toHaveClass('hovered');
    expect(follower).not.toHaveClass('hovered');

    const link = document.getElementById('test-link');
    act(() => {
      const event = new MouseEvent('mouseover', { bubbles: true });
      link?.dispatchEvent(event);
    });

    expect(cursor).toHaveClass('hovered');
    expect(follower).toHaveClass('hovered');
  });

  it('removes hovered class on mouseout', () => {
    const { container } = render(
      <>
        <Cursor />
        <a href="#" id="test-link">Link</a>
      </>
    );

    const cursor = container.querySelector('.cursor');
    const follower = container.querySelector('.cursor-follower');
    const link = document.getElementById('test-link');

    act(() => {
      const event = new MouseEvent('mouseover', { bubbles: true });
      link?.dispatchEvent(event);
    });

    expect(cursor).toHaveClass('hovered');

    act(() => {
      const event = new MouseEvent('mouseout', { bubbles: true });
      link?.dispatchEvent(event);
    });

    expect(cursor).not.toHaveClass('hovered');
    expect(follower).not.toHaveClass('hovered');
  });

  it('updates position on mousemove', async () => {
    const { container } = render(<Cursor />);

    act(() => {
      const event = new MouseEvent('mousemove', { clientX: 100, clientY: 200, bubbles: true });
      document.dispatchEvent(event);
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const cursor = container.querySelector('.cursor') as HTMLElement;

    expect(cursor.style.transform).toContain('translate3d(100px, 200px, 0');
  });

  it('cleans up event listeners and animation frames on unmount', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(<Cursor />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));
    expect(cancelAnimationFrameMock).toHaveBeenCalled();
  });
});
