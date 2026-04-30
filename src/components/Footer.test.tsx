import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders footer element with correct role', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });

  it('renders logo text correctly', () => {
    render(<Footer />);
    const logo = screen.getByText('[VJ]');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass('footer-logo');
  });

  it('renders copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear} Vikas Jaiswal · Java Spring Boot Backend Developer · Mumbai, India`));
    expect(copyrightText).toBeInTheDocument();
    expect(copyrightText).toHaveClass('footer-copy');
  });

  it('renders GitHub Pages link with correct attributes', () => {
    render(<Footer />);
    const link = screen.getByRole('link', { name: /GitHub Pages/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://pages.github.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
