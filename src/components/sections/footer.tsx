'use client';

import {
	Box,
	Button,
	Container,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useColorScheme } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Link as MuiLink } from '@mui/material';

import {
	IconArrowUp as IconTop,
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandTwitter,
	IconBrandYoutube,
	IconBrandWhatsapp,
	IconPhone,
} from '@tabler/icons-react';

export default function Footer() {
	const t = useTranslations('Footer');
	const { mode } = useColorScheme();
	const locale = useLocale();
	const pathname = usePathname();
	const isRTL = locale === 'ar';

	// Hide footer on dashboard routes (dashboard has its own layout)
	const isDashboardRoute = pathname?.includes('/dashboard');
	if (isDashboardRoute) {
		return null;
	}

	const handleToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+970592345678';
	const phoneNumber = '+970 2 295 0000';

	return (
		<>
			{/* Main Footer */}
			<Box
				sx={{
					bgcolor: 'background.paper',
					borderTop: '1px solid',
					borderColor: 'divider',
					pt: { xs: 6, md: 8 },
					pb: { xs: 4, md: 6 },
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={{ xs: 4, md: 6 }}>
						{/* About Tasheel Platform */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
							<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700}>
									{t('aboutPlatform')}
									</Typography>
								<Stack spacing={1.5}>
									{[
										{ href: '/about', label: t('aboutUs') },
										{ href: '/privacy', label: t('privacyPolicy') },
										{ href: '/terms', label: t('termsConditions') },
										{ href: '/#faq', label: t('faqs') },
										{ href: '/news', label: t('news') },
										{ href: '/accessibility', label: t('accessibility') },
										{ href: '/statistics', label: t('statistics') },
										{ href: '/security', label: t('security') },
									].map((link) => (
										<MuiLink
											key={link.href}
											component={Link}
											href={link.href}
											underline="none"
											prefetch
										>
											<Typography
												color="text.secondary"
												variant="body2"
												sx={{
													'&:hover': {
														color: 'primary.main',
													},
												}}
											>
												{link.label}
											</Typography>
										</MuiLink>
												))}
											</Stack>
										</Stack>
									</Grid>

						{/* Help and Support */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
										<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700}>
									{t('helpSupport')}
											</Typography>
											<Stack spacing={1.5}>
									{[
										{ href: '/contact', label: t('contact') },
										{ href: '/#faq', label: t('faqs') },
										{ href: '/service-channels', label: t('serviceChannels') },
										{ href: '/registration', label: t('registration') },
									].map((link) => (
										<MuiLink
											key={link.href}
											component={Link}
											href={link.href}
											underline="none"
											prefetch
										>
														<Typography
												color="text.secondary"
												variant="body2"
												sx={{
													'&:hover': {
														color: 'primary.main',
													},
												}}
														>
															{link.label}
														</Typography>
										</MuiLink>
												))}
											</Stack>
										</Stack>
									</Grid>

						{/* Important Links */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
										<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700}>
									{t('importantLinks')}
											</Typography>
											<Stack spacing={1.5}>
									{[
										{ href: '/services', label: t('services') },
										{ href: '/track', label: t('trackStatus') },
										{ href: '/pricing', label: t('pricing') },
									].map((link) => (
										<MuiLink
											key={link.href}
											component={Link}
											href={link.href}
											underline="none"
											prefetch
										>
														<Typography
												color="text.secondary"
												variant="body2"
												sx={{
													'&:hover': {
														color: 'primary.main',
													},
												}}
														>
															{link.label}
														</Typography>
										</MuiLink>
												))}
											</Stack>
										</Stack>
									</Grid>

						{/* Contact Us */}
						<Grid size={{ xs: 12, md: 6, lg: 3 }}>
										<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700}>
									{t('contactUs')}
											</Typography>
								<Stack spacing={2}>
									<Button
										component="a"
										href={`tel:${phoneNumber.replace(/\s/g, '')}`}
										startIcon={!isRTL ? <IconPhone size={20} /> : undefined}
										endIcon={isRTL ? <IconPhone size={20} /> : undefined}
										variant="contained"
										color="primary"
										sx={{
											borderRadius: 2,
											px: 3,
											py: 1.5,
											textTransform: 'none',
											fontWeight: 600,
											direction: 'ltr',
											'& .MuiButton-endIcon': {
												marginLeft: 0,
												marginRight: '8px',
											},
										}}
									>
										<span dir="ltr">{phoneNumber}</span>
									</Button>
									<Stack direction="row" spacing={1.5}>
										{[
											{ href: `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, icon: <IconBrandWhatsapp />, label: 'WhatsApp' },
											{ href: '#', icon: <IconBrandFacebook />, label: 'Facebook' },
											{ href: '#', icon: <IconBrandTwitter />, label: 'Twitter' },
											{ href: '#', icon: <IconBrandYoutube />, label: 'YouTube' },
										].map((social) => (
											<IconButton
												key={social.label}
												component="a"
												href={social.href}
												target="_blank"
												rel="noopener noreferrer"
												sx={{
													border: '1px solid',
													borderColor: 'divider',
													color: 'text.secondary',
													'&:hover': {
														bgcolor: 'primary.main',
														color: 'white',
														borderColor: 'primary.main',
													},
												}}
														>
												{social.icon}
											</IconButton>
												))}
									</Stack>
											</Stack>
										</Stack>
									</Grid>
								</Grid>

					{/* Logo and Copyright */}
					<Box sx={{ mt: { xs: 6, md: 8 }, pt: { xs: 4, md: 6 }, borderTop: '1px solid', borderColor: 'divider' }}>
						<Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between" alignItems="center">
							<Stack direction="row" spacing={2} alignItems="center">
								<Box>
									{mode === 'dark' && (
										<img src="/dark/logo-footer.png" alt={t('logoAlt')} style={{ height: 40 }} />
									)}
									{mode === 'light' && (
										<img src="/light/logo-footer.png" alt={t('logoAlt')} style={{ height: 40 }} />
									)}
								</Box>
								<Typography variant="body2" color="text.secondary">
									{t('copyright')}
								</Typography>
							</Stack>
							<Button
								onClick={handleToTop}
								startIcon={<IconTop />}
								variant="outlined"
								size="small"
								sx={{
									borderRadius: 2,
									textTransform: 'none',
								}}
							>
								{t('toTop')}
							</Button>
					</Stack>
					</Box>
				</Container>
			</Box>

			{/* Cookie Consent Banner */}
			<Box
				sx={{
					bgcolor: 'background.default',
					borderTop: '1px solid',
					borderColor: 'divider',
					py: 2,
				}}
			>
				<Container maxWidth="lg">
					<Typography variant="body2" color="text.secondary" textAlign="center">
						{t('cookieConsent')}
					</Typography>
		</Container>
			</Box>
		</>
	);
}
