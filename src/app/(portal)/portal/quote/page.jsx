'use client';

import { useSearchParams } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';

// @project
import TranslationWizard from '@/components/forms/translation-wizard/TranslationWizard';

export default function PortalQuotePage() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service') || '';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <TranslationWizard service={service} />
    </Box>
  );
}
