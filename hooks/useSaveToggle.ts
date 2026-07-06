import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { savedArticlesApi } from '../api/savedArticles';
import { useAuth } from '../context/AuthContext';
import type { Article, PaginatedResponse } from '../types/api';
import { SAVED_QUERY_KEY } from './useSavedArticles';

export function useSaveToggle(articleId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Derive the server-known saved state from the cache
  const cachedIsSaved = (() => {
    const pages = queryClient.getQueryData<{
      pages: PaginatedResponse<Article>[];
    }>(SAVED_QUERY_KEY);
    if (!pages) return false;
    return pages.pages.some((page) =>
      page.data.some((a) => a.id === articleId),
    );
  })();

  // Local optimistic state — seeds from cache but flips immediately on
  // toggle so the icon reacts instantly without waiting for a round
  // trip + cache invalidation + refetch cycle.
  const [optimisticIsSaved, setOptimisticIsSaved] = useState(cachedIsSaved);

  // Keep local state in sync if the cache changes underneath us
  // (e.g. user visits Saved tab which loads the real list).
  useEffect(() => {
    setOptimisticIsSaved(cachedIsSaved);
  }, [cachedIsSaved]);

  const mutation = useMutation<
    unknown,
    Error,
    boolean,
    { previousPages: unknown; previousOptimistic: boolean }
  >({
    mutationFn: (save) =>
      save
        ? savedArticlesApi.save(articleId)
        : savedArticlesApi.unsave(articleId),

    onMutate: async (save) => {
      await queryClient.cancelQueries({ queryKey: SAVED_QUERY_KEY });
      const previousPages = queryClient.getQueryData(SAVED_QUERY_KEY);
      const previousOptimistic = optimisticIsSaved;

      // Flip the icon immediately
      setOptimisticIsSaved(save);

      // Optimistically remove from the cache list when unsaving
      if (!save) {
        queryClient.setQueryData<{ pages: PaginatedResponse<Article>[] }>(
          SAVED_QUERY_KEY,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data.filter((a) => a.id !== articleId),
              })),
            };
          },
        );
      }

      return { previousPages, previousOptimistic };
    },

    onError: (_err, _save, context) => {
      // Roll back both the cache and the local icon state
      if (context?.previousPages) {
        queryClient.setQueryData(SAVED_QUERY_KEY, context.previousPages);
      }
      setOptimisticIsSaved(context?.previousOptimistic ?? cachedIsSaved);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_QUERY_KEY });
    },
  });

  return {
    isSaved: optimisticIsSaved,
    isLoading: mutation.isPending,
    toggle: () => {
      if (!user) return false;
      mutation.mutate(!optimisticIsSaved);
      return true;
    },
  };
}