'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	alpha,
	Box,
	Button,
	CardContent,
	Chip,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Switch,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
	IconArrowRight,
	IconBolt,
	IconClock,
	IconCurrencyShekel,
	IconFileText,
	IconSearch,
	IconX,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { Card } from '@/components/ui/card';
import Image from '@/components/ui/image';
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
	t: any,
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

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [turnaroundFilter, setTurnaroundFilter] = useState<TurnaroundFilter>('all');
	const [pricingFilter, setPricingFilter] = useState<PricingFilter>('all');
	const [expressOnly, setExpressOnly] = useState(false);
	const [sortOption, setSortOption] = useState<SortOption>('recommended');
	const [quickViewService, setQuickViewService] = useState<Service | null>(null);

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

const handleQuickView = useCallback((service: Service) => {
	setQuickViewService(service);
	trackServicesEvent('services_quick_view_opened', {
		serviceSlug: service.slug,
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

	const handleCloseQuickView = useCallback(() => {
		setQuickViewService(null);
	}, []);

	const handleQuoteClick = useCallback((service: Service, source: 'card' | 'quick-view') => {
		trackServicesEvent('services_quote_cta', {
			serviceSlug: service.slug,
			source,
		});
	}, []);

	const handleDetailsClick = useCallback((service: Service, source: 'card' | 'quick-view') => {
		trackServicesEvent('services_details_cta', {
			serviceSlug: service.slug,
			source,
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
		<Box>
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
								sx={{
									borderRadius: 3,
									bgcolor: 'background.paper',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'divider',
									},
								}}
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
						px: { xs: 2, md: 3 },
						py: { xs: 2.5, md: 3 },
						mb: { xs: 4, md: 6 },
						borderRadius: 4,
						border: '1px solid',
						borderColor: 'divider',
						backgroundColor: alpha(theme.palette.background.paper, 0.92),
						backdropFilter: 'blur(8px)',
						position: { md: 'sticky' },
						top: { md: theme.spacing(11) },
						zIndex: theme.zIndex.appBar - 1,
					})}
				>
					<Stack spacing={3}>
						<Stack
							direction={{ xs: 'column', md: 'row' }}
							justifyContent="space-between"
							alignItems={{ xs: 'flex-start', md: 'center' }}
							spacing={2}
						>
							<Stack spacing={0.5}>
								<Typography variant="h6">{t('filters.heading')}</Typography>
								<Typography variant="body2" color="text.secondary">
									{t('filters.resultsSummary', { count: sortedServices.length })}
								</Typography>
							</Stack>
							<Button variant="text" onClick={handleResetFilters} disabled={activeFiltersCount === 0}>
								{t('filters.clearAll')}
							</Button>
						</Stack>

						<Stack spacing={2}>
							<Typography variant="subtitle2" color="text.secondary">
								{t('filters.categories')}
							</Typography>
							<Stack direction="row" flexWrap="wrap" gap={1.2}>
								<Chip
									label={t('filters.allCategories')}
									variant={selectedCategories.length === 0 ? 'filled' : 'outlined'}
									onClick={handleClearCategories}
									size="medium"
								/>
								{categories.map((category) => {
									const isActive = selectedCategories.includes(category.slug);
									const count = categoryCounts[category.slug] || 0;
									return (
										<Chip
											key={category.slug}
											label={`${category.name} (${count})`}
											variant={isActive ? 'filled' : 'outlined'}
											size="medium"
											onClick={() => handleToggleCategory(category.slug)}
										/>
									);
								})}
							</Stack>
						</Stack>

						<Divider />

						<Stack
							direction={{ xs: 'column', lg: 'row' }}
							spacing={3}
							alignItems={{ xs: 'flex-start', lg: 'center' }}
							justifyContent="space-between"
						>
							<Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} flexWrap="wrap">
								<Stack spacing={1}>
									<Typography variant="subtitle2" color="text.secondary">
										{t('filters.turnaround')}
									</Typography>
								<Stack direction="row" flexWrap="wrap" gap={1}>
									{turnaroundOptions.map((option) => (
										<Chip
											key={option.value}
											label={option.label}
											variant={turnaroundFilter === option.value ? 'filled' : 'outlined'}
											onClick={() => handleTurnaroundChange(option.value)}
										/>
									))}
								</Stack>
								</Stack>

								<Stack spacing={1}>
									<Typography variant="subtitle2" color="text.secondary">
										{t('filters.pricing')}
									</Typography>
								<Stack direction="row" flexWrap="wrap" gap={1}>
									{pricingOptions.map((option) => (
										<Chip
											key={option.value}
											label={option.label}
											variant={pricingFilter === option.value ? 'filled' : 'outlined'}
											onClick={() => handlePricingChange(option.value)}
										/>
									))}
								</Stack>
								</Stack>

								<FormControlLabel
									control={<Switch checked={expressOnly} onChange={(event) => handleExpressToggle(event.target.checked)} />}
									label={t('filters.express')}
								/>
							</Stack>

							<FormControl size="small" sx={{ minWidth: { xs: '100%', lg: 220 } }}>
								<InputLabel id="services-sort-label">{t('filters.sortLabel')}</InputLabel>
								<Select
									labelId="services-sort-label"
									label={t('filters.sortLabel')}
									value={sortOption}
									onChange={(event) => handleSortChange(event.target.value as SortOption)}
								>
									{sortOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
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
				<Grid container spacing={{ xs: 3, md: 4 }}>
					{sortedServices.map((service, index) => {
						const documentCount = service.requiredDocuments?.length ?? 0;
						const expressAvailable = hasExpressOption(service);
						const priceLabel = formatPriceLabel(service, currencyFormatter, t);
						const turnaroundLabel = service.turnaroundTime || t('metadata.turnaroundUnknown');
						const hasImage = Boolean(service.image?.light);

						return (
							<Grid key={service.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
								<RevealSection delay={0.1 + index * 0.06} direction="up">
									<Card fullHeight>
										<CardContent
											sx={{
												p: 0,
												display: 'flex',
												flexDirection: 'column',
												height: '100%',
											}}
										>
											<Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
												{hasImage ? (
													<Image
														lightImage={service.image.light}
														darkImage={service.image.dark || service.image.light}
														alt={service.title}
														aspectRatio="16/10"
													/>
												) : (
													<Box
														sx={{
															py: 6,
															px: 3,
															background: (theme) => alpha(theme.palette.primary.main, 0.08),
															textAlign: 'center',
														}}
													>
														<Typography variant="subtitle2" color="primary">
															{service.category.toUpperCase()}
														</Typography>
													</Box>
												)}
											</Box>

											<Stack spacing={2.5} sx={{ flexGrow: 1, px: 3, pt: 3 }}>
												<Stack spacing={1}>
													<Typography
														variant="h4"
														sx={{
															fontSize: '1.2rem',
															minHeight: 60,
															display: '-webkit-box',
															WebkitLineClamp: 2,
															WebkitBoxOrient: 'vertical',
															overflow: 'hidden',
														}}
													>
														{service.title}
													</Typography>
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{
															minHeight: 66,
															display: '-webkit-box',
															WebkitLineClamp: 3,
															WebkitBoxOrient: 'vertical',
															overflow: 'hidden',
														}}
													>
														{service.shortDescription}
													</Typography>
												</Stack>

												<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
													<Chip
														icon={<IconClock size={16} />}
														label={turnaroundLabel}
														size="small"
														variant="outlined"
													/>
													<Chip
														icon={<IconCurrencyShekel size={16} />}
														label={priceLabel}
														size="small"
														variant="outlined"
													/>
													{documentCount > 0 && (
														<Chip
															size="small"
															sx={{ fontWeight: 500 }}
															icon={<IconFileText size={16} />}
															label={t('metadata.documents', { count: documentCount })}
															variant="outlined"
														/>
													)}
													{expressAvailable && (
														<Chip
															icon={<IconBolt size={16} />}
															label={t('metadata.expressAvailable')}
															size="small"
															variant="outlined"
															color="success"
														/>
													)}
												</Stack>
											</Stack>

											<Box sx={{ mt: 'auto', px: 3, pb: 3 }}>
												<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
													<Button
														variant="text"
														onClick={() => handleQuickView(service)}
													>
														{t('quickView')}
													</Button>
													<Button
														component={Link}
														href={`/services/${service.slug}/quote`}
														variant="contained"
														size="large"
														fullWidth
														onClick={() => handleQuoteClick(service, 'card')}
													>
														{t('requestQuote')}
													</Button>
													<Button
														component={Link}
														href={`/services/${service.slug}`}
														variant="outlined"
														size="large"
														endIcon={<IconArrowRight size={18} />}
														fullWidth
														onClick={() => handleDetailsClick(service, 'card')}
													>
														{t('viewDetails')}
													</Button>
												</Stack>
											</Box>
										</CardContent>
									</Card>
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
			</Container>

			<Dialog open={Boolean(quickViewService)} onClose={handleCloseQuickView} fullWidth maxWidth="md">
				{quickViewService && (
					<>
						<DialogTitle>{quickViewService.title}</DialogTitle>
						<DialogContent dividers>
							<Stack spacing={3}>
								{quickViewService.description && (
									<Stack spacing={1}>
										<Typography variant="subtitle1">{t('quickInfo')}</Typography>
										<Typography variant="body1" color="text.secondary">
											{quickViewService.description}
										</Typography>
									</Stack>
								)}

								{quickViewService.requiredDocuments && quickViewService.requiredDocuments.length > 0 && (
									<Stack spacing={1.5}>
										<Typography variant="subtitle1">{t('requiredDocuments')}</Typography>
										<Stack component="ul" spacing={0.75} sx={{ pl: 2.5 }}>
											{quickViewService.requiredDocuments.map((doc, idx) => (
												<Typography component="li" variant="body2" key={idx}>
													{doc}
												</Typography>
											))}
										</Stack>
									</Stack>
								)}

								{quickViewService.features && quickViewService.features.length > 0 && (
									<Stack spacing={1.5}>
										<Typography variant="subtitle1">{t('whatsIncluded')}</Typography>
										<Stack direction="row" flexWrap="wrap" gap={1}>
											{quickViewService.features.map((feature, idx) => (
												<Chip key={idx} label={feature} variant="outlined" />
											))}
										</Stack>
									</Stack>
								)}

								{quickViewService.pricing?.note && (
									<Box>
										<Typography variant="subtitle2" color="text.secondary">
											{quickViewService.pricing.note}
										</Typography>
									</Box>
								)}
							</Stack>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCloseQuickView}>{tCommon('close')}</Button>
							<Button
								component={Link}
								href={`/services/${quickViewService.slug}/quote`}
								variant="contained"
								onClick={() => quickViewService && handleQuoteClick(quickViewService, 'quick-view')}
							>
								{t('requestQuote')}
							</Button>
							<Button
								component={Link}
								href={`/services/${quickViewService.slug}`}
								variant="outlined"
								endIcon={<IconArrowRight size={18} />}
								onClick={() => quickViewService && handleDetailsClick(quickViewService, 'quick-view')}
							>
								{t('viewDetails')}
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</Box>
	);
}
