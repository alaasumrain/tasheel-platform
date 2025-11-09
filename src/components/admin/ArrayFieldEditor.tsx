'use client';

import { Box, TextField, IconButton, Button, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface ArrayFieldEditorProps {
	label: string;
	value: string[];
	onChange: (items: string[]) => void;
	placeholder?: string;
}

export function ArrayFieldEditor({ label, value, onChange, placeholder }: ArrayFieldEditorProps) {
	const items = value || [];

	const handleAdd = () => {
		onChange([...items, '']);
	};

	const handleRemove = (index: number) => {
		onChange(items.filter((_, i) => i !== index));
	};

	const handleChange = (index: number, newValue: string) => {
		const updated = [...items];
		updated[index] = newValue;
		onChange(updated);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="subtitle1" fontWeight={600}>
					{label}
				</Typography>
				<Button startIcon={<AddIcon />} onClick={handleAdd} size="small" variant="outlined">
					Add Item
				</Button>
			</Box>

			{items.length === 0 && (
				<Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
					No items added. Click "Add Item" to add one.
				</Typography>
			)}

			{items.map((item, index) => (
				<Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
					<TextField
						fullWidth
						value={item}
						onChange={(e) => handleChange(index, e.target.value)}
						placeholder={placeholder || `Item ${index + 1}`}
						size="small"
					/>
					<IconButton onClick={() => handleRemove(index)} color="error" size="small" sx={{ mt: 0.5 }}>
						<DeleteIcon />
					</IconButton>
				</Box>
			))}
		</Box>
	);
}

