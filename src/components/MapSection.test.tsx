import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MapSection from './MapSection';

describe('MapSection', () => {
  it('renders correctly when isOpen is false', () => {
    const mockOnClose = vi.fn();
    render(<MapSection isOpen={false} onClose={mockOnClose} />);

    // Verify overlay
    const overlay = document.getElementById('mapOverlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).not.toHaveClass('active');

    // Verify modal
    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).toBeInTheDocument();
    expect(modal).not.toHaveClass('active');
    expect(modal).toHaveAttribute('aria-hidden', 'true');

    // Verify iframe is not rendered
    const iframe = document.getElementById('mapFrame');
    expect(iframe).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    const mockOnClose = vi.fn();
    render(<MapSection isOpen={true} onClose={mockOnClose} />);

    // Verify overlay
    const overlay = document.getElementById('mapOverlay');
    expect(overlay).toHaveClass('active');

    // Verify modal
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('active');
    expect(modal).toHaveAttribute('aria-hidden', 'false');

    // Verify iframe is rendered
    const iframe = document.getElementById('mapFrame');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('title', 'Santacruz Mumbai map');
    expect(iframe).toHaveAttribute('src', 'https://www.google.com/maps?q=Santacruz+East+Mumbai&z=14&output=embed');
  });

  it('calls onClose when clicking the overlay', () => {
    const mockOnClose = vi.fn();
    render(<MapSection isOpen={true} onClose={mockOnClose} />);

    const overlay = document.getElementById('mapOverlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the close button', () => {
    const mockOnClose = vi.fn();
    render(<MapSection isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close map/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
