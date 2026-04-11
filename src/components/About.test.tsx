import { render, screen } from '@testing-library/react';
import About from './About';
import { describe, it, expect } from 'vitest';

describe('About Component', () => {
  it('renders the main heading correctly', () => {
    render(<About />);
    const heading = screen.getByRole('heading', { level: 2, name: /About Vikas Jaiswal/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the eyebrow text', () => {
    render(<About />);
    const eyebrow = screen.getByText('// who I am');
    expect(eyebrow).toBeInTheDocument();
  });

  it('renders the badges', () => {
    render(<About />);
    expect(screen.getByText('🏗️ System Design')).toBeInTheDocument();
    expect(screen.getByText('🔐 Security-first')).toBeInTheDocument();
    expect(screen.getByText('⚡ Performance tuning')).toBeInTheDocument();
  });

  it('renders the domains worked in', () => {
    render(<About />);
    expect(screen.getByText('FinTech / Algo Trading')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('EdTech')).toBeInTheDocument();
    expect(screen.getByText('Logistics')).toBeInTheDocument();
  });

  it('renders quick facts', () => {
    render(<About />);
    expect(screen.getByText('Quick Facts')).toBeInTheDocument();
    expect(screen.getByText(/Java Spring Boot Backend Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Mumbai, Maharashtra, India/)).toBeInTheDocument();
  });
});
