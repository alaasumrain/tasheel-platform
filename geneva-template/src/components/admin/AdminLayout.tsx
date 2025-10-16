'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
	Receipt as OrdersIcon,
	Settings as SettingsIcon,
	Menu as MenuIcon,
	Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
	{ label: 'Dashboard', icon: DashboardIcon, href: '/admin' },
	{ label: 'Orders', icon: OrdersIcon, href: '/admin/orders' },
	{ label: 'Settings', icon: SettingsIcon, href: '/admin/settings' },
];

interface AdminLayoutProps {
	children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleLogout = async () => {
		await fetch('/api/admin/logout', { method: 'POST' });
		router.push('/login');
	};

	const drawer = (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Box sx={{ p: 3, pb: 2 }}>
				<Typography variant="h5" fontWeight={700} color="primary">
					Tasheel
				</Typography>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: 'block', mt: 1 }}
				>
					Admin Dashboard
				</Typography>
			</Box>

			<Divider />

			<List sx={{ flexGrow: 1, pt: 2 }}>
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href ||
						(item.href !== '/admin' && pathname?.startsWith(item.href));

					return (
						<ListItem key={item.href} disablePadding sx={{ px: 2, mb: 0.5 }}>
							<ListItemButton
								component={Link}
								href={item.href}
								selected={isActive}
								sx={{
									borderRadius: 2,
									'&.Mui-selected': {
										bgcolor: 'primary.main',
										color: 'primary.contrastText',
										'&:hover': {
											bgcolor: 'primary.dark',
										},
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
					sx={{ borderRadius: 2 }}
				>
					Logout
				</Button>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
			{/* AppBar */}
			<AppBar
				position="fixed"
				elevation={0}
				sx={[
					() => ({
						width: { md: `calc(100% - ${drawerWidth}px)` },
						ml: { md: `${drawerWidth}px` },
						bgcolor: 'rgba(255,255,255,0.85)',
						color: 'text.primary',
						boxShadow: 'none',
						borderBottom: '1px solid',
						borderColor: 'divider',
						backdropFilter: 'blur(12px)',
					}),
					(theme) =>
						theme.applyStyles('dark', {
							bgcolor: 'rgba(20,20,24,0.85)',
							borderColor: 'rgba(255,255,255,0.1)',
						}),
				]}
			>
				<Toolbar sx={{ minHeight: 72, px: { xs: 2, md: 4 } }}>
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { md: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" fontWeight={700}>
						Tasheel Admin
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Drawer */}
			<Box
				component="nav"
				sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
			>
				{/* Mobile drawer */}
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: 'block', md: 'none' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>

				{/* Desktop drawer */}
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', md: 'block' },
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
							borderRight: 1,
							borderColor: 'divider',
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>

			{/* Main content */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: { xs: 3, md: 4 },
					width: { md: `calc(100% - ${drawerWidth}px)` },
					mt: '84px',
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
