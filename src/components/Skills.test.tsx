import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skills from './Skills';

describe('Skills Component', () => {
  it('renders the component without crashing', () => {
    render(<Skills />);
    const section = document.getElementById('skills');
    expect(section).toBeInTheDocument();
  });

  it('renders the section headings correctly', () => {
    render(<Skills />);
    expect(screen.getByText('// toolbox')).toBeInTheDocument();
    expect(screen.getByText('Technical Skills — Java, Spring Boot & Cloud')).toBeInTheDocument();
  });

  it('renders all skill categories correctly', () => {
    render(<Skills />);
    const expectedCategories = [
      'Core Backend',
      'Security & Auth',
      'Database',
      'Performance',
      '3rd Party SDKs',
      'Cloud & DevOps'
    ];

    expectedCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('renders specific tags and applies accent class to accentTags', () => {
    render(<Skills />);

    // Core Backend category
    const java17Tag = screen.getByText('Java 17');
    expect(java17Tag).toBeInTheDocument();
    expect(java17Tag).toHaveClass('tag', 'tag-accent');

    const java8Tag = screen.getByText('Java 8');
    expect(java8Tag).toBeInTheDocument();
    expect(java8Tag).toHaveClass('tag');
    expect(java8Tag).not.toHaveClass('tag-accent');

    // Cloud & DevOps category
    const awsTag = screen.getByText('AWS S3');
    expect(awsTag).toBeInTheDocument();
    expect(awsTag).toHaveClass('tag', 'tag-accent');

    const gitTag = screen.getByText('Git');
    expect(gitTag).toBeInTheDocument();
    expect(gitTag).toHaveClass('tag');
    expect(gitTag).not.toHaveClass('tag-accent');
  });
});
