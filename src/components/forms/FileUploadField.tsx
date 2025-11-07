'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
	Box,
	FormControl,
	FormLabel,
	FormHelperText,
	Typography,
	IconButton,
	Tooltip,
} from '@mui/material';
import { IconUpload, IconFile, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface FileUploadFieldProps {
	label: string;
	name: string;
	value: File | null;
	onChange: (file: File | null) => void;
	onRemove: () => void;
	error?: string;
	helperText?: string;
	accept?: string;
	maxSize?: number; // in bytes
	required?: boolean;
	disabled?: boolean;
}

export function FileUploadField({
	label,
	name,
	value,
	onChange,
	onRemove,
	error,
	helperText,
	accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
	maxSize = 10 * 1024 * 1024, // 10MB default
	required = false,
	disabled = false,
}: FileUploadFieldProps) {
	const t = useTranslations('Quote.fileUpload');
	
	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: unknown[]) => {
			if (disabled) return;
			if (rejectedFiles.length > 0) {
				// Handle rejection (e.g., file too large)
				return;
			}
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				if (file.size > maxSize) {
					return;
				}
				onChange(file);
			}
		},
		[onChange, maxSize, disabled]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: accept.split(',').reduce((acc, ext) => {
			acc[ext.trim()] = [];
			return acc;
		}, {} as Record<string, string[]>),
		maxSize,
		multiple: false,
		disabled,
	});

	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel htmlFor={name}>{label}</FormLabel>
			<Box sx={{ position: 'relative', mt: 1 }}>
				<Box
					{...getRootProps()}
					sx={{
						p: 3,
						border: 2,
						borderStyle: 'dashed',
						borderColor: value
							? 'success.main'
							: error
								? 'error.main'
								: isDragActive
									? 'primary.main'
									: 'divider',
						borderRadius: 2,
						backgroundColor: value
							? 'success.lighter'
							: isDragActive
								? 'action.hover'
								: 'background.paper',
						cursor: disabled ? 'not-allowed' : 'pointer',
						opacity: disabled ? 0.6 : 1,
						transition: 'all 0.2s',
						'&:hover': {
							borderColor: disabled ? 'divider' : 'primary.main',
							backgroundColor: disabled ? 'background.paper' : 'action.hover',
						},
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 1,
						position: 'relative',
					}}
				>
					<input {...getInputProps()} id={name} name={name} />
					{value ? (
						<>
							<IconFile size={32} />
							<Typography variant="body2" fontWeight={600}>
								{value.name}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{(value.size / 1024 / 1024).toFixed(2)}MB
							</Typography>
							<Typography variant="caption" color="success.main">
								{t('fileSelected')}
							</Typography>
						</>
					) : (
						<>
							<IconUpload size={32} />
							<Typography variant="body2" fontWeight={600}>
								{isDragActive ? t('dropFileHere') : t('clickToUpload')}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{accept} ({t('maxSize', { size: (maxSize / 1024 / 1024).toFixed(0) })})
							</Typography>
						</>
					)}
				</Box>
				{value && (
					<Tooltip title={t('removeFile')}>
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							sx={{
								position: 'absolute',
								top: 8,
								right: 8,
								backgroundColor: 'background.paper',
								'&:hover': {
									backgroundColor: 'action.hover',
								},
							}}
						>
							<IconX size={18} />
						</IconButton>
					</Tooltip>
				)}
			</Box>
			{error && <FormHelperText error>{error}</FormHelperText>}
			{!error && helperText && <FormHelperText>{helperText}</FormHelperText>}
		</FormControl>
	);
}

