import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders developer name and basic information', () => {
    render(<Hero />);

    expect(screen.getByText('Vikas')).toBeInTheDocument();
    expect(screen.getByText('Jaiswal')).toBeInTheDocument();
    expect(screen.getByText(/Available for opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/Mumbai, India/i)).toBeInTheDocument();
  });

  it('renders metrics section correctly', () => {
    render(<Hero />);

    expect(screen.getAllByText('4')[0]).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('REST APIs Built')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('Integration Time Cut')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('Manual Effort Cut')).toBeInTheDocument();
  });

  it('animates typing effect through phrases', () => {
    const { container } = render(<Hero />);

    const typedTextSpan = container.querySelector('.typed-text');
    expect(typedTextSpan).toBeInTheDocument();

    // Initially should be empty
    expect(typedTextSpan?.textContent).toBe('');


    // Type out the first phrase
    for (let i = 0; i < 22; i++) {
      act(() => {
        vi.advanceTimersByTime(80);
      });
    }

    expect(typedTextSpan?.textContent).toBe('Java Backend Developer');

    // Pause before deleting
    act(() => {
      vi.advanceTimersByTime(1800);
    });

    // Delete the phrase
    for (let i = 0; i < 22; i++) {
      act(() => {
        vi.advanceTimersByTime(45);
      });
    }

    // We expect it to be empty or just the first char deleted depending on how the loop ran.
    // The exact deleting process might need a couple extra ticks to fully clear and move to the next word.
    act(() => {
        vi.advanceTimersByTime(45); // One more to set deleting to false
    });

    expect(typedTextSpan?.textContent).toBe('');

    // Type out the second phrase
    for (let i = 0; i < 22; i++) {
      act(() => {
        vi.advanceTimersByTime(80);
      });
    }

    expect(typedTextSpan?.textContent).toBe('Spring Boot Specialist');
  });

  it('renders the code panel', () => {
    render(<Hero />);

    expect(screen.getByText('VikasJaiswal.java')).toBeInTheDocument();
    expect(screen.getByText(/Java 17 \+ Spring Boot 3\.x/i)).toBeInTheDocument();
    expect(screen.getByText('@RestController')).toBeInTheDocument();
  });
});
