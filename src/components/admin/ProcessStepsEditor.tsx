'use client';

import { useState } from 'react';
import { Box, TextField, IconButton, Button, Typography, Divider } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Card } from '@/components/ui/card';

export interface ProcessStep {
	number: number;
	title_en: string;
	title_ar: string;
	description_en: string;
	description_ar: string;
}

interface ProcessStepsEditorProps {
	value: ProcessStep[];
	onChange: (steps: ProcessStep[]) => void;
}

export function ProcessStepsEditor({ value, onChange }: ProcessStepsEditorProps) {
	const steps = value || [];

	const handleAdd = () => {
		const newStep: ProcessStep = {
			number: steps.length + 1,
			title_en: '',
			title_ar: '',
			description_en: '',
			description_ar: '',
		};
		onChange([...steps, newStep]);
	};

	const handleRemove = (index: number) => {
		const updated = steps.filter((_, i) => i !== index).map((step, i) => ({
			...step,
			number: i + 1,
		}));
		onChange(updated);
	};

	const handleStepChange = (index: number, field: keyof ProcessStep, newValue: string | number) => {
		const updated = [...steps];
		updated[index] = {
			...updated[index],
			[field]: newValue,
		};
		onChange(updated);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Typography variant="subtitle1" fontWeight={600}>
					Process Steps
				</Typography>
				<Button startIcon={<AddIcon />} onClick={handleAdd} size="small" variant="outlined">
					Add Step
				</Button>
			</Box>

			{steps.length === 0 && (
				<Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
					No steps added. Click "Add Step" to add one.
				</Typography>
			)}

			{steps.map((step, index) => (
				<Card
					key={index}
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={12}
				>
					<Box sx={{ p: 2 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
							<Typography variant="subtitle2" fontWeight={600}>
								Step {step.number}
							</Typography>
							<IconButton onClick={() => handleRemove(index)} color="error" size="small">
								<DeleteIcon />
							</IconButton>
						</Box>

						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Title (English)"
									value={step.title_en}
									onChange={(e) => handleStepChange(index, 'title_en', e.target.value)}
									placeholder="e.g., Submit Documents"
									size="small"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Title (Arabic)"
									value={step.title_ar}
									onChange={(e) => handleStepChange(index, 'title_ar', e.target.value)}
									placeholder="مثال: تقديم المستندات"
									size="small"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Description (English)"
									multiline
									rows={3}
									value={step.description_en}
									onChange={(e) => handleStepChange(index, 'description_en', e.target.value)}
									placeholder="Detailed description of this step"
									size="small"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Description (Arabic)"
									multiline
									rows={3}
									value={step.description_ar}
									onChange={(e) => handleStepChange(index, 'description_ar', e.target.value)}
									placeholder="وصف تفصيلي لهذه الخطوة"
									size="small"
								/>
							</Grid>
						</Grid>
					</Box>
				</Card>
			))}
		</Box>
	);
}

