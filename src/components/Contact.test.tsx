import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from './Contact';

// Mock the MapSection component to avoid rendering the iframe and to isolate Contact tests
vi.mock('./MapSection', () => {
  return {
    default: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
      isOpen ? (
        <div data-testid="mock-map-section">
          Map is open
          <button onClick={onClose} data-testid="mock-close-map">Close</button>
        </div>
      ) : null
    )
  };
});

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard contact information and links correctly', async () => {
    await act(async () => {
      render(<Contact theme="light" />);
    });

    // Verify heading
    expect(screen.getByText(/Open to Work\./i)).toBeInTheDocument();
    expect(screen.getByText(/Let's Talk\./i)).toBeInTheDocument();

    // Verify contact links
    const emailLink = screen.getByRole('link', { name: /Email vikasjaiswal794@gmail\.com/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:vikasjaiswal794@gmail.com');

    const linkedinLink = screen.getByRole('link', { name: /LinkedIn linkedin\.com\/in\/vikasjaiswall/i });
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/vikasjaiswall/');

    const githubLink = screen.getByRole('link', { name: /GitHub github\.com\/vikas794/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/vikas794');
  });

  it('applies the light theme to GitHub stats images', async () => {
    await act(async () => {
      render(<Contact theme="light" />);
    });

    const statsImages = screen.getAllByRole('img');
    expect(statsImages.length).toBeGreaterThan(0);

    // Verify that the images include the "gruvbox" theme which maps to light
    statsImages.forEach(img => {
      expect(img.getAttribute('src')).toMatch(/theme=gruvbox|theme=transparent/);
    });
  });

  it('applies the dark theme to GitHub stats images', async () => {
    await act(async () => {
      render(<Contact theme="dark" />);
    });

    const statsImages = screen.getAllByRole('img');
    expect(statsImages.length).toBeGreaterThan(0);

    // Verify that the images include the "dark" theme (or transparent for streak)
    expect(statsImages[0].getAttribute('src')).toContain('theme=dark');
    expect(statsImages[1].getAttribute('src')).toContain('theme=dark');
    expect(statsImages[2].getAttribute('src')).toContain('theme=transparent');
  });

  it('opens and closes the map modal when location link is clicked', async () => {
    await act(async () => {
      render(<Contact theme="light" />);
    });

    // Map section should initially be closed
    expect(screen.queryByTestId('mock-map-section')).not.toBeInTheDocument();

    // Find the location div
    const locationDiv = screen.getByRole('button', { name: /Location Santacruz, Mumbai 400055 ↗ map/i });
    expect(locationDiv).toBeInTheDocument();

    // Click location to open map
    await act(async () => {
      fireEvent.click(locationDiv);
    });

    // Wait for the Suspense lazy load to finish
    await waitFor(() => {
      expect(screen.getByTestId('mock-map-section')).toBeInTheDocument();
    });

    // Close the map
    const closeButton = screen.getByTestId('mock-close-map');
    await act(async () => {
      fireEvent.click(closeButton);
    });

    // Verify map is closed
    await waitFor(() => {
      expect(screen.queryByTestId('mock-map-section')).not.toBeInTheDocument();
    });
  });

  it('opens the map modal with Enter key on location link', async () => {
    await act(async () => {
      render(<Contact theme="light" />);
    });

    const locationDiv = screen.getByRole('button', { name: /Location Santacruz, Mumbai 400055 ↗ map/i });

    // Press Enter
    await act(async () => {
      fireEvent.keyDown(locationDiv, { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-map-section')).toBeInTheDocument();
    });
  });

  it('opens the map modal with Space key on location link', async () => {
    await act(async () => {
      render(<Contact theme="light" />);
    });

    const locationDiv = screen.getByRole('button', { name: /Location Santacruz, Mumbai 400055 ↗ map/i });

    // Press Space
    await act(async () => {
      fireEvent.keyDown(locationDiv, { key: ' ', code: 'Space', charCode: 32 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('mock-map-section')).toBeInTheDocument();
    });
  });
});
