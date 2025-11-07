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
import ThemeToggle from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/ui/language-switcher';

export default function Header() {
	const [open, setOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const t = useTranslations('Header');
	const locale = useLocale();
	const pathname = usePathname();
	const isArabic = locale === 'ar';

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
		return pathname === href || pathname.startsWith(href + '/');
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
							spacing={2}
					sx={{ display: { xs: 'none', lg: 'flex' } }}
				>
							<IconButton
								sx={{
									color: 'text.primary',
								}}
							>
								<IconSearch size={20} />
							</IconButton>
					<LanguageSwitcher />
					<ThemeToggle />
					<GetStarted
								buttonLabel={t('requestService')}
						href="/services"
						size="medium"
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
				component="img"
				src={logoSrc}
				alt={t('logoAlt')}
				sx={{ height: { xs: 56, lg: 68 }, width: 'auto' }}
			/>
		</MuiLink>
	);
}
