'use client';

import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

export interface Pricing {
	type: 'fixed' | 'quote' | 'starting';
	amount?: number;
	note_en?: string;
	note_ar?: string;
}

interface PricingEditorProps {
	value: Pricing | undefined;
	onChange: (pricing: Pricing) => void;
}

export function PricingEditor({ value, onChange }: PricingEditorProps) {
	const pricing = value || { type: 'quote' };

	const handleTypeChange = (type: 'fixed' | 'quote' | 'starting') => {
		onChange({
			...pricing,
			type,
			// Clear amount if switching to quote
			amount: type === 'quote' ? undefined : pricing.amount,
		});
	};

	const handleAmountChange = (amount: string) => {
		const numAmount = amount === '' ? undefined : parseFloat(amount);
		onChange({
			...pricing,
			amount: numAmount,
		});
	};

	const handleNoteEnChange = (note_en: string) => {
		onChange({
			...pricing,
			note_en: note_en || undefined,
		});
	};

	const handleNoteArChange = (note_ar: string) => {
		onChange({
			...pricing,
			note_ar: note_ar || undefined,
		});
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Typography variant="subtitle1" fontWeight={600}>
				Pricing
			</Typography>

			<FormControl fullWidth>
				<InputLabel>Pricing Type</InputLabel>
				<Select value={pricing.type} label="Pricing Type" onChange={(e) => handleTypeChange(e.target.value as 'fixed' | 'quote' | 'starting')}>
					<MenuItem value="fixed">Fixed Price</MenuItem>
					<MenuItem value="starting">Starting From</MenuItem>
					<MenuItem value="quote">Quote Based</MenuItem>
				</Select>
			</FormControl>

			{pricing.type !== 'quote' && (
				<TextField
					fullWidth
					label="Amount (ILS)"
					type="number"
					value={pricing.amount || ''}
					onChange={(e) => handleAmountChange(e.target.value)}
					inputProps={{ min: 0, step: 0.01 }}
					helperText={pricing.type === 'fixed' ? 'Fixed price for this service' : 'Minimum/starting price'}
				/>
			)}

			<Grid container spacing={2}>
				<Grid size={{ xs: 12, md: 6 }}>
					<TextField
						fullWidth
						label="Note (English)"
						multiline
						rows={2}
						value={pricing.note_en || ''}
						onChange={(e) => handleNoteEnChange(e.target.value)}
						placeholder="e.g., Price may vary based on document complexity"
					/>
				</Grid>
				<Grid size={{ xs: 12, md: 6 }}>
					<TextField
						fullWidth
						label="Note (Arabic)"
						multiline
						rows={2}
						value={pricing.note_ar || ''}
						onChange={(e) => handleNoteArChange(e.target.value)}
						placeholder="مثال: قد يختلف السعر حسب تعقيد المستند"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

