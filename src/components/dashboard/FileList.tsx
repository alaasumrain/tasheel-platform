'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	Typography,
	Stack,
	Button,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	CircularProgress,
} from '@mui/material';
import { IconDownload, IconFile, IconTrash } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { getDownloadUrl, deleteFile, STORAGE_BUCKETS } from '@/lib/storage';
import { useTranslations } from 'next-intl';

interface FileListProps {
	applicationId: string;
	canDelete?: boolean;
	onFileDeleted?: () => void;
}

interface FileRecord {
	id: string;
	filename: string;
	file_path: string;
	file_size: number;
	file_type: string;
	is_customer_upload: boolean;
	is_completed_work: boolean;
	created_at: string;
}

export function FileList({ applicationId, canDelete = false, onFileDeleted }: FileListProps) {
	const t = useTranslations('Dashboard');
	const [files, setFiles] = useState<FileRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState<string | null>(null);
	const [deleting, setDeleting] = useState<string | null>(null);

	useEffect(() => {
		loadFiles();
	}, [applicationId]);

	const loadFiles = async () => {
		try {
			const supabase = createClient();
			const { data, error } = await supabase
				.from('files')
				.select('*')
				.eq('application_id', applicationId)
				.order('created_at', { ascending: false });

			if (error) throw error;
			setFiles(data || []);
		} catch (error) {
			console.error('Error loading files:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async (file: FileRecord) => {
		setDownloading(file.id);
		try {
			const bucket = file.is_completed_work
				? 'COMPLETED_WORK'
				: 'CUSTOMER_UPLOADS';

			const url = await getDownloadUrl(bucket, file.file_path);
			if (url) {
				window.open(url, '_blank');
			} else {
				throw new Error(t('fileList.downloadError'));
			}
		} catch (error: any) {
			console.error('Download error:', error);
			alert(error.message || t('fileList.downloadError'));
		} finally {
			setDownloading(null);
		}
	};

	const handleDelete = async (file: FileRecord) => {
		if (!confirm(t('fileList.confirmDelete'))) return;

		setDeleting(file.id);
		try {
			const supabase = createClient();
			const bucket = file.is_completed_work
				? 'COMPLETED_WORK'
				: 'CUSTOMER_UPLOADS';

			// Delete from storage
			const { error: storageError } = await deleteFile(bucket, file.file_path);
			if (storageError) throw storageError;

			// Delete from database
			const { error: dbError } = await supabase
				.from('files')
				.delete()
				.eq('id', file.id);

			if (dbError) throw dbError;

			// Refresh list
			loadFiles();
			onFileDeleted?.();
		} catch (error: any) {
			console.error('Delete error:', error);
			alert(error.message || t('fileList.deleteError'));
		} finally {
			setDeleting(null);
		}
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	if (loading) {
		return (
			<Card borderRadius={20}>
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<CircularProgress />
				</Box>
			</Card>
		);
	}

	if (files.length === 0) {
		return (
			<Card borderRadius={20}>
				<Box sx={{ p: 3 }}>
					<Typography variant="body2" color="text.secondary" textAlign="center">
						{t('fileList.noFiles')}
					</Typography>
				</Box>
			</Card>
		);
	}

	return (
		<Card borderRadius={20}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h6" fontWeight={600} gutterBottom>
					{t('fileList.title')}
				</Typography>

				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{t('fileList.filename')}</TableCell>
								<TableCell>{t('fileList.type')}</TableCell>
								<TableCell>{t('fileList.size')}</TableCell>
								<TableCell>{t('fileList.status')}</TableCell>
								<TableCell align="right">{t('fileList.actions')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{files.map((file) => (
								<TableRow key={file.id}>
									<TableCell>
										<Stack direction="row" spacing={1} alignItems="center">
											<IconFile size={20} />
											<Typography variant="body2">{file.filename}</Typography>
										</Stack>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{file.file_type || 'N/A'}
										</Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" color="text.secondary">
											{formatFileSize(file.file_size)}
										</Typography>
									</TableCell>
									<TableCell>
										<Chip
											label={
												file.is_completed_work
													? t('fileList.completedWork')
													: t('fileList.customerUpload')
											}
											size="small"
											color={file.is_completed_work ? 'success' : 'default'}
										/>
									</TableCell>
									<TableCell align="right">
										<Stack direction="row" spacing={1} justifyContent="flex-end">
											<IconButton
												size="small"
												onClick={() => handleDownload(file)}
												disabled={downloading === file.id}
											>
												{downloading === file.id ? (
													<CircularProgress size={20} />
												) : (
													<IconDownload size={20} />
												)}
											</IconButton>
											{canDelete && (
												<IconButton
													size="small"
													onClick={() => handleDelete(file)}
													disabled={deleting === file.id}
													color="error"
												>
													{deleting === file.id ? (
														<CircularProgress size={20} />
													) : (
														<IconTrash size={20} />
													)}
												</IconButton>
											)}
										</Stack>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Card>
	);
}

