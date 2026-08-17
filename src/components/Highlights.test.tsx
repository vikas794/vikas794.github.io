import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Highlights from './Highlights';

describe('Highlights', () => {
  it('renders the section with correct id', () => {
    const { container } = render(<Highlights />);
    const section = container.querySelector('#highlights');
    expect(section).toBeInTheDocument();
  });

  it('renders the section header text', () => {
    render(<Highlights />);
    expect(screen.getByText('// notable work')).toBeInTheDocument();
    expect(screen.getByText('Key Projects & Highlights')).toBeInTheDocument();
  });

  it('renders all 6 highlight cards with correct content', () => {
    render(<Highlights />);

    // Check first and last cards
    expect(screen.getByText('FinTech Trading Platform')).toBeInTheDocument();
    expect(screen.getByText('Database Performance')).toBeInTheDocument();

    // Check numbers
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('06')).toBeInTheDocument();

    // Total highlight cards should be 6
    const cards = document.querySelectorAll('.highlight-card');
    expect(cards.length).toBe(6);
  });
});
