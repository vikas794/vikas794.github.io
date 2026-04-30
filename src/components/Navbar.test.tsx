import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renders correctly with light theme', () => {
    const mockToggleTheme = vi.fn();
    render(<Navbar theme="light" toggleTheme={mockToggleTheme} />);

    // Check for the sun/moon icons by aria-label or specific classes, wait,
    // Wait, the icons are simple lucide-react components.
    // When theme is dark, Sun is shown. When theme is light, Moon is shown.
    // Wait, let's verify what the component renders based on the theme prop.
    const toggleButtons = screen.getAllByLabelText('Toggle theme');
    expect(toggleButtons).toHaveLength(2); // Desktop and mobile
  });

  it('calls toggleTheme when buttons are clicked', () => {
    const mockToggleTheme = vi.fn();
    render(<Navbar theme="light" toggleTheme={mockToggleTheme} />);

    const toggleButtons = screen.getAllByLabelText('Toggle theme');
    fireEvent.click(toggleButtons[0]);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);

    fireEvent.click(toggleButtons[1]);
    expect(mockToggleTheme).toHaveBeenCalledTimes(2);
  });

  it('toggles mobile menu on hamburger click', () => {
    const mockToggleTheme = vi.fn();
    render(<Navbar theme="light" toggleTheme={mockToggleTheme} />);

    const hamburger = screen.getByLabelText('Toggle menu');
    const mobileMenu = document.getElementById('mobileMenu');

    expect(hamburger).not.toHaveClass('open');
    expect(mobileMenu).not.toHaveClass('open');

    // Open menu
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');
    expect(mobileMenu).toHaveClass('open');

    // Close menu
    fireEvent.click(hamburger);
    expect(hamburger).not.toHaveClass('open');
    expect(mobileMenu).not.toHaveClass('open');
  });

  it('closes mobile menu when a mobile link is clicked', () => {
    const mockToggleTheme = vi.fn();
    render(<Navbar theme="light" toggleTheme={mockToggleTheme} />);

    const hamburger = screen.getByLabelText('Toggle menu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Open menu
    fireEvent.click(hamburger);
    expect(hamburger).toHaveClass('open');
    expect(mobileMenu).toHaveClass('open');

    // Click a mobile link (the first one)
    const mobileLinks = mobileMenu?.querySelectorAll('.mobile-link');
    if (mobileLinks && mobileLinks.length > 0) {
      fireEvent.click(mobileLinks[0]);
    }

    // Hamburger doesn't remove "open" class based on code!
    // Wait, the mobile-link onClick sets menuOpen(false), which should remove "open" from both.
    expect(mobileMenu).not.toHaveClass('open');
    expect(hamburger).not.toHaveClass('open');
  });

  it('adds scrolled class on scroll down and removes on scroll to top', () => {
    const mockToggleTheme = vi.fn();
    render(<Navbar theme="light" toggleTheme={mockToggleTheme} />);

    const nav = document.getElementById('nav');
    expect(nav).not.toHaveClass('scrolled');

    // Simulate scrolling down
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(nav).toHaveClass('scrolled');

    // Simulate scrolling back to top
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(nav).not.toHaveClass('scrolled');
  });
});
