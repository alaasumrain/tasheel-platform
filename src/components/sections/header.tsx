'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
	Box,
	Link as MuiLink,
	Container,
	Dialog,
	DialogContent,
	IconButton,
	Stack,
	Typography,
	useColorScheme,
} from '@mui/material';

import { IconMenu, IconX as IconClose, IconSearch } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

import GetStarted from '@/components/buttons/get-started-button';
import LoginButton from '@/components/buttons/login-button';
import RegisterButton from '@/components/buttons/register-button';
import AccountMenu from '@/components/ui/account-menu';
import ThemeToggle from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/ui/language-switcher';
import CurrencySwitcher from '@/components/ui/currency-switcher';
import { useAuth } from '@/hooks/use-auth';
import OptimizedImage from '@/components/ui/OptimizedImage';

export default function Header() {
	const [open, setOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const t = useTranslations('Header');
	const locale = useLocale();
	const pathname = usePathname();
	const isArabic = locale === 'ar';
	const { user, loading: authLoading } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navigationLinks: NavigationLink[] = [
		{
			label: t('services'),
			href: '/services',
		},
		{
			label: t('track'),
			href: '/track',
		},
		{
			label: t('faqs'),
			href: '/#faq',
		},
		{
			label: t('about'),
			href: '/about',
		},
		{
			label: t('contact'),
			href: '/contact',
		},
	];

	const isActiveLink = (href: string) => {
		if (href === '/') {
		return pathname === '/' || pathname === '/ar' || pathname === '/en';
	}
	return pathname ? (pathname === href || pathname.startsWith(href + '/')) : false;
	};

	return (
		<>
			<Box
				sx={{
					bgcolor: 'background.paper',
					borderBottom: '1px solid',
					borderColor: 'divider',
					position: 'sticky',
					top: 0,
					zIndex: 1100,
					transition: 'box-shadow 0.3s ease, transform 0.3s ease',
					boxShadow: isScrolled ? '0px 2px 8px rgba(0,0,0,0.08)' : 'none',
					transform: isScrolled ? 'translateY(0)' : 'translateY(0)',
				}}
			>
		<Container maxWidth="lg" sx={{ px: { xs: 2.5, lg: 4 } }}>
					<Stack
						alignItems="center"
						direction={'row'}
						justifyContent="space-between"
						sx={{ height: { xs: 80, lg: 90 } }}
					>
						<LogoWrapper />
				<Stack
					direction="row"
					sx={{
						display: { xs: 'none', lg: 'flex' },
								flex: 1,
								justifyContent: 'center',
						alignItems: 'center',
								gap: { lg: 3, xl: 4 },
								mx: { lg: 4 },
						'& a': {
							whiteSpace: 'nowrap',
							fontWeight: 500,
									position: 'relative',
						},
					}}
				>
							{navigationLinks.map((link) => {
								const isActive = isActiveLink(link.href);
								return (
									<MuiLink
										key={link.href}
										component={Link}
										href={link.href}
										underline="none"
										prefetch
										sx={{
											position: 'relative',
											px: 1,
										}}
									>
										{isActive && (
											<Box
												sx={{
													position: 'absolute',
													[isArabic ? 'right' : 'left']: 0,
													top: '50%',
													transform: 'translateY(-50%)',
													width: 3,
													height: '60%',
													bgcolor: 'primary.main',
													borderRadius: 1,
												}}
											/>
										)}
						<Typography
											color={isActive ? 'primary.main' : 'text.primary'}
							sx={{
												fontSize: '1.1rem',
												fontWeight: isActive ? 700 : 600,
								letterSpacing: isArabic ? 0 : 0.2,
							}}
							variant="subtitle2"
						>
							{link.label}
						</Typography>
					</MuiLink>
								);
							})}
				</Stack>
				<Stack
					alignItems="center"
					direction="row"
					spacing={1.5}
					sx={{ display: { xs: 'none', lg: 'flex' } }}
				>
					<IconButton
						size="small"
						sx={{
							border: '1.5px solid',
							borderColor: (theme) =>
								theme.palette.mode === 'dark'
									? 'rgba(255, 255, 255, 0.28)'
									: 'rgba(15, 23, 42, 0.16)',
							borderRadius: '999px',
							color: 'text.primary',
							width: 42,
							height: 42,
							'&:hover': {
								backgroundColor: (theme) =>
									theme.palette.mode === 'dark'
										? 'rgba(255, 255, 255, 0.12)'
										: 'rgba(15, 23, 42, 0.04)',
								borderColor: (theme) =>
									theme.palette.mode === 'dark'
										? 'rgba(255, 255, 255, 0.4)'
										: 'rgba(15, 23, 42, 0.3)',
							},
						}}
					>
						<IconSearch size={16} />
					</IconButton>
					<LanguageSwitcher />
					<Box sx={{ minWidth: 'fit-content' }}>
						<CurrencySwitcher />
					</Box>
					<ThemeToggle />
					{!authLoading && (
						<>
							{user ? (
								<AccountMenu user={user} />
							) : (
								<>
									<LoginButton
										buttonLabel={t('login')}
										variant="text"
										size="small"
										sx={{ mr: 0.5 }}
									/>
									<RegisterButton
										variant="outlined"
										size="small"
										sx={{ mr: 1 }}
									/>
								</>
							)}
						</>
					)}
					<GetStarted
						buttonLabel={t('requestService')}
						href="/services"
						size="small"
						sx={{ boxShadow: '0px 8px 16px rgba(0,0,0,0.12)' }}
					/>
				</Stack>
						<Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
							<IconButton onClick={() => setOpen(true)}>
								<IconMenu />
							</IconButton>
						</Box>
					</Stack>
				</Container>
			</Box>
			<Dialog
				fullScreen
				keepMounted
				onClose={() => setOpen(false)}
				open={open}
				sx={{ '& .MuiDialog-paper': { borderRadius: 0 } }}
			>
				<DialogContent
					sx={{ py: { xs: 3.75, md: 3.75 }, px: { xs: 2, md: 3 } }}
				>
					<Container
						disableGutters
						maxWidth="xl"
						sx={{
							height: '100%',
						}}
					>
						<Stack
							justifyContent="space-between"
							sx={{
								height: '100%',
							}}
						>
							<Stack
								alignItems={'center'}
								direction={{ xs: 'row' }}
								justifyContent={{ xs: 'space-between' }}
							>
								<LogoWrapper />
								<Box>
									<IconButton
										onClick={() => setOpen(false)}
										size="large"
										sx={{ p: 0 }}
									>
										<IconClose size={32} />
									</IconButton>
								</Box>
							</Stack>
							<Stack alignItems="center" spacing={5}>
								{navigationLinks.map((link) => (
									<MuiLink
										key={link.href}
										component={Link}
										href={link.href}
										onClick={() => setOpen(false)}
										underline="none"
										prefetch
									>
										<Typography
											color="textPrimary"
											component={'div'}
											variant="h3"
										>
											{link.label}
										</Typography>
									</MuiLink>
								))}
							</Stack>
							<Container maxWidth="sm">
								<Stack spacing={2}>
									<LanguageSwitcher fullWidth />
									<CurrencySwitcher fullWidth />
									{!authLoading && (
										<>
											{user ? (
												<>
													<MuiLink
														component={Link}
														href="/dashboard"
														onClick={() => setOpen(false)}
														underline="none"
													>
														<Typography
															variant="h6"
															sx={{
																textAlign: 'center',
																py: 2,
																border: '1px solid',
																borderColor: 'divider',
																borderRadius: 2,
															}}
														>
															{t('dashboard')}
														</Typography>
													</MuiLink>
												</>
											) : (
												<>
													<LoginButton
														buttonLabel={t('login')}
														variant="outlined"
														fullWidth
														size="large"
													/>
													<RegisterButton
														variant="contained"
														fullWidth
														size="large"
													/>
												</>
											)}
										</>
									)}
									<GetStarted
										buttonLabel={t('requestService')}
										fullWidth
										href="/services"
										size="large"
									/>
								</Stack>
							</Container>
						</Stack>
					</Container>
				</DialogContent>
			</Dialog>
		</>
	);
}

interface NavigationLink {
	label: string;
	href: string;
}

function LogoWrapper() {
	const { mode } = useColorScheme();
	const t = useTranslations('Header');
	const logoSrc = mode === 'dark' ? '/dark/logo-header.png' : '/light/logo-header.png';
	return (
		<MuiLink component={Link} href="/" underline="none" prefetch>
			<Box
				sx={{
					position: 'relative',
					height: { xs: 48, lg: 56 },
					width: 'auto',
				}}
			>
				<OptimizedImage
					src={logoSrc}
					alt={t('logoAlt')}
					height={56}
					width={200}
					style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
					priority
				/>
			</Box>
		</MuiLink>
	);
}
