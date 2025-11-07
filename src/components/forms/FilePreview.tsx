'use client';

import { useState, useEffect } from 'react';
import { Box, IconButton, Stack, Typography, Chip } from '@mui/material';
import {
	IconFile,
	IconFileText,
	IconPhoto,
	IconX,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface FilePreviewProps {
	file: File;
	onRemove?: () => void;
	showRemove?: boolean;
}

export default function FilePreview({
	file,
	onRemove,
	showRemove = true,
}: FilePreviewProps) {
	const t = useTranslations('Quote.filePreview');
	const [preview, setPreview] = useState<string | null>(null);

	// Generate preview for images
	useEffect(() => {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			return () => {
				reader.abort();
			};
		}
	}, [file]);

	// Format file size
	const formatSize = (bytes: number): string => {
		if (bytes === 0) return `0 ${t('bytes')}`;
		const k = 1024;
		const sizes = [t('bytes'), t('kb'), t('mb'), t('gb')];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	};

	// Get file type info
	const getFileTypeInfo = () => {
		const type = file.type;
		if (type.startsWith('image/')) {
			return { label: t('image'), icon: IconPhoto, color: 'success' as const };
		}
		if (type === 'application/pdf') {
			return { label: t('pdf'), icon: IconFileText, color: 'error' as const };
		}
		return { label: t('document'), icon: IconFile, color: 'default' as const };
	};

	const fileTypeInfo = getFileTypeInfo();
	const FileIcon = fileTypeInfo.icon;

	return (
		<Box
			sx={{
				position: 'relative',
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 2,
				overflow: 'hidden',
				backgroundColor: 'background.paper',
				transition: 'all 0.2s',
				'&:hover': {
					borderColor: 'primary.main',
					boxShadow: 1,
				},
			}}
		>
			{/* Remove button */}
			{showRemove && onRemove && (
				<IconButton
					onClick={onRemove}
					size="small"
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						zIndex: 1,
						backgroundColor: 'background.paper',
						boxShadow: 1,
						'&:hover': {
							backgroundColor: 'error.main',
							color: 'white',
						},
					}}
				>
					<IconX size={16} />
				</IconButton>
			)}

			{/* Preview area */}
			<Box
				sx={{
					height: 160,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'background.default',
					position: 'relative',
				}}
			>
				{preview ? (
					// Image thumbnail
					<Box
						component="img"
						src={preview}
						alt={file.name}
						sx={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : (
					// File icon
					<FileIcon size={48} opacity={0.3} />
				)}
			</Box>

			{/* File info */}
			<Stack spacing={1} sx={{ p: 2 }}>
				<Chip
					label={fileTypeInfo.label}
					size="small"
					color={fileTypeInfo.color}
					sx={{ width: 'fit-content' }}
				/>
				<Typography
					variant="body2"
					fontWeight={600}
					sx={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{file.name}
				</Typography>
				<Typography variant="caption" color="text.secondary">
					{formatSize(file.size)}
				</Typography>
			</Stack>
		</Box>
	);
}
