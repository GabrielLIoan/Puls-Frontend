import type {
    ReadEventResult,
    UserBadge,
    UserStats,
} from '../types/gamification';
import { api } from './client';

export const gamificationApi = {
  recordRead: (articleId: string, readDate: string) =>
    api.post<ReadEventResult>('/me/gamification/read-events', {
      articleId,
      readDate,
    }),

  getStats: () => api.get<UserStats>('/me/gamification/stats'),

  getBadges: () => api.get<UserBadge[]>('/me/gamification/badges'),
};