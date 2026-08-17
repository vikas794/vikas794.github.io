import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with the correct aria-label', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
  });

  it('contains the expected CSS classes', () => {
    render(<LoadingSpinner />);
    const container = screen.getByLabelText('Loading');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center', 'w-full', 'h-full');

    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('animate-spin', 'text-[var(--accent)]');
  });
});
