import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../api/gamification';
import { useAuth } from '../context/AuthContext';
import type { ReadEventResult, UserStats } from '../types/gamification';

export const STATS_QUERY_KEY = ['me', 'gamification', 'stats'];
export const BADGES_QUERY_KEY = ['me', 'gamification', 'badges'];

export function useGamificationStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: gamificationApi.getStats,
    enabled: !!user,
  });
}

export function useGamificationBadges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: BADGES_QUERY_KEY,
    queryFn: gamificationApi.getBadges,
    enabled: !!user,
  });
}

// Called from the article detail screen when the user has actually
// read the article (scroll depth + dwell time thresholds met).
// Returns the XP awarded and any new badges earned.
export function useRecordRead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ articleId, readDate }: { articleId: string; readDate: string }) =>
      gamificationApi.recordRead(articleId, readDate),

    onSuccess: (result: ReadEventResult) => {
      if (result.alreadyRead || result.xpAwarded === 0) return;

      // Update stats cache directly from the response — no need to
      // refetch since the server returns the updated stats inline.
      queryClient.setQueryData<UserStats>(STATS_QUERY_KEY, result.stats);

      // If new badges were earned, invalidate so the badge gallery
      // picks them up.
      if (result.newBadges.length > 0) {
        queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      }
    },
  });
}