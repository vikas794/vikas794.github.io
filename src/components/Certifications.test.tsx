import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Certifications from './Certifications';

describe('Certifications', () => {
  it('renders the component correctly', () => {
    render(<Certifications />);

    // Verify main header
    expect(screen.getByText('Certification Registry')).toBeInTheDocument();

    // Verify the presence of cert cards
    const certCards = screen.getAllByRole('button');
    // There are 3 certificates in the CERTS array
    expect(certCards.length).toBeGreaterThanOrEqual(3);

    // Check for specific certificate names
    expect(screen.getByText('Introduction to Generative AI, Google Cloud')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Certified: Azure Fundamentals (AZ-900)')).toBeInTheDocument();
  });

  it('opens the modal when clicking a certificate card', async () => {
    const user = userEvent.setup();
    render(<Certifications />);

    // Initially modal should not be active
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveClass('active');

    // Click the first cert card
    const certCards = screen.getAllByRole('button');
    await user.click(certCards[0]);

    // Modal should be active now
    expect(dialog).toHaveClass('active');

    // Verify modal contents
    expect(screen.getByText('Direct Verification Pathway')).toBeInTheDocument();
    // The issuer is Google Cloud for the first one
    expect(screen.getByText('Google Cloud Secured Badge')).toBeInTheDocument();
  });

  it('opens the modal when pressing Enter on a certificate card', async () => {
    render(<Certifications />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveClass('active');

    const certCards = screen.getAllByRole('button');
    fireEvent.keyDown(certCards[0], { key: 'Enter', code: 'Enter' });

    expect(dialog).toHaveClass('active');
  });

  it('opens the modal when pressing Space on a certificate card', async () => {
    render(<Certifications />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).not.toHaveClass('active');

    const certCards = screen.getAllByRole('button');
    fireEvent.keyDown(certCards[0], { key: ' ', code: 'Space' });

    expect(dialog).toHaveClass('active');
  });

  it('closes the modal when clicking the Close button (X)', async () => {
    const user = userEvent.setup();
    render(<Certifications />);

    // Open modal
    const certCards = screen.getAllByRole('button');
    await user.click(certCards[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('active');

    // Click the X close button
    const closeBtn = screen.getByLabelText('Close');
    await user.click(closeBtn);

    expect(dialog).not.toHaveClass('active');
  });

  it('closes the modal when clicking the Return to Site button', async () => {
    const user = userEvent.setup();
    render(<Certifications />);

    // Open modal
    const certCards = screen.getAllByRole('button');
    await user.click(certCards[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('active');

    // Click "Return to Site"
    const returnBtn = screen.getByRole('button', { name: /return to site/i });
    await user.click(returnBtn);

    expect(dialog).not.toHaveClass('active');
  });

  it('closes the modal when clicking the overlay', async () => {
    const user = userEvent.setup();
    render(<Certifications />);

    // Open modal
    const certCards = screen.getAllByRole('button');
    await user.click(certCards[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('active');

    // The overlay is the div before the dialog. It doesn't have a role,
    // but we can find it by class
    const overlay = document.querySelector('.cert-modal-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) {
      await user.click(overlay);
    }

    expect(dialog).not.toHaveClass('active');
  });

  it('closes the modal when pressing the Escape key', async () => {
    const user = userEvent.setup();
    render(<Certifications />);

    // Open modal
    const certCards = screen.getAllByRole('button');
    await user.click(certCards[0]);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('active');

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(dialog).not.toHaveClass('active');
  });
});
