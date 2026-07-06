import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reactionsApi } from '../api/reactions';
import type { ReactionEmoji, ReactionSummary } from '../types/reactions';

function reactionQueryKey(articleId: string) {
  return ['reactions', articleId];
}

export function useReactions(articleId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: reactionQueryKey(articleId),
    queryFn: () => reactionsApi.getSummary(articleId),
    enabled: !!articleId,
  });

  const mutation = useMutation<
    unknown,
    Error,
    ReactionEmoji | null, // null = remove reaction
    { previous: ReactionSummary | undefined }
  >({
    mutationFn: (emoji) =>
      emoji
        ? reactionsApi.react(articleId, emoji)
        : reactionsApi.removeReaction(articleId),

    onMutate: async (emoji) => {
      await queryClient.cancelQueries({
        queryKey: reactionQueryKey(articleId),
      });

      const previous = queryClient.getQueryData<ReactionSummary>(
        reactionQueryKey(articleId),
      );

      // Optimistically update counts and myReaction immediately
      queryClient.setQueryData<ReactionSummary>(
        reactionQueryKey(articleId),
        (old) => {
          if (!old) return old;

          const counts = { ...old.counts };
          const prevEmoji = old.myReaction;

          // Remove old reaction count
          if (prevEmoji) {
            counts[prevEmoji] = Math.max(0, counts[prevEmoji] - 1);
          }
          // Add new reaction count
          if (emoji) {
            counts[emoji] = (counts[emoji] ?? 0) + 1;
          }

          const total = Object.values(counts).reduce((a, b) => a + b, 0);

          return { ...old, counts, total, myReaction: emoji };
        },
      );

      return { previous };
    },

    onError: (_err, _emoji, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          reactionQueryKey(articleId),
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: reactionQueryKey(articleId),
      });
    },
  });

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading,
    react: (emoji: ReactionEmoji) => {
      // Tapping the same emoji you already picked = remove reaction
      const current = query.data?.myReaction;
      mutation.mutate(current === emoji ? null : emoji);
    },
    removeReaction: () => mutation.mutate(null),
  };
}