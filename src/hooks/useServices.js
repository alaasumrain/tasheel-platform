'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function useServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServicesAndCategories() {
      try {
        setLoading(true);

        // Fetch service categories
        const { data: categoryData, error: categoryError } = await supabase
          .from('service_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (categoryError) throw categoryError;

        // Fetch services with category info
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

        setCategories(categoryData || []);
        setServices(serviceData || []);
      } catch (err) {
        setError(err.message);
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
