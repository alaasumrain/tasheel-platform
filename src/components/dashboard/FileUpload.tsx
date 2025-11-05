'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
	Box,
	Typography,
	Stack,
	Button,
	Alert,
	CircularProgress,
	IconButton,
	Paper,
} from '@mui/material';
import { IconUpload, IconX, IconFile, IconCheck } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { uploadFile, STORAGE_BUCKETS } from '@/lib/storage';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

interface FileUploadProps {
	applicationId: string;
	onUploadComplete?: () => void;
	maxSize?: number; // in bytes, default 10MB
	accept?: Record<string, string[]>; // e.g., { 'application/pdf': ['.pdf'] }
}

interface UploadedFile {
	id: string;
	filename: string;
	file_path: string;
	file_size: number;
	file_type: string;
	is_customer_upload: boolean;
	created_at: string;
}

export function FileUpload({
	applicationId,
	onUploadComplete,
	maxSize = 10 * 1024 * 1024, // 10MB default
	accept,
}: FileUploadProps) {
	const t = useTranslations('Dashboard');
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) return;

		setUploading(true);
		setError(null);
		setSuccess(null);

		try {
			const file = acceptedFiles[0];

			// Validate file size
			if (file.size > maxSize) {
				throw new Error(
					t('fileUpload.maxSizeExceeded', {
						maxSize: `${Math.round(maxSize / 1024 / 1024)}MB`,
					})
				);
			}

			// Upload to Supabase Storage
			const { path, url, error: uploadError } = await uploadFile(
				'CUSTOMER_UPLOADS',
				applicationId,
				file
			);

			if (uploadError || !path) {
				throw new Error(uploadError || 'Upload failed');
			}

			// Create file record in database
			const supabase = createClient();
			const { error: dbError } = await supabase.from('files').insert({
				application_id: applicationId,
				filename: file.name,
				file_path: path,
				file_size: file.size,
				file_type: file.type,
				is_customer_upload: true,
			});

			if (dbError) {
				throw new Error(dbError.message);
			}

			setSuccess(t('fileUpload.uploadSuccess'));
			onUploadComplete?.();

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(null), 3000);
		} catch (err: any) {
			setError(err.message || t('fileUpload.uploadError'));
		} finally {
			setUploading(false);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		maxSize,
		accept,
		disabled: uploading,
	});

	return (
		<Card borderRadius={20}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('fileUpload.title')}
				</Typography>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
						{success}
					</Alert>
				)}

				<Paper
					{...getRootProps()}
					sx={{
						p: 4,
						border: '2px dashed',
						borderColor: isDragActive ? 'primary.main' : 'divider',
						bgcolor: isDragActive ? 'action.hover' : 'background.paper',
						cursor: uploading ? 'not-allowed' : 'pointer',
						textAlign: 'center',
						transition: 'all 0.2s',
						'&:hover': {
							borderColor: 'primary.main',
							bgcolor: 'action.hover',
						},
					}}
				>
					<input {...getInputProps()} />
					<Stack spacing={2} alignItems="center">
						{uploading ? (
							<CircularProgress size={48} />
						) : (
							<IconUpload size={48} color="primary" />
						)}
						<Typography variant="body1" fontWeight={500}>
							{isDragActive
								? t('fileUpload.dropHere')
								: uploading
									? t('fileUpload.uploading')
									: t('fileUpload.clickOrDrag')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('fileUpload.maxSize', {
								maxSize: `${Math.round(maxSize / 1024 / 1024)}MB`,
							})}
						</Typography>
					</Stack>
				</Paper>
			</Box>
		</Card>
	);
}

