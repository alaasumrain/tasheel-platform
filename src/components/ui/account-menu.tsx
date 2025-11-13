'use client';

import { useState } from 'react';
import {
	Menu,
	MenuItem,
	IconButton,
	Avatar,
	Stack,
	Typography,
	Divider,
	useColorScheme,
} from '@mui/material';
import { IconUser, IconLogout, IconClipboardList, IconChevronDown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AccountMenuProps {
	user: User;
}

export default function AccountMenu({ user }: AccountMenuProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const t = useTranslations('Header');
	const router = useRouter();
	const supabase = createClient();
	const { mode } = useColorScheme();
	
	const isDark = mode === 'dark';
	const controlBorder = isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(15, 23, 42, 0.16)';
	const controlHoverBorder = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(15, 23, 42, 0.3)';
	const controlHoverBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.04)';
	const controlTextColor = isDark ? 'common.white' : 'text.primary';

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		handleClose();
		await supabase.auth.signOut();
		router.push('/');
		router.refresh();
	};

	const userInitial = user.user_metadata?.name?.[0]?.toUpperCase() || 
		user.email?.[0]?.toUpperCase() || 
		'U';

	const userName = user.user_metadata?.name || 
		user.email?.split('@')[0] || 
		'User';

	return (
		<>
			<IconButton
				onClick={handleClick}
				size="small"
				sx={{
					border: '1.5px solid',
					borderColor: controlBorder,
					borderRadius: '999px',
					color: controlTextColor,
					width: 42,
					height: 42,
					p: 0.5,
					'&:hover': {
						backgroundColor: controlHoverBg,
						borderColor: controlHoverBorder,
					},
				}}
			>
				<Stack direction="row" spacing={0.5} alignItems="center">
					<Avatar
						sx={{
							width: 24,
							height: 24,
							bgcolor: 'primary.main',
							fontSize: '0.75rem',
							fontWeight: 600,
						}}
					>
						{userInitial}
					</Avatar>
					<IconChevronDown size={14} />
				</Stack>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'account-menu-button',
					sx: {
						py: 1,
						minWidth: 200,
						boxShadow: (theme) =>
							theme.palette.mode === 'dark'
								? '0px 4px 20px rgba(0,0,0,0.5)'
								: '0px 4px 20px rgba(0,0,0,0.1)',
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<MenuItem disabled>
					<Stack spacing={0.5} sx={{ width: '100%' }}>
						<Typography variant="body2" fontWeight={600}>
							{userName}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{user.email}
						</Typography>
					</Stack>
				</MenuItem>
				<Divider />
				<MenuItem
					component={Link}
					href="/dashboard"
					onClick={handleClose}
					sx={{ py: 1.5 }}
				>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<IconClipboardList size={18} />
						<Typography variant="body2">{t('dashboard')}</Typography>
					</Stack>
				</MenuItem>
				<MenuItem
					component={Link}
					href="/dashboard/profile"
					onClick={handleClose}
					sx={{ py: 1.5 }}
				>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<IconUser size={18} />
						<Typography variant="body2">{t('profile')}</Typography>
					</Stack>
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<IconLogout size={18} />
						<Typography variant="body2">{t('logout')}</Typography>
					</Stack>
				</MenuItem>
			</Menu>
		</>
	);
}

