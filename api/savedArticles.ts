import type { Article, PaginatedResponse } from '../types/api';
import { api } from './client';

export const savedArticlesApi = {
  list: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<Article>>(
      `/me/saved-articles?page=${page}&limit=${limit}`,
    ),

  save: (articleId: string) =>
    api.post<{ id: string }>('/me/saved-articles', { articleId }),

  unsave: (articleId: string) =>
    api.delete<{ success: boolean }>(`/me/saved-articles/${articleId}`),
};