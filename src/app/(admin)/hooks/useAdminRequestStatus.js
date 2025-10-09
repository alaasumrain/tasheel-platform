import { useCallback, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function useAdminRequestStatus({ initialStatus, requestId }) {
  const router = useRouter();
  const [statusValue, setStatusValueState] = useState(initialStatus);
  const statusRef = useRef(initialStatus);
  const [snack, setSnack] = useState(null);
  const [isPending, startTransition] = useTransition();

  const setStatusValue = useCallback((nextStatus) => {
    statusRef.current = nextStatus;
    setStatusValueState(nextStatus);
  }, []);

  const triggerStatusUpdate = useCallback(
    (nextStatus) => {
      const previousStatus = statusRef.current;
      setStatusValue(nextStatus);

      startTransition(async () => {
        try {
          const response = await fetch(`/api/admin/requests/${requestId}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            throw new Error(body.error || 'Unable to update status');
          }

          setSnack({ type: 'success', message: 'Status updated' });
          router.refresh();
        } catch (error) {
          console.error('Status update failed', error);
          setSnack({ type: 'error', message: error.message || 'Status update failed' });
          setStatusValue(previousStatus);
        }
      });
    },
    [requestId, router, setStatusValue]
  );

  const handleStatusSelect = useCallback(
    (event) => {
      triggerStatusUpdate(event.target.value);
    },
    [triggerStatusUpdate]
  );

  return {
    statusValue,
    triggerStatusUpdate,
    handleStatusSelect,
    isPending,
    snack,
    setSnack
  };
}
