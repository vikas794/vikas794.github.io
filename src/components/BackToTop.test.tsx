import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BackToTop from './BackToTop';

describe('BackToTop', () => {
  beforeEach(() => {
    // Reset window properties before each test
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    vi.restoreAllMocks();
  });

  it('renders initially without visible class', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('visible');
  });

  it('becomes visible when scrolled past 500px', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 501, writable: true });
    fireEvent.scroll(window);

    expect(button).toHaveClass('visible');
  });

  it('hides when scrolled back up above 500px', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    // Scroll down first
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true });
    fireEvent.scroll(window);
    expect(button).toHaveClass('visible');

    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    fireEvent.scroll(window);
    expect(button).not.toHaveClass('visible');
  });

  it('calls window.scrollTo when clicked', () => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();

    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });

    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });
});
