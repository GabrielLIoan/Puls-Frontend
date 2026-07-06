import type { ReactionEmoji, ReactionSummary } from '../types/reactions';
import { api } from './client';

export const reactionsApi = {
  getSummary: (articleId: string) =>
    api.get<ReactionSummary>(`/articles/${articleId}/reactions`),

  react: (articleId: string, emoji: ReactionEmoji) =>
    api.post<{ id: string }>('/me/reactions', { articleId, emoji }),

  removeReaction: (articleId: string) =>
    api.delete<{ success: boolean }>(`/me/reactions/${articleId}`),
};