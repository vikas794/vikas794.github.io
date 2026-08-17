import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Skills from './Skills';

describe('Skills Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver as it's not available in JSDOM
    // and required by motion/react whileInView
    vi.stubGlobal('IntersectionObserver', function() {
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the section header correctly', () => {
    render(<Skills />);

    expect(screen.getByText('// toolbox')).toBeInTheDocument();
    expect(screen.getByText(/Technical Skills — Java, Spring Boot & Cloud/i)).toBeInTheDocument();
  });

  it('renders all skill category titles', () => {
    render(<Skills />);

    const titles = [
      'Core Backend',
      'Security & Auth',
      'Database',
      'Performance',
      '3rd Party SDKs',
      'Cloud & DevOps'
    ];

    titles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders skill tags', () => {
    render(<Skills />);

    // Check some specific tags from different categories
    expect(screen.getByText('Java 21')).toBeInTheDocument();
    expect(screen.getByText('Spring Boot')).toBeInTheDocument();
    expect(screen.getByText('MS SQL Server')).toBeInTheDocument();
    expect(screen.getByText('AWS S3')).toBeInTheDocument();
  });

  it('applies accent class to specific tags', () => {
    render(<Skills />);

    // "Java 17" is an accent tag in Core Backend
    const java17Tag = screen.getByText('Java 17');
    expect(java17Tag).toHaveClass('tag-accent');

    // "Java 8" is NOT an accent tag in Core Backend
    const java8Tag = screen.getByText('Java 8');
    expect(java8Tag).not.toHaveClass('tag-accent');
  });
});
