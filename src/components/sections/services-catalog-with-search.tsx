'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	alpha,
	Box,
	Button,
	Chip,
	Container,
	Divider,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Pagination,
	Select,
	Stack,
	Switch,
	Typography,
	useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	IconArrowRight,
	IconArrowLeft,
	IconSearch,
	IconX,
} from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import RevealSection from '@/components/ui/reveal-section';
import type { Service } from '@/data/services';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { trackServicesEvent } from '@/lib/analytics';

type TurnaroundFilter = 'all' | 'express' | 'standard' | 'extended';
type PricingFilter = 'all' | 'fixed' | 'starting' | 'quote';
type SortOption = 'recommended' | 'speed' | 'price';

interface ServiceCategory {
	slug: string;
	name: string;
	description: string;
}

interface ServicesWithSearchProps {
	services: Service[];
	categories: ServiceCategory[];
	locale: 'en' | 'ar';
}

interface FilterState {
	searchQuery: string;
	selectedCategories: string[];
	turnaroundFilter: TurnaroundFilter;
	pricingFilter: PricingFilter;
	expressOnly: boolean;
	sortOption: SortOption;
}

const ALLOWED_TURNAROUND: TurnaroundFilter[] = ['all', 'express', 'standard', 'extended'];
const ALLOWED_PRICING: PricingFilter[] = ['all', 'fixed', 'starting', 'quote'];
const ALLOWED_SORT: SortOption[] = ['recommended', 'speed', 'price'];

function arraysEqual<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) return false;
	return a.every((value, index) => value === b[index]);
}

function getTurnaroundDays(turnaround?: string | null): number | null {
	if (!turnaround) return null;
	const match = turnaround.match(/(\d+)(?:\s*-\s*(\d+))?/);
	if (!match) return null;
	const value = Number(match[1]);
	return Number.isNaN(value) ? null : value;
}

function matchesTurnaround(filter: TurnaroundFilter, days: number | null): boolean {
	if (filter === 'all') return true;
	if (days === null) return false;
	if (filter === 'express') return days <= 3;
	if (filter === 'standard') return days > 3 && days <= 7;
	return days > 7;
}

function hasExpressOption(service: Service): boolean {
	const keywords = ['express', 'fast', 'urgent', 'same day', 'سريع', 'عاجل'];
	const combined = [
		...(service.features || []),
		service.pricing?.note || '',
		service.turnaroundTime || '',
	];
	return combined.some((entry) =>
		keywords.some((keyword) => entry.toLowerCase().includes(keyword)),
	);
}

function getPricingValue(service: Service): number {
	if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
		return service.pricing.amount;
	}
	if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
		return service.pricing.amount;
	}
	return Number.POSITIVE_INFINITY;
}

function formatPriceLabel(
	service: Service,
	formatter: Intl.NumberFormat,
	t: ReturnType<typeof useTranslations<'Services'>>,
): string {
	if (service.pricing.type === 'fixed' && service.pricing.amount !== undefined) {
		return t('pricingFormats.fixed', { amount: formatter.format(service.pricing.amount) });
	}

	if (service.pricing.type === 'starting' && service.pricing.amount !== undefined) {
		return t('pricingFormats.startingFrom', { amount: formatter.format(service.pricing.amount) });
	}

	if (service.pricing.note) {
		return service.pricing.note;
	}

	return t('pricingFormats.custom');
}

