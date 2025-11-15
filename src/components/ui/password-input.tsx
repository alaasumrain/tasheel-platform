/**
 * Password Input Component with Show/Hide Toggle
 * Adapted from next-supabase-starter and react-admin patterns
 */

'use client';

import { useState } from 'react';
import {
	OutlinedInput,
	InputAdornment,
	IconButton,
	OutlinedInputProps,
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export interface PasswordInputProps extends Omit<OutlinedInputProps, 'type'> {
	/**
	 * Whether the password should initially be visible
	 * @default false
	 */
	initiallyVisible?: boolean;
}

/**
 * Password input field with show/hide toggle button
 * 
 * @example
 * ```tsx
 * <PasswordInput
 *   label="Password"
 *   name="password"
 *   required
 *   fullWidth
 * />
 * ```
 */
export default function PasswordInput({
	initiallyVisible = false,
	...props
}: PasswordInputProps) {
	const [visible, setVisible] = useState(initiallyVisible);

	const handleToggleVisibility = () => {
		setVisible((prev) => !prev);
	};

	return (
		<OutlinedInput
			{...props}
			type={visible ? 'text' : 'password'}
			endAdornment={
				<InputAdornment position="end">
					<IconButton
						aria-label={visible ? 'Hide password' : 'Show password'}
						onClick={handleToggleVisibility}
						edge="end"
						size="small"
					>
						{visible ? (
							<IconEyeOff size={20} />
						) : (
							<IconEye size={20} />
						)}
					</IconButton>
				</InputAdornment>
			}
		/>
	);
}

