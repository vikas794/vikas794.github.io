import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackToTop from './BackToTop';

describe('BackToTop', () => {
  it('stays hidden until scrolled past the threshold', () => {
    render(<BackToTop />);
    expect(screen.queryByLabelText('Back to top')).not.toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByLabelText('Back to top')).toBeInTheDocument();
  });

  it('scrolls to top on click', () => {
    const scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });

    render(<BackToTop />);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    fireEvent.click(screen.getByLabelText('Back to top'));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
