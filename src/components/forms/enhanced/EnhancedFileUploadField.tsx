'use client';

import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
	Box,
	FormControl,
	FormLabel,
	FormHelperText,
	Typography,
	IconButton,
	Tooltip,
	LinearProgress,
	Stack,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import {
	IconUpload,
	IconFile,
	IconX,
	IconPhoto,
	IconFileText,
	IconRefresh,
	IconCheck,
	IconAlertCircle,
	IconCamera,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';

export interface UploadedFileInfo {
	id?: string;
	file: File;
	storagePath?: string;
	uploadProgress?: number;
	uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
	error?: string;
	retryCount?: number;
}

interface EnhancedFileUploadFieldProps {
	label: string;
	name: string;
	files: UploadedFileInfo[];
	onChange: (files: UploadedFileInfo[]) => void;
	onRemove: (index: number) => void;
	onRetry?: (index: number) => void;
	error?: string;
	helperText?: string;
	accept?: string;
	maxSize?: number; // in bytes
	maxFiles?: number;
	required?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	showPreview?: boolean;
	onFileSelect?: (file: File) => Promise<void>;
}

export function EnhancedFileUploadField({
	label,
	name,
	files = [],
	onChange,
	onRemove,
	onRetry,
	error,
	helperText,
	accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
	maxSize = 10 * 1024 * 1024, // 10MB default
	maxFiles = 5,
	required = false,
	disabled = false,
	multiple = true,
	showPreview = true,
	onFileSelect,
}: EnhancedFileUploadFieldProps) {
	const t = useTranslations('Quote.fileUpload');
	const [previewDialog, setPreviewDialog] = useState<{ file: File; url: string } | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Compress image if needed
	const compressImage = async (file: File, maxSizeMB: number = 2): Promise<File> => {
		if (!file.type.startsWith('image/')) return file;
		if (file.size <= maxSizeMB * 1024 * 1024) return file;

		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					let width = img.width;
					let height = img.height;
					let quality = 0.9;

					// Calculate new dimensions
					const maxDimension = 1920;
					if (width > height && width > maxDimension) {
						height = (height * maxDimension) / width;
						width = maxDimension;
					} else if (height > maxDimension) {
						width = (width * maxDimension) / height;
						height = maxDimension;
					}

					canvas.width = width;
					canvas.height = height;

					const ctx = canvas.getContext('2d');
					if (ctx) {
						ctx.drawImage(img, 0, 0, width, height);
					}

					// Try different quality levels to get under max size
					const tryCompress = (q: number) => {
						canvas.toBlob(
							(blob) => {
								if (blob && blob.size <= maxSizeMB * 1024 * 1024) {
									resolve(
										new File([blob], file.name, {
											type: file.type,
											lastModified: Date.now(),
										})
									);
								} else if (q > 0.3) {
									tryCompress(q - 0.1);
								} else {
									resolve(file); // Fallback to original
								}
							},
							file.type,
							q
						);
					};

					tryCompress(quality);
				};
				img.src = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		});
	};

	const onDrop = useCallback(
		async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
			if (disabled) return;

			// Handle rejected files
			if (rejectedFiles.length > 0) {
				// Show error for rejected files
				return;
			}

			// Check max files limit
			if (files.length + acceptedFiles.length > maxFiles) {
				// Show error: too many files
				return;
			}

			// Process accepted files
			for (const file of acceptedFiles) {
				// Validate file size
				if (file.size > maxSize) {
					const newFile: UploadedFileInfo = {
						file,
						uploadStatus: 'error',
						error: t('fileTooLarge', { maxSize: `${(maxSize / 1024 / 1024).toFixed(0)}MB` }),
					};
					onChange([...files, newFile]);
					continue;
				}

				// Compress image if needed
				let processedFile = file;
				if (file.type.startsWith('image/')) {
					try {
						processedFile = await compressImage(file);
					} catch (error) {
						console.error('Error compressing image:', error);
					}
				}

				const newFile: UploadedFileInfo = {
					file: processedFile,
					uploadStatus: 'pending',
				};

				const updatedFiles = [...files, newFile];
				onChange(updatedFiles);

				// If onFileSelect callback provided, trigger upload
				if (onFileSelect) {
					const fileIndex = updatedFiles.length - 1;
					updatedFiles[fileIndex].uploadStatus = 'uploading';
					updatedFiles[fileIndex].uploadProgress = 0;
					onChange([...updatedFiles]);

					try {
						await onFileSelect(processedFile);
						updatedFiles[fileIndex].uploadStatus = 'success';
						updatedFiles[fileIndex].uploadProgress = 100;
						onChange([...updatedFiles]);
					} catch (error: any) {
						updatedFiles[fileIndex].uploadStatus = 'error';
						updatedFiles[fileIndex].error = error.message || t('uploadFailed');
						onChange([...updatedFiles]);
					}
				}
			}
		},
		[disabled, files, maxFiles, maxSize, onChange, onFileSelect, t]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: accept.split(',').reduce((acc, ext) => {
			acc[ext.trim()] = [];
			return acc;
		}, {} as Record<string, string[]>),
		maxSize,
		multiple,
		disabled: disabled || files.length >= maxFiles,
	});

	const formatSize = (bytes: number): string => {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	};

	const getFileIcon = (file: File) => {
		if (file.type.startsWith('image/')) return IconPhoto;
		if (file.type === 'application/pdf') return IconFileText;
		return IconFile;
	};

	const openPreview = (file: File) => {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewDialog({ file, url: e.target?.result as string });
			};
			reader.readAsDataURL(file);
		} else if (file.type === 'application/pdf') {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewDialog({ file, url: e.target?.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCameraCapture = () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: { facingMode: 'environment' } })
				.then((stream) => {
					// Create video element
					const video = document.createElement('video');
					video.srcObject = stream;
					video.play();

					// Create canvas to capture photo
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					video.addEventListener('loadedmetadata', () => {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						ctx?.drawImage(video, 0, 0);

						canvas.toBlob((blob) => {
							if (blob) {
								const file = new File([blob], `camera-${Date.now()}.jpg`, {
									type: 'image/jpeg',
									lastModified: Date.now(),
								});
								onDrop([file], []);
							}
							stream.getTracks().forEach((track) => track.stop());
						}, 'image/jpeg', 0.9);
					});
				})
				.catch((error) => {
					console.error('Error accessing camera:', error);
				});
		}
	};

	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Box sx={{ position: 'relative', mt: 1 }}>
				{/* Dropzone */}
				<Box
					{...getRootProps()}
					sx={{
						p: 3,
						border: 2,
						borderStyle: 'dashed',
						borderColor: error
							? 'error.main'
							: isDragActive
								? 'primary.main'
								: files.length > 0
									? 'success.main'
									: 'divider',
						borderRadius: 2,
						backgroundColor: isDragActive
							? 'action.hover'
							: files.length > 0
								? 'success.lighter'
								: 'background.paper',
						cursor: disabled || files.length >= maxFiles ? 'not-allowed' : 'pointer',
						opacity: disabled || files.length >= maxFiles ? 0.6 : 1,
						transition: 'all 0.2s',
						'&:hover': {
							borderColor:
								disabled || files.length >= maxFiles
									? 'divider'
									: error
										? 'error.main'
										: 'primary.main',
							backgroundColor:
								disabled || files.length >= maxFiles ? 'background.paper' : 'action.hover',
						},
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 1.5,
						position: 'relative',
					}}
				>
					<input {...getInputProps()} id={name} name={name} ref={fileInputRef} />
					{files.length === 0 ? (
						<>
							<motion.div
								animate={{ scale: isDragActive ? 1.1 : 1 }}
								transition={{ duration: 0.2 }}
							>
								<IconUpload size={40} />
							</motion.div>
							<Typography variant="body1" fontWeight={600}>
								{isDragActive ? t('dropFileHere') : t('clickToUpload')}
							</Typography>
							<Typography variant="caption" color="text.secondary" textAlign="center">
								{accept} ({t('maxSize', { size: (maxSize / 1024 / 1024).toFixed(0) })})
							</Typography>
							{multiple && (
								<Typography variant="caption" color="text.secondary">
									{t('maxFiles', { count: maxFiles })}
								</Typography>
							)}
							{/* Camera button for mobile */}
							{typeof navigator !== 'undefined' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && (
								<Button
									startIcon={<IconCamera size={18} />}
									size="small"
									variant="outlined"
									onClick={(e) => {
										e.stopPropagation();
										handleCameraCapture();
									}}
									sx={{ mt: 1 }}
								>
									{t('takePhoto')}
								</Button>
							)}
						</>
					) : (
						<>
							<IconCheck size={32} color="success" />
							<Typography variant="body2" fontWeight={600} color="success.main">
								{t('filesSelected', { count: files.length })}
							</Typography>
							{files.length < maxFiles && (
								<Typography variant="caption" color="text.secondary">
									{t('addMoreFiles')}
								</Typography>
							)}
						</>
					)}
				</Box>

				{/* File List */}
				{files.length > 0 && (
					<Box sx={{ mt: 2 }}>
						<AnimatePresence>
							<Stack spacing={1.5}>
								{files.map((fileInfo, index) => {
									const FileIcon = getFileIcon(fileInfo.file);
									const isUploading = fileInfo.uploadStatus === 'uploading';
									const isSuccess = fileInfo.uploadStatus === 'success';
									const isError = fileInfo.uploadStatus === 'error';

									return (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ duration: 0.2 }}
										>
											<Box
												sx={{
													p: 2,
													border: '1px solid',
													borderColor: isError
														? 'error.main'
														: isSuccess
															? 'success.main'
															: 'divider',
													borderRadius: 2,
													backgroundColor: 'background.paper',
													position: 'relative',
												}}
											>
												<Stack direction="row" spacing={2} alignItems="center">
													{/* File Icon/Preview */}
													{showPreview && fileInfo.file.type.startsWith('image/') ? (
														<Box
															component="img"
															src={URL.createObjectURL(fileInfo.file)}
															alt={fileInfo.file.name}
															sx={{
																width: 48,
																height: 48,
																objectFit: 'cover',
																borderRadius: 1,
																cursor: 'pointer',
															}}
															onClick={() => openPreview(fileInfo.file)}
														/>
													) : (
														<FileIcon size={32} />
													)}

													{/* File Info */}
													<Box sx={{ flex: 1, minWidth: 0 }}>
														<Typography
															variant="body2"
															fontWeight={600}
															sx={{
																overflow: 'hidden',
																textOverflow: 'ellipsis',
																whiteSpace: 'nowrap',
															}}
														>
															{fileInfo.file.name}
														</Typography>
														<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
															<Typography variant="caption" color="text.secondary">
																{formatSize(fileInfo.file.size)}
															</Typography>
															{isSuccess && (
																<Chip
																	label={t('uploaded')}
																	size="small"
																	color="success"
																	icon={<IconCheck size={14} />}
																/>
															)}
															{isError && (
																<Chip
																	label={t('failed')}
																	size="small"
																	color="error"
																	icon={<IconAlertCircle size={14} />}
																/>
															)}
														</Stack>

														{/* Upload Progress */}
														{isUploading && (
															<Box sx={{ mt: 1 }}>
																<LinearProgress
																	variant="determinate"
																	value={fileInfo.uploadProgress || 0}
																	sx={{ height: 6, borderRadius: 1 }}
																/>
																<Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
																	{fileInfo.uploadProgress || 0}%
																</Typography>
															</Box>
														)}

														{/* Error Message */}
														{isError && fileInfo.error && (
															<Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
																{fileInfo.error}
															</Typography>
														)}
													</Box>

													{/* Actions */}
													<Stack direction="row" spacing={0.5}>
														{isError && onRetry && (
															<Tooltip title={t('retry')}>
																<IconButton
																	size="small"
																	onClick={() => onRetry(index)}
																	color="primary"
																>
																	<IconRefresh size={18} />
																</IconButton>
															</Tooltip>
														)}
														<Tooltip title={t('remove')}>
															<IconButton
																size="small"
																onClick={() => onRemove(index)}
																color={isError ? 'error' : 'default'}
															>
																<IconX size={18} />
															</IconButton>
														</Tooltip>
													</Stack>
												</Stack>
											</Box>
										</motion.div>
									);
								})}
							</Stack>
						</AnimatePresence>
					</Box>
				)}
			</Box>

			{error && <FormHelperText error>{error}</FormHelperText>}
			{!error && helperText && <FormHelperText>{helperText}</FormHelperText>}

			{/* Preview Dialog */}
			<Dialog
				open={!!previewDialog}
				onClose={() => setPreviewDialog(null)}
				maxWidth="md"
				fullWidth
			>
				{previewDialog && (
					<>
						<DialogTitle>{previewDialog.file.name}</DialogTitle>
						<DialogContent>
							{previewDialog.file.type.startsWith('image/') ? (
								<Box
									component="img"
									src={previewDialog.url}
									alt={previewDialog.file.name}
									sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
								/>
							) : previewDialog.file.type === 'application/pdf' ? (
								<Box
									component="iframe"
									src={previewDialog.url}
									sx={{ width: '100%', height: '600px', border: 'none' }}
								/>
							) : null}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setPreviewDialog(null)}>{t('close')}</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</FormControl>
	);
}

