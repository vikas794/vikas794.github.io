import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About', () => {
  it('renders correctly', () => {
    render(<About />);

    // Check main title
    expect(screen.getByText('About Vikas Jaiswal — Java Spring Boot Developer')).toBeInTheDocument();

    // Check section headers
    expect(screen.getByText('Domains worked in')).toBeInTheDocument();
    expect(screen.getByText('Quick Facts')).toBeInTheDocument();
  });

  it('renders domain items', () => {
    render(<About />);

    // Check specific domains
    expect(screen.getByText('FinTech / Algo Trading')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('EdTech')).toBeInTheDocument();
    expect(screen.getByText('Logistics')).toBeInTheDocument();
  });

  it('renders quick facts items', () => {
    render(<About />);

    // Check specific quick facts
    expect(screen.getByText('Vikas Jaiswal')).toBeInTheDocument();
    expect(screen.getByText('Currently at WEQ Technologies')).toBeInTheDocument();
    expect(screen.getByText('Mumbai, Maharashtra, India')).toBeInTheDocument();
    expect(screen.getByText('Core Stack')).toBeInTheDocument();
  });
});
