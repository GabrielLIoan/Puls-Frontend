import { useInfiniteQuery } from '@tanstack/react-query';
import { articlesApi } from '../api/articles';
import { useAuth } from '../context/AuthContext';
import type { ArticleQueryParams } from '../types/api';

// Switches between the personalized feed (respects the user's muted
// outlets) and the public feed (everything, no auth) based on login
// state. The query key includes `isLoggedIn` so switching auth state
// mid-session (login/logout) correctly triggers a refetch from the
// right endpoint rather than serving stale cached data from the other
// one.
export function useArticleFeed(
  params: Omit<ArticleQueryParams, 'page' | 'outletIds'> = {},
) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const isLoggedIn = !!user;

  return useInfiniteQuery({
    queryKey: ['articles', 'feed', { isLoggedIn, ...params }],
    queryFn: ({ pageParam }) =>
      isLoggedIn
        ? articlesApi.getFeed({ ...params, page: pageParam, limit: 20 })
        : articlesApi.list({ ...params, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    // Wait for the auth state to be known before firing — otherwise on
    // app launch we might briefly fetch the public feed, then refetch
    // the personalized one a moment later once the session restores.
    enabled: !isAuthLoading,
  });
}