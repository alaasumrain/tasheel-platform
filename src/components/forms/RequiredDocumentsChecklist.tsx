'use client';

import { Box, Stack, Typography, Chip } from '@mui/material';
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';

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
	// Simple heuristic: if user uploaded files, assume they've covered the requirements
	// In reality, we'd need to map specific fields to required docs
	const hasUploads = uploadedFileCount > 0;

	return (
		<Stack spacing={2}>
			{/* Header with status */}
			<Stack direction="row" spacing={2} alignItems="center">
				<Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
					Required Documents
				</Typography>
				<Chip
					label={
						hasUploads
							? `${uploadedFileCount} file${uploadedFileCount !== 1 ? 's' : ''} uploaded`
							: 'No files uploaded'
					}
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
							label={hasUploads ? 'Ready' : 'Required'}
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
					⚠️ Please upload the required documents to proceed with your request
				</Typography>
			)}
		</Stack>
	);
}
