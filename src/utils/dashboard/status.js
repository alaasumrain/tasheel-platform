const STATUS_METADATA = {
  submitted: { label: 'Submitted', color: 'info' },
  scoping: { label: 'Scoping', color: 'default' },
  quote_sent: { label: 'Quote sent', color: 'warning' },
  in_progress: { label: 'In progress', color: 'primary' },
  review: { label: 'Review', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' },
  archived: { label: 'Archived', color: 'default' },
  rejected: { label: 'Rejected', color: 'error' },
  cancelled: { label: 'Cancelled', color: 'error' }
};

export function getStatusMeta(status) {
  if (!status) {
    return { label: 'Unknown', color: 'default' };
  }

  return STATUS_METADATA[status] || { label: status, color: 'default' };
}

export function getStatusChipProps(status) {
  const meta = getStatusMeta(status);
  return {
    label: meta.label,
    color: meta.color
  };
}

export const STATUS_METADATA_MAP = STATUS_METADATA;
