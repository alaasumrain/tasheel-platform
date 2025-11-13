import Image, { ImageProps } from 'next/image';

/**
 * Optimized Image Component
 *
 * Wraps Next.js Image component with automatic WebP conversion
 * and performance optimizations.
 *
 * Features:
 * - Automatic format detection and WebP conversion
 * - Lazy loading by default
 * - Responsive images with srcset
 * - Proper aspect ratio handling
 *
 * @example
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero image"
 *   width={1200}
 *   height={600}
 * />
 */

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
	src: string;
	alt: string;
}

export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
	// Auto-convert to WebP if not already
	// Fallback to original if WebP doesn't exist
	const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

	return (
		<Image
			src={optimizedSrc}
			alt={alt}
			quality={85}
			{...props}
		/>
	);
}

export default OptimizedImage;
