import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Highlights from './Highlights';

describe('Highlights', () => {
  it('renders the highlights section with correct id and class', () => {
    const { container } = render(<Highlights />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'highlights');
    expect(section).toHaveClass('section', 'highlights-section');
  });

  it('renders the section header properly', () => {
    render(<Highlights />);
    expect(screen.getByText('// notable work')).toBeInTheDocument();
    expect(screen.getByText('Key Projects & Highlights')).toBeInTheDocument();
  });

  it('renders all 6 highlight cards', () => {
    const { container } = render(<Highlights />);
    const cards = container.querySelectorAll('.highlight-card');
    expect(cards).toHaveLength(6);
  });

  it('renders content correctly for the first highlight card', () => {
    render(<Highlights />);

    // Check for specific content from the first highlight
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('📈')).toBeInTheDocument();
    expect(screen.getByText('FinTech Trading Platform')).toBeInTheDocument();
    expect(screen.getByText(/Real-time algo-trading backend with Kite Connect OAuth/)).toBeInTheDocument();
    expect(screen.getByText('Kite Connect · WebSocket · Razorpay · iText7 · AWS S3')).toBeInTheDocument();
  });
});
