import { useInfiniteQuery } from '@tanstack/react-query';
import { savedArticlesApi } from '../api/savedArticles';
import { useAuth } from '../context/AuthContext';

export const SAVED_QUERY_KEY = ['me', 'saved-articles'];

export function useSavedArticles() {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: SAVED_QUERY_KEY,
    queryFn: ({ pageParam }) => savedArticlesApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    // Only fetch when logged in — the Saved tab shows a login prompt
    // otherwise, so there's no point firing a doomed 401 request.
    enabled: !!user,
  });
}