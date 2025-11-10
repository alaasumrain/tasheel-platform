'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	Box,
	TextField,
	Autocomplete,
	FormControl,
	FormLabel,
	FormHelperText,
	Stack,
	Chip,
	Typography,
	Tooltip,
	IconButton,
} from '@mui/material';
import { IconInfoCircle, IconX, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

// Smart Field Suggestions Hook
export function useSmartSuggestions(fieldName: string, value: string) {
	const [suggestions, setSuggestions] = useState<string[]>([]);

	useEffect(() => {
		if (!value || value.length < 2) {
			setSuggestions([]);
			return;
		}

		// Load suggestions from localStorage (user's previous inputs)
		try {
			const stored = localStorage.getItem(`field_suggestions_${fieldName}`);
			if (stored) {
				const previousValues = JSON.parse(stored) as string[];
				const filtered = previousValues
					.filter((v) => v.toLowerCase().includes(value.toLowerCase()) && v !== value)
					.slice(0, 5);
				setSuggestions(filtered);
			}
		} catch (error) {
			console.error('Error loading suggestions:', error);
		}
	}, [fieldName, value]);

	const saveSuggestion = useCallback(
		(newValue: string) => {
			try {
				const key = `field_suggestions_${fieldName}`;
				const stored = localStorage.getItem(key);
				const previousValues = stored ? (JSON.parse(stored) as string[]) : [];
				
				// Add new value if not already present
				if (!previousValues.includes(newValue)) {
					const updated = [newValue, ...previousValues].slice(0, 20); // Keep last 20
					localStorage.setItem(key, JSON.stringify(updated));
				}
			} catch (error) {
				console.error('Error saving suggestion:', error);
			}
		},
		[fieldName]
	);

	return { suggestions, saveSuggestion };
}

// Smart Autocomplete Field Component
interface SmartAutocompleteFieldProps {
	name: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	error?: string;
	helperText?: string;
	required?: boolean;
	options?: string[];
	placeholder?: string;
	freeSolo?: boolean;
	showSuggestions?: boolean;
}

export function SmartAutocompleteField({
	name,
	label,
	value,
	onChange,
	onBlur,
	error,
	helperText,
	required = false,
	options = [],
	placeholder,
	freeSolo = true,
	showSuggestions = true,
}: SmartAutocompleteFieldProps) {
	const { suggestions, saveSuggestion } = useSmartSuggestions(name, value);
	const allOptions = useMemo(() => {
		const combined = [...options];
		if (showSuggestions) {
			suggestions.forEach((s) => {
				if (!combined.includes(s)) {
					combined.push(s);
				}
			});
		}
		return combined;
	}, [options, suggestions, showSuggestions]);

	const handleChange = useCallback(
		(newValue: string | null) => {
			if (newValue) {
				onChange(newValue);
				saveSuggestion(newValue);
			} else {
				onChange('');
			}
		},
		[onChange, saveSuggestion]
	);

	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel>{label}</FormLabel>
			<Autocomplete
				freeSolo={freeSolo}
				options={allOptions}
				value={value}
				onChange={(_, newValue) => handleChange(newValue as string | null)}
				onBlur={onBlur}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder}
						error={!!error}
						helperText={error || helperText}
					/>
				)}
				renderOption={(props, option) => (
					<Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						{showSuggestions && suggestions.includes(option) && (
							<IconSparkles size={16} style={{ color: '#FFC107' }} />
						)}
						{option}
					</Box>
				)}
				sx={{ mt: 1 }}
			/>
		</FormControl>
	);
}

// Field with Smart Defaults Component
interface SmartDefaultsFieldProps {
	name: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: 'text' | 'email' | 'tel';
	placeholder?: string;
	error?: string;
	helperText?: string;
	required?: boolean;
	smartDefaults?: {
		detectFromContext?: boolean;
		usePreviousValues?: boolean;
		useCommonValues?: boolean;
	};
}

export function SmartDefaultsField({
	name,
	label,
	value,
	onChange,
	type = 'text',
	placeholder,
	error,
	helperText,
	required = false,
	smartDefaults = {
		detectFromContext: true,
		usePreviousValues: true,
		useCommonValues: true,
	},
}: SmartDefaultsFieldProps) {
	const [smartValue, setSmartValue] = useState<string>('');

	useEffect(() => {
		if (value) {
			setSmartValue(value);
			return;
		}

		// Try to get smart default
		let defaultValue = '';

		// 1. Use previous values
		if (smartDefaults.usePreviousValues) {
			try {
				const stored = localStorage.getItem(`field_suggestions_${name}`);
				if (stored) {
					const previousValues = JSON.parse(stored) as string[];
					if (previousValues.length > 0) {
						defaultValue = previousValues[0];
					}
				}
			} catch (error) {
				// Ignore
			}
		}

		// 2. Detect from context (browser, URL params, etc.)
		if (!defaultValue && smartDefaults.detectFromContext) {
			if (type === 'email') {
				// Could detect from browser autofill or previous sessions
			} else if (type === 'tel') {
				// Could detect from browser or device
			}
		}

		// 3. Use common values
		if (!defaultValue && smartDefaults.useCommonValues) {
			// Could use common patterns based on field name
		}

		if (defaultValue) {
			setSmartValue(defaultValue);
		}
	}, [name, type, smartDefaults, value]);

	const handleChange = useCallback(
		(newValue: string) => {
			setSmartValue(newValue);
			onChange(newValue);
		},
		[onChange]
	);

	return (
		<FormControl fullWidth error={!!error} required={required}>
			<FormLabel>{label}</FormLabel>
			<TextField
				name={name}
				type={type}
				value={smartValue}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={placeholder}
				error={!!error}
				helperText={error || helperText}
				sx={{ mt: 1 }}
			/>
		</FormControl>
	);
}

