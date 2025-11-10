'use client';

import { Box, Skeleton, Stack } from '@mui/material';

// Form Field Skeleton
export function FormFieldSkeleton() {
	return (
		<Stack spacing={1}>
			<Skeleton variant="text" width="30%" height={24} />
			<Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
		</Stack>
	);
}

// File Upload Skeleton
export function FileUploadSkeleton() {
	return (
		<Stack spacing={1}>
			<Skeleton variant="text" width="40%" height={24} />
			<Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
		</Stack>
	);
}

// Service Card Skeleton
export function ServiceCardSkeleton() {
	return (
		<Box>
			<Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
			<Skeleton variant="text" width="60%" height={28} />
			<Skeleton variant="text" width="100%" height={20} />
			<Skeleton variant="text" width="80%" height={20} />
			<Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
				<Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
				<Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
			</Box>
		</Box>
	);
}

// Wizard Step Skeleton
export function WizardStepSkeleton() {
	return (
		<Stack spacing={3}>
			<Skeleton variant="text" width="40%" height={32} />
			<Stack spacing={2}>
				<FormFieldSkeleton />
				<FormFieldSkeleton />
				<FormFieldSkeleton />
			</Stack>
		</Stack>
	);
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
	return (
		<Stack direction="row" spacing={2} sx={{ py: 2 }}>
			{Array.from({ length: columns }).map((_, index) => (
				<Skeleton key={index} variant="text" width="100%" height={24} />
			))}
		</Stack>
	);
}

// Dashboard Card Skeleton
export function DashboardCardSkeleton() {
	return (
		<Box sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
			<Skeleton variant="text" width="50%" height={20} />
			<Skeleton variant="text" width="30%" height={32} sx={{ mt: 1 }} />
			<Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 2, borderRadius: 1 }} />
		</Box>
	);
}

