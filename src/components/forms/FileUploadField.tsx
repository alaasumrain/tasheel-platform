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

// Helper function to convert file extensions to MIME types
const extensionToMimeType: Record<string, string[]> = {
	'.pdf': ['application/pdf'],
	'.jpg': ['image/jpeg'],
	'.jpeg': ['image/jpeg'],
	'.png': ['image/png'],
	'.doc': ['application/msword'],
	'.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	'.gif': ['image/gif'],
	'.webp': ['image/webp'],
	'.txt': ['text/plain'],
	'.csv': ['text/csv'],
	'.xls': ['application/vnd.ms-excel'],
	'.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// Convert accept string (extensions or MIME types) to react-dropzone format
const parseAccept = (acceptString: string): Record<string, string[]> => {
	const acceptMap: Record<string, string[]> = {};
	
	acceptString.split(',').forEach(item => {
		const trimmed = item.trim();
		// If it's already a MIME type (contains '/'), use it directly
		if (trimmed.includes('/')) {
			acceptMap[trimmed] = [];
		} 
		// If it's a file extension, convert to MIME type(s)
		else if (trimmed.startsWith('.')) {
			const mimeTypes = extensionToMimeType[trimmed.toLowerCase()];
			if (mimeTypes) {
				mimeTypes.forEach(mimeType => {
					acceptMap[mimeType] = [];
				});
			}
		}
		// If it's an extension without dot, add the dot
		else {
			const withDot = `.${trimmed}`;
			const mimeTypes = extensionToMimeType[withDot.toLowerCase()];
			if (mimeTypes) {
				mimeTypes.forEach(mimeType => {
					acceptMap[mimeType] = [];
				});
			}
		}
	});
	
	return acceptMap;
};

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
			
			// Log rejected files for debugging
			if (rejectedFiles.length > 0) {
				console.warn('[FileUploadField] Files rejected:', rejectedFiles);
			}
			
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				console.log('[FileUploadField] File accepted:', { fileName: file.name, fileSize: file.size, fileType: file.type });
				
				// Check file size (react-dropzone also checks this, but double-check)
				if (file.size > maxSize) {
					console.warn('[FileUploadField] File too large:', { fileName: file.name, size: file.size, maxSize });
					return;
				}
				
				// Call onChange to trigger parent handler
				onChange(file);
			}
		},
		[onChange, maxSize, disabled]
	);

	const acceptMap = parseAccept(accept);
	
	// Always pass accept - if empty, react-dropzone will accept all files
	// This is better than undefined which might cause issues
	const dropzoneAccept = Object.keys(acceptMap).length > 0 ? acceptMap : {};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: Object.keys(dropzoneAccept).length > 0 ? dropzoneAccept : undefined,
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
					<input 
						{...getInputProps()} 
						id={name} 
						name={name}
					/>
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
								{accept.split(',').map(ext => ext.trim()).join(', ')} ({t('maxSize', { size: (maxSize / 1024 / 1024).toFixed(0) })})
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