// Field Validation Helper Component
interface ValidationHelperProps {
	fieldName: string;
	value: string;
	rules?: {
		minLength?: number;
		maxLength?: number;
		pattern?: RegExp;
		required?: boolean;
		custom?: (value: string) => string | null;
	};
}

export function ValidationHelper({ fieldName, value, rules }: ValidationHelperProps) {
	const [hints, setHints] = useState<string[]>([]);

	useEffect(() => {
		const newHints: string[] = [];

		if (!rules) return;

		if (rules.required && !value) {
			newHints.push('This field is required');
		}

		if (rules.minLength && value.length > 0 && value.length < rules.minLength) {
			newHints.push(`Minimum ${rules.minLength} characters`);
		}

		if (rules.maxLength && value.length > rules.maxLength) {
			newHints.push(`Maximum ${rules.maxLength} characters`);
		}

		if (rules.pattern && value && !rules.pattern.test(value)) {
			newHints.push('Invalid format');
		}

		if (rules.custom && value) {
			const customError = rules.custom(value);
			if (customError) {
				newHints.push(customError);
			}
		}

		setHints(newHints);
	}, [value, rules]);

	if (hints.length === 0) return null;

	return (
		<Box sx={{ mt: 0.5 }}>
			{hints.map((hint, index) => (
				<Typography key={index} variant="caption" color="error" sx={{ display: 'block' }}>
					• {hint}
				</Typography>
			))}
		</Box>
	);
}

// Field Character Counter Component
interface CharacterCounterProps {
	current: number;
	max: number;
	min?: number;
	showMin?: boolean;
}

export function CharacterCounter({ current, max, min, showMin = false }: CharacterCounterProps) {
	const percentage = (current / max) * 100;
	const isWarning = percentage > 80;
	const isError = percentage >= 100;

	return (
		<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
			<Box sx={{ flex: 1, height: 4, borderRadius: 1, backgroundColor: 'divider', overflow: 'hidden' }}>
				<Box
					sx={{
						width: `${Math.min(percentage, 100)}%`,
						height: '100%',
						backgroundColor: isError ? 'error.main' : isWarning ? 'warning.main' : 'primary.main',
						transition: 'width 0.2s',
					}}
				/>
			</Box>
			<Typography
				variant="caption"
				color={isError ? 'error.main' : isWarning ? 'warning.main' : 'text.secondary'}
				sx={{ minWidth: 60, textAlign: 'right' }}
			>
				{showMin && min !== undefined ? `${current}/${min}-${max}` : `${current}/${max}`}
			</Typography>
		</Stack>
	);
}

// Field Help Component with Examples
interface FieldHelpProps {
	title?: string;
	description?: string;
	examples?: string[];
	link?: {
		text: string;
		url: string;
	};
}

export function FieldHelp({ title, description, examples, link }: FieldHelpProps) {
	const [open, setOpen] = useState(false);

	if (!title && !description && !examples && !link) return null;

	return (
		<Box sx={{ mt: 1 }}>
			<Tooltip title="Click for help">
				<IconButton size="small" onClick={() => setOpen(!open)} sx={{ p: 0.5 }}>
					<IconInfoCircle size={16} />
				</IconButton>
			</Tooltip>
			{open && (
				<Box
					sx={{
						mt: 1,
						p: 2,
						borderRadius: 1,
						backgroundColor: 'background.paper',
						border: '1px solid',
						borderColor: 'divider',
						boxShadow: 2,
					}}
				>
					{title && (
						<Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
							{title}
						</Typography>
					)}
					{description && (
						<Typography variant="body2" color="text.secondary" sx={{ mb: examples ? 1 : 0 }}>
							{description}
						</Typography>
					)}
					{examples && examples.length > 0 && (
						<Stack spacing={0.5} sx={{ mt: 1 }}>
							<Typography variant="caption" fontWeight={600}>
								Examples:
							</Typography>
							{examples.map((example, index) => (
								<Chip key={index} label={example} size="small" variant="outlined" />
							))}
						</Stack>
					)}
					{link && (
						<Box sx={{ mt: 1 }}>
							<a href={link.url} target="_blank" rel="noopener noreferrer">
								<Typography variant="caption" color="primary">
									{link.text} →
								</Typography>
							</a>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}

