import type {
  Article,
  ArticleQueryParams,
  PaginatedResponse,
} from '../types/api';
import { api } from './client';

function buildQueryString(params: ArticleQueryParams): string {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.outletIds?.length)
    search.set('outletIds', params.outletIds.join(','));
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const articlesApi = {
  // Public — shows every outlet, no auth required.
  list: (params: ArticleQueryParams = {}) =>
    api.get<PaginatedResponse<Article>>(
      `/articles${buildQueryString(params)}`,
    ),

  // Authenticated — respects the user's muted outlets.
  // outletIds is intentionally excluded from params here since the
  // server derives the outlet list from the user's mute preferences,
  // not from a client-supplied filter.
  getFeed: (params: Omit<ArticleQueryParams, 'outletIds'> = {}) =>
    api.get<PaginatedResponse<Article>>(
      `/articles/feed${buildQueryString(params)}`,
    ),

  getById: (id: string) => api.get<Article>(`/articles/${id}`),
};