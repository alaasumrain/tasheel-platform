'use client';

import { useState, useCallback } from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	FormHelperText,
	TextField,
	Autocomplete,
	Stack,
	Chip,
	IconButton,
	Typography,
} from '@mui/material';
import { IconPlus, IconX, IconInfoCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'motion/react';

// Dynamic Field Array Component
interface DynamicFieldArrayProps {
	name: string;
	label: string;
	value: string[];
	onChange: (value: string[]) => void;
	minItems?: number;
	maxItems?: number;
	placeholder?: string;
	helperText?: string;
	error?: string;
	required?: boolean;
}

export function DynamicFieldArray({
	name,
	label,
	value = [],
	onChange,
	minItems = 0,
	maxItems = 10,
	placeholder,
	helperText,
	error,
	required = false,
}: DynamicFieldArrayProps) {
	const t = useTranslations('Common.form');
	const [inputValue, setInputValue] = useState('');

	const handleAdd = useCallback(() => {
		if (inputValue.trim() && value.length < maxItems) {
			onChange([...value, inputValue.trim()]);
			setInputValue('');
		}
	}, [inputValue, value, maxItems, onChange]);

	const handleRemove = useCallback(
		(index: number) => {
			if (value.length > minItems) {
				onChange(value.filter((_, i) => i !== index));
			}
		},
		[value, minItems, onChange]
	);

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleAdd();
			}
		},
		[handleAdd]
	);

	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel>{label}</FormLabel>
			<Stack spacing={2} sx={{ mt: 1 }}>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<TextField
						fullWidth
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={placeholder || t('addItem') || 'Add item'}
						size="small"
						disabled={value.length >= maxItems}
					/>
					<IconButton
						onClick={handleAdd}
						disabled={!inputValue.trim() || value.length >= maxItems}
						color="primary"
					>
						<IconPlus size={20} />
					</IconButton>
				</Box>

				{value.length > 0 && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						<AnimatePresence>
							{value.map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
								>
									<Chip
										label={item}
										onDelete={value.length > minItems ? () => handleRemove(index) : undefined}
										deleteIcon={<IconX size={16} />}
										size="small"
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</Box>
				)}

				{value.length === 0 && (
					<Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
						{t('noItems') || 'No items added'}
					</Typography>
				)}
			</Stack>
			{error && <FormHelperText error>{error}</FormHelperText>}
			{!error && helperText && <FormHelperText>{helperText}</FormHelperText>}
			{maxItems && (
				<FormHelperText>
					{value.length} / {maxItems} {t('items') || 'items'}
				</FormHelperText>
			)}
		</FormControl>
	);
}

// Autocomplete with Tags Component
interface AutocompleteTagsProps {
	name: string;
	label: string;
	value: string[];
	onChange: (value: string[]) => void;
	options: string[];
	placeholder?: string;
	helperText?: string;
	error?: string;
	required?: boolean;
	freeSolo?: boolean;
}

export function AutocompleteTags({
	name,
	label,
	value = [],
	onChange,
	options = [],
	placeholder,
	helperText,
	error,
	required = false,
	freeSolo = true,
}: AutocompleteTagsProps) {
	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel>{label}</FormLabel>
			<Autocomplete
				multiple
				freeSolo={freeSolo}
				options={options}
				value={value}
				onChange={(_, newValue) => onChange(newValue)}
				renderTags={(tagValue, getTagProps) =>
					tagValue.map((option, index) => (
						<Chip
							{...getTagProps({ index })}
							key={index}
							label={option}
							size="small"
							deleteIcon={<IconX size={16} />}
						/>
					))
				}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder || 'Type and press Enter'}
						error={!!error}
						helperText={error || helperText}
					/>
				)}
				sx={{ mt: 1 }}
			/>
		</FormControl>
	);
}

// Field Group Component
interface FieldGroupProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	collapsible?: boolean;
	defaultExpanded?: boolean;
}

export function FieldGroup({
	title,
	description,
	children,
	collapsible = false,
	defaultExpanded = true,
}: FieldGroupProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);

	return (
		<Box
			sx={{
				p: 3,
				borderRadius: 2,
				border: '1px solid',
				borderColor: 'divider',
				backgroundColor: 'background.paper',
			}}
		>
			<Stack spacing={2}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<Stack spacing={0.5}>
						<Typography variant="h6" fontWeight={600}>
							{title}
						</Typography>
						{description && (
							<Typography variant="body2" color="text.secondary">
								{description}
							</Typography>
						)}
					</Stack>
					{collapsible && (
						<IconButton
							size="small"
							onClick={() => setExpanded(!expanded)}
							sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
						>
							<IconX size={20} />
						</IconButton>
					)}
				</Box>
				<AnimatePresence>
					{expanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Box sx={{ pt: 2 }}>{children}</Box>
						</motion.div>
					)}
				</AnimatePresence>
			</Stack>
		</Box>
	);
}

// Help Text Component
interface HelpTextProps {
	text: string;
	icon?: React.ReactNode;
}

export function HelpText({ text, icon }: HelpTextProps) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
			{icon || <IconInfoCircle size={16} />}
			<Typography variant="caption" color="text.secondary">
				{text}
			</Typography>
		</Box>
	);
}

