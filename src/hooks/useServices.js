'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function useServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  console.log('🔌 useServices HOOK', { loading, servicesCount: services.length, categoriesCount: categories.length, hasError: !!error });

  useEffect(() => {
    // Prevent duplicate fetch in Strict Mode
    if (fetchedRef.current) {
      console.log('🔌 useServices: Already fetched, skipping');
      return;
    }

    async function fetchServicesAndCategories() {
      try {
        console.log('🔌 useServices: START fetching data');
        fetchedRef.current = true;
        setLoading(true);

        // Fetch service categories
        console.log('🔌 useServices: Fetching categories...');
        const { data: categoryData, error: categoryError } = await supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (categoryError) throw categoryError;
        console.log('🔌 useServices: Categories fetched', { count: categoryData?.length });

        // Fetch services with category info
        console.log('🔌 useServices: Fetching services...');
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select(
            `
            *,
            service_categories (
              slug,
              name
            )
          `
          )
          .eq('is_active', true)
          .order('sort_order');

        if (serviceError) throw serviceError;
        console.log('🔌 useServices: Services fetched', { count: serviceData?.length });

        setCategories(categoryData || []);
        setServices(serviceData || []);
        console.log('🔌 useServices: SUCCESS - Data loaded');
      } catch (err) {
        console.error('🔌 useServices: ERROR', err);
        setError(err.message);
        fetchedRef.current = false; // Allow retry on error
      } finally {
        setLoading(false);
      }
    }

    fetchServicesAndCategories();
  }, []);

  return { services, categories, loading, error };
}

export function useServicesByCategory(categorySlug) {
  const { services, loading, error } = useServices();

  const filteredServices = services.filter((service) => service.service_categories?.slug === categorySlug);

  return { services: filteredServices, loading, error };
}