export default function ServicesCatalogWithSearch({
	services,
	categories,
	locale,
}: ServicesWithSearchProps) {
	const t = useTranslations('Services');
	const tOverview = useTranslations('ServicesOverview');
	const tCommon = useTranslations('Common');
	const theme = useTheme();
	const currentLocale = useLocale() as 'en' | 'ar';

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [turnaroundFilter, setTurnaroundFilter] = useState<TurnaroundFilter>('all');
	const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all');
	const [expressOnly, setExpressOnly] = useState(false);
	const [sortOption, setSortOption] = useState<SortOption>('recommended');
	const [page, setPage] = useState(1);
	const servicesPerPage = 12; // Show 12 services per page (4 rows x 3 columns)

	const currencyFormatter = useMemo(
		() =>
			new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
				style: 'currency',
				currency: 'ILS',
				currencyDisplay: 'narrowSymbol',
				maximumFractionDigits: 0,
			}),
		[locale],
	);

	const categoryCounts = useMemo(() => {
		return services.reduce<Record<string, number>>((acc, service) => {
			acc[service.category] = (acc[service.category] || 0) + 1;
			return acc;
		}, {});
	}, [services]);

	const turnaroundOptions = useMemo(
		() => [
			{ value: 'all' as TurnaroundFilter, label: t('filters.turnaroundOptions.all') },
			{ value: 'express' as TurnaroundFilter, label: t('filters.turnaroundOptions.express') },
			{ value: 'standard' as TurnaroundFilter, label: t('filters.turnaroundOptions.standard') },
			{ value: 'extended' as TurnaroundFilter, label: t('filters.turnaroundOptions.extended') },
		],
		[t],
	);

	const pricingOptions = useMemo(
		() => [
			{ value: 'all' as PricingFilter, label: t('filters.pricingOptions.all') },
			{ value: 'fixed' as PricingFilter, label: t('filters.pricingOptions.fixed') },
			{ value: 'starting' as PricingFilter, label: t('filters.pricingOptions.starting') },
			{ value: 'quote' as PricingFilter, label: t('filters.pricingOptions.quote') },
		],
		[t],
	);

	const sortOptions = useMemo(
		() => [
			{ value: 'recommended' as SortOption, label: t('filters.sortOptions.recommended') },
			{ value: 'speed' as SortOption, label: t('filters.sortOptions.speed') },
			{ value: 'price' as SortOption, label: t('filters.sortOptions.price') },
		],
		[t],
	);

	const hasInitialisedFromUrl = useRef(false);

	// Hydrate state from URL search params
	useEffect(() => {
		const qParam = searchParams.get('q') ?? '';
		if (qParam !== searchQuery) {
			setSearchQuery(qParam);
		}

		const categoriesParam = searchParams.get('categories');
		const categoriesFromUrl = categoriesParam ? categoriesParam.split(',').filter(Boolean) : [];
		setSelectedCategories((prev) => (arraysEqual(prev, categoriesFromUrl) ? prev : categoriesFromUrl));

		const turnaroundParam = searchParams.get('turnaround') as TurnaroundFilter | null;
		if (turnaroundParam && ALLOWED_TURNAROUND.includes(turnaroundParam) && turnaroundParam !== turnaroundFilter) {
			setTurnaroundFilter(turnaroundParam);
		} else if (!turnaroundParam && turnaroundFilter !== 'all') {
			setTurnaroundFilter('all');
		}

		const pricingParam = searchParams.get('pricing') as PricingFilter | null;
		if (pricingParam && ALLOWED_PRICING.includes(pricingParam) && pricingParam !== pricingFilter) {
			setPricingFilter(pricingParam);
		} else if (!pricingParam && pricingFilter !== 'all') {
			setPricingFilter('all');
		}

		const expressParam = searchParams.get('express') === '1';
		if (expressParam !== expressOnly) {
			setExpressOnly(expressParam);
		}

		const sortParam = searchParams.get('sort') as SortOption | null;
		if (sortParam && ALLOWED_SORT.includes(sortParam) && sortParam !== sortOption) {
			setSortOption(sortParam);
		} else if (!sortParam && sortOption !== 'recommended') {
			setSortOption('recommended');
		}

		hasInitialisedFromUrl.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	// Mirror filter state back to URL
	useEffect(() => {
		if (!hasInitialisedFromUrl.current) return;

		const params = new URLSearchParams();
		const trimmedQuery = searchQuery.trim();
		if (trimmedQuery) params.set('q', trimmedQuery);
		if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
		if (turnaroundFilter !== 'all') params.set('turnaround', turnaroundFilter);
		if (pricingFilter !== 'all') params.set('pricing', pricingFilter);
		if (expressOnly) params.set('express', '1');
		if (sortOption !== 'recommended') params.set('sort', sortOption);

		const newQuery = params.toString();
		const currentQuery = searchParams.toString();

		if (newQuery === currentQuery) return;

		router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false });
	}, [searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, sortOption, pathname, router, searchParams]);

	const filteredServices = useMemo(() => {
		return services.filter((service) => {
			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				service.title.toLowerCase().includes(query) ||
				service.shortDescription.toLowerCase().includes(query) ||
				service.description.toLowerCase().includes(query);

			if (!matchesSearch) return false;

			if (selectedCategories.length > 0 && !selectedCategories.includes(service.category)) {
				return false;
			}

			const days = getTurnaroundDays(service.turnaroundTime);
			if (!matchesTurnaround(turnaroundFilter, days)) {
				return false;
			}

			if (pricingFilter !== 'all' && service.pricing.type !== pricingFilter) {
				return false;
			}

			if (expressOnly && !hasExpressOption(service)) {
				return false;
			}

			return true;
		});
	}, [services, searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly]);

	const sortedServices = useMemo(() => {
		const ordered = [...filteredServices];
		if (sortOption === 'speed') {
			ordered.sort((a, b) => {
				const aDays = getTurnaroundDays(a.turnaroundTime) ?? Number.POSITIVE_INFINITY;
				const bDays = getTurnaroundDays(b.turnaroundTime) ?? Number.POSITIVE_INFINITY;
				return aDays - bDays;
			});
			return ordered;
		}

		if (sortOption === 'price') {
			ordered.sort((a, b) => getPricingValue(a) - getPricingValue(b));
			return ordered;
		}

		return ordered;
	}, [filteredServices, sortOption]);

	// Pagination logic
	const totalPages = Math.ceil(sortedServices.length / servicesPerPage);
	const startIndex = (page - 1) * servicesPerPage;
	const endIndex = startIndex + servicesPerPage;
	const paginatedServices = sortedServices.slice(startIndex, endIndex);

	// Reset to page 1 when filters change
	useEffect(() => {
		setPage(1);
	}, [searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, sortOption]);

const analyticsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
const hasTrackedFilters = useRef(false);

useEffect(() => {
	if (!hasInitialisedFromUrl.current) return;

	if (!hasTrackedFilters.current) {
		hasTrackedFilters.current = true;
		return;
	}

	if (analyticsTimeout.current) {
		clearTimeout(analyticsTimeout.current);
	}

	const pendingState: FilterState = {
		searchQuery,
		selectedCategories,
		turnaroundFilter,
		pricingFilter,
		expressOnly,
		sortOption,
	};

	analyticsTimeout.current = setTimeout(() => {
		trackServicesEvent('services_filters_updated', {
			...pendingState,
			results: sortedServices.length,
		});
	}, 400);

	return () => {
		if (analyticsTimeout.current) {
			clearTimeout(analyticsTimeout.current);
		}
	};
}, [searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, sortOption, sortedServices.length]);

const handleResetFilters = useCallback(() => {
	setSearchQuery('');
	setSelectedCategories([]);
	setTurnaroundFilter('all');
	setPricingFilter('all');
	setExpressOnly(false);
	setSortOption('recommended');
	trackServicesEvent('services_filters_reset', {});
}, []);

const handleClearCategories = useCallback(() => {
	if (selectedCategories.length === 0) return;
	setSelectedCategories([]);
	trackServicesEvent('services_category_reset', {});
}, [selectedCategories.length]);

const handleToggleCategory = useCallback((slug: string) => {
	setSelectedCategories((prev) => {
		const next = prev.includes(slug)
			? prev.filter((item) => item !== slug)
			: [...prev, slug];
		trackServicesEvent('services_category_toggled', {
			category: slug,
			active: !prev.includes(slug),
		});
		return next;
	});
}, []);

const handleTurnaroundChange = useCallback((value: TurnaroundFilter) => {
	setTurnaroundFilter(value);
	trackServicesEvent('services_turnaround_filter', { value });
}, []);

const handlePricingChange = useCallback((value: PricingFilter) => {
	setPricingFilter(value);
	trackServicesEvent('services_pricing_filter', { value });
}, []);

const handleExpressToggle = useCallback((value: boolean) => {
	setExpressOnly(value);
	trackServicesEvent('services_express_toggle', { value });
}, []);

