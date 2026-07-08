import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';
import type { CountryFilter, FeedFilter } from '../types/feedFilter';

export { EMPTY_FILTER } from '../types/feedFilter';
export type { CountryFilter, FeedFilter };

export function useAvailableCategories() {
  return useQuery({
    queryKey: ['articles', 'categories'],
    queryFn: () => api.get<string[]>('/articles/categories'),
    staleTime: 5 * 60_000,
  });
}

export function useFeedFilter() {
  const [filter, setFilter] = useState<FeedFilter>({ country: null, categories: [] });

  const activeCount =
    (filter.country ? 1 : 0) + filter.categories.length;

  function toggleCountry(country: CountryFilter) {
    setFilter((f) => ({
      ...f,
      country: f.country === country ? null : country,
    }));
  }

  function toggleCategory(category: string) {
    setFilter((f) => ({
      ...f,
      categories: f.categories.includes(category)
        ? f.categories.filter((c) => c !== category)
        : [...f.categories, category],
    }));
  }

  function clearAll() {
    setFilter({ country: null, categories: [] });
  }

  return { filter, activeCount, toggleCountry, toggleCategory, clearAll };
}