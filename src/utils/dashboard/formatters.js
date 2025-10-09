const TURNAROUND_LABELS = {
  rush: 'Rush (24 hours)',
  standard: 'Standard (2–3 business days)',
  'rush (24 hours)': 'Rush (24 hours)',
  'standard (2–3 business days)': 'Standard (2–3 business days)'
};

const TRANSLATION_TYPE_LABELS = {
  certified: 'Certified translation',
  translation_only: 'Professional translation only',
  notarized: 'Notarized translation'
};

const DELIVERY_LABELS = {
  digital: 'Digital delivery (PDF)',
  digital_physical: 'Digital + physical copies'
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium'
});

export function formatLanguagePair({ sourceLanguage, targetLanguage } = {}) {
  if (sourceLanguage && targetLanguage) {
    return `${sourceLanguage} → ${targetLanguage}`;
  }
  return '—';
}

export function formatDateTime(value) {
  if (!value) return '—';

  try {
    return dateTimeFormatter.format(new Date(value));
  } catch (error) {
    console.warn('formatDateTime failed', error);
    return new Date(value).toLocaleString();
  }
}

export function formatDate(value) {
  if (!value) return '—';

  try {
    return dateFormatter.format(new Date(value));
  } catch (error) {
    console.warn('formatDate failed', error);
    return new Date(value).toLocaleDateString();
  }
}

export function formatTurnaround(request = {}) {
  const rawValue = request.options?.turnaround ?? request.turnaround;
  if (!rawValue) return '—';

  if (typeof rawValue === 'string') {
    const normalized = rawValue.trim().toLowerCase();
    if (TURNAROUND_LABELS[normalized]) {
      return TURNAROUND_LABELS[normalized];
    }
  }

  return TURNAROUND_LABELS[String(rawValue)] || rawValue;
}

export function formatTranslationType(request = {}) {
  const value = request.options?.translationType;
  if (!value) return '—';
  return TRANSLATION_TYPE_LABELS[value] || value;
}

export function formatDeliveryMethod(request = {}) {
  const value = request.options?.deliveryMethod;
  if (value) {
    return DELIVERY_LABELS[value] || value;
  }

  if (request.options?.physicalCopies) {
    return DELIVERY_LABELS.digital_physical;
  }

  return DELIVERY_LABELS.digital;
}

export function formatEstimatedTotal(request = {}) {
  const value = request.estimatedTotal ?? request.quoteAmount ?? request.options?.estimatedTotal;

  if (value || value === 0) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return `$${numeric.toFixed(2)}`;
    }
    return value;
  }

  return 'Pending quote — shared after Tasheel review';
}

export const TURNAROUND_LABEL_MAP = TURNAROUND_LABELS;
export const TRANSLATION_TYPE_LABEL_MAP = TRANSLATION_TYPE_LABELS;
export const DELIVERY_LABEL_MAP = DELIVERY_LABELS;