const handleSortChange = useCallback((value: SortOption) => {
	setSortOption(value);
	trackServicesEvent('services_sort_change', { value });
}, []);

	const handleDetailsClick = useCallback((service: Service) => {
		trackServicesEvent('services_details_cta', {
			serviceSlug: service.slug,
			source: 'card',
		});
	}, []);

	const activeFiltersCount = useMemo(() => {
		let count = 0;
		if (searchQuery.trim()) count += 1;
		if (selectedCategories.length) count += 1;
		if (turnaroundFilter !== 'all') count += 1;
		if (pricingFilter !== 'all') count += 1;
		if (expressOnly) count += 1;
		if (sortOption !== 'recommended') count += 1;
		return count;
	}, [searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, sortOption]);

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
			<Container sx={{ pt: { xs: 3, md: 6 }, pb: { xs: 6.25, md: 8 } }}>
				<RevealSection delay={0.1} direction="up">
					<Stack spacing={4} alignItems="center" textAlign="center">
						<Stack spacing={3} alignItems="center">
							<Typography color="accent" variant="subtitle1">
								{t('title')}
							</Typography>
							<Typography variant="h1" maxWidth={800}>
								{t('description')}
							</Typography>
							<Typography color="text.secondary" variant="h6" component="p" maxWidth={720}>
								{tOverview('description')}
							</Typography>
						</Stack>

						<Box sx={{ width: '100%', maxWidth: 600 }}>
							<OutlinedInput
								fullWidth
								placeholder={t('filters.searchPlaceholder')}
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								startAdornment={
									<InputAdornment position="start">
										<IconSearch size={20} />
									</InputAdornment>
								}
								endAdornment={
									searchQuery ? (
										<InputAdornment position="end">
											<IconButton
												edge="end"
												aria-label={tCommon('clear')}
												onClick={() => setSearchQuery('')}
												size="small"
											>
												<IconX size={18} />
											</IconButton>
										</InputAdornment>
									) : undefined
								}
								sx={(theme) => ({
									borderRadius: 3,
									bgcolor: 'background.paper',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: theme.palette.mode === 'dark' 
											? 'rgba(255,255,255,0.1)' 
											: 'rgba(0,0,0,0.12)',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: theme.palette.mode === 'dark' 
											? 'rgba(255,255,255,0.2)' 
											: 'rgba(0,0,0,0.2)',
									},
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
										borderColor: 'primary.main',
										borderWidth: 2,
									},
								})}
							/>
							{activeFiltersCount > 0 && (
								<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
									{t('filters.resultsSummary', { count: sortedServices.length })}
								</Typography>
							)}
						</Box>
					</Stack>
				</RevealSection>
			</Container>

			<Container sx={{ pb: { xs: 5, md: 7 } }}>
				<Paper
					elevation={0}
					sx={(theme) => ({
						px: { xs: 2.5, md: 3 },
						py: { xs: 2.5, md: 3 },
						mb: { xs: 3, md: 4 },
						borderRadius: 2,
						border: '1px solid',
						borderColor: theme.palette.mode === 'dark' 
							? 'rgba(255,255,255,0.1)' 
							: 'rgba(0,0,0,0.08)',
						backgroundColor: 'background.paper',
						position: { md: 'sticky' },
						top: { md: theme.spacing(11) },
						zIndex: theme.zIndex.appBar - 1,
						boxShadow: theme.palette.mode === 'dark'
							? '0px 2px 8px rgba(0,0,0,0.2)'
							: '0px 2px 8px rgba(0,0,0,0.04)',
					})}
				>
					<Stack spacing={2}>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							justifyContent="space-between"
							alignItems={{ xs: 'flex-start', sm: 'center' }}
							spacing={1.5}
						>
							<Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
								<Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}>
									{t('filters.heading')}
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
									{t('filters.resultsSummary', { count: sortedServices.length })}
								</Typography>
							</Stack>
							<Button 
								variant="outlined" 
								onClick={handleResetFilters} 
								disabled={activeFiltersCount === 0}
								size="small"
								sx={{
									borderRadius: 1.5,
									px: 2,
									py: 0.75,
									fontWeight: 600,
									fontSize: '0.875rem',
									minWidth: 'auto',
								}}
							>
								{t('filters.clearAll')}
							</Button>
						</Stack>

						<Stack spacing={1.5}>
							<Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={1}>
								<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 'fit-content' }}>
									{t('filters.categories')}:
								</Typography>
								<Stack direction="row" flexWrap="wrap" gap={0.75}>
									<Chip
										label={t('filters.allCategories')}
										variant={selectedCategories.length === 0 ? 'filled' : 'outlined'}
										onClick={handleClearCategories}
										size="small"
										sx={(theme) => ({
											fontSize: '0.8125rem',
											fontWeight: 600,
											height: 28,
											px: 1,
											bgcolor: selectedCategories.length === 0 
												? 'primary.main' 
												: 'transparent',
											color: selectedCategories.length === 0 
												? 'primary.contrastText' 
												: 'text.primary',
											borderColor: 'divider',
											'&:hover': {
												bgcolor: selectedCategories.length === 0 
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
												onClick={() => handleToggleCategory(category.slug)}
												sx={(theme) => ({
													fontSize: '0.8125rem',
													fontWeight: 600,
													height: 28,
													px: 1,
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
						</Stack>

						<Divider sx={{ my: 0.5 }} />

						<Stack
							direction={{ xs: 'column', lg: 'row' }}
							spacing={2}
							alignItems={{ xs: 'flex-start', lg: 'center' }}
							justifyContent="space-between"
						>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" gap={1.5}>
								<Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.75}>
									<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 'fit-content' }}>
										{t('filters.turnaround')}:
									</Typography>
									<Stack direction="row" flexWrap="wrap" gap={0.75}>
										{turnaroundOptions.map((option) => (
											<Chip
												key={option.value}
												label={option.label}
												variant={turnaroundFilter === option.value ? 'filled' : 'outlined'}
												onClick={() => handleTurnaroundChange(option.value)}
												size="small"
												sx={(theme) => ({
													fontSize: '0.8125rem',
													fontWeight: 600,
													height: 28,
													px: 1,
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

								<Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.75}>
									<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem', minWidth: 'fit-content' }}>
										{t('filters.pricing')}:
									</Typography>
									<Stack direction="row" flexWrap="wrap" gap={0.75}>
										{pricingOptions.map((option) => (
											<Chip
												key={option.value}
												label={option.label}
												variant={pricingFilter === option.value ? 'filled' : 'outlined'}
												onClick={() => handlePricingChange(option.value)}
												size="small"
												sx={(theme) => ({
													fontSize: '0.8125rem',
													fontWeight: 600,
													height: 28,
													px: 1,
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

								<Stack direction="row" alignItems="center" spacing={1}>
									<Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
										{t('filters.express')}:
									</Typography>
									<Switch 
										checked={expressOnly} 
										onChange={(event) => handleExpressToggle(event.target.checked)}
										size="small"
									/>
								</Stack>
							</Stack>

							<FormControl size="small" sx={{ minWidth: { xs: '100%', lg: 200 }, mt: { xs: 1, lg: 0 } }}>
								<InputLabel id="services-sort-label" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
									{t('filters.sortLabel')}
								</InputLabel>
								<Select
									labelId="services-sort-label"
									label={t('filters.sortLabel')}
									value={sortOption}
									onChange={(event) => handleSortChange(event.target.value as SortOption)}
									sx={{
										fontWeight: 600,
										fontSize: '0.8125rem',
										height: 36,
									}}
								>
									{sortOptions.map((option) => (
										<MenuItem key={option.value} value={option.value} sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>
					</Stack>
				</Paper>
			</Container>

			<Container sx={{ pb: { xs: 6, md: 10 } }}>
				<Grid container spacing={{ xs: 3, md: 4 }} sx={{ alignItems: 'stretch' }}>
					{paginatedServices.map((service, index) => {
						const priceLabel = formatPriceLabel(service, currencyFormatter, t);
						// Get category name for tag - use translation if available
						const categoryLabel = t(`categoryLabels.${service.category}` as any) || categories.find(cat => cat.slug === service.category)?.name || service.category;
						
						// Category-based color scheme for visual distinction
						const getCategoryColor = (categorySlug: string): { bg: string; text: string } => {
							const colorMap: Record<string, { bg: string; text: string }> = {
								'government': { bg: alpha(theme.palette.primary.main, 0.1), text: 'primary.main' },
								'translation': { bg: alpha(theme.palette.info.main, 0.1), text: 'info.main' },
								'legalization': { bg: alpha(theme.palette.success.main, 0.1), text: 'success.main' },
								'business': { bg: alpha(theme.palette.warning.main, 0.1), text: 'warning.main' },
							};
							return colorMap[categorySlug] || { bg: alpha(theme.palette.primary.main, 0.1), text: 'primary.main' };
						};
						
						const categoryColor = getCategoryColor(service.category);
						
						return (
							<Grid key={service.slug} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
								<RevealSection delay={0.1 + index * 0.06} direction="up">
									<Paper
										elevation={0}
										sx={(theme) => ({
											width: '100%',
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											borderRadius: 3,
											border: '1px solid',
											borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
											bgcolor: 'background.paper',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											overflow: 'hidden',
											'&:hover': {
												boxShadow: theme.palette.mode === 'dark'
													? '0px 8px 24px rgba(0,0,0,0.4)'
													: '0px 8px 24px rgba(0,0,0,0.12)',
												transform: 'translateY(-4px)',
												borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
											},
										})}
									>
										<Stack spacing={2.5} sx={{ flexGrow: 1, p: 3 }}>
											{/* Category Tag */}
											<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
												<Chip
													label={categoryLabel}
													size="small"
													sx={{
														bgcolor: categoryColor.bg,
														color: categoryColor.text,
														fontWeight: 600,
														fontSize: '0.75rem',
														height: 24,
													}}
												/>
											</Box>

											{/* Title */}
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													fontSize: { xs: '1rem', md: '1.125rem' },
													lineHeight: 1.4,
													minHeight: { xs: 48, md: 54 },
													display: '-webkit-box',
													WebkitLineClamp: 2,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
												}}
											>
												{service.title}
											</Typography>

											{/* Description */}
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{
													fontSize: { xs: '0.875rem', md: '0.9375rem' },
													lineHeight: 1.6,
													minHeight: { xs: 60, md: 72 },
													display: '-webkit-box',
													WebkitLineClamp: 3,
													WebkitBoxOrient: 'vertical',
													overflow: 'hidden',
												}}
											>
												{service.shortDescription}
											</Typography>

											{/* Audience Tags & Service Fee */}
											<Stack spacing={1.5} sx={{ mt: 'auto' }}>
												<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
													{/* Audience tags - simplified for now, can be enhanced later */}
													<Chip
														label={locale === 'ar' ? 'مواطن' : 'Citizen'}
														size="small"
														sx={{
															bgcolor: alpha(theme.palette.success.main, 0.1),
															color: 'success.main',
															fontSize: '0.75rem',
															height: 24,
														}}
													/>
													<Chip
														label={locale === 'ar' ? 'مقيم' : 'Resident'}
														size="small"
														sx={{
															bgcolor: alpha(theme.palette.info.main, 0.1),
															color: 'info.main',
															fontSize: '0.75rem',
															height: 24,
														}}
													/>
												</Stack>

												{/* Service Fee */}
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{
														fontSize: '0.875rem',
														fontWeight: 500,
													}}
												>
													{locale === 'ar' ? 'رسوم الخدمة' : 'Service fee'}: {priceLabel}
												</Typography>
											</Stack>
										</Stack>

										{/* Details Link */}
										<Box sx={{ px: 3, pb: 3, pt: 1 }}>
											<Button
												component={Link}
												href={`/services/${service.slug}`}
												variant="text"
												endIcon={currentLocale === 'ar' ? <IconArrowLeft size={18} /> : <IconArrowRight size={18} />}
												onClick={() => handleDetailsClick(service)}
												fullWidth
												sx={(theme) => ({
													color: 'primary.main',
													fontWeight: 600,
													textTransform: 'none',
													borderRadius: 2,
													px: 2,
													py: 1.25,
													justifyContent: 'space-between',
													'&:hover': {
														bgcolor: theme.palette.mode === 'dark' 
															? 'rgba(255,255,255,0.05)' 
															: 'rgba(14, 33, 160, 0.04)',
													},
												})}
											>
												{locale === 'ar' ? 'تفاصيل' : t('viewDetails')}
											</Button>
										</Box>
									</Paper>
								</RevealSection>
							</Grid>
						);
					})}
				</Grid>

				{sortedServices.length === 0 && (
					<Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 8 }}>
						<Typography variant="h4">{tOverview('noResultsTitle')}</Typography>
						<Typography color="text.secondary" maxWidth={420}>
							{tOverview('noResultsDescription')}
						</Typography>
						<Button variant="outlined" onClick={handleResetFilters}>
							{tOverview('clearSearch')}
						</Button>
					</Stack>
				)}

				{/* Pagination */}
				{sortedServices.length > 0 && totalPages > 1 && (
					<Stack spacing={2} alignItems="center" sx={{ mt: 6 }}>
						<Pagination
							count={totalPages}
							page={page}
							onChange={(_, value) => setPage(value)}
							color="primary"
							size="large"
							sx={{
								'& .MuiPaginationItem-root': {
									fontSize: '1rem',
									fontWeight: 600,
								},
							}}
						/>
					<Typography variant="body2" color="text.secondary">
						{t('pagination.showing', {
							start: startIndex + 1,
							end: Math.min(endIndex, sortedServices.length),
							total: sortedServices.length,
						})}
					</Typography>
					</Stack>
				)}
			</Container>
		</Box>
	);
}

