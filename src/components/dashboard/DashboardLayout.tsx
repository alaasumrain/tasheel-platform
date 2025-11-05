'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@mui/material';
import {
	Dashboard as DashboardIcon,
	Receipt as RequestsIcon,
	Person as ProfileIcon,
	ReceiptLong as InvoicesIcon,
	Logout as LogoutIcon,
	Menu as MenuIcon,
} from '@mui/icons-material';
import { Link } from '@/i18n/navigation';
import { Link as MuiLink } from '@mui/material';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const drawerWidth = 260;

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();
	const supabase = createClient();
	const t = useTranslations('Dashboard.layout');

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
								<ListItemIcon sx={{ minWidth: 40 }}>
									<Icon fontSize="small" />
								</ListItemIcon>
								<ListItemText primary={item.label} />
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
					startIcon={<LogoutIcon />}
					onClick={handleLogout}
					sx={{ textTransform: 'none' }}
				>
					{t('logout')}
				</Button>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{t('subtitle')}
					</Typography>
				</Toolbar>
			</AppBar>

			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true,
					}}
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
				}}
			>
				{children}
			</Box>
		</Box>
	);
}

