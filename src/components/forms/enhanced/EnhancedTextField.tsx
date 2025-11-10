'use client';

import { useState, useCallback, useEffect } from 'react';
import {
	FormControl,
	FormLabel,
	FormHelperText,
	OutlinedInput,
	InputAdornment,
	IconButton,
	Tooltip,
	Autocomplete,
	TextField,
	Stack,
	Box,
	Typography,
	Chip,
} from '@mui/material';
import { IconInfoCircle, IconCheck, IconAlertCircle, IconX } from '@tabler/icons-react';
import { useFormValidation, formatPhoneNumber, getEmailDomainSuggestions } from '@/hooks/use-form-validation';
import { z } from 'zod';

interface EnhancedTextFieldProps {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	error?: string;
	suggestion?: string;
	helperText?: string;
	required?: boolean;
	type?: string;
	placeholder?: string;
	disabled?: boolean;
	validationSchema?: z.ZodString;
	showSuggestions?: boolean;
	formatValue?: (value: string) => string;
}

export function EnhancedTextField({
	label,
	name,
	value,
	onChange,
	onBlur,
	error,
	suggestion,
	helperText,
	required = false,
	type = 'text',
	placeholder,
	disabled = false,
	validationSchema,
	showSuggestions = false,
	formatValue,
}: EnhancedTextFieldProps) {
	const [showSuggestionList, setShowSuggestionList] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [touched, setTouched] = useState(false);

	// Email domain suggestions
	useEffect(() => {
		if (showSuggestions && type === 'email' && value.includes('@') && !value.endsWith('@')) {
			const domainSuggestions = getEmailDomainSuggestions(value);
			setSuggestions(domainSuggestions);
			setShowSuggestionList(domainSuggestions.length > 0);
		} else {
			setShowSuggestionList(false);
		}
	}, [value, type, showSuggestions]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = formatValue ? formatValue(e.target.value) : e.target.value;
			onChange(newValue);
		},
		[onChange, formatValue]
	);

	const handleBlur = useCallback(() => {
		setTouched(true);
		onBlur?.();
	}, [onBlur]);

	const handleSuggestionClick = useCallback(
		(suggestion: string) => {
			onChange(suggestion);
			setShowSuggestionList(false);
		},
		[onChange]
	);

	const hasError = touched && !!error;
	const hasSuccess = touched && !error && value.length > 0;

	return (
		<FormControl fullWidth error={hasError} required={required}>
			<FormLabel htmlFor={name}>
				{label}
				{required && <span style={{ color: 'red' }}> *</span>}
			</FormLabel>
			<Box sx={{ position: 'relative', mt: 1 }}>
				<OutlinedInput
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder={placeholder}
					disabled={disabled}
					error={hasError}
					endAdornment={
						<InputAdornment position="end">
							{hasSuccess && <IconCheck size={18} color="success" />}
							{hasError && <IconAlertCircle size={18} color="error" />}
							{helperText && (
								<Tooltip title={helperText}>
									<IconInfoCircle size={18} style={{ cursor: 'help' }} />
								</Tooltip>
							)}
						</InputAdornment>
					}
					sx={{
						'& .MuiOutlinedInput-input': {
							paddingRight: hasSuccess || hasError || helperText ? '40px' : '14px',
						},
					}}
				/>

				{/* Email Domain Suggestions */}
				{showSuggestionList && suggestions.length > 0 && (
					<Box
						sx={{
							position: 'absolute',
							top: '100%',
							left: 0,
							right: 0,
							mt: 0.5,
							bgcolor: 'background.paper',
							border: '1px solid',
							borderColor: 'divider',
							borderRadius: 1,
							boxShadow: 2,
							zIndex: 1000,
							maxHeight: 200,
							overflow: 'auto',
						}}
					>
						{suggestions.map((suggestion, index) => (
							<Box
								key={index}
								onClick={() => handleSuggestionClick(suggestion)}
								sx={{
									p: 1.5,
									cursor: 'pointer',
									'&:hover': {
										bgcolor: 'action.hover',
									},
								}}
							>
								<Typography variant="body2">{suggestion}</Typography>
							</Box>
						))}
					</Box>
				)}
			</Box>

			{/* Error Message with Suggestion */}
			{hasError && (
				<FormHelperText error>
					<Stack direction="row" spacing={1} alignItems="center">
						<span>{error}</span>
						{suggestion && (
							<Chip
								label={`Try: ${suggestion}`}
								size="small"
								variant="outlined"
								color="error"
								onClick={() => onChange(suggestion)}
								icon={<IconInfoCircle size={14} />}
								sx={{ cursor: 'pointer' }}
							/>
						)}
					</Stack>
				</FormHelperText>
			)}

			{/* Helper Text */}
			{!hasError && helperText && <FormHelperText>{helperText}</FormHelperText>}
		</FormControl>
	);
}

// Phone Number Field with Formatting
interface EnhancedPhoneFieldProps extends Omit<EnhancedTextFieldProps, 'type' | 'formatValue'> {}

export function EnhancedPhoneField(props: EnhancedPhoneFieldProps) {
	return (
		<EnhancedTextField
			{...props}
			type="tel"
			formatValue={formatPhoneNumber}
			placeholder="+970 5X XXXXXXX"
		/>
	);
}

// Email Field with Domain Suggestions
interface EnhancedEmailFieldProps extends Omit<EnhancedTextFieldProps, 'type' | 'showSuggestions'> {}

export function EnhancedEmailField(props: EnhancedEmailFieldProps) {
	return <EnhancedTextField {...props} type="email" showSuggestions={true} />;
}

