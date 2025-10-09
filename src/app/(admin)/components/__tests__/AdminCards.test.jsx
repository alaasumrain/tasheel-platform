import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import RequestDataCard from '../RequestDataCard';
import ActionsCard from '../ActionsCard';
import TimelineCard from '../TimelineCard';
import DocumentsCard from '../DocumentsCard';

describe('Admin request UI cards', () => {
  const baseData = {
    contact: { email: 'user@example.com' },
    submittedAt: '2024-05-01T12:00:00.000Z',
    turnaround: '24 hours',
    options: { certification: true, instructions: 'Call client when ready.' }
  };

  it('renders request data and triggers status change', async () => {
    const handleStatusChange = vi.fn();

    render(
      <RequestDataCard
        data={baseData}
        statusValue="submitted"
        onStatusChange={handleStatusChange}
        isPending={false}
      />
    );

    expect(screen.getByText('Request data')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toHaveTextContent('Submitted');
    expect(screen.getByText('Call client when ready.')).toBeInTheDocument();

    const select = screen.getByLabelText('Status');
    fireEvent.mouseDown(select);

    const option = await screen.findByRole('option', { name: 'In progress' });
    fireEvent.click(option);

    expect(handleStatusChange).toHaveBeenCalledTimes(1);
    expect(handleStatusChange.mock.calls[0][0]).toMatchObject({ target: { value: 'in_progress' } });
  });

  it('disables status input when pending and shows fallback copy', () => {
    render(
      <RequestDataCard
        data={{ ...baseData, options: {} }}
        statusValue="submitted"
        onStatusChange={vi.fn()}
        isPending
      />
    );

    expect(screen.getByLabelText('Status')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('None provided.')).toBeInTheDocument();
  });

  it('invokes action handlers and honours disabled state', () => {
    const trigger = vi.fn();

    const { rerender } = render(
      <ActionsCard statusValue="submitted" onStatusChange={trigger} isPending={false} />
    );

    const action = screen.getByRole('button', { name: 'Mark as quote sent' });
    fireEvent.click(action);

    expect(trigger).toHaveBeenCalledWith('quote_sent');

    rerender(<ActionsCard statusValue="quote_sent" onStatusChange={trigger} isPending={false} />);
    expect(screen.getByRole('button', { name: 'Mark as quote sent' })).toBeDisabled();

    rerender(<ActionsCard statusValue="submitted" onStatusChange={trigger} isPending />);
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('renders timeline items and empty state', () => {
    const events = [
      { id: '1', eventType: 'Submitted', createdAt: '2024-01-01T00:00:00.000Z', notes: 'Initial submit.' },
      { id: '2', eventType: 'Quote sent', createdAt: '2024-01-02T00:00:00.000Z' }
    ];

    const { rerender } = render(<TimelineCard events={events} />);

    expect(screen.getByText('Submitted')).toBeInTheDocument();
    expect(screen.getByText('Quote sent')).toBeInTheDocument();

    rerender(<TimelineCard events={[]} />);
    expect(screen.getByText('No events logged yet.')).toBeInTheDocument();
  });

  it('renders documents and empty fallback', () => {
    const attachments = [
      { id: '1', fileName: 'contract.pdf', fileSize: 1024 * 1024 * 2, url: '/contract.pdf' }
    ];

    const { rerender } = render(<DocumentsCard attachments={attachments} />);

    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute('href', '/contract.pdf');

    rerender(<DocumentsCard attachments={[]} />);
    expect(screen.getByText('No documents uploaded.')).toBeInTheDocument();
  });
});
