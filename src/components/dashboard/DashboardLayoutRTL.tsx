/**
 * RTL-Aware Dashboard Layout
 * Properly handles RTL/LTR directions
 * Based on Materio patterns but adapted for our needs
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Divider,
	Button,
	useTheme,
} from '@mui/material';
import {
	Dashboard as DashboardIcon,
	Receipt as RequestsIcon,
	Person as ProfileIcon,
	ReceiptLong as InvoicesIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

const drawerWidth = 260;

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations('Dashboard.layout');
	const locale = useLocale();
	const theme = useTheme();
	const isRTL = locale === 'ar';

	const menuItems = [
		{ label: t('menu.dashboard'), icon: DashboardIcon, href: '/dashboard' },
		{ label: t('menu.myRequests'), icon: RequestsIcon, href: '/dashboard/requests' },
		{ label: t('menu.invoices'), icon: InvoicesIcon, href: '/dashboard/invoices' },
		{ label: t('menu.profile'), icon: ProfileIcon, href: '/dashboard/profile' },
	];

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error(t('logoutFailed'));
		} else {
			toast.success(t('logoutSuccess'));
			router.push('/');
		}
	};

	const drawer = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Box sx={{ p: 3, pb: 2 }}>
				<Typography variant="h5" fontWeight={700} color="primary">
					{t('title')}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
					{t('subtitle')}
				</Typography>
			</Box>

			<Divider />

			<List sx={{ flexGrow: 1, pt: 2 }}>
				{menuItems.map((item) => {
					const Icon = item.icon;
					return (
						<ListItem key={item.href} disablePadding sx={{ px: 2, mb: 0.5 }}>
							<ListItemButton
								component={Link}
								href={item.href}
								sx={{
									borderRadius: 2,
									'&:hover': {
										bgcolor: 'primary.main',
										color: 'primary.contrastText',
										'& .MuiListItemIcon-root': {
											color: 'primary.contrastText',
										},
									},
								}}
							>
								<ListItemIcon 
									sx={{ 
										minWidth: 40,
										// RTL: icon on right, LTR: icon on left
										...(isRTL ? { 
											marginLeft: 1,
											marginRight: 0,
										} : {
											marginRight: 1,
											marginLeft: 0,
										}),
									}}
								>
									<Icon fontSize="small" />
								</ListItemIcon>
								<ListItemText 
									primary={item.label}
									primaryTypographyProps={{
										sx: {
											textAlign: isRTL ? 'right' : 'left',
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			<Divider />

			<Box sx={{ p: 2 }}>
				<Button
					fullWidth
					variant="outlined"
					startIcon={!isRTL ? <LogoutIcon /> : undefined}
					endIcon={isRTL ? <LogoutIcon /> : undefined}
					onClick={handleLogout}
					sx={{ textTransform: 'none' }}
				>
					{t('logout')}
				</Button>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					// RTL: margin on right, LTR: margin on left
					...(isRTL 
						? { mr: { sm: `${drawerWidth}px` } }
						: { ml: { sm: `${drawerWidth}px` } }
					),
					zIndex: theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge={isRTL ? 'end' : 'start'}
						onClick={handleDrawerToggle}
						sx={{ 
							[isRTL ? 'ml' : 'mr']: 2, 
							display: { sm: 'none' } 
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography 
						variant="h6" 
						noWrap 
						component="div"
						sx={{ 
							flexGrow: 1,
							textAlign: isRTL ? 'right' : 'left',
						}}
					>
						{t('subtitle')}
					</Typography>
				</Toolbar>
			</AppBar>

			<Box
				component="nav"
				sx={{ 
					width: { sm: drawerWidth }, 
					flexShrink: { sm: 0 },
					// RTL: drawer on right
					...(isRTL && {
						order: 2,
					}),
				}}
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
					anchor={isRTL ? 'right' : 'left'}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					anchor={isRTL ? 'right' : 'left'}
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					mt: 8,
					// RTL: content on left, LTR: content on right
					...(isRTL ? {
						mr: { sm: `${drawerWidth}px` },
						ml: 0,
					} : {
						ml: { sm: `${drawerWidth}px` },
						mr: 0,
					}),
					direction: isRTL ? 'rtl' : 'ltr',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

