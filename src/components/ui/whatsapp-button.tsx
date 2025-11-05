'use client';

import { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface WhatsAppButtonProps {
	phoneNumber: string;
	message?: string;
	variant?: 'button' | 'icon';
	size?: 'small' | 'medium' | 'large';
	fullWidth?: boolean;
}

/**
 * WhatsApp Button Component
 * 
 * Opens WhatsApp chat with pre-filled message
 * Uses WhatsApp web/desktop app or WhatsApp Business link format
 */
export function WhatsAppButton({
	phoneNumber,
	message = '',
	variant = 'button',
	size = 'medium',
	fullWidth = false,
}: WhatsAppButtonProps) {
	const t = useTranslations('WhatsApp');
	const [hovered, setHovered] = useState(false);

	// Format phone number (remove + for WhatsApp URL)
	const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');

	// Encode message for URL
	const encodedMessage = encodeURIComponent(message);

	// WhatsApp URL format: https://wa.me/[number]?text=[message]
	const whatsappUrl = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;

	const handleClick = () => {
		window.open(whatsappUrl, '_blank');
	};

	if (variant === 'icon') {
		return (
			<Tooltip title={t('openChat')}>
				<IconButton
					color="success"
					onClick={handleClick}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					size={size}
					sx={{
						'&:hover': {
							backgroundColor: 'success.light',
							transform: 'scale(1.1)',
							transition: 'all 0.2s',
						},
					}}
				>
					<IconBrandWhatsapp size={24} />
				</IconButton>
			</Tooltip>
		);
	}

	return (
		<Button
			variant="contained"
			color="success"
			startIcon={<IconBrandWhatsapp size={20} />}
			onClick={handleClick}
			size={size}
			fullWidth={fullWidth}
			sx={{
				backgroundColor: '#25D366',
				'&:hover': {
					backgroundColor: '#20BA5A',
				},
			}}
		>
			{t('openChat')}
		</Button>
	);
}

