'use client';

import { Box, useColorScheme } from '@mui/material';

export default function ImageComponent({
	darkImage,
	lightImage,
	alt,
	aspectRatio = '16/9',
}: {
	darkImage: string;
	lightImage: string;
	alt: string;
	aspectRatio?: string;
}) {
	const { mode } = useColorScheme();
	const src = mode === 'dark' ? darkImage : lightImage;

	// Calculate padding-top percentage from aspect ratio (e.g., "16/9" or "694/520")
	const [width, height] = aspectRatio.split('/').map(Number);
	const paddingTop = `${(height / width) * 100}%`;

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				paddingTop,
				overflow: 'hidden',
				borderRadius: 2,
			}}
		>
			<Box
				component="img"
				src={src}
				alt={alt || ''}
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					display: 'block',
				}}
			/>
		</Box>
	);
}
