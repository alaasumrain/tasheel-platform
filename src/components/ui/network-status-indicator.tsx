'use client';

import { Alert } from '@mui/material';
import { IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useNetworkStatus } from '@/hooks/use-error-handling';

// Network Status Indicator Component
export function NetworkStatusIndicator() {
	const { isOnline, wasOffline } = useNetworkStatus();
	const t = useTranslations('Common');

	if (isOnline && !wasOffline) return null;

	return (
		<Alert
			severity={isOnline ? 'success' : 'warning'}
			icon={isOnline ? <IconWifi size={20} /> : <IconWifiOff size={20} />}
			sx={{
				position: 'fixed',
				top: 16,
				right: 16,
				zIndex: 9999,
				minWidth: 300,
				boxShadow: 3,
			}}
		>
			{isOnline
				? t('networkStatus.backOnline') || 'Connection restored!'
				: t('networkStatus.offline') || 'You are offline. Changes will be saved when connection is restored.'}
		</Alert>
	);
}

