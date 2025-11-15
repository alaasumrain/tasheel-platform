'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	alpha,
	Box,
	Button,
	Chip,
	Container,
	Divider,
	Drawer,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Pagination,
	Select,
	Stack,
	Switch,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	IconArrowRight,
	IconArrowLeft,
	IconSearch,
	IconX,
	IconFilter,
	IconLayoutGrid,
	IconLayoutList,
} from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import RevealSection from '@/components/ui/reveal-section';
import type { Service } from '@/data/services';
import type { Service as DBService } from '@/lib/types/service';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { trackServicesEvent } from '@/lib/analytics';
import ServicesFilterSidebar from './services-filter-sidebar';
import ServiceCard from './service-card';
import { useCurrency } from '@/contexts/currency-context';

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
	originalServices?: DBService[];
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
	originalServices,
	categories,
	locale,
}: ServicesWithSearchProps) {
	const t = useTranslations('Services');
	const tOverview = useTranslations('ServicesOverview');
	const tCommon = useTranslations('Common');
	const theme = useTheme();
	const currentLocale = useLocale() as 'en' | 'ar';

	// Create a map of slug to original service for bilingual search
	const originalServicesMap = useMemo(() => {
		if (!originalServices) return new Map<string, DBService>();
		return new Map(originalServices.map(s => [s.slug, s]));
	}, [originalServices]);

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
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
	const servicesPerPage = 12; // Show 12 services per page (4 rows x 3 columns)
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const { currency } = useCurrency();
	const currencyFormatter = useMemo(
		() =>
			new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
				style: 'currency',
				currency: currency === 'ILS' ? 'ILS' : currency === 'USD' ? 'USD' : 'EUR',
				currencyDisplay: 'narrowSymbol',
				maximumFractionDigits: 0,
			}),
		[locale, currency],
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
		if (!searchParams) return;
		
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
		const currentQuery = searchParams?.toString() || '';

		if (newQuery === currentQuery) return;

		router.replace(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false });
	}, [searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, sortOption, pathname, router, searchParams]);

	const filteredServices = useMemo(() => {
		return services.filter((service) => {
			const query = searchQuery.trim().toLowerCase();
			
			// Bilingual search - check both English and Arabic fields
			let matchesSearch = !query;
			if (query) {
				const originalService = originalServicesMap.get(service.slug);
				
				// Check current locale fields
				const currentTitle = service.title.toLowerCase();
				const currentShortDesc = service.shortDescription.toLowerCase();
				const currentDesc = service.description.toLowerCase();
				
				// Check bilingual fields from original service
				const enTitle = originalService?.name_en?.toLowerCase() || '';
				const arTitle = originalService?.name_ar?.toLowerCase() || '';
				const enShortDesc = originalService?.short_description_en?.toLowerCase() || '';
				const arShortDesc = originalService?.short_description_ar?.toLowerCase() || '';
				const enDesc = originalService?.description_en?.toLowerCase() || '';
				const arDesc = originalService?.description_ar?.toLowerCase() || '';
				
				matchesSearch = 
					currentTitle.includes(query) ||
					currentShortDesc.includes(query) ||
					currentDesc.includes(query) ||
					enTitle.includes(query) ||
					arTitle.includes(query) ||
					enShortDesc.includes(query) ||
					arShortDesc.includes(query) ||
					enDesc.includes(query) ||
					arDesc.includes(query);
			}

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
	}, [services, searchQuery, selectedCategories, turnaroundFilter, pricingFilter, expressOnly, originalServicesMap]);

	const sortedServices = useMemo(() => {
		const ordered = [...filteredServices];
		
		// Only show active services - filter out inactive/coming soon services
		const availableServices = ordered.filter(s => {
			const originalService = originalServicesMap.get(s.slug);
			return originalService?.is_active === true; // Only show if explicitly active
		});
		
		let sortedAvailable = availableServices;
		
		if (sortOption === 'speed') {
			sortedAvailable = [...availableServices].sort((a, b) => {
				const aDays = getTurnaroundDays(a.turnaroundTime) ?? Number.POSITIVE_INFINITY;
				const bDays = getTurnaroundDays(b.turnaroundTime) ?? Number.POSITIVE_INFINITY;
				return aDays - bDays;
			});
		} else if (sortOption === 'price') {
			sortedAvailable = [...availableServices].sort((a, b) => getPricingValue(a) - getPricingValue(b));
		}
		
		// Only return active services (no coming soon)
		return sortedAvailable;
	}, [filteredServices, sortOption, originalServicesMap]);

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

	// Active filters for display
	const activeFilters = useMemo(() => {
		const filters: Array<{ label: string; onRemove: () => void }> = [];
		if (selectedCategories.length > 0) {
			selectedCategories.forEach((slug) => {
				const category = categories.find((c) => c.slug === slug);
				if (category) {
					filters.push({
						label: t(`categoryLabels.${slug}` as any) || category.name,
						onRemove: () => handleToggleCategory(slug),
					});
				}
			});
		}
		if (turnaroundFilter !== 'all') {
			filters.push({
				label: turnaroundOptions.find((o) => o.value === turnaroundFilter)?.label || '',
				onRemove: () => handleTurnaroundChange('all'),
			});
		}
		if (pricingFilter !== 'all') {
			filters.push({
				label: pricingOptions.find((o) => o.value === pricingFilter)?.label || '',
				onRemove: () => handlePricingChange('all'),
			});
		}
		if (expressOnly) {
			filters.push({
				label: t('filters.express'),
				onRemove: () => handleExpressToggle(false),
			});
		}
		return filters;
	}, [selectedCategories, turnaroundFilter, pricingFilter, expressOnly, categories, turnaroundOptions, pricingOptions, t, handleToggleCategory, handleTurnaroundChange, handlePricingChange, handleExpressToggle]);

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
			{/* Hero Section */}
			<Container maxWidth="md" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 3, md: 4 } }}>
				<Stack spacing={2.5} alignItems="center" textAlign="center">
					<Stack spacing={1.5} alignItems="center">
						<Typography color="accent" variant="subtitle2" sx={{ fontSize: { xs: '0.8125rem', md: '0.875rem' } }}>
							{t('title')}
						</Typography>
						<Typography variant="h3" maxWidth={520} sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' }, lineHeight: 1.3 }}>
							{t('description')}
						</Typography>
						<Typography color="text.secondary" variant="body2" component="p" maxWidth={480} sx={{ fontSize: { xs: '0.875rem', md: '0.9375rem' } }}>
							{tOverview('description')}
						</Typography>
					</Stack>
				</Stack>
			</Container>

			{/* Top Bar */}
			<Container maxWidth="lg" sx={{ pb: { xs: 2, md: 3 } }}>
				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					alignItems={{ xs: 'stretch', sm: 'center' }}
					justifyContent="space-between"
				>
					{/* Search */}
					<Box sx={{ flex: 1, maxWidth: { sm: 400 } }}>
						<OutlinedInput
							fullWidth
							placeholder={t('filters.searchPlaceholder')}
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							startAdornment={
								<InputAdornment position="start">
									<IconSearch size={18} />
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
											<IconX size={16} />
										</IconButton>
									</InputAdornment>
								) : undefined
							}
							sx={(theme) => ({
								borderRadius: 2,
								bgcolor: 'background.paper',
								height: 44,
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
					</Box>

					{/* View Toggle & Sort & Mobile Filter Button */}
					<Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
						{/* Mobile Filter Button */}
						{isMobile && (
							<IconButton
								onClick={() => setFilterDrawerOpen(true)}
								sx={{
									border: '1px solid',
									borderColor: 'divider',
									bgcolor: 'background.paper',
									minWidth: 44,
									minHeight: 44,
								}}
								aria-label={t('filters.heading')}
							>
								<IconFilter size={18} />
							</IconButton>
						)}

						{/* View Toggle */}
						<Stack direction="row" spacing={0.5} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 0.5 }}>
							<IconButton
								size="small"
								onClick={() => setViewMode('grid')}
								sx={{
									bgcolor: viewMode === 'grid' ? 'primary.main' : 'transparent',
									color: viewMode === 'grid' ? 'primary.contrastText' : 'text.primary',
									minWidth: 36,
									minHeight: 36,
									'&:hover': {
										bgcolor: viewMode === 'grid' ? 'primary.dark' : 'action.hover',
									},
								}}
								aria-label="Grid view"
							>
								<IconLayoutGrid size={18} />
							</IconButton>
							<IconButton
								size="small"
								onClick={() => setViewMode('list')}
								sx={{
									bgcolor: viewMode === 'list' ? 'primary.main' : 'transparent',
									color: viewMode === 'list' ? 'primary.contrastText' : 'text.primary',
									minWidth: 36,
									minHeight: 36,
									'&:hover': {
										bgcolor: viewMode === 'list' ? 'primary.dark' : 'action.hover',
									},
								}}
								aria-label="List view"
							>
								<IconLayoutList size={18} />
							</IconButton>
						</Stack>

						{/* Sort */}
						<FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 }, flex: { xs: '1 1 100%', sm: 'none' } }}>
							<InputLabel id="services-sort-label" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
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
									height: 44,
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
			</Container>

			{/* Two-Column Layout */}
			<Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', md: 'row' },
						gap: 3,
						alignItems: 'flex-start',
					}}
				>
					{/* Main Content - Left */}
					<Stack sx={{ flex: 1, width: { xs: '100%', md: 'calc(100% - 316px)' } }} spacing={2}>
						{/* Active Filters Bar */}
						{activeFilters.length > 0 && (
							<Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ gap: 1 }}>
								<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem', mr: locale === 'ar' ? 0 : 1, ml: locale === 'ar' ? 1 : 0 }}>
									{t('filters.activeFilters')}:
								</Typography>
								{activeFilters.map((filter, index) => (
									<Chip
										key={index}
										label={filter.label}
										size="small"
										onDelete={filter.onRemove}
										sx={{
											fontSize: '0.75rem',
											fontWeight: 600,
											height: 28,
											bgcolor: 'primary.main',
											color: 'primary.contrastText',
											'& .MuiChip-deleteIcon': {
												color: 'primary.contrastText',
												'&:hover': {
													color: 'primary.contrastText',
													opacity: 0.8,
												},
											},
										}}
									/>
								))}
							</Stack>
						)}

						{/* Services Grid/List */}
						{viewMode === 'grid' ? (
							<Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ alignItems: 'stretch' }}>
								{paginatedServices.map((service) => {
									const categoryLabel = t(`categoryLabels.${service.category}` as any) || categories.find(cat => cat.slug === service.category)?.name || service.category;
									const originalService = originalServicesMap.get(service.slug);
									return (
										<Grid key={service.slug} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
											<ServiceCard
												service={service}
												locale={locale}
												currencyFormatter={currencyFormatter}
												viewMode="grid"
												categoryLabel={categoryLabel}
												categories={categories}
												originalService={originalService}
											/>
										</Grid>
									);
								})}
							</Grid>
						) : (
							<Stack spacing={2}>
								{paginatedServices.map((service) => {
									const categoryLabel = t(`categoryLabels.${service.category}` as any) || categories.find(cat => cat.slug === service.category)?.name || service.category;
									const originalService = originalServicesMap.get(service.slug);
									return (
										<ServiceCard
											key={service.slug}
											service={service}
											locale={locale}
											currencyFormatter={currencyFormatter}
											viewMode="list"
											categoryLabel={categoryLabel}
											categories={categories}
											originalService={originalService}
										/>
									);
								})}
							</Stack>
						)}

						{/* Empty State */}
						{sortedServices.length === 0 && (
							<Stack spacing={2} alignItems="center" textAlign="center" sx={{ py: 6 }}>
								<Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>{tOverview('noResultsTitle')}</Typography>
								<Typography color="text.secondary" maxWidth={400} sx={{ fontSize: { xs: '0.875rem', md: '0.9375rem' } }}>
									{tOverview('noResultsDescription')}
								</Typography>
								<Button variant="outlined" onClick={handleResetFilters} size="medium">
									{tOverview('clearSearch')}
								</Button>
							</Stack>
						)}

						{/* Pagination */}
						{sortedServices.length > 0 && totalPages > 1 && (
							<Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
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
					</Stack>

					{/* Filter Sidebar - Right */}
					{!isMobile && (
						<ServicesFilterSidebar
							categories={categories}
							categoryCounts={categoryCounts}
							selectedCategories={selectedCategories}
							onToggleCategory={handleToggleCategory}
							onClearCategories={handleClearCategories}
							turnaroundFilter={turnaroundFilter}
							onTurnaroundChange={handleTurnaroundChange}
							pricingFilter={pricingFilter}
							onPricingChange={handlePricingChange}
							expressOnly={expressOnly}
							onExpressToggle={handleExpressToggle}
							onResetFilters={handleResetFilters}
							activeFiltersCount={activeFiltersCount}
							resultsCount={sortedServices.length}
							locale={locale}
						/>
					)}
				</Box>
			</Container>

			{/* Mobile Filter Drawer */}
			<Drawer
				anchor="bottom"
				open={filterDrawerOpen}
				onClose={() => setFilterDrawerOpen(false)}
				PaperProps={{
					sx: {
						borderRadius: '24px 24px 0 0',
						maxHeight: '90vh',
						paddingBottom: 'env(safe-area-inset-bottom)',
					},
				}}
			>
				<Box sx={{ p: 3, pb: 4 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
						<Typography variant="h6" fontWeight={700}>
							{t('filters.heading')}
						</Typography>
						<IconButton 
							onClick={() => setFilterDrawerOpen(false)} 
							size="small"
							sx={{
								width: 40,
								height: 40,
							}}
						>
							<IconX size={20} />
						</IconButton>
					</Stack>
					<ServicesFilterSidebar
						categories={categories}
						categoryCounts={categoryCounts}
						selectedCategories={selectedCategories}
						onToggleCategory={handleToggleCategory}
						onClearCategories={handleClearCategories}
						turnaroundFilter={turnaroundFilter}
						onTurnaroundChange={handleTurnaroundChange}
						pricingFilter={pricingFilter}
						onPricingChange={handlePricingChange}
						expressOnly={expressOnly}
						onExpressToggle={handleExpressToggle}
						onResetFilters={() => {
							handleResetFilters();
							setFilterDrawerOpen(false);
						}}
						activeFiltersCount={activeFiltersCount}
						resultsCount={sortedServices.length}
						locale={currentLocale}
						inDrawer={true}
					/>
					<Button
						variant="contained"
						fullWidth
						size="large"
						onClick={() => setFilterDrawerOpen(false)}
						sx={{
							mt: 3,
							py: 1.5,
							fontSize: '1rem',
							fontWeight: 600,
							borderRadius: 2,
						}}
					>
						{t('filters.applyFilters') || 'Apply Filters'}
					</Button>
				</Box>
			</Drawer>
		</Box>
	);
}

