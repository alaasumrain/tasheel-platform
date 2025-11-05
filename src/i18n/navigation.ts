import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Create locale-aware navigation helpers
// These automatically handle locale prefixes in URLs
export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);

