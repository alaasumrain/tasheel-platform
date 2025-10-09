import { act, renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

import useAdminRequestStatus from '../useAdminRequestStatus';

const mockRefresh = vi.fn();
const originalFetch = global.fetch;

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh
  })
}));

describe('useAdminRequestStatus', () => {
  beforeEach(() => {
    mockRefresh.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('updates status optimistically and finalizes on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAdminRequestStatus({ initialStatus: 'pending', requestId: '123' }));

    expect(result.current.statusValue).toBe('pending');

    act(() => {
      result.current.triggerStatusUpdate('in_progress');
    });

    expect(result.current.statusValue).toBe('in_progress');

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/requests/123/status',
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    await waitFor(() => {
      expect(result.current.snack).toMatchObject({
        type: 'success',
        message: 'Status updated'
      });
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it('rolls back status and surfaces error when update fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Unable to update status' })
    });
    global.fetch = mockFetch;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAdminRequestStatus({ initialStatus: 'pending', requestId: '123' }));

    act(() => {
      result.current.triggerStatusUpdate('completed');
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(result.current.statusValue).toBe('pending');
    });

    await waitFor(() => {
      expect(result.current.snack).toMatchObject({ type: 'error' });
    });

    expect(mockRefresh).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('handles network errors by restoring the previous status and showing fallback text', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network down'));
    global.fetch = mockFetch;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAdminRequestStatus({ initialStatus: 'pending', requestId: '456' }));

    act(() => {
      result.current.triggerStatusUpdate('completed');
    });

    expect(result.current.statusValue).toBe('completed');

    await waitFor(() => {
      expect(result.current.statusValue).toBe('pending');
    });

    await waitFor(() => {
      expect(result.current.snack).toMatchObject({
        type: 'error',
        message: 'Network down'
      });
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('handles select change events via handleStatusSelect', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAdminRequestStatus({ initialStatus: 'pending', requestId: '123' }));

    act(() => {
      result.current.handleStatusSelect({ target: { value: 'quote_sent' } });
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/requests/123/status',
        expect.objectContaining({
          body: JSON.stringify({ status: 'quote_sent' })
        })
      );
    });
  });
});
