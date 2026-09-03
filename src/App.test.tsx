import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock hooks
vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() })
}));

describe('App', () => {
  it('renders the routed home page with document shell', () => {
    render(<App />);

    // AppShell: skip link + main landmark
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();

    // New document chrome
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByLabelText('Vikas Jaiswal — home')).toBeInTheDocument();

    // Home route: single display h1 + ledger + proof strip
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'I build the backends that move money, data, and messages'
    );
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Results, measured')).toBeInTheDocument();
    expect(screen.getByText('Selected work')).toBeInTheDocument();
  });
});
