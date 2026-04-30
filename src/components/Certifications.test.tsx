import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Certifications from './Certifications';

describe('Certifications', () => {
  it('renders correctly', () => {
    render(<Certifications />);

    // Verify section title is present
    expect(screen.getByText('Certification Registry')).toBeInTheDocument();

    // Verify all certifications are listed
    expect(screen.getByText('Introduction to Generative AI, Google Cloud')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Certified: Azure Data Fundamentals (DP-900)')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Certified: Azure Fundamentals (AZ-900)')).toBeInTheDocument();

    // Verify modal elements exist but are not active initially
    const overlay = document.querySelector('.cert-modal-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).not.toHaveClass('active');

    const modal = screen.getByRole('dialog', { hidden: true });
    expect(modal).toBeInTheDocument();
    expect(modal).not.toHaveClass('active');
  });

  it('opens modal on card click', () => {
    render(<Certifications />);

    const certCard = screen.getByText('Introduction to Generative AI, Google Cloud').closest('.cert-card');
    expect(certCard).toBeInTheDocument();

    if (certCard) {
      fireEvent.click(certCard);
    }

    const overlay = document.querySelector('.cert-modal-overlay');
    expect(overlay).toHaveClass('active');

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('active');

    // Verify modal contains the correct certification name
    const modalTitle = document.querySelector('.cert-modal-title');
    expect(modalTitle).toHaveTextContent('Introduction to Generative AI, Google Cloud');
  });

  it('opens modal on Enter key press', () => {
    render(<Certifications />);

    const certCard = screen.getByText('Microsoft Certified: Azure Fundamentals (AZ-900)').closest('.cert-card');
    expect(certCard).toBeInTheDocument();

    if (certCard) {
      fireEvent.keyDown(certCard, { key: 'Enter', code: 'Enter', charCode: 13 });
    }

    const overlay = document.querySelector('.cert-modal-overlay');
    expect(overlay).toHaveClass('active');

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('active');
  });

  it('opens modal on Space key press', () => {
    render(<Certifications />);

    const certCard = screen.getByText('Microsoft Certified: Azure Data Fundamentals (DP-900)').closest('.cert-card');
    expect(certCard).toBeInTheDocument();

    if (certCard) {
      fireEvent.keyDown(certCard, { key: ' ', code: 'Space', charCode: 32 });
    }

    const overlay = document.querySelector('.cert-modal-overlay');
    expect(overlay).toHaveClass('active');

    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('active');
  });

  it('closes modal on close button click', () => {
    render(<Certifications />);

    // Open modal first
    const certCard = screen.getByText('Introduction to Generative AI, Google Cloud').closest('.cert-card');
    if (certCard) {
      fireEvent.click(certCard);
    }

    // Ensure modal is open
    expect(document.querySelector('.cert-modal-overlay')).toHaveClass('active');

    // Close modal
    const closeBtns = screen.getAllByRole('button', { name: /close/i });
    // Click the first close button found
    fireEvent.click(closeBtns[0]);

    // Verify modal is closed
    expect(document.querySelector('.cert-modal-overlay')).not.toHaveClass('active');
  });

  it('closes modal on overlay click', () => {
    render(<Certifications />);

    // Open modal first
    const certCard = screen.getByText('Introduction to Generative AI, Google Cloud').closest('.cert-card');
    if (certCard) {
      fireEvent.click(certCard);
    }

    // Ensure modal is open
    expect(document.querySelector('.cert-modal-overlay')).toHaveClass('active');

    // Close modal via overlay
    const overlay = document.querySelector('.cert-modal-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }

    // Verify modal is closed
    expect(document.querySelector('.cert-modal-overlay')).not.toHaveClass('active');
  });

  it('closes modal on Escape key press', () => {
    render(<Certifications />);

    // Open modal first
    const certCard = screen.getByText('Introduction to Generative AI, Google Cloud').closest('.cert-card');
    if (certCard) {
      fireEvent.click(certCard);
    }

    // Ensure modal is open
    expect(document.querySelector('.cert-modal-overlay')).toHaveClass('active');

    // Close modal via Escape key
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    // Verify modal is closed
    expect(document.querySelector('.cert-modal-overlay')).not.toHaveClass('active');
  });
});
