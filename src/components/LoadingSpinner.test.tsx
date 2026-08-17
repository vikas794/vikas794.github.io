import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner container with correct aria-label and classes', () => {
    render(<LoadingSpinner />);
    const container = screen.getByLabelText('Loading');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex items-center justify-center w-full h-full');
  });

  it('renders Loader2 icon with correct classes and size', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin text-[var(--accent)] lucide lucide-loader-circle');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });
});
