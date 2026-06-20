import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock hooks
vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() })
}));

// Mock static components
vi.mock('./components/Navbar', () => ({ default: () => <div data-testid="navbar" /> }));
vi.mock('./components/Hero', () => ({ default: () => <div data-testid="hero" /> }));
vi.mock('./components/Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('./components/Cursor', () => ({ default: () => <div data-testid="cursor" /> }));
vi.mock('./components/BackToTop', () => ({ default: () => <div data-testid="back-to-top" /> }));

// Mock lazy components
vi.mock('./components/About', () => ({ default: () => <div data-testid="about" /> }));
vi.mock('./components/Skills', () => ({ default: () => <div data-testid="skills" /> }));
vi.mock('./components/Experience', () => ({ default: () => <div data-testid="experience" /> }));
vi.mock('./components/Highlights', () => ({ default: () => <div data-testid="highlights" /> }));
vi.mock('./components/OtherProjects', () => ({ default: () => <div data-testid="other-projects" /> }));
vi.mock('./components/Certifications', () => ({ default: () => <div data-testid="certifications" /> }));
vi.mock('./components/Contact', () => ({ default: () => <div data-testid="contact" /> }));

describe('App', () => {
  it('renders the application shell with static components', async () => {
    render(<App />);

    // Check main role and aria-label
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label', 'Vikas Jaiswal Portfolio - Java Spring Boot Developer');

    // Static components should be available immediately
    expect(screen.getByTestId('cursor')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();

    // Lazy components should eventually render
    await waitFor(() => {
      expect(screen.getByTestId('about')).toBeInTheDocument();
    });

    expect(screen.getByTestId('skills')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('highlights')).toBeInTheDocument();
    expect(screen.getByTestId('other-projects')).toBeInTheDocument();
    expect(screen.getByTestId('certifications')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
  });
});
