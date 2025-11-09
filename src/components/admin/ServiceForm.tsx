'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Switch,
	FormControlLabel,
	Typography,
	Divider,
	Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Card } from '@/components/ui/card';
import { PricingEditor, Pricing } from './PricingEditor';
import { ArrayFieldEditor } from './ArrayFieldEditor';
import { ProcessStepsEditor, ProcessStep } from './ProcessStepsEditor';
import type { Service } from '@/lib/types/service';

interface ServiceFormProps {
	initialData?: Service;
	onSubmit: (data: any) => Promise<void>;
	loading?: boolean;
	error?: string | null;
	categories: Array<{ id: string; name: string; name_ar?: string }>;
}

export function ServiceForm({ initialData, onSubmit, loading = false, error, categories }: ServiceFormProps) {
	// Basic Info
	const [nameEn, setNameEn] = useState(initialData?.name_en || '');
	const [nameAr, setNameAr] = useState(initialData?.name_ar || '');
	const [slug, setSlug] = useState(initialData?.slug || '');
	const [categoryId, setCategoryId] = useState(initialData?.category_id || '');

	// Descriptions
	const [shortDescriptionEn, setShortDescriptionEn] = useState(initialData?.short_description_en || '');
	const [shortDescriptionAr, setShortDescriptionAr] = useState(initialData?.short_description_ar || '');
	const [descriptionEn, setDescriptionEn] = useState(initialData?.description_en || '');
	const [descriptionAr, setDescriptionAr] = useState(initialData?.description_ar || '');
	const [detailedDescription, setDetailedDescription] = useState(initialData?.detailed_description || '');

	// Pricing
	const [pricing, setPricing] = useState<Pricing | undefined>(initialData?.pricing || { type: 'quote' });

	// Arrays
	const [features, setFeatures] = useState<string[]>(initialData?.features || []);
	const [requiredDocuments, setRequiredDocuments] = useState<string[]>(initialData?.required_documents || []);
	const [processSteps, setProcessSteps] = useState<ProcessStep[]>(initialData?.process_steps || []);

	// Media
	const [icon, setIcon] = useState(initialData?.icon || '');
	const [imageLight, setImageLight] = useState(initialData?.image_light || '');
	const [imageDark, setImageDark] = useState(initialData?.image_dark || '');

	// Settings
	const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
	const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
	const [sortOrder, setSortOrder] = useState(initialData?.sort_order || 0);
	const [turnaroundDays, setTurnaroundDays] = useState(initialData?.turnaround_days || '');
	const [turnaroundWindow, setTurnaroundWindow] = useState(initialData?.turnaround_window || '');

	// Auto-generate slug from name_en
	useEffect(() => {
		if (!initialData && nameEn) {
			const generatedSlug = nameEn
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)/g, '');
			setSlug(generatedSlug);
		}
	}, [nameEn, initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!nameEn || !nameAr || !slug || !categoryId) {
			return;
		}

		const formData = {
			name_en: nameEn,
			name_ar: nameAr,
			slug,
			category_id: categoryId,
			short_description_en: shortDescriptionEn || undefined,
			short_description_ar: shortDescriptionAr || undefined,
			description_en: descriptionEn || undefined,
			description_ar: descriptionAr || undefined,
			detailed_description: detailedDescription || undefined,
			pricing: pricing || undefined,
			features: features.length > 0 ? features.filter((f) => f.trim()) : undefined,
			process_steps: processSteps.length > 0 ? processSteps : undefined,
			required_documents: requiredDocuments.length > 0 ? requiredDocuments.filter((d) => d.trim()) : undefined,
			icon: icon || undefined,
			image_light: imageLight || undefined,
			image_dark: imageDark || undefined,
			is_active: isActive,
			is_featured: isFeatured,
			sort_order: sortOrder,
			turnaround_days: turnaroundDays ? parseInt(turnaroundDays.toString()) : undefined,
			turnaround_window: turnaroundWindow || undefined,
		};

		await onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				{error && (
					<Alert severity="error">{error}</Alert>
				)}

				{/* Section 1: Basic Information */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Basic Information
						</Typography>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Service Name (English)"
									value={nameEn}
									onChange={(e) => setNameEn(e.target.value)}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Service Name (Arabic)"
									value={nameAr}
									onChange={(e) => setNameAr(e.target.value)}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Slug"
									value={slug}
									onChange={(e) => setSlug(e.target.value)}
									required
									disabled={loading}
									helperText="URL-friendly identifier (e.g., drivers-license-renewal)"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControl fullWidth required>
									<InputLabel>Category</InputLabel>
									<Select
										value={categoryId}
										label="Category"
										onChange={(e) => setCategoryId(e.target.value)}
										disabled={loading}
									>
										{categories.map((cat) => (
											<MenuItem key={cat.id} value={cat.id}>
												{cat.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Box>
				</Card>

				{/* Section 2: Descriptions */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Descriptions
						</Typography>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Short Description (English)"
									multiline
									rows={3}
									value={shortDescriptionEn}
									onChange={(e) => setShortDescriptionEn(e.target.value)}
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Short Description (Arabic)"
									multiline
									rows={3}
									value={shortDescriptionAr}
									onChange={(e) => setShortDescriptionAr(e.target.value)}
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Detailed Description (English)"
									multiline
									rows={5}
									value={descriptionEn}
									onChange={(e) => setDescriptionEn(e.target.value)}
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Detailed Description (Arabic)"
									multiline
									rows={5}
									value={descriptionAr}
									onChange={(e) => setDescriptionAr(e.target.value)}
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Legacy Detailed Description (Fallback)"
									multiline
									rows={3}
									value={detailedDescription}
									onChange={(e) => setDetailedDescription(e.target.value)}
									disabled={loading}
									helperText="Used as fallback if description_en/description_ar are not available"
								/>
							</Grid>
						</Grid>
					</Box>
				</Card>

				{/* Section 3: Pricing */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<PricingEditor value={pricing} onChange={setPricing} />
					</Box>
				</Card>

				{/* Section 4: Features */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<ArrayFieldEditor
							label="Features"
							value={features}
							onChange={setFeatures}
							placeholder="e.g., No ministry visit required"
						/>
					</Box>
				</Card>

				{/* Section 5: Process Steps */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<ProcessStepsEditor value={processSteps} onChange={setProcessSteps} />
					</Box>
				</Card>

				{/* Section 6: Required Documents */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<ArrayFieldEditor
							label="Required Documents"
							value={requiredDocuments}
							onChange={setRequiredDocuments}
							placeholder="e.g., Copy of existing driver's license"
						/>
					</Box>
				</Card>

				{/* Section 7: Media */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Media
						</Typography>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Icon (URL or path)"
									value={icon}
									onChange={(e) => setIcon(e.target.value)}
									disabled={loading}
									helperText="Icon URL or file path"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Image Light (URL or path)"
									value={imageLight}
									onChange={(e) => setImageLight(e.target.value)}
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<TextField
									fullWidth
									label="Image Dark (URL or path)"
									value={imageDark}
									onChange={(e) => setImageDark(e.target.value)}
									disabled={loading}
								/>
							</Grid>
						</Grid>
					</Box>
				</Card>

				{/* Section 8: Settings */}
				<Card
					backgroundColor={{ light: 'background.paper', dark: 'background.paper' }}
					borderColor={{ light: 'divider', dark: 'divider' }}
					borderRadius={20}
				>
					<Box sx={{ p: 3 }}>
						<Typography variant="h6" fontWeight={600} gutterBottom>
							Settings
						</Typography>
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControlLabel
									control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} disabled={loading} />}
									label="Is Active"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<FormControlLabel
									control={<Switch checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} disabled={loading} />}
									label="Is Featured"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<TextField
									fullWidth
									label="Sort Order"
									type="number"
									value={sortOrder}
									onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
									disabled={loading}
									inputProps={{ min: 0 }}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<TextField
									fullWidth
									label="Turnaround Days"
									type="number"
									value={turnaroundDays}
									onChange={(e) => setTurnaroundDays(e.target.value)}
									disabled={loading}
									inputProps={{ min: 0 }}
									helperText="Number of days"
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 4 }}>
								<TextField
									fullWidth
									label="Turnaround Window"
									value={turnaroundWindow}
									onChange={(e) => setTurnaroundWindow(e.target.value)}
									disabled={loading}
									helperText="e.g., 3-5 business days"
								/>
							</Grid>
						</Grid>
					</Box>
				</Card>
			</Box>
		</form>
	);
}

