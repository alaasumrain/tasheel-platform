'use server';

import { supabase } from './supabase';
import type { Service } from './types/service';

/**
 * Get all active services from database
 */
export async function getAllServices(): Promise<Service[]> {
	const { data, error } = await supabase
		.from('services')
		.select('*')
		.eq('is_active', true)
		.order('sort_order', { ascending: true })
		.order('name', { ascending: true });

	if (error) {
		console.error('Error fetching services:', error);
		throw error;
	}

	return (data as Service[]) || [];
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
	const { data, error } = await supabase
		.from('services')
		.select('*')
		.eq('slug', slug)
		.eq('is_active', true)
		.single();

	if (error) {
		if (error.code === 'PGRST116') {
			// Not found
			return null;
		}
		console.error('Error fetching service by slug:', error);
		throw error;
	}

	return data as Service;
}

/**
 * Get services by category ID
 */
export async function getServicesByCategoryId(
	categoryId: string
): Promise<Service[]> {
	const { data, error } = await supabase
		.from('services')
		.select('*')
		.eq('category_id', categoryId)
		.eq('is_active', true)
		.order('sort_order', { ascending: true })
		.order('name', { ascending: true });

	if (error) {
		console.error('Error fetching services by category:', error);
		throw error;
	}

	return (data as Service[]) || [];
}

/**
 * Get services by category slug
 */
export async function getServicesByCategorySlug(
	categorySlug: string
): Promise<Service[]> {
	// First get category ID
	const { data: category, error: categoryError } = await supabase
		.from('service_categories')
		.select('id')
		.eq('slug', categorySlug)
		.eq('is_active', true)
		.single();

	if (categoryError || !category) {
		console.error('Error fetching category:', categoryError);
		return [];
	}

	return getServicesByCategoryId(category.id);
}

/**
 * Get featured services
 */
export async function getFeaturedServices(): Promise<Service[]> {
	const { data, error } = await supabase
		.from('services')
		.select('*')
		.eq('is_featured', true)
		.eq('is_active', true)
		.order('sort_order', { ascending: true })
		.limit(12);

	if (error) {
		console.error('Error fetching featured services:', error);
		throw error;
	}

	return (data as Service[]) || [];
}

/**
 * Get all service categories
 */
export async function getServiceCategories() {
	const { data, error } = await supabase
		.from('service_categories')
		.select('*')
		.eq('is_active', true)
		.order('sort_order', { ascending: true });

	if (error) {
		console.error('Error fetching service categories:', error);
		throw error;
	}

	return data || [];
}

