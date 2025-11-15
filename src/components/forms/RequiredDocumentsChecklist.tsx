'use client';

import { Box, Stack, Typography, Chip } from '@mui/material';
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';

interface RequiredDocumentsChecklistProps {
	requiredDocuments: string[];
	uploadedFiles: File[];
	uploadedFileCount: number;
}

export default function RequiredDocumentsChecklist({
	requiredDocuments,
	uploadedFiles,
	uploadedFileCount,
}: RequiredDocumentsChecklistProps) {
	const locale = useLocale();
	const t = useTranslations('Quote.requiredDocuments');
	
	// Simple heuristic: if user uploaded files, assume they've covered the requirements
	// In reality, we'd need to map specific fields to required docs
	const hasUploads = uploadedFileCount > 0;

	// Safe translation with fallback - next-intl returns the key if translation is missing
	const title = t('title') || (locale === 'ar' ? 'المستندات المطلوبة' : 'Required Documents');
	const filesUploadedLabel = hasUploads 
		? (t('filesUploaded', { count: uploadedFileCount }) || `${uploadedFileCount} file${uploadedFileCount !== 1 ? 's' : ''} uploaded`)
		: (t('noFiles') || 'No files uploaded');
	const readyLabel = t('ready') || (locale === 'ar' ? 'جاهز' : 'Ready');
	const requiredLabel = t('required') || (locale === 'ar' ? 'مطلوب' : 'Required');
	const warningText = t('warning') || (locale === 'ar' 
		? '⚠️ يرجى رفع المستندات المطلوبة للمتابعة مع طلبك'
		: '⚠️ Please upload the required documents to proceed with your request');

	return (
		<Stack spacing={2}>
			{/* Header with status */}
			<Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
				<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
					{title}
				</Typography>
				<Chip
					label={filesUploadedLabel}
					size="small"
					color={hasUploads ? 'success' : 'default'}
					icon={hasUploads ? <IconCheck size={16} /> : <IconAlertTriangle size={16} />}
				/>
			</Stack>

			{/* Documents list */}
			<Stack spacing={1.5}>
				{requiredDocuments.map((doc, index) => (
					<Stack
						key={index}
						direction="row"
						spacing={2}
						alignItems="flex-start"
						sx={{
							p: 1.5,
							borderRadius: 1,
							backgroundColor: 'background.default',
						}}
					>
						{/* Status icon */}
						<Box
							sx={{
								mt: 0.25,
								color: hasUploads ? 'success.main' : 'text.disabled',
							}}
						>
							{hasUploads ? <IconCheck size={20} /> : <IconAlertTriangle size={20} />}
						</Box>

						{/* Document name */}
						<Typography
							variant="body2"
							sx={{
								flex: 1,
								color: hasUploads ? 'text.primary' : 'text.secondary',
							}}
						>
							{doc}
						</Typography>

						{/* Status badge */}
						<Chip
							label={hasUploads ? readyLabel : requiredLabel}
							size="small"
							variant="outlined"
							sx={{
								height: 24,
								fontSize: '0.75rem',
								borderColor: hasUploads ? 'success.main' : 'warning.main',
								color: hasUploads ? 'success.main' : 'warning.main',
							}}
						/>
					</Stack>
				))}
			</Stack>

			{/* Helper message */}
			{!hasUploads && (
				<Typography variant="caption" color="warning.main" sx={{ pl: 1 }}>
					{warningText}
				</Typography>
			)}
		</Stack>
	);
}
