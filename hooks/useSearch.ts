import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Article, PaginatedResponse } from '../types/api';

export function searchArticles(q: string, page = 1) {
  return api.get<PaginatedResponse<Article>>(
    `/articles/search?q=${encodeURIComponent(q)}&page=${page}&limit=20`,
  );
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ['articles', 'search', query],
    queryFn: () => searchArticles(query),
    // Only fire when the user has typed at least 2 characters — avoids
    // hammering the API on every keystroke and meaningless single-char
    // results.
    enabled: query.trim().length >= 2,
    // Keep previous results visible while new ones load — prevents the
    // list from flickering to empty between keystrokes.
    placeholderData: (prev) => prev,
  });
}