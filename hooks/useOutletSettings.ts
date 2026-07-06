import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followsApi } from '../api/follows';
import type { OutletWithStatus } from '../types/api';

const OUTLETS_QUERY_KEY = ['me', 'outlets'];

export function useOutletSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: OUTLETS_QUERY_KEY,
    queryFn: followsApi.getOutlets,
  });

  const toggleMutation = useMutation<
    unknown,
    Error,
    { outletId: string; enable: boolean },
    { previous: OutletWithStatus[] | undefined }
  >({
    mutationFn: ({ outletId, enable }) =>
      enable
        ? followsApi.unmuteOutlet(outletId)
        : followsApi.muteOutlet(outletId),

    // Optimistic update: flip the toggle immediately in the cache rather
    // than waiting on the round trip — toggles should feel instant. If
    // the request fails, onError rolls the cache back to what it was.
    onMutate: async ({ outletId, enable }) => {
      await queryClient.cancelQueries({ queryKey: OUTLETS_QUERY_KEY });

      const previous = queryClient.getQueryData<OutletWithStatus[]>(
        OUTLETS_QUERY_KEY,
      );

      queryClient.setQueryData<OutletWithStatus[]>(OUTLETS_QUERY_KEY, (old) =>
        old?.map((outlet) =>
          outlet.id === outletId ? { ...outlet, enabled: enable } : outlet,
        ),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(OUTLETS_QUERY_KEY, context.previous);
      }
    },

    onSettled: () => {
      // Re-sync with the server in the background regardless of
      // success/failure, to catch any drift.
      queryClient.invalidateQueries({ queryKey: OUTLETS_QUERY_KEY });
      // The personalized feed depends on enabled outlets — invalidate
      // it too so it reflects the change next time it's viewed.
      queryClient.invalidateQueries({ queryKey: ['articles', 'feed'] });
    },
  });

  return {
    outlets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    toggleOutlet: (outletId: string, enable: boolean) =>
      toggleMutation.mutate({ outletId, enable }),
  };
}