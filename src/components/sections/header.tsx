'use client';
import { useState } from 'react';
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

import { IconMenu, IconX as IconClose } from '@tabler/icons-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

import GetStarted from '@/components/buttons/get-started-button';
import ThemeToggle from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/ui/language-switcher';

export default function Header() {
	const [open, setOpen] = useState(false);
	const t = useTranslations('Header');
	const locale = useLocale();
	const isArabic = locale === 'ar';

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
			label: t('pricing'),
			href: '/#pricing',
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

	return (
		<>
			<Box>
		<Container maxWidth="lg" sx={{ px: { xs: 2.5, lg: 4 } }}>
					<Stack
						alignItems="center"
						direction={'row'}
						justifyContent="space-between"
						sx={{ height: { xs: 100, lg: 110 } }}
					>
						<LogoWrapper />
				<Stack
					direction="row"
					spacing={3}
					sx={{
						display: { xs: 'none', lg: 'flex' },
						marginInlineStart: { lg: 6 },
						alignItems: 'center',
						'& a': {
							whiteSpace: 'nowrap',
							fontWeight: 500,
						},
					}}
				>
					{navigationLinks.map((link) => (
						<MuiLink key={link.href} component={Link} href={link.href} underline="none" prefetch>
						<Typography
							color="textPrimary"
							sx={{
								fontSize: '0.95rem',
								fontWeight: 600,
								letterSpacing: isArabic ? 0 : 0.2,
							}}
							variant="subtitle2"
						>
							{link.label}
						</Typography>
					</MuiLink>
					))}
				</Stack>
				<Stack
					alignItems="center"
					direction="row"
					spacing={2.5}
					sx={{ display: { xs: 'none', lg: 'flex' } }}
				>
					<LanguageSwitcher />
					<ThemeToggle />
					<GetStarted
						buttonLabel="Request a Service"
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
										buttonLabel="Request a Service"
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
	const logoSrc = mode === 'dark' ? '/dark/logo-header.png' : '/light/logo-header.png';
	return (
		<MuiLink component={Link} href="/" underline="none" prefetch>
			<Box
				component="img"
				src={logoSrc}
				alt="Company logo"
				sx={{ height: { xs: 56, lg: 68 }, width: 'auto' }}
			/>
		</MuiLink>
	);
}
