import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import CaseStudyView from './CaseStudy';
import { caseStudies } from '../../content/projects';

const study = caseStudies.find((c) => c.slug === 'market-ticks-fanout')!;

function renderStudy() {
  return render(
    <MemoryRouter>
      <CaseStudyView study={study} />
    </MemoryRouter>
  );
}

describe('CaseStudy template', () => {
  it('renders one h1, header ledger, and all nine blocks', () => {
    renderStudy();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(study.title);
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    for (const block of [
      'The problem',
      'Constraints',
      'Architecture',
      'The critical path',
      'Decisions and trade-offs',
      'Code that mattered',
      'Results',
      "What I'd do differently",
    ]) {
      expect(h2s, block).toContain(block);
    }
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
  });

  it('offers Skip to results and an accessible diagram', () => {
    renderStudy();
    expect(screen.getByText('Skip to results')).toHaveAttribute('href', '#results');
    expect(screen.getByRole('img', { name: /fan-out architecture/i })).toBeInTheDocument();
    expect(screen.getByText(/one upstream socket feeds thousands/i)).toBeInTheDocument();
  });

  it('shows the code excerpt with its honesty note', () => {
    renderStudy();
    expect(screen.getByText('BroadcastScheduler.java')).toBeInTheDocument();
    expect(screen.getByText(/not a verbatim paste/i)).toBeInTheDocument();
  });
});
