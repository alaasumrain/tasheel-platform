'use client';

import { Box, Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { IconAlertCircle, IconRefresh, IconCircleCheck, IconX, IconFileText, IconSearch } from '@tabler/icons-react';
import { motion } from 'motion/react';

interface ErrorStateProps {
	title?: string;
	message: string;
	onRetry?: () => void;
	retryLabel?: string;
}

export function ErrorState({ title, message, onRetry, retryLabel = 'Retry' }: ErrorStateProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Alert
				severity="error"
				icon={<IconAlertCircle size={24} />}
				action={
					onRetry && (
						<Button color="inherit" size="small" onClick={onRetry}>
							{retryLabel}
						</Button>
					)
				}
				sx={{ borderRadius: 2 }}
			>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message}
			</Alert>
		</motion.div>
	);
}

interface SuccessStateProps {
	title?: string;
	message: string;
	onDismiss?: () => void;
}

export function SuccessState({ title, message, onDismiss }: SuccessStateProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			<Alert
				severity="success"
				icon={<IconCircleCheck size={24} />}
				action={
					onDismiss && (
						<Button color="inherit" size="small" onClick={onDismiss}>
							<IconX size={18} />
						</Button>
					)
				}
				sx={{ borderRadius: 2 }}
			>
				{title && <AlertTitle>{title}</AlertTitle>}
				{message}
			</Alert>
		</motion.div>
	);
}

interface EmptyStateProps {
	title?: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	icon?: React.ReactNode;
	variant?: 'no-orders' | 'no-results' | 'default';
}

export function EmptyState({ title, description, action, icon, variant = 'default' }: EmptyStateProps) {
	// Smart messaging based on variant
	const getSmartContent = () => {
		if (variant === 'no-orders') {
			return {
				title: title || 'Get Started',
				description: description || 'Explore our services to get started with your first request.',
				defaultIcon: <IconFileText size={48} />,
			};
		}
		if (variant === 'no-results') {
			return {
				title: title || 'No Results Found',
				description: description || 'Try adjusting your search or filters to find what you\'re looking for.',
				defaultIcon: <IconSearch size={48} />,
			};
		}
		return {
			title: title || 'No Data',
			description: description,
			defaultIcon: icon,
		};
	};

	const smartContent = getSmartContent();
	const displayIcon = icon || smartContent.defaultIcon;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: 8,
				px: 2,
				textAlign: 'center',
			}}
		>
			{displayIcon && (
				<Box sx={{ mb: 2, color: 'text.secondary' }}>
					{displayIcon}
				</Box>
			)}
			{smartContent.title && (
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{smartContent.title}
				</Typography>
			)}
			{smartContent.description && (
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
					{smartContent.description}
				</Typography>
			)}
			{action && (
				<Button variant="contained" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</Box>
	);
}

interface LoadingStateProps {
	message?: string;
	fullScreen?: boolean;
}

export function LoadingState({ message = 'Loading...', fullScreen = false }: LoadingStateProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				py: fullScreen ? 20 : 8,
				px: 2,
			}}
		>
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
				style={{ display: 'inline-block' }}
			>
				<Box
					sx={{
						width: 48,
						height: 48,
						border: '4px solid',
						borderColor: 'divider',
						borderTopColor: 'primary.main',
						borderRadius: '50%',
					}}
				/>
			</motion.div>
			{message && (
				<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
					{message}
				</Typography>
			)}
		</Box>
	);
}

