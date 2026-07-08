import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Article, PaginatedResponse } from '../types/api';
import type { FeedFilter } from '../types/feedFilter';

function buildFeedUrl(
  isLoggedIn: boolean,
  filter: FeedFilter,
  page: number,
): string {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', '20');

  if (filter.country) params.set('country', filter.country);
  if (filter.categories.length > 0) {
    params.set('categories', filter.categories.join(','));
  }

  const base = isLoggedIn ? '/articles/feed' : '/articles';
  return `${base}?${params.toString()}`;
}

export function useArticleFeed(filter: FeedFilter = { country: null, categories: [] }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isLoggedIn = !!user;

  return useInfiniteQuery({
    queryKey: ['articles', 'feed', { isLoggedIn, filter }],
    queryFn: ({ pageParam }) =>
      api.get<PaginatedResponse<Article>>(
        buildFeedUrl(isLoggedIn, filter, pageParam as number),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    enabled: !isAuthLoading,
  });
}