import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Experience from './Experience';

describe('Experience Component', () => {
  it('renders the section title correctly', () => {
    render(<Experience />);

    expect(screen.getByText('// career')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /professional experience/i })).toBeInTheDocument();
  });

  it('renders all experience items', () => {
    render(<Experience />);

    // There are 3 experiences in the array
    const roles = [
      'Software Developer',
      'Database Engineer & Backend Developer',
      'Associate Software Engineer'
    ];

    roles.forEach(role => {
      expect(screen.getByRole('heading', { name: role })).toBeInTheDocument();
    });

    // Check companies are rendered
    expect(screen.getByText('WEQ Technologies · Mumbai')).toBeInTheDocument();
    expect(screen.getByText('Medify Nexus · Mumbai')).toBeInTheDocument();
    expect(screen.getByText('Wipro Pvt Ltd · Mumbai')).toBeInTheDocument();

    // Check periods are rendered
    expect(screen.getByText('Jul 2025 — Present')).toBeInTheDocument();
    expect(screen.getByText('Jan 2024 — Jul 2025')).toBeInTheDocument();
    expect(screen.getByText('Feb 2022 — Jan 2024')).toBeInTheDocument();
  });

  it('renders the Current badge for current role', () => {
    render(<Experience />);

    // WEQ Technologies is the current role and should have the "Current" badge
    const badge = screen.getByText('Current');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('exp-badge');
    expect(badge).toHaveClass('current');

    // There should only be one current badge as per data
    const badges = screen.getAllByText('Current');
    expect(badges).toHaveLength(1);
  });

  it('renders technologies for each experience', () => {
    render(<Experience />);

    // Check some specific technologies
    expect(screen.getByText('Java 17')).toBeInTheDocument();
    expect(screen.getByText('Kite Connect SDK')).toBeInTheDocument();
    expect(screen.getByText('MS SQL Server')).toBeInTheDocument();
    expect(screen.getByText('Hibernate')).toBeInTheDocument();
  });
});
