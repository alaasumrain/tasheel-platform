'use client';

import {
	Box,
	Button,
	Chip,
	Divider,
	Stack,
	Switch,
	Typography,
	useTheme,
} from '@mui/material';
import {
	IconCategory,
	IconClock,
	IconCurrencyShekel,
	IconBolt,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { CardContent } from '@mui/material';

type TurnaroundFilter = 'all' | 'express' | 'standard' | 'extended';
type PricingFilter = 'all' | 'fixed' | 'starting' | 'quote';

interface ServiceCategory {
	slug: string;
	name: string;
	description: string;
}

interface ServicesFilterSidebarProps {
	categories: ServiceCategory[];
	categoryCounts: Record<string, number>;
	selectedCategories: string[];
	onToggleCategory: (slug: string) => void;
	onClearCategories: () => void;
	turnaroundFilter: TurnaroundFilter;
	onTurnaroundChange: (value: TurnaroundFilter) => void;
	pricingFilter: PricingFilter;
	onPricingChange: (value: PricingFilter) => void;
	expressOnly: boolean;
	onExpressToggle: (value: boolean) => void;
	onResetFilters: () => void;
	activeFiltersCount: number;
	resultsCount: number;
	locale: 'en' | 'ar';
	inDrawer?: boolean;
}

export default function ServicesFilterSidebar({
	categories,
	categoryCounts,
	selectedCategories,
	onToggleCategory,
	onClearCategories,
	turnaroundFilter,
	onTurnaroundChange,
	pricingFilter,
	onPricingChange,
	expressOnly,
	onExpressToggle,
	onResetFilters,
	activeFiltersCount,
	resultsCount,
	locale,
	inDrawer = false,
}: ServicesFilterSidebarProps) {
	const t = useTranslations('Services');
	const theme = useTheme();

	const turnaroundOptions = [
		{ value: 'all' as TurnaroundFilter, label: t('filters.turnaroundOptions.all') },
		{ value: 'express' as TurnaroundFilter, label: t('filters.turnaroundOptions.express') },
		{ value: 'standard' as TurnaroundFilter, label: t('filters.turnaroundOptions.standard') },
		{ value: 'extended' as TurnaroundFilter, label: t('filters.turnaroundOptions.extended') },
	];

	const pricingOptions = [
		{ value: 'all' as PricingFilter, label: t('filters.pricingOptions.all') },
		{ value: 'fixed' as PricingFilter, label: t('filters.pricingOptions.fixed') },
		{ value: 'starting' as PricingFilter, label: t('filters.pricingOptions.starting') },
		{ value: 'quote' as PricingFilter, label: t('filters.pricingOptions.quote') },
	];

	return (
		<Box
			sx={{
				width: { xs: '100%', md: inDrawer ? '100%' : '280px' },
				minWidth: { xs: 'auto', md: inDrawer ? 'auto' : '280px' },
				position: { xs: 'static', md: inDrawer ? 'static' : 'sticky' },
				top: { xs: 'auto', md: inDrawer ? 'auto' : 100 },
				alignSelf: { xs: 'stretch', md: 'flex-start' },
			}}
		>
			<Card
				backgroundColor={{ light: '#ffffff', dark: '#181818' }}
				borderColor={{ light: '#ffffff', dark: '#444444' }}
				borderRadius={16}
				gradientColor={{ light: '#eeeeee', dark: '#262626' }}
				gradientOpacity={0.3}
			>
				<CardContent sx={{ p: 3 }}>
					<Stack spacing={3}>
						{/* Header */}
						<Stack spacing={1}>
							<Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9375rem' }}>
								{t('filters.heading')}
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
								{t('filters.resultsSummary', { count: resultsCount })}
							</Typography>
						</Stack>

						{activeFiltersCount > 0 && (
							<Button
								variant="outlined"
								onClick={onResetFilters}
								size="small"
								fullWidth
								sx={{
									borderRadius: 1.5,
									px: 2,
									py: 0.75,
									fontWeight: 600,
									fontSize: '0.8125rem',
								}}
							>
								{t('filters.clearAll')}
							</Button>
						)}

						<Divider />

						{/* Categories Section */}
						<Stack spacing={1.5}>
							<Stack direction="row" spacing={1} alignItems="center">
								<IconCategory size={18} style={{ color: theme.palette.primary.main }} />
								<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{t('filters.categories')}
								</Typography>
							</Stack>
							<Stack direction="row" flexWrap="wrap" gap={0.75}>
								<Chip
									label={t('filters.allCategories')}
									variant={selectedCategories.length === 0 ? 'filled' : 'outlined'}
									onClick={onClearCategories}
									size="small"
									sx={(theme) => ({
										fontSize: inDrawer ? '0.875rem' : '0.75rem',
										fontWeight: 600,
										height: inDrawer ? 40 : 32,
										px: inDrawer ? 2 : 1.5,
										py: inDrawer ? 1 : 0,
										bgcolor:
											selectedCategories.length === 0
												? 'primary.main'
												: 'transparent',
										color:
											selectedCategories.length === 0
												? 'primary.contrastText'
												: 'text.primary',
										borderColor: 'divider',
										'&:hover': {
											bgcolor:
												selectedCategories.length === 0
													? 'primary.dark'
													: theme.palette.mode === 'dark'
														? 'rgba(255,255,255,0.05)'
														: 'rgba(0,0,0,0.04)',
										},
									})}
								/>
								{categories.map((category) => {
									const isActive = selectedCategories.includes(category.slug);
									const count = categoryCounts[category.slug] || 0;
									const categoryLabel = t(`categoryLabels.${category.slug}` as any) || category.name;
									return (
										<Chip
											key={category.slug}
											label={`${categoryLabel} (${count})`}
											variant={isActive ? 'filled' : 'outlined'}
											size="small"
											onClick={() => onToggleCategory(category.slug)}
											sx={(theme) => ({
												fontSize: inDrawer ? '0.875rem' : '0.75rem',
												fontWeight: 600,
												height: inDrawer ? 40 : 32,
												px: inDrawer ? 2 : 1.5,
												py: inDrawer ? 1 : 0,
												bgcolor: isActive ? 'primary.main' : 'transparent',
												color: isActive ? 'primary.contrastText' : 'text.primary',
												borderColor: 'divider',
												'&:hover': {
													bgcolor: isActive
														? 'primary.dark'
														: theme.palette.mode === 'dark'
															? 'rgba(255,255,255,0.05)'
															: 'rgba(0,0,0,0.04)',
												},
											})}
										/>
									);
								})}
							</Stack>
						</Stack>

						<Divider />

						{/* Turnaround Section */}
						<Stack spacing={1.5}>
							<Stack direction="row" spacing={1} alignItems="center">
								<IconClock size={18} style={{ color: theme.palette.primary.main }} />
								<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{t('filters.turnaround')}
								</Typography>
							</Stack>
							<Stack direction="row" flexWrap="wrap" gap={0.75}>
								{turnaroundOptions.map((option) => (
									<Chip
										key={option.value}
										label={option.label}
										variant={turnaroundFilter === option.value ? 'filled' : 'outlined'}
										onClick={() => onTurnaroundChange(option.value)}
										size="small"
										sx={(theme) => ({
											fontSize: inDrawer ? '0.875rem' : '0.75rem',
											fontWeight: 600,
											height: inDrawer ? 40 : 32,
											px: inDrawer ? 2 : 1.5,
											py: inDrawer ? 1 : 0,
											bgcolor: turnaroundFilter === option.value ? 'primary.main' : 'transparent',
											color: turnaroundFilter === option.value ? 'primary.contrastText' : 'text.primary',
											borderColor: 'divider',
											'&:hover': {
												bgcolor: turnaroundFilter === option.value
													? 'primary.dark'
													: theme.palette.mode === 'dark'
														? 'rgba(255,255,255,0.05)'
														: 'rgba(0,0,0,0.04)',
											},
										})}
									/>
								))}
							</Stack>
						</Stack>

						<Divider />

						{/* Pricing Section */}
						<Stack spacing={1.5}>
							<Stack direction="row" spacing={1} alignItems="center">
								<IconCurrencyShekel size={18} style={{ color: theme.palette.primary.main }} />
								<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{t('filters.pricing')}
								</Typography>
							</Stack>
							<Stack direction="row" flexWrap="wrap" gap={0.75}>
								{pricingOptions.map((option) => (
									<Chip
										key={option.value}
										label={option.label}
										variant={pricingFilter === option.value ? 'filled' : 'outlined'}
										onClick={() => onPricingChange(option.value)}
										size="small"
										sx={(theme) => ({
											fontSize: inDrawer ? '0.875rem' : '0.75rem',
											fontWeight: 600,
											height: inDrawer ? 40 : 32,
											px: inDrawer ? 2 : 1.5,
											py: inDrawer ? 1 : 0,
											bgcolor: pricingFilter === option.value ? 'primary.main' : 'transparent',
											color: pricingFilter === option.value ? 'primary.contrastText' : 'text.primary',
											borderColor: 'divider',
											'&:hover': {
												bgcolor: pricingFilter === option.value
													? 'primary.dark'
													: theme.palette.mode === 'dark'
														? 'rgba(255,255,255,0.05)'
														: 'rgba(0,0,0,0.04)',
											},
										})}
									/>
								))}
							</Stack>
						</Stack>

						<Divider />

						{/* Express Toggle */}
						<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
							<Stack direction="row" spacing={1} alignItems="center" flex={1}>
								<IconBolt size={18} style={{ color: theme.palette.primary.main }} />
								<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
									{t('filters.express')}
								</Typography>
							</Stack>
							<Switch
								checked={expressOnly}
								onChange={(event) => onExpressToggle(event.target.checked)}
								size="small"
								color="primary"
							/>
						</Stack>
					</Stack>
				</CardContent>
			</Card>
		</Box>
	);
}

