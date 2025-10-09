import { formatTurnaround } from './formatters';

export function deriveAdminMetrics(requests = []) {
  let newSubmissions = 0;
  let rush = 0;
  let awaitingApproval = 0;

  for (const request of requests) {
    if (request.status === 'submitted') {
      newSubmissions += 1;
    }

    const turnaround = request?.turnaround;
    if (typeof turnaround === 'string' && turnaround.trim().toLowerCase().startsWith('rush')) {
      rush += 1;
    }

    if (request.status === 'quote_sent') {
      awaitingApproval += 1;
    }
  }

  return [
    { label: 'New submissions', value: newSubmissions, icon: 'tabler-inbox' },
    { label: 'Rush jobs', value: rush, icon: 'tabler-clock-bolt' },
    { label: 'Awaiting approval', value: awaitingApproval, icon: 'tabler-mail-forward' }
  ];
}

const ACTIVE_STATUSES = new Set(['submitted', 'scoping', 'quote_sent', 'in_progress', 'review']);

export function derivePortalSummaryCards(requests = []) {
  let active = 0;
  let completed = 0;
  let rush = 0;

  for (const request of requests) {
    if (ACTIVE_STATUSES.has(request.status)) {
      active += 1;
    }

    if (request.status === 'completed') {
      completed += 1;
    }

    const turnaround = request.options?.turnaround ?? request.turnaround;
    if (typeof turnaround === 'string') {
      const normalized = turnaround.trim().toLowerCase();
      if (normalized === 'rush' || normalized === 'rush (24 hours)' || formatTurnaround({ turnaround }) === 'Rush (24 hours)') {
        rush += 1;
      }
    }
  }

  return [
    { title: 'Active requests', value: active, icon: 'tabler-mail-forward' },
    { title: 'Completed', value: completed, icon: 'tabler-check' },
    { title: 'Rush jobs', value: rush, icon: 'tabler-bolt' }
  ];
}
