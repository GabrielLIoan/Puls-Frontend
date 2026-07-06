import type { OutletWithStatus } from '../types/api';
import { api } from './client';

export const followsApi = {
  getOutlets: () => api.get<OutletWithStatus[]>('/me/outlets'),

  muteOutlet: (outletId: string) =>
    api.post<{ id: string }>('/me/outlets/mute', { outletId }),

  unmuteOutlet: (outletId: string) =>
    api.delete<{ success: boolean }>(`/me/outlets/mute/${outletId}`),

  getCategoryPreferences: () => api.get<string[]>('/me/categories'),

  addCategoryPreference: (category: string) =>
    api.post<{ id: string }>('/me/categories', { category }),

  removeCategoryPreference: (category: string) =>
    api.delete<{ success: boolean }>(`/me/categories/${category}`),
};