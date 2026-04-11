import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import MapSection from './MapSection';

describe('MapSection', () => {
  it('renders default state without active class when isOpen is false', () => {
    const { container } = render(<MapSection isOpen={false} onClose={vi.fn()} />);

    // Check elements are present but don't have active class
    const overlay = container.querySelector('.map-overlay');
    expect(overlay).not.toHaveClass('active');

    const modal = container.querySelector('.map-modal');
    expect(modal).not.toHaveClass('active');

    // Check aria attributes
    expect(modal).toHaveAttribute('aria-hidden', 'true');

    // Check iframe is not rendered
    const iframe = container.querySelector('.map-frame');
    expect(iframe).not.toBeInTheDocument();
  });

  it('renders active state with iframe when isOpen is true', () => {
    const { container } = render(<MapSection isOpen={true} onClose={vi.fn()} />);

    // Check elements have active class
    const overlay = container.querySelector('.map-overlay');
    expect(overlay).toHaveClass('active');

    const modal = container.querySelector('.map-modal');
    expect(modal).toHaveClass('active');

    // Check aria attributes
    expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Check iframe is rendered
    const iframe = container.querySelector('.map-frame');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://www.google.com/maps?q=Santacruz+East+Mumbai&z=14&output=embed');
  });

  it('calls onClose when clicking the overlay', () => {
    const handleClose = vi.fn();
    const { container } = render(<MapSection isOpen={true} onClose={handleClose} />);

    const overlay = container.querySelector('.map-overlay');
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the close button', () => {
    const handleClose = vi.fn();
    const { container } = render(<MapSection isOpen={true} onClose={handleClose} />);

    const closeBtn = container.querySelector('.map-close');
    expect(closeBtn).toBeInTheDocument();

    if (closeBtn) {
      fireEvent.click(closeBtn);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
